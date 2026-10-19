#!/usr/bin/env python3
"""Regenerate the offline announcements and the original two-tone chime.

Requires Python 3.9+, piper-tts==1.8.0, numpy and ffmpeg. Example:
  python scripts/generate_audio.py --model-dir /tmp/fahrplan_audio_models --download-model

Only app/src/main/assets/audio is written inside the Android project. The
Piper runtime and model are build-time tools and are not bundled into the APK.
"""

import argparse
import hashlib
import io
import json
import re
import subprocess
import tempfile
import unicodedata
import urllib.request
import wave
from pathlib import Path

import numpy as np
import onnxruntime as ort
from piper import PiperVoice, SynthesisConfig
from piper.config import PiperConfig


PROJECT = Path(__file__).resolve().parents[1]
ASSETS = PROJECT / "app/src/main/assets"
AUDIO = ASSETS / "audio"
MODEL_NAME = "de_DE-kerstin-low.onnx"
MODEL_BASE = (
    "https://huggingface.co/rhasspy/piper-voices/resolve/"
    "v1.0.0/de/de_DE/kerstin/low/"
)
MODEL_HASHES = {
    MODEL_NAME: "d352a7641892cebf2903859af94e9ba81a141110215fe3943bcda7f7da401b7a",
    MODEL_NAME + ".json": "56e708556b7b9b7a53c4f8957e021421e69f11a600962bba554cffbe72cf2d47",
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def ensure_models(directory, download):
    directory.mkdir(parents=True, exist_ok=True)
    for filename, expected_hash in MODEL_HASHES.items():
        target = directory / filename
        if not target.is_file():
            if not download:
                raise SystemExit(f"Missing {target}; use --download-model.")
            partial = target.with_suffix(target.suffix + ".download")
            with urllib.request.urlopen(MODEL_BASE + filename, timeout=60) as response:
                with partial.open("wb") as output:
                    while block := response.read(1024 * 1024):
                        output.write(block)
            if sha256(partial) != expected_hash:
                raise SystemExit(f"Checksum mismatch: {filename}")
            partial.replace(target)
        if sha256(target) != expected_hash:
            raise SystemExit(f"Checksum mismatch: {filename}")
    return directory / MODEL_NAME


def route_stop_names():
    """Read only literal station arrays; do not execute any app JavaScript."""
    html = (ASSETS / "app.js").read_text(encoding="utf-8")
    source = html[html.index("const STOP_") : html.index("const DEFAULT_STATE")]
    arrays = re.findall(r"const STOP_\w+\s*=\s*\[([^\]]*)\]", source)
    arrays += re.findall(r"stops\s*:\s*\[([^\]]*)\]", source)
    names = []
    for array in arrays:
        for literal in re.findall(r"'((?:\\.|[^'\\])*)'", array):
            name = literal.replace("\\'", "'").replace("\\\\", "\\")
            if name not in names:
                names.append(name)
    if not names:
        raise SystemExit("No station names were found in the route definitions.")
    return names


def slug(name):
    name = name.lower().translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}))
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "_", name).strip("_")


def write_pcm_wav(path, audio, sample_rate):
    samples = np.round(np.clip(audio, -0.999, 0.999) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(samples.tobytes())


def generate_chime(path):
    """Original additive synthesis: two gently decaying descending bell tones."""
    sample_rate = 44100
    duration = 1.10
    time = np.arange(round(duration * sample_rate), dtype=np.float64) / sample_rate
    signal = np.zeros_like(time)
    for onset, frequency, gain in [(0.015, 1046.50, 0.36), (0.395, 783.99, 0.32)]:
        local_time = np.maximum(0, time - onset)
        envelope = (1 - np.exp(-local_time / 0.004)) * np.exp(-local_time / 0.22)
        envelope *= time >= onset
        tone = (
            np.sin(2 * np.pi * frequency * local_time)
            + 0.18 * np.sin(2 * np.pi * frequency * 2.003 * local_time) * np.exp(-local_time / 0.12)
            + 0.045 * np.sin(2 * np.pi * frequency * 3.97 * local_time) * np.exp(-local_time / 0.065)
        )
        signal += gain * envelope * tone
    signal[-2205:] *= np.linspace(1, 0, 2205)
    write_pcm_wav(path, signal, sample_rate)


class StationVoice(PiperVoice):
    def phonemize(self, text):
        # eSpeak in newer Piper emits c + combining cedilla, whereas the
        # original Kerstin model expects the precomposed IPA character ç.
        # NFC preserves the German "ch" in "Nächste" and other station names.
        sentences = [
            list(unicodedata.normalize("NFC", "".join(phonemes)))
            for phonemes in super().phonemize(text)
        ]
        unknown = {p for sentence in sentences for p in sentence if p not in self.config.phoneme_id_map}
        if unknown:
            raise ValueError(f"Unsupported phonemes in {text!r}: {sorted(unknown)}")
        return sentences


def generate_announcement(voice, station, path):
    # The slash in the displayed compound stop name represents a short pause.
    spoken_name = station.replace("/", ", ")
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_output:
        voice.synthesize_wav(
            f"Nächste Haltestelle, {spoken_name}.",
            wav_output,
            syn_config=SynthesisConfig(length_scale=1.04, noise_scale=0.45, noise_w_scale=0.60),
        )
    buffer.seek(0)
    with wave.open(buffer, "rb") as wav_input:
        sample_rate = wav_input.getframerate()
        signal = np.frombuffer(wav_input.readframes(wav_input.getnframes()), dtype="<i2").astype(np.float64) / 32768
    # Keep a small natural margin and normalize all lines to the same peak.
    voiced = np.flatnonzero(np.abs(signal) >= 0.004)
    if not voiced.size:
        raise ValueError(f"Silent synthesis for {station}")
    begin = max(0, int(voiced[0]) - round(0.035 * sample_rate))
    end = min(len(signal), int(voiced[-1]) + round(0.16 * sample_rate))
    signal = signal[begin:end]
    signal *= 0.75 / max(0.001, float(np.max(np.abs(signal))))
    fade = min(round(0.005 * sample_rate), len(signal) // 2)
    signal[:fade] *= np.linspace(0, 1, fade)
    signal[-fade:] *= np.linspace(1, 0, fade)
    write_pcm_wav(path, signal, sample_rate)


def validate(path):
    with wave.open(str(path), "rb") as audio:
        sample_rate = audio.getframerate()
        duration = audio.getnframes() / sample_rate
        if audio.getnchannels() != 1 or audio.getsampwidth() != 2:
            raise ValueError(f"Unexpected PCM format: {path}")
        signal = np.frombuffer(audio.readframes(audio.getnframes()), dtype="<i2").astype(np.float64) / 32768
    rms = float(np.sqrt(np.mean(signal * signal)))
    peak = float(np.max(np.abs(signal)))
    if not (0.8 <= duration <= 9 and 0.01 < rms < 0.5 and 0.1 < peak < 0.999):
        raise ValueError(f"Invalid audio levels or duration: {path}")
    subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(path), "-f", "null", "-"], check=True)
    return {"file": str(path.relative_to(ASSETS)), "duration": round(duration, 3), "peak_dbfs": round(20 * np.log10(peak), 2), "rms_dbfs": round(20 * np.log10(rms), 2), "sha256": sha256(path)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-dir", type=Path, default=Path(tempfile.gettempdir()) / "fahrplan_audio_models")
    parser.add_argument("--download-model", action="store_true")
    args = parser.parse_args()
    model = ensure_models(args.model_dir, args.download_model)
    names = route_stop_names()
    if len({slug(name) for name in names}) != len(names):
        raise SystemExit("Station filename collision; adjust slug() first.")
    (AUDIO / "stops").mkdir(parents=True, exist_ok=True)
    ort.disable_telemetry_events()
    ort.set_seed(61506)
    options = ort.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    voice = StationVoice(
        config=PiperConfig.from_dict(json.loads(Path(str(model) + ".json").read_text(encoding="utf-8"))),
        session=ort.InferenceSession(str(model), sess_options=options, providers=["CPUExecutionProvider"]),
        download_dir=args.model_dir,
    )
    generate_chime(AUDIO / "ding-dong.wav")
    results = [validate(AUDIO / "ding-dong.wav")]
    announcements = {}
    for name in names:
        path = AUDIO / "stops" / f"{slug(name)}.wav"
        generate_announcement(voice, name, path)
        results.append(validate(path))
        announcements[name] = str(path.relative_to(ASSETS))
        print(f"{name}: {results[-1]['duration']:.3f}s", flush=True)
    (AUDIO / "announcements.json").write_text(json.dumps(announcements, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (AUDIO / "audio-validation.json").write_text(json.dumps({"voice": "de_DE-kerstin-low", "piper_version": "1.8.0", "model_sha256": MODEL_HASHES[MODEL_NAME], "files": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated and validated {len(names)} announcements and one chime.")


if __name__ == "__main__":
    main()

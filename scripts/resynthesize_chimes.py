#!/usr/bin/env python3
"""Rebuild supplied chimes from tonal components only (NumPy + FFmpeg).

Analyze supplied originals once with --reference-dir DIR. The checked-in tonal
envelopes then reproduce the clean MP3s without needing the noisy recordings.
No recorded waveform or broadband residual is mixed into the result.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / 'scripts/chime-tones.json'
RATE = 44100
HOP = 0.01


def ffmpeg():
    bundled = ROOT / 'build/qa-deps/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
    return os.environ.get('FFMPEG_PATH', str(bundled) if bundled.is_file() else 'ffmpeg')


def analyze(directory):
    result = {}
    for name, fundamentals in [('ding_dong', [523.25, 440]),
                               ('dong_dong_ding', [655.5, 520.5, 388.5, 584.5, 491.5])]:
        decoded = subprocess.run([ffmpeg(), '-v', 'error', '-i', str(directory / (name+'.mp3')),
                                  '-f', 'f32le', '-ar', str(RATE), '-ac', '1', 'pipe:1'],
                                 capture_output=True, check=True)
        signal = np.frombuffer(decoded.stdout, dtype='<f4').astype(float)
        duration = len(signal)/RATE
        time = np.arange(len(signal))/RATE
        frame_times = np.arange(0, duration+HOP, HOP)
        # A 100 ms Hann window rejects neighboring non-tonal sound while keeping
        # the attacks and repeated notes. Only sustained, prominent modes remain.
        width = int(.10*RATE)
        window = np.hanning(width)
        modes = []
        for base in fundamentals:
            for harmonic in [1, 3, 5]:
                expected = base*harmonic
                nfft = 2**int(np.ceil(np.log2(len(signal)*4)))
                spectrum = np.abs(np.fft.rfft(signal*np.hanning(len(signal)), nfft))
                frequencies = np.fft.rfftfreq(nfft, 1/RATE)
                candidates = np.flatnonzero(np.abs(frequencies-expected) < expected*.008)
                index = candidates[np.argmax(spectrum[candidates])]
                frequency = float(frequencies[index])
                carrier = signal*np.exp(-2j*np.pi*frequency*time)
                amplitudes = []
                padded = np.pad(carrier, (width//2, width))
                for t in frame_times:
                    start = int(t*RATE)
                    amplitudes.append(2*abs(np.sum(padded[start:start+width]*window))/window.sum())
                amplitudes = np.array(amplitudes)
                floor = max(np.quantile(amplitudes, .25)*2.5, amplitudes.max()*.045)
                amplitudes = np.maximum(0, amplitudes-floor)
                # Remove isolated residual peaks shorter than 30 ms.
                mask = amplitudes > amplitudes.max()*.07
                for i in range(1, len(mask)-1):
                    if mask[i] and not (mask[i-1] or mask[i+1]):
                        amplitudes[i] = 0
                if amplitudes.max() < .008:
                    continue
                modes.append({'hz': round(frequency, 4), 'amplitudes': np.round(amplitudes, 6).tolist()})
        result[name] = {'duration': round(duration, 6), 'hop': HOP, 'modes': modes}
    SPEC.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    return result


def synthesize(spec):
    destination = ROOT / 'app/src/main/assets/audio/chimes'
    for name, item in spec.items():
        time = np.arange(round(item['duration']*RATE))/RATE
        signal = np.zeros(len(time))
        for mode in item['modes']:
            envelope = np.interp(time, np.arange(len(mode['amplitudes']))*item['hop'], mode['amplitudes'])
            signal += envelope*np.sin(2*np.pi*mode['hz']*time)
        # Tiny end fades avoid boundary clicks; preserve the reference timing.
        fade = min(int(.012*RATE), len(signal)//2)
        signal[:fade] *= np.linspace(0, 1, fade)
        signal[-fade:] *= np.linspace(1, 0, fade)
        signal *= .68/max(.001, np.max(np.abs(signal)))
        path = destination / (name+'.mp3')
        subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-f', 'f32le',
                        '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0', '-c:a', 'libmp3lame',
                        '-b:a', '192k', '-map_metadata', '-1', '-y', str(path)],
                       input=signal.astype('<f4').tobytes(), check=True)
        print(name, f"{item['duration']:.2f}s, {len(item['modes'])} tonal modes")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reference-dir', type=Path)
    args = parser.parse_args()
    synthesize(analyze(args.reference_dir) if args.reference_dir else json.loads(SPEC.read_text(encoding='utf-8')))

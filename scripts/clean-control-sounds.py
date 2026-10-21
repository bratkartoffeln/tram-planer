"""Remove DC offset and boundary clicks from the three supplied control sounds.

Requires FFmpeg, selectable via FFMPEG_PATH. Repeat runs use preserved originals.
"""
import array
import hashlib
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'app/src/main/assets/vehicle-bundles/default/audio'
BACKUP = ROOT / 'build/control-sound-cleanup'
ORIGINALS = {
    'push-button': '3fb2824f52e520f495466dd0501fed10b78705821bcbcf1232a3668207fc94bd',
    'release-button': '9ed3938a23facff59f60563a164049279f871d1a60f7905b6d5f9489d31c1b97',
    'switch': 'f180d9dc5a5ee757c7cf56d698a7bf9e007bca34e14121e837736e310cd6fa59',
}


def run(*args):
    return subprocess.check_output([os.environ.get('FFMPEG_PATH', 'ffmpeg'),
                                    '-v', 'error', *args])


def decode(path):
    samples = array.array('f')
    samples.frombytes(run('-i', str(path), '-f', 'f32le', '-ar', '44100',
                         '-ac', '1', 'pipe:1'))
    return samples


def main():
    BACKUP.mkdir(parents=True, exist_ok=True)
    for name, checksum in ORIGINALS.items():
        target = ASSETS / (name + '.mp3')
        original = BACKUP / (name + '-original.mp3')
        source = original if original.exists() else target
        if hashlib.sha256(source.read_bytes()).hexdigest() != checksum:
            raise SystemExit('Expected original recording: ' + str(source))
        if not original.exists():
            shutil.copy2(source, original)
        samples = decode(original)
        mean = sum(samples) / len(samples)
        duration = len(samples) / 44100
        filters = (f'dcshift=shift={-mean},highpass=f=60,'
                   f'afade=t=in:d=0.002,afade=t=out:st={duration - .006}:d=0.006')
        output = BACKUP / (name + '-clean.mp3')
        run('-i', str(original), '-af', filters, '-c:a', 'libmp3lame',
            '-b:a', '192k', '-map_metadata', '-1', '-y', str(output))
        cleaned = decode(output)
        assert len(cleaned) == len(samples), name + ': duration changed'
        assert abs(sum(cleaned) / len(cleaned)) < .005, name + ': residual DC'
        assert max(abs(cleaned[0]), abs(cleaned[-1])) < .01, name + ': edge click'
        shutil.copy2(output, target)
        print(f'{name}: {duration:.3f} s, DC {mean:.4f} removed, edges smoothed')


if __name__ == '__main__':
    main()

"""Remove the stationary high-frequency whine from the current door recordings.

Run once on unprocessed recordings: python scripts/clean-door-sounds.py.
FFMPEG_PATH overrides the local encoder. Originals are backed up under build/.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
EFFECTS = ROOT / 'app/src/main/assets/audio/effects'
BACKUP = ROOT / 'build/door-cleanup-6.2.5'
BUNDLED = ROOT / 'build/qa-deps/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
FFMPEG = os.environ.get('FFMPEG_PATH') or (str(BUNDLED) if BUNDLED.exists() else 'ffmpeg')
# Measured stationary tones, including their upper-frequency sidebands.
# Narrow cuts leave the broadband hiss, motor, impacts and warning tones intact.
FREQUENCIES = [
    4813, 4863, 4914, 4963, 5013, 5063, 5164, 5214, 5264, 5315, 5364, 5414,
    9625, 9675, 9726, 9776, 9826, 9876, 9926, 9977, 10026, 10177, 10227,
    10328, 10378, 10678, 10779,
]


def run(args):
    return subprocess.run([FFMPEG, '-v', 'error', *args], check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout


def main():
    BACKUP.mkdir(parents=True, exist_ok=True)
    catalog_path = EFFECTS / 'catalog.json'
    catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
    filters = ','.join(f'equalizer=f={f}:t=h:w=20:g=-36' for f in FREQUENCIES)
    filters += ',volume=0.95'  # Headroom for filter/MP3 overshoot at door impacts.
    for entry in catalog:
        if entry['id'] not in ('door_open', 'door_close'):
            continue
        target = EFFECTS / (entry['id'] + '.mp3')
        source = BACKUP / target.name
        if not source.exists():
            shutil.copy2(target, source)
        temporary = BACKUP / (entry['id'] + '-clean.mp3')
        run(['-i', str(source), '-af', filters, '-c:a', 'libmp3lame',
             '-b:a', '192k', '-map_metadata', '-1', '-y', str(temporary)])
        # Decode before replacing the asset; retain the original duration/channels.
        pcm = run(['-i', str(temporary), '-f', 'f32le', '-ar', '44100',
                   '-ac', '1', 'pipe:1'])
        entry['duration'] = len(pcm) / 4 / 44100
        entry['sha256'] = hashlib.sha256(temporary.read_bytes()).hexdigest()
        shutil.copy2(temporary, target)
        print(f"{entry['id']}: {entry['duration']:.3f} s, whine filtered")
    catalog_path.write_text(json.dumps(catalog, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()

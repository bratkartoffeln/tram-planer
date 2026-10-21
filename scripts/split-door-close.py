"""Separate the final ding from the supplied, cleaned door-close recording.

Run with python3 scripts/split-door-close.py; requires FFmpeg (or FFMPEG_PATH).
The full recording is retained under build/door-close-split for repeat runs.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
EFFECTS = ROOT / 'app/src/main/assets/audio/effects'
BACKUP = ROOT / 'build/door-close-split'
ORIGINAL_SHA256 = '990ddfececd9759d270db13510586d4493a19ac434ea4ccac5c97557119354b3'
SPLIT = 3.78  # Before the attack of the final ~988 Hz bell.


def run(*args):
    return subprocess.run([os.environ.get('FFMPEG_PATH', 'ffmpeg'), '-v', 'error',
                           *args], check=True, stdout=subprocess.PIPE).stdout


def main():
    BACKUP.mkdir(parents=True, exist_ok=True)
    original = BACKUP / 'door_close-original.mp3'
    source = original if original.exists() else EFFECTS / 'door_close.mp3'
    if hashlib.sha256(source.read_bytes()).hexdigest() != ORIGINAL_SHA256:
        raise SystemExit('Expected the full, cleaned door_close recording; refusing to split another file.')
    if not original.exists():
        shutil.copy2(source, original)
    catalog_path = EFFECTS / 'catalog.json'
    catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
    for sound_id, filters in [
        ('door_close', f'atrim=end={SPLIT},afade=t=out:st={SPLIT - .005}:d=0.005'),
        ('door_closed', f'atrim=start={SPLIT},asetpts=PTS-STARTPTS,afade=t=in:d=0.003'),
    ]:
        target = BACKUP / (sound_id + '.mp3')
        run('-i', str(original), '-af', filters, '-c:a', 'libmp3lame', '-b:a',
            '192k', '-map_metadata', '-1', '-y', str(target))
        pcm = run('-i', str(target), '-f', 'f32le', '-ar', '44100', '-ac', '1', 'pipe:1')
        entry = next((entry for entry in catalog if entry['id'] == sound_id), None)
        if entry is None:
            entry = {'id': sound_id, 'file': f'audio/effects/{sound_id}.mp3'}
            catalog.insert(next(i for i, e in enumerate(catalog) if e['id'] == 'door_close') + 1, entry)
        entry.update(duration=len(pcm) / 4 / 44100,
                     sha256=hashlib.sha256(target.read_bytes()).hexdigest())
        shutil.copy2(target, EFFECTS / target.name)
        print(f'{sound_id}: {entry["duration"]:.3f} s')
    catalog_path.write_text(json.dumps(catalog, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()

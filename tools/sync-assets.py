#!/usr/bin/env python3
"""Keep the Android assets, audio mapping and separately runnable PWA in sync."""
import json
import hashlib
import shutil
from pathlib import Path

project = Path(__file__).resolve().parents[1]
assets = project / 'app/src/main/assets'
mapping = json.loads((assets / 'audio/announcements.json').read_text(encoding='utf-8'))
for name, relative_path in mapping.items():
    path = (assets / relative_path).resolve()
    if not path.is_relative_to(assets.resolve()) or not path.is_file():
        raise SystemExit(f'Missing announcement for {name}')
(assets / 'audio/announcements-data.js').write_text(
    "'use strict';\nwindow.STOP_ANNOUNCEMENTS = Object.freeze("
    + json.dumps(mapping, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
web = project / 'web-pwa'
web.mkdir(exist_ok=True)
effects = json.loads((assets / 'audio/effects/catalog.json').read_text(encoding='utf-8'))
for effect in effects:
    path = (assets / effect['file']).resolve()
    if not path.is_relative_to(assets.resolve()) or path.suffix != '.mp3' or not path.is_file():
        raise SystemExit(f'Missing MP3 effect: {effect["id"]}')
    if hashlib.sha256(path.read_bytes()).hexdigest() != effect['sha256']:
        raise SystemExit(f'Effect checksum mismatch: {effect["id"]}')
    # Remove only obsolete mirrors of the explicitly migrated effects.
    old_copy = web / 'audio/effects' / (path.stem + '.wav')
    if old_copy.is_file():
        old_copy.unlink()
shutil.copytree(assets, web, dirs_exist_ok=True)
for path in assets.rglob('*'):
    if path.is_file() and path.read_bytes() != (web / path.relative_to(assets)).read_bytes():
        raise SystemExit(f'Asset mismatch: {path.name}')
print(f'Android and PWA assets synchronized; {len(mapping)} spoken stop names.')

#!/usr/bin/env python3
"""Keep the Android assets, audio mapping and separately runnable PWA in sync."""
import json
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
shutil.copytree(assets, web, dirs_exist_ok=True)
for path in assets.rglob('*'):
    if path.is_file() and path.read_bytes() != (web / path.relative_to(assets)).read_bytes():
        raise SystemExit(f'Asset mismatch: {path.name}')
print(f'Android and PWA assets synchronized; {len(mapping)} spoken stop names.')

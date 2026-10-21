#!/usr/bin/env python3
"""Keep the Android assets, audio mapping and separately runnable PWA in sync."""
import json
import hashlib
import shutil
import math
import re
from vehicle_bundles import compile_bundles
from pathlib import Path

project = Path(__file__).resolve().parents[1]
assets = project / 'app/src/main/assets'
network_plan = json.loads((assets / 'network-plan.json').read_text(encoding='utf-8-sig'))


def validate_network_plan(plan):
    def text(value, limit):
        return isinstance(value, str) and bool(value.strip()) and len(value) <= limit

    def color(value):
        return isinstance(value, str) and re.fullmatch(r'#[0-9a-fA-F]{6}', value) is not None

    def check(condition):
        if not condition:
            raise SystemExit('Invalid network plan: app/src/main/assets/network-plan.json')

    check(isinstance(plan, dict) and plan.get('format') == 'fahrplan-manager-network-plan'
          and type(plan.get('schemaVersion')) is int and plan['schemaVersion'] == 1
          and plan.get('network') == 'erfurt' and isinstance(plan.get('edits'), dict))
    edits = plan['edits']
    check(isinstance(edits.get('stops'), dict) and isinstance(edits.get('lineColors'), dict)
          and isinstance(edits.get('addedEdges'), list) and len(edits['addedEdges']) <= 500
          and isinstance(edits.get('removedEdges'), list) and len(edits['removedEdges']) <= 1000)
    for key, stop in edits['stops'].items():
        check(text(key, 100) and isinstance(stop, dict) and text(stop.get('name'), 100))
        for field, minimum, maximum in [('x', 15, 1085), ('y', 15, 1065),
                                         ('dx', -300, 300), ('dy', -150, 150)]:
            value = stop.get(field)
            check(type(value) in (int, float) and math.isfinite(value) and minimum <= value <= maximum)
    for encoded in edits['removedEdges']:
        try:
            edge = json.loads(encoded) if isinstance(encoded, str) else None
        except ValueError:
            edge = None
        check(isinstance(edge, list) and len(edge) == 3 and text(edge[0], 50)
              and text(edge[1], 100) and text(edge[2], 100) and edge[1] != edge[2])
    for edge in edits['addedEdges']:
        check(isinstance(edge, dict) and text(edge.get('from'), 100) and text(edge.get('to'), 100)
              and edge['from'] != edge['to'] and text(edge.get('line'), 50) and color(edge.get('color')))
    for key, value in edits['lineColors'].items():
        check(text(key, 50) and color(value))
    check(isinstance(edits.get('edgeStyles', {}), dict) and len(edits.get('edgeStyles', {})) <= 1000)
    for encoded, style in edits.get('edgeStyles', {}).items():
        try:
            edge = json.loads(encoded)
        except ValueError:
            edge = None
        check(isinstance(edge, list) and len(edge) == 3 and text(edge[0], 50)
              and text(edge[1], 100) and text(edge[2], 100) and edge[1] != edge[2]
              and isinstance(style, dict) and color(style.get('color'))
              and style.get('pattern') in ('solid', 'dashed')
              and style.get('status') in ('regular', 'construction', 'not-served'))


validate_network_plan(network_plan)
vehicle_catalog = json.loads((assets / 'vehicle-types.json').read_text(encoding='utf-8'))
vehicle_photos = json.loads((assets / 'images/vehicles/credits.json').read_text(encoding='utf-8'))
vehicle_type_ids = set()
for vehicle_type in vehicle_catalog['types']:
    if vehicle_type['id'] in vehicle_type_ids or not re.fullmatch(r'[a-z0-9-]+', vehicle_type['id']):
        raise SystemExit('Invalid/duplicate vehicle type: ' + vehicle_type['id'])
    vehicle_type_ids.add(vehicle_type['id'])
    photo = vehicle_photos[vehicle_type['photo']]
    path = (assets / photo['file']).resolve()
    if not path.is_relative_to(assets.resolve()) or not path.is_file():
        raise SystemExit('Missing vehicle photo: ' + vehicle_type['id'])
    if any(key not in vehicle_catalog['sources'] for key in vehicle_type['sources']):
        raise SystemExit('Missing vehicle source: ' + vehicle_type['id'])
vehicle_catalog['photos'] = vehicle_photos
compile_bundles(assets, vehicle_type_ids)
(assets / 'vehicle-types-data.js').write_text(
    "'use strict';\n// Generated from vehicle-types.json and images/vehicles/credits.json.\n"
    + 'window.ERFURT_VEHICLE_CATALOG = Object.freeze('
    + json.dumps(vehicle_catalog, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
# Script form also works in Android's file:// WebView without a fetch/CORS step.
(assets / 'network-plan-data.js').write_text(
    "'use strict';\n// Generated from network-plan.json by tools/sync-assets.py.\n"
    + 'window.BUNDLED_NETWORK_PLAN = Object.freeze('
    + json.dumps(network_plan, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
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

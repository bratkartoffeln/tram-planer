"""Validate and compile modular vehicle cabs for file:// Android and offline PWA."""
import copy
import json
import re


EFFECTS = {'door_open', 'door_close', 'emergency', 'traffic', 'passenger', 'finish', 'back'}
MECHANICAL = {'down', 'up', 'latch', 'rotary', 'screw', 'ratchet'}
BUTTONS = {'next', 'back', 'doors', 'passenger', 'fullscreen', 'traffic', 'finish', 'emergency'}


def compile_bundles(assets, type_ids):
    manifests, resolved, cached = {}, {}, set()

    def check(condition, message):
        if not condition:
            raise SystemExit('Invalid vehicle bundle: ' + message)

    def asset(value, suffixes):
        check(isinstance(value, str) and re.fullmatch(r'[a-z0-9_./-]+', value)
              and '..' not in value.split('/'), str(value))
        path = (assets / value).resolve()
        check(path.is_relative_to(assets.resolve()) and path.is_file()
              and path.suffix in suffixes, 'missing/unsupported asset ' + value)
        cached.add(value)

    for path in sorted((assets / 'vehicle-bundles').glob('*/bundle.json')):
        data = json.loads(path.read_text(encoding='utf-8'))
        key = path.parent.name
        check(isinstance(data, dict) and data.get('id') == key
              and re.fullmatch(r'[a-z0-9-]+', key), str(path))
        check(set(data) <= {'id', 'extends', 'cab', 'sounds', 'credits'}, key + ': unknown section')
        manifests[key] = data
        cached.add(path.relative_to(assets).as_posix())
    check('default' in manifests and type_ids <= manifests.keys(), 'missing default/type manifest')

    def merge(base, override):
        result = copy.deepcopy(base)
        for key, value in override.items():
            result[key] = merge(result[key], value) if isinstance(result.get(key), dict) and isinstance(value, dict) else copy.deepcopy(value)
        return result

    def resolve(key, chain=()):
        check(key in manifests and key not in chain, 'missing parent/cycle: ' + ' -> '.join((*chain, key)))
        if key not in resolved:
            data = manifests[key]
            parent = data.get('extends', 'default' if key != 'default' else None)
            check(parent is None or isinstance(parent, str) and re.fullmatch(r'[a-z0-9-]+', parent), key + ': invalid parent')
            check(key != 'default' or parent is None, 'default cannot inherit')
            base = resolve(parent, (*chain, key)) if parent else {}
            resolved[key] = merge(base, {k: v for k, v in data.items() if k != 'extends'})
        return resolved[key]

    for key in manifests:
        bundle = resolve(key)
        cab, sounds = bundle.get('cab', {}), bundle.get('sounds', {})
        check(isinstance(cab, dict) and isinstance(sounds, dict), key)
        check(set(cab) == {'image', 'width', 'height', 'buttons', 'indicators', 'headings', 'spares',
                           'screws', 'rotaries', 'rotarySprites', 'colors'}
              and set(sounds) == {'effects', 'mechanical'}, key + ': unknown/missing cab or sound section')
        width, height = cab.get('width'), cab.get('height')
        check(type(width) is int and type(height) is int and width > 200 and height > 200, key + ': panel dimensions')
        asset(cab.get('image'), {'.webp', '.png', '.jpg'})

        def point(x, y):
            check(type(x) in (int, float) and type(y) in (int, float)
                  and 0 <= x <= width and 0 <= y <= height, key + ': position outside panel')

        check(isinstance(cab.get('buttons'), dict) and set(cab['buttons']) == BUTTONS, key + ': buttons')
        check(isinstance(cab.get('indicators'), dict) and set(cab['indicators']) == {'open', 'closed'}, key + ': indicators')
        for pos in [*cab['buttons'].values(), *cab['indicators'].values()]:
            check(isinstance(pos, dict) and set(pos) == {'x', 'y'}, key + ': button/indicator position')
            point(pos['x'], pos['y'])
        for field, length in [('spares', 2), ('screws', 3), ('rotaries', 2), ('headings', 3)]:
            check(isinstance(cab.get(field), list), key + ': ' + field)
            for entry in cab[field]:
                check(isinstance(entry, list) and len(entry) == length, key + ': ' + field)
                point(*(entry[1:] if field == 'headings' else entry[:2]))
                if field in ('screws', 'headings'):
                    check(isinstance(entry[-1] if field == 'screws' else entry[0], str), key + ': label')
        check(len(cab['rotaries']) <= 2, key + ': at most two reserve rotaries')
        check(set(cab.get('rotarySprites', {})) == {'mask', 'ring', 'grip'}, key + ': rotary sprites')
        for rect in cab['rotarySprites'].values():
            check(isinstance(rect, list) and len(rect) == 4, key + ': sprite rectangle')
            point(*rect[:2])
            check(all(type(v) in (int, float) and v > 0 for v in rect[2:])
                  and rect[2] < width and rect[3] < height, key + ': sprite size')
        check(set(cab.get('colors', {})) == {'console', 'panel', 'text'}
              and all(isinstance(v, str) and re.fullmatch(r'#[0-9a-fA-F]{6}', v) for v in cab['colors'].values()), key + ': colors')
        check(set(sounds.get('effects', {})) == EFFECTS and set(sounds.get('mechanical', {})) == MECHANICAL, key + ': sound keys')
        for effect, path in sounds['effects'].items():
            asset(path, {'.mp3'})
            check(re.fullmatch(r'(audio/effects|vehicle-bundles/[a-z0-9-]+/audio)/[a-z0-9_-]+\.mp3', path), key + ': effect path')
        for kind, path in sounds['mechanical'].items():
            if path != 'synth:' + kind:
                asset(path, {'.mp3'})
                check(re.fullmatch(r'(audio/effects|vehicle-bundles/[a-z0-9-]+/audio)/[a-z0-9_-]+\.mp3', path), key + ': mechanical path')
        check(isinstance(bundle.get('credits', []), list)
              and all(isinstance(v, str) for v in bundle.get('credits', [])), key + ': credits')

    (assets / 'vehicle-bundles-data.js').write_text(
        "'use strict';\n// Generated from vehicle-bundles/*/bundle.json. Do not edit.\nwindow.VEHICLE_BUNDLES = Object.freeze("
        + json.dumps(resolved, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
    (assets / 'vehicle-bundle-assets.json').write_text(
        json.dumps(sorted(cached), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

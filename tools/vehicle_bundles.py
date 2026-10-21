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
        check(set(data) <= {'id', 'extends', 'cab', 'sounds', 'credits', 'presentation'}, key + ': unknown section')
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
        check(set(cab) - {'skin', 'screwCap', 'emergencySprites', 'accessories', 'leverSprites', 'labelColor'} == {'image', 'width', 'height', 'buttons', 'indicators', 'headings', 'spares',
                           'screws', 'rotaries', 'rotarySprites', 'colors'}
              and set(sounds) == {'effects', 'mechanical'}, key + ': unknown/missing cab or sound section')
        check(cab.get('skin', 'photo') in ('photo', 'panel'), key + ': cab skin')
        check(type(cab.get('screwCap', 54)) in (int, float) and 20 <= cab.get('screwCap', 54) <= 200, key + ': screw cap')
        width, height = cab.get('width'), cab.get('height')
        check(type(width) is int and type(height) is int and width > 200 and height > 200, key + ': panel dimensions')
        asset(cab.get('image'), {'.webp', '.png', '.jpg'})

        def point(x, y):
            check(type(x) in (int, float) and type(y) in (int, float)
                  and 0 <= x <= width and 0 <= y <= height, key + ': position outside panel')

        def rectangle(rect):
            check(isinstance(rect, list) and len(rect) == 4, key + ': sprite rectangle')
            point(*rect[:2])
            check(all(type(v) in (int, float) and v > 0 for v in rect[2:])
                  and rect[2]/2 <= rect[0] <= width-rect[2]/2
                  and rect[3]/2 <= rect[1] <= height-rect[3]/2, key + ': sprite outside panel')

        def ink(value):
            check(isinstance(value, str) and re.fullmatch(r'#[0-9a-fA-F]{6}', value) is not None, key + ': label/control ink')

        def label_pad(pad):
            check(isinstance(pad, dict) and set(pad) == {'x', 'y', 'width', 'ink'}, key + ': label pad')
            point(pad['x'], pad['y'])
            check(type(pad['width']) in (int, float) and 20 <= pad['width'] <= width
                  and pad['width']/2 <= pad['x'] <= width-pad['width']/2, key + ': label width')
            ink(pad['ink'])

        ink(cab.get('labelColor', '#fff8df'))
        if 'leverSprites' in cab:
            sprites = cab['leverSprites']
            check(isinstance(sprites, dict) and set(sprites) == {'off', 'on'}, key + ': lever sprites')
            for sprite in sprites.values():
                check(isinstance(sprite, dict) and set(sprite) == {'image', 'width', 'height', 'crop'}, key + ': lever sprite')
                asset(sprite['image'], {'.webp', '.png'})
                sw, sh, rect = sprite['width'], sprite['height'], sprite['crop']
                check(type(sw) is int and type(sh) is int and sw > 0 and sh > 0
                      and isinstance(rect, list) and len(rect) == 4
                      and all(type(v) in (int, float) for v in rect), key + ': lever sprite dimensions')
                cx, cy, rw, rh = rect
                check(0 < rw < sw and 0 < rh < sh and rw/2 <= cx <= sw-rw/2
                      and rh/2 <= cy <= sh-rh/2, key + ': lever sprite crop')

        if 'emergencySprites' in cab:
            sprites = cab['emergencySprites']
            check(isinstance(sprites, dict) and {'mask', 'ring', 'travel'} <= set(sprites)
                  and set(sprites) <= {'mask', 'ring', 'travel', 'base'}, key + ': emergency sprites')
            rectangle(sprites['mask'])
            rectangle(sprites['ring'])
            if 'base' in sprites:
                rectangle(sprites['base'])
                check(sprites['base'][2] == sprites['base'][3], key + ': emergency base must be circular')
            check(isinstance(sprites['travel'], list) and len(sprites['travel']) == 2
                  and all(type(v) in (int, float) and abs(v) <= 100 for v in sprites['travel']), key + ': emergency travel')
        check(isinstance(cab.get('accessories', []), list) and len(cab.get('accessories', [])) <= 24, key + ': accessories')
        for control in cab.get('accessories', []):
            check(isinstance(control, dict) and {'kind', 'label', 'sprite'} <= set(control)
                  and set(control) <= {'kind', 'label', 'sprite', 'onSprite', 'profile', 'labelPad'}
                  and control['kind'] in ('button', 'lever')
                  and isinstance(control['label'], str) and control['label'].strip(), key + ': accessory')
            rectangle(control['sprite'])
            if control['kind'] == 'lever':
                check('onSprite' in control and 'leverSprites' in cab
                      and control.get('profile', 'toggle') in ('toggle', 'long'), key + ': lever fields')
                rectangle(control['onSprite'])
            if 'labelPad' in control:
                label_pad(control['labelPad'])

        check(isinstance(cab.get('buttons'), dict) and set(cab['buttons']) == BUTTONS, key + ': buttons')
        check(isinstance(cab.get('indicators'), dict) and set(cab['indicators']) == {'open', 'closed'}, key + ': indicators')
        for pos in [*cab['buttons'].values(), *cab['indicators'].values()]:
            check(isinstance(pos, dict) and {'x', 'y'} <= set(pos)
                  and set(pos) <= {'x', 'y', 'size', 'capWidth', 'capHeight', 'shape', 'kind', 'ink', 'labelPad'}, key + ': button/indicator position')
            point(pos['x'], pos['y'])
            for field in ('size', 'capWidth', 'capHeight'):
                check(type(pos.get(field, 140)) in (int, float) and 20 <= pos.get(field, 140) <= 400, key + ': control size')
            check(pos.get('shape', 'round') in ('round', 'rect') and pos.get('kind', 'mushroom') in ('mushroom', 'push'), key + ': control type')
            check(isinstance(pos.get('ink', '#eef1f3'), str) and re.fullmatch(r'#[0-9a-fA-F]{6}', pos.get('ink', '#eef1f3')) is not None, key + ': control ink')
            if 'labelPad' in pos:
                label_pad(pos['labelPad'])
            for field, coordinate, limit in [('capWidth', pos['x'], width), ('capHeight', pos['y'], height)]:
                if field in pos:
                    check(pos[field] <= pos.get('size', 200) and pos[field]/2 <= coordinate <= limit-pos[field]/2, key + ': cap outside control/panel')
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
        if 'presentation' in bundle:
            info = bundle['presentation']
            check(isinstance(info, dict) and set(info) == {'title', 'variant', 'description', 'soundNote', 'references'}, key + ': presentation')
            check(all(isinstance(info[field], str) and info[field].strip() for field in ('title', 'variant', 'description', 'soundNote')), key + ': presentation text')
            check(isinstance(info['references'], list) and len(info['references']) > 0, key + ': references')
            for reference in info['references']:
                check(isinstance(reference, dict) and set(reference) == {'title', 'url'}
                      and isinstance(reference['title'], str) and reference['title'].strip()
                      and isinstance(reference['url'], str)
                      and re.fullmatch(r'https://[^\s<>"\x00-\x1f]+', reference['url']), key + ': reference link')

    (assets / 'vehicle-bundles-data.js').write_text(
        "'use strict';\n// Generated from vehicle-bundles/*/bundle.json. Do not edit.\nwindow.VEHICLE_BUNDLES = Object.freeze("
        + json.dumps(resolved, ensure_ascii=False, indent=2) + ');\n', encoding='utf-8')
    (assets / 'vehicle-bundle-assets.json').write_text(
        json.dumps(sorted(cached), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

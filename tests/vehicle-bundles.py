"""Exercise inheritance and build-time rejection without changing shipped assets."""
import json
from pathlib import Path
import shutil
import sys
import tempfile

project = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project / 'tools'))
from vehicle_bundles import compile_bundles

source = project / 'app/src/main/assets'
type_ids = {item['id'] for item in json.loads((source / 'vehicle-types.json').read_text(encoding='utf-8'))['types']}
(project / 'build').mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(prefix='bundle-validation-', dir=project / 'build') as directory:
    assets = Path(directory)
    shutil.copytree(source / 'vehicle-bundles', assets / 'vehicle-bundles')
    shutil.copytree(source / 'audio/effects', assets / 'audio/effects')
    (assets / 'images').mkdir()
    shutil.copyfile(source / 'images/cab-panel-photoreal.webp', assets / 'images/cab-panel-photoreal.webp')
    path = assets / 'vehicle-bundles/tramlink/bundle.json'
    original = json.loads(path.read_text(encoding='utf-8'))

    def write(data):
        path.write_text(json.dumps(data), encoding='utf-8')

    def rejected(data):
        write(data)
        try:
            compile_bundles(assets, type_ids)
        except SystemExit as error:
            assert 'Invalid vehicle bundle' in str(error)
        else:
            raise AssertionError('Invalid manifest accepted: ' + repr(data))
        write(original)

    # Deep partial overrides, a shared family and offline registration of new media.
    family = assets / 'vehicle-bundles/modern-family'
    family.mkdir()
    (family / 'bundle.json').write_text(json.dumps({'id': 'modern-family', 'extends': 'default', 'cab': {'colors': {'console': '#112233'}}}), encoding='utf-8')
    audio = path.parent / 'audio'
    audio.mkdir()
    shutil.copyfile(source / 'audio/effects/door_open.mp3', audio / 'open.mp3')
    write({'id': 'tramlink', 'extends': 'modern-family', 'cab': {'buttons': {'doors': {'x': 175}}, 'screws': []}, 'sounds': {'effects': {'door_open': 'vehicle-bundles/tramlink/audio/open.mp3'}}})
    compile_bundles(assets, type_ids)
    script = (assets / 'vehicle-bundles-data.js').read_text(encoding='utf-8')
    compiled = json.loads(script.split('Object.freeze(', 1)[1].rsplit(');', 1)[0])
    result = compiled['tramlink']
    assert result['cab']['buttons']['doors'] == {'x': 175, 'y': 475}
    assert result['cab']['colors']['console'] == '#112233'
    assert result['cab']['screws'] == []
    assert result['sounds']['effects']['door_close'] == 'audio/effects/door_close.mp3'
    assert result['sounds']['mechanical']['down'] == 'synth:down'
    assert 'vehicle-bundles/tramlink/audio/open.mp3' in json.loads((assets / 'vehicle-bundle-assets.json').read_text(encoding='utf-8'))
    rejected({'id': 'tramlink', 'extends': 'tramlink'})
    rejected({'id': 'tramlink', 'extends': 'missing'})
    rejected({'id': 'tramlink', 'extends': ['default']})
    rejected({'id': 'tramlink', 'sounds': {'effects': {'door_open': 'vehicle-bundles/tramlink/audio/missing.mp3'}}})
    rejected({'id': 'tramlink', 'sounds': {'effects': {'door_open': '../outside.mp3'}}})
    rejected({'id': 'tramlink', 'sounds': {'mechanical': {'down': 'synth:typo'}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'x': 9000}}}})
    rejected({'id': 'tramlink', 'cab': {'colors': {'console': 'red;display:none'}}})
    rejected({'id': 'tramlink', 'cab': {'skin': 'unsafe-renderer'}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'shape': 'script'}}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'capWidth': 999}}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'ink': ['unsafe']}}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'labelPad': {'x': 100, 'y': 100, 'width': 100, 'ink': 'red;background:black'}}}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'labelPad': {'x': 9000, 'y': 100, 'width': 100, 'ink': '#ffffff'}}}}})
    rejected({'id': 'tramlink', 'extends': 'family-gotha-wheel', 'cab': {'leverSprites': {'on': {'image': '../outside.png'}}}})
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'presentation': {'references': [{'title': 'Unsafe', 'url': 'javascript:alert(1)'}]}})
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'presentation': {'unknown': True}})
    rejected({'id': 'wrong-id', 'extends': 'default'})
print('Bundle validation checks passed.')

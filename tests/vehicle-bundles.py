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
    assert result['sounds']['mechanical']['down'] == 'vehicle-bundles/default/audio/push-button.mp3'
    assert 'vehicle-bundles/tramlink/audio/open.mp3' in json.loads((assets / 'vehicle-bundle-assets.json').read_text(encoding='utf-8'))
    write({'id': 'tramlink', 'cab': {'layout': {'control-next': {'action': 'traffic', 'text': 'Meldung', 'icon': 'traffic', 'sound': 'effect:passenger'}}}})
    compile_bundles(assets, type_ids)
    write(original)
    write({'id': 'tramlink', 'cab': {'screws': [[100, 100, 'small', 12], [200, 200, 'legacy']]}})
    compile_bundles(assets, type_ids)
    write(original)
    rejected({'id': 'tramlink', 'cab': {'screws': [[100, 100, 'invalid', -1]]}})
    rejected({'id': 'tramlink', 'cab': {'screws': [[2, 2, 'outside', 30]]}})
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
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'cab': {'emergencySprites': {'base': [100, 100, 100, 90]}}})
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'presentation': {'references': [{'title': 'Unsafe', 'url': 'javascript:alert(1)'}]}})
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'presentation': {'unknown': True}})
    rejected({'id': 'wrong-id', 'extends': 'default'})
    rejected({'id': 'tramlink', 'cab': {'layout': {'icon-next': {'iconSize': 201}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'label-next': {'iconSize': 40}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'label-next': {'background': 'url(evil)'}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'control-rotary-0': {'action': 'eval'}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'control-spare-99': {'action': 'next'}}}})
    rejected({'id': 'tramlink', 'extends': 'family-gotha-crank', 'cab': {'layout': {'control-reserve-0': {'actions': {'2': 'next'}}}}})
    rejected({'id': 'tramlink', 'extends': 'family-gotha-crank', 'cab': {'leverSprites': {'on': {'flipX': 'yes'}}}})
    rejected({'id': 'tramlink', 'extends': 'family-tramlink', 'cab': {'rotarySprites': {'image': '../outside.webp'}}})
    rejected({'id': 'tramlink', 'cab': {'buttons': {'doors': {'press': [0, 20, 1]}}}})
    rejected({'id': 'tramlink', 'extends': 'family-gotha-crank', 'cab': {'layout': {'control-reserve-0': {'sound': 'https://example.org/audio.mp3'}}}})
    rejected({'id': 'tramlink', 'extends': 'family-gotha-crank', 'cab': {'layout': {'control-reserve-0': {'sounds': {'2': 'effect:traffic'}}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'actuation-next': {'press': 'effect:traffic'}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'actuation-next': {'mode': 'invalid'}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'actuation-spare-999': {'press': 'mechanical:down'}}}})
    rejected({'id': 'tramlink', 'cab': {'layout': {'label-next': {'hidden': True}}}})
    layout = {'control-reserve-0': {'text': 'Fahrtrichtung', 'icon': 'next', 'actions': {'0': 'back', '1': 'next'}, 'sounds': {'0': 'none', '1': 'effect:traffic'}},
              'icon-reserve-0': {'x': 790, 'y': 540, 'iconSize': 80, 'color': '#ffffff'},
              'label-reserve-0': {'text': 'Anzeige', 'background': 'transparent', 'fontFamily': 'Georgia', 'fontSize': 18, 'bold': True, 'italic': True, 'underline': True},
              'actuation-emergency': {'press': 'mechanical:latch', 'release': 'none', 'mode': 'latching'},
              'heading-free-1': {'text': 'Pulttext', 'x': 300, 'y': 150, 'hidden': False},
              'heading-0': {'hidden': True}}
    write({'id': 'tramlink', 'extends': 'family-gotha-crank', 'cab': {'layout': layout}})
    compile_bundles(assets, type_ids)
    compiled = json.loads((assets / 'vehicle-bundles-data.js').read_text(encoding='utf-8').split('Object.freeze(', 1)[1].rsplit(');', 1)[0])
    assert compiled['tramlink']['cab']['layout'] == layout
    assert compiled['tramlink']['cab']['leverSprites']['on']['flipX'] is True
print('Bundle validation checks passed.')

"""Refresh the selected Commons photos and their attribution (network required).

Only files with an explicit reusable Creative Commons license are accepted.
Commons supplies the resized JPEGs; the photos are otherwise unmodified.
"""
import html
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'app/src/main/assets'
HEADERS = {'User-Agent': 'FahrplanManager/6.2.3 (Erfurt tram vehicle catalogue)'}


def request(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=45) as response:
                return response.read()
        except Exception:
            if attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))


def plain(value):
    return html.unescape(re.sub(r'<[^>]*>', '', value)).strip()


def main():
    selection = json.loads((ROOT / 'artwork/vehicle-photo-selection.json').read_text(encoding='utf-8'))
    # An optional local API cache avoids repeating research requests during development.
    pages = {}
    for name in ('vehicle-photo-research.json', 'vehicle-photo-extra.json'):
        cached = ROOT / 'build' / name
        if cached.exists():
            for category in json.loads(cached.read_text(encoding='utf-8')).values():
                pages.update(category.get('query', {}).get('pages', {}))
    missing = [str(page_id) for page_id in selection.values() if str(page_id) not in pages]
    if missing:
        params = dict(action='query', format='json', pageids='|'.join(missing),
                      prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=960)
        data = json.loads(request('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))
        pages.update(data['query']['pages'])
    target = ASSETS / 'images/vehicles'
    target.mkdir(parents=True, exist_ok=True)
    credits = {}
    for key, page_id in selection.items():
        page = pages[str(page_id)]
        info = page['imageinfo'][0]
        meta = info['extmetadata']
        license_name = plain(meta['LicenseShortName']['value'])
        license_url = meta.get('LicenseUrl', {}).get('value', '').replace('http:', 'https:')
        if not license_name.startswith(('CC BY', 'CC0')) or not license_url.startswith('https://creativecommons.org/'):
            raise ValueError('No approved reusable license: ' + page['title'])
        photo = target / (key + '.jpg')
        if not photo.exists():
            photo.write_bytes(request(info.get('thumburl', info['url'])))
            time.sleep(.5)
        credits[key] = dict(file='images/vehicles/' + photo.name, title=page['title'][5:],
                            author=plain(meta['Artist']['value']), license=license_name,
                            licenseUrl=license_url, source=info['descriptionurl'],
                            original=info['url'], changes='Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert.')
        print(key + ': ' + license_name)
    (target / 'credits.json').write_text(json.dumps(credits, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()

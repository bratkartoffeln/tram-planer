#!/usr/bin/env python3
"""Import user-provided MP3s without changing their audio bytes."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / 'app/src/main/assets/audio'
SPECIAL = {
    'nachste-haltestelle': ('phrases/naechste_haltestelle', 'Nächste Haltestelle'),
    'umsteigemoglichkeit-zum-stadtbus-und-zum': ('phrases/umstieg_stadtbus_busbahnhof', 'Umsteigemöglichkeit zum Stadtbus und zum Busbahnhof'),
    'next-stop-central-station': ('phrases/next_stop_central_station', 'Next stop, Central Station'),
    'next-stop-town-hall': ('phrases/next_stop_town_hall', 'Next stop, Town Hall'),
    'umsteigemoglichkeit-zu-allen-stadtbahnli': ('phrases/umstieg_alle_stadtbahnlinien', 'Umsteigemöglichkeit zu allen Stadtbahnlinien'),
    'sehr-geehrte-fahrgaste-diese-fahrt-endet': ('phrases/fahrt_endet_hier', 'Sehr geehrte Fahrgäste, diese Fahrt endet hier. Bitte alle aussteigen.'),
    'next-stop': ('phrases/next_stop', 'Next stop'),
    'train-station': ('phrases/train_station', 'Train station'),
}
CORRECTIONS = {
    'robert-koch-stra-e': ('robert_koch_strasse', 'Robert-Koch-Straße'),
    'waltergropius-schule': ('walter_gropius_schule', 'Walter-Gropius-Schule'),
    'wiesenhugel': ('wiesenhuegel', 'Wiesenhügel'),
    'farber-waidweg': ('faerberwaidweg', 'Färberwaidweg'),
    'abzweig-wiesenhugel': ('abzweig_wiesenhuegel', 'Abzweig Wiesenhügel'),
    'bluhcherstra-e': ('bluecherstrasse', 'Blücherstraße'),
    'am-schwemm-bach': ('am_schwemmbach', 'Am Schwemmbach'),
    'tschaikoffskiestra-e': ('tschaikowskistrasse', 'Tschaikowskistraße'),
    'betriebshof-melchendorf': ('melchendorf_betriebshof', 'Melchendorf Betriebshof'),
    'fischmarkt-rathaus': ('fischmarkt_rathaus', 'Fischmarkt/Rathaus'),
    'universitat': ('universitaet', 'Universität'),
    'thuringenhalle': ('thueringenhalle', 'Thüringenhalle'),
    'lange-brucke': ('lange_bruecke', 'Lange Brücke'),
    'katho-lisches-krankenhaus': ('katholisches_krankenhaus', 'Katholisches Krankenhaus'),
    'bruhler-garten': ('bruehler_garten', 'Brühler Garten'),
    'buropark-airfurt': ('bueropark_airfurt', 'Büropark Airfurt'),
    'augustfrohlichstra-e': ('august_froelich_strasse', 'August-Frölich-Straße'),
    'an-der-laahche': ('an_der_lache', 'An der Lache'),
    'am-kreuzchen': ('am_kreuzchen', 'Am Kreuzchen'),
    'puschkien-stra-e': ('puschkinstrasse', 'Puschkinstraße'),
    'baumerstra-e': ('baeumerstrasse', 'Bäumerstraße'),
    'hanse-platz-fh': ('hanseplatz_fh', 'Hanseplatz/FH'),
    'krampfer-garten': ('krampfer_gaerten', 'Krämpfer Gärten'),
    'volkenroder-weg': ('volkenrodaer_weg', 'Volkenrodaer Weg'),
    'witterda-er-weg': ('witterdaer_weg', 'Witterdaer Weg'),
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('archive', type=Path)
    args = parser.parse_args()
    catalog, mapping, used = [], {}, set()
    with zipfile.ZipFile(args.archive) as archive:
        for entry in archive.infolist():
            if entry.is_dir():
                continue
            match = re.fullmatch(r'wevolabs-(.+)-(\d{8}-\d{6})\.mp3', entry.filename)
            if not match:
                raise SystemExit(f'Unexpected audio filename: {entry.filename}')
            slug, timestamp = match.groups()
            if slug in SPECIAL:
                target, title = SPECIAL[slug]
                # Preserve both supplied recordings, select the later one below.
                if slug == 'nachste-haltestelle' and timestamp.endswith('004527'):
                    target += '_alternative'
            else:
                normalized = slug.replace('stra-e', 'strasse')
                name, title = CORRECTIONS.get(slug, (normalized.replace('-', '_'), normalized.replace('strasse', 'straße').replace('-', ' ').title()))
                target = 'stops/' + name
            relative = target + '.mp3'
            if relative in used:
                raise SystemExit(f'Duplicate destination: {relative}')
            used.add(relative)
            data = archive.read(entry)
            destination = AUDIO / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
            catalog.append({'original': entry.filename, 'file': 'audio/' + relative,
                            'title': title, 'sha256': hashlib.sha256(data).hexdigest()})
            if target.startswith('stops/'):
                mapping[title] = 'audio/' + relative
    (AUDIO / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (AUDIO / 'announcements.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Imported {len(catalog)} MP3s; {len(mapping)} station names.')


if __name__ == '__main__':
    main()

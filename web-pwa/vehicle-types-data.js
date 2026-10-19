'use strict';
// Generated from vehicle-types.json and images/vehicles/credits.json.
window.ERFURT_VEHICLE_CATALOG = Object.freeze({
  "schemaVersion": 1,
  "researchedOn": "2026-10-20",
  "scope": "Erfurter Straßenbahn: heutige Serien, Traditionsfahrzeuge und frühere Gotha-/Reko-Bauarten. Arbeits- und Veranstaltungsumbauten sind bei ihrer Grundbauart beschrieben. Frühe Einzelanfertigungen vor den Gotha-Serien sind hier nicht vollständig erfasst.",
  "sources": {
    "evag": {
      "title": "EVAG: Fahrzeuge und Traditionsbahnen",
      "url": "https://www.evag-erfurt.de/evag/strassenbahn-mieten-erfurt"
    },
    "tramlink": {
      "title": "EVAG: Tramlink",
      "url": "https://www.evag-erfurt.de/evag/tramlink"
    },
    "fleet": {
      "title": "Fahrzeugchronik Erfurt",
      "url": "https://www.strassenbahn-erfurt.de/wagenpark/"
    },
    "combino": {
      "title": "Erfurter Combino-Bauarten und Fahrzeugdaten",
      "url": "https://www.tram-mitteldeutschland.de/Erfurt/Fahrzeuge.html"
    },
    "gotha": {
      "title": "Gothawagen.de: Erfurter Fahrzeuggeschichte",
      "url": "https://www.gothawagen.de/gothawagen/staedte/erfurt/erfurt.html"
    },
    "reko": {
      "title": "EVAG: Fahrzeuggeschichte der 1980er",
      "url": "https://jubilaeum.evag-erfurt.de/evag-jubilaeum/home/evag-geschichte/1980er"
    },
    "heritage": {
      "title": "Erfurter Sonder- und Traditionswagen",
      "url": "https://www.strassenbahn-erfurt.de/wagenpark/sonderwagen/"
    }
  },
  "types": [
    {
      "id": "tramlink",
      "name": "Stadler Tramlink",
      "group": "Linienfahrzeuge",
      "manufacturer": "Stadler",
      "era": "Erfurt seit 2021",
      "description": "Siebenteiliger Niederflurwagen der jüngsten Erfurter Fahrzeuggeneration.",
      "features": [
        "ca. 42 m",
        "Niederflur",
        "Einrichtung"
      ],
      "photo": "tramlink",
      "photoCaption": "Tramlink 803 am Erfurter Domplatz.",
      "sources": [
        "tramlink",
        "evag"
      ]
    },
    {
      "id": "combino-basic",
      "name": "Combino Basic · 5-teilig",
      "group": "Linienfahrzeuge",
      "manufacturer": "Siemens",
      "era": "Baujahr 2000 · Wagen 621–627",
      "description": "Erste Erfurter Combino-Serie mit fünf Wagenkästen und ursprünglicher Kopfform.",
      "features": [
        "ca. 30 m",
        "Niederflur",
        "Einrichtung"
      ],
      "photo": "combino-basic",
      "photoCaption": "Combino Basic 621 in Erfurt.",
      "sources": [
        "combino",
        "fleet"
      ]
    },
    {
      "id": "combino-advanced-long",
      "name": "Combino Advanced · 5-teilig",
      "group": "Linienfahrzeuge",
      "manufacturer": "Siemens",
      "era": "Baujahre 2002–2005 · Wagen 628–656",
      "description": "Lange Advanced-Ausführung des Combino mit überarbeiteter Fahrzeugfront.",
      "features": [
        "ca. 30 m",
        "Niederflur",
        "Einrichtung"
      ],
      "photo": "combino-advanced-long",
      "photoCaption": "Combino Advanced 634 in Erfurt.",
      "sources": [
        "combino",
        "fleet"
      ]
    },
    {
      "id": "combino-advanced-short",
      "name": "Combino Advanced · 3-teilig",
      "group": "Linienfahrzeuge",
      "manufacturer": "Siemens",
      "era": "Baujahre 2002–2005 · Wagen 701–712",
      "description": "Kurze Advanced-Ausführung; in Erfurt auch als Teil von Doppeltraktionen eingesetzt.",
      "features": [
        "ca. 20 m",
        "Niederflur",
        "Einrichtung"
      ],
      "photo": "combino-advanced-short",
      "photoCaption": "Dreiteiliger Combino 710 am Europaplatz.",
      "sources": [
        "combino",
        "fleet"
      ]
    },
    {
      "id": "combino-classic",
      "name": "Combino Classic · 3-teilig",
      "group": "Linienfahrzeuge",
      "manufacturer": "Siemens",
      "era": "Baujahre 2011–2012 · Wagen 713–724",
      "description": "Spätere Erfurter Combino-Serie mit drei Wagenkästen.",
      "features": [
        "ca. 20 m",
        "Niederflur",
        "Einrichtung"
      ],
      "photo": "combino-classic",
      "photoCaption": "Combino Classic 715 in Erfurt (Originaldateiname nennt irrtümlich 716).",
      "sources": [
        "combino",
        "fleet"
      ]
    },
    {
      "id": "mgt6d",
      "name": "MGT6D · Zweirichter",
      "group": "Linienfahrzeuge",
      "manufacturer": "DUEWAG / Siemens",
      "era": "Baujahr 1994 · Wagen 601–604",
      "description": "Erste Erfurter Niederflurserie. Zwei Fahrerstände und Türen auf beiden Seiten unterscheiden sie von den späteren Einrichtern.",
      "features": [
        "Teilniederflur",
        "Zweirichtung",
        "3-teilig"
      ],
      "photo": "mgt6d",
      "photoCaption": "MGT6D 602 am Anger.",
      "sources": [
        "fleet"
      ]
    },
    {
      "id": "mgt6de",
      "name": "MGT6DE · Einrichter",
      "group": "Linienfahrzeuge",
      "manufacturer": "DUEWAG / Siemens",
      "era": "Baujahre 1996–1998 · Wagen 605–616",
      "description": "Weiterentwicklung des MGT6D für den Erfurter Einrichtungsbetrieb.",
      "features": [
        "Teilniederflur",
        "Einrichtung",
        "3-teilig"
      ],
      "photo": "mgt6de",
      "photoCaption": "MGT6DE 606 in der Erfurter Bahnhofstraße.",
      "sources": [
        "fleet",
        "evag"
      ]
    },
    {
      "id": "kt4d",
      "name": "Tatra KT4D",
      "group": "Tatra & Tradition",
      "manufacturer": "ČKD Tatra, Prag",
      "era": "Erfurt ab 1976",
      "description": "Vierachsiger Kurzgelenktriebwagen. Prägte den Erfurter Linienverkehr; einzelne Fahrzeuge wurden später zu Arbeitswagen umgebaut.",
      "features": [
        "Hochflur",
        "Einrichtung",
        "2-teilig"
      ],
      "photo": "kt4d",
      "photoCaption": "Erfurter Tatra KT4D.",
      "sources": [
        "fleet",
        "reko"
      ]
    },
    {
      "id": "kt4dc",
      "name": "Tatra KT4D-C · modernisiert",
      "group": "Tatra & Tradition",
      "manufacturer": "ČKD Tatra / Modernisierung EVAG",
      "era": "Modernisierte KT4D · heute auch Sonderfahrten",
      "description": "Modernisierungsvariante des KT4D. Erhaltene Stadtführungswagen gehören zu dieser Fahrzeugfamilie.",
      "features": [
        "Hochflur",
        "Einrichtung",
        "Sonderfahrten"
      ],
      "photo": "kt4dc",
      "photoCaption": "Traditions-Tatra 522 in Erfurt.",
      "sources": [
        "heritage",
        "evag"
      ]
    },
    {
      "id": "gotha-standard",
      "name": "Gothaer Zweiachser · TW 92",
      "group": "Tatra & Tradition",
      "manufacturer": "Waggonfabrik Gotha",
      "era": "Traditionswagen 92 · Baujahr 1938",
      "description": "Erhaltener zweiachsiger Vorkriegstriebwagen für historische Fahrten.",
      "features": [
        "Hochflur",
        "Zweiachser",
        "24 Sitzplätze"
      ],
      "photo": "gotha-standard",
      "photoCaption": "Traditionswagen 92 in der Erfurter Bahnhofstraße.",
      "sources": [
        "evag",
        "heritage"
      ]
    },
    {
      "id": "t2d",
      "name": "Gotha / Tatra T2D",
      "group": "Tatra & Tradition",
      "manufacturer": "ČKD Tatra, Prag",
      "era": "Erfurter Neulieferungen ab 1968",
      "description": "In Prag weitergebaute Gotha-Konstruktion. In Erfurt auch als Traditionswagen 3 und als Arbeits-/Schneepflugwagen vertreten.",
      "features": [
        "Hochflur",
        "Zweiachser",
        "Einrichtung"
      ],
      "photo": "t2d",
      "photoCaption": "T2D-Traditionswagen am Erfurter Domplatz.",
      "sources": [
        "gotha",
        "evag",
        "heritage"
      ]
    },
    {
      "id": "g4-65",
      "name": "Gotha G4-65",
      "group": "Tatra & Tradition",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Erfurter Serie der 1960er · Traditionswagen 178",
      "description": "Gothaer Gelenkwagen mit schwebendem Mittelteil; Nachfolgeausführung des G4-61.",
      "features": [
        "Hochflur",
        "4 Achsen",
        "3-teilig"
      ],
      "photo": "g4-65",
      "photoCaption": "G4-65-Traditionswagen 178 in Erfurt; später aus Gotha übernommen.",
      "sources": [
        "gotha",
        "heritage"
      ]
    },
    {
      "id": "katerexpress",
      "name": "Gotha G4-65 · Katerexpress",
      "group": "Tatra & Tradition",
      "manufacturer": "VEB Waggonbau Gotha / EVAG",
      "era": "Wagen 190 · Baujahr 1967 · Eventumbau 2003",
      "description": "Zum Veranstaltungswagen mit Tischen und Bar umgebauter G4-65.",
      "features": [
        "Hochflur",
        "Eventwagen",
        "Einrichtung"
      ],
      "photo": "katerexpress",
      "photoCaption": "Katerexpress 190 in Erfurt.",
      "sources": [
        "evag",
        "heritage"
      ]
    },
    {
      "id": "g4-61",
      "name": "Gotha G4-61",
      "group": "Frühere Bauarten",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Prototyp ab 1959 · Vorserie 1961 · Serie ab 1962",
      "description": "Frühe Gothaer Gelenkwagenserie. Erfurt war an der Entwicklung beteiligt und setzte sie in größerer Zahl ein.",
      "features": [
        "Hochflur",
        "4 Achsen",
        "3-teilig"
      ],
      "photo": "g4-61",
      "photoCaption": "Typenfoto: Gotha G4-61, Wagen 54 in Nordhausen, 1990.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "t57e",
      "name": "Gotha T57E · Erfurt 57",
      "group": "Frühere Bauarten",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Erfurter Lieferungen 1957–1958",
      "description": "Erfurter Sonderausführung mit großen Plattformfenstern. Zehn Triebwagen wurden geliefert.",
      "features": [
        "Hochflur",
        "Zweiachser",
        "Einrichtung"
      ],
      "photo": "historic-gotha",
      "photoCaption": "Zeitaufnahme Erfurter Gotha-Züge an der EGA; kein gesichertes Einzelporträt eines T57E.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "t2-60",
      "name": "Gotha T2-60",
      "group": "Frühere Bauarten",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Lieferung 1960 · zwei Triebwagen",
      "description": "Fortsetzung der Erfurter Zweiachser-Sonderbauform; Einführung der ESW-Kupplung zusammen mit passenden Beiwagen.",
      "features": [
        "Hochflur",
        "Zweiachser",
        "Einrichtung"
      ],
      "photo": "historic-gotha",
      "photoCaption": "Zeitaufnahme Erfurter Gotha-Züge an der EGA; kein gesichertes Einzelporträt eines T2-60.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "t2-61",
      "name": "Gotha T2-61",
      "group": "Frühere Bauarten",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Lieferung 1961 · zwei Triebwagen",
      "description": "Erfurter Fahrzeuge aus der damaligen Gothaer Serienfertigung; ein Wagen ging 1964 nach Brandenburg.",
      "features": [
        "Hochflur",
        "Zweiachser",
        "Einrichtung"
      ],
      "photo": "t2-61",
      "photoCaption": "Erfurter Gotha-Zweiachser auf dem verschneiten Anger, 1984 (Bundesarchiv; als T2-61 eingeordnet).",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "b2-60",
      "name": "Gotha B2-60 · Beiwagen",
      "group": "Beiwagen",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Erfurter Sonderbauform · Lieferung 1960",
      "description": "Sieben zweiachsige Beiwagen zur Erfurter Sonderbauform der Gotha-Triebwagen.",
      "features": [
        "Ohne eigenen Antrieb",
        "Hochflur",
        "Zweiachser"
      ],
      "photo": "historic-gotha",
      "photoCaption": "Historischer Gotha-Zug in Erfurt; Zeitaufnahme ohne gesicherte Beiwagen-Untertyp-Zuordnung.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "b2-61",
      "name": "Gotha B2-61 · Beiwagen",
      "group": "Beiwagen",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Lieferung 1961",
      "description": "Serienbeiwagen der Gothaer Zweiachserfamilie im früheren Erfurter Wagenpark.",
      "features": [
        "Ohne eigenen Antrieb",
        "Hochflur",
        "Zweiachser"
      ],
      "photo": "historic-gotha",
      "photoCaption": "Historischer Gotha-Zug in Erfurt; Zeitaufnahme ohne gesicherte Beiwagen-Untertyp-Zuordnung.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "b2-62",
      "name": "Gotha B2-62 / B2-64 · Beiwagen",
      "group": "Beiwagen",
      "manufacturer": "VEB Waggonbau Gotha",
      "era": "Spätere Gotha-Beiwagen · u. a. Traditionswagen 274",
      "description": "Spätere Beiwagenfamilie, auch hinter Gelenkwagen verwendet. Der erhaltene Wagen 274 wird in der Fahrzeugchronik als B2-64 geführt.",
      "features": [
        "Ohne eigenen Antrieb",
        "Hochflur",
        "Zweiachser"
      ],
      "photo": "b2-64",
      "photoCaption": "Typenfoto: B2-64-Beiwagen 385 im Straßenbahnmuseum Halle; kein Erfurter Wagen.",
      "sources": [
        "gotha",
        "heritage",
        "evag"
      ]
    },
    {
      "id": "b2d",
      "name": "Tatra B2D · Beiwagen",
      "group": "Beiwagen",
      "manufacturer": "ČKD Tatra, Prag",
      "era": "Erfurt ab 1968",
      "description": "In Prag gebauter Beiwagen der Gotha-Konstruktion; Neulieferungen und spätere Übernahmen aus Halle.",
      "features": [
        "Ohne eigenen Antrieb",
        "Hochflur",
        "Zweiachser"
      ],
      "photo": "b2-64",
      "photoCaption": "Vergleichsfoto: B2-64 in Halle aus derselben Gotha-Fahrzeugfamilie; kein B2D.",
      "sources": [
        "gotha"
      ]
    },
    {
      "id": "summer-trailer",
      "name": "Gotha B2-64 · Sommerbeiwagen 275",
      "group": "Beiwagen",
      "manufacturer": "VEB Waggonbau Gotha / Umbau",
      "era": "Traditionswagen 275 · offener Umbau",
      "description": "Offener Sommerbeiwagen für Traditions- und Veranstaltungsfahrten mit einem geeigneten Triebwagen.",
      "features": [
        "Ohne eigenen Antrieb",
        "Offener Aufbau",
        "34 Sitzplätze"
      ],
      "photo": "b2-64",
      "photoCaption": "Vergleichsfoto des geschlossenen B2-64 in Halle; der Erfurter offene Umbau 275 ist hier nicht abgebildet.",
      "sources": [
        "heritage",
        "evag"
      ]
    },
    {
      "id": "reko-trailer",
      "name": "Reko-Beiwagen · BE 70",
      "group": "Beiwagen",
      "manufacturer": "RAW Berlin-Schöneweide",
      "era": "Erfurter Lieferungen 1973–1975",
      "description": "18 Reko-Beiwagen ergänzten die Erfurter Gotha-Züge in den 1970er-Jahren.",
      "features": [
        "Ohne eigenen Antrieb",
        "Hochflur",
        "Zweiachser"
      ],
      "photo": "historic-gotha",
      "photoCaption": "Ältere Erfurter Gotha-Zeitaufnahme als Vergleich; kein Reko-Beiwagen-Porträt.",
      "sources": [
        "reko"
      ]
    }
  ],
  "photos": {
    "tramlink": {
      "file": "images/vehicles/tramlink.jpg",
      "title": "Tram Tramlink Erfurt Domplatz 1.JPG",
      "author": "Tramhendi",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Tram_Tramlink_Erfurt_Domplatz_1.JPG",
      "original": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Tram_Tramlink_Erfurt_Domplatz_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "combino-basic": {
      "file": "images/vehicles/combino-basic.jpg",
      "title": "Erfurt tramwaj 621.jpg",
      "author": "Andrzej Otrębski",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_tramwaj_621.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/4/42/Erfurt_tramwaj_621.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "combino-advanced-long": {
      "file": "images/vehicles/combino-advanced-long.jpg",
      "title": "SWE EVAG 634.jpg",
      "author": "Briefkasten97",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "source": "https://commons.wikimedia.org/wiki/File:SWE_EVAG_634.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/a/a9/SWE_EVAG_634.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "combino-advanced-short": {
      "file": "images/vehicles/combino-advanced-short.jpg",
      "title": "J24 043 Bf Europaplatz, ET 710.jpg",
      "author": "Falk2",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:J24_043_Bf_Europaplatz,_ET_710.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/3/3e/J24_043_Bf_Europaplatz%2C_ET_710.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "combino-classic": {
      "file": "images/vehicles/combino-classic.jpg",
      "title": "Combino Classic Erfurt Tw 716.JPG",
      "author": "Briefkasten97",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "source": "https://commons.wikimedia.org/wiki/File:Combino_Classic_Erfurt_Tw_716.JPG",
      "original": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Combino_Classic_Erfurt_Tw_716.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "mgt6d": {
      "file": "images/vehicles/mgt6d.jpg",
      "title": "J21 517 Anger, ET 602.jpg",
      "author": "Falk2",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:J21_517_Anger,_ET_602.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/d/d4/J21_517_Anger%2C_ET_602.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "mgt6de": {
      "file": "images/vehicles/mgt6de.jpg",
      "title": "Erfurt tramwaj 606.jpg",
      "author": "Andrzej Otrębski",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_tramwaj_606.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/9/90/Erfurt_tramwaj_606.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "kt4d": {
      "file": "images/vehicles/kt4d.jpg",
      "title": "Erfurt, Tatra KT4.jpg",
      "author": "Felix O",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt,_Tatra_KT4.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/1/15/Erfurt%2C_Tatra_KT4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "kt4dc": {
      "file": "images/vehicles/kt4dc.jpg",
      "title": "Erfurt tramwaj 522.jpg",
      "author": "Andrzej Otrębski",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_tramwaj_522.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Erfurt_tramwaj_522.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "t2d": {
      "file": "images/vehicles/t2d.jpg",
      "title": "Erfurt Tram Domplatz.jpg",
      "author": "Andreas Praefcke",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_Tram_Domplatz.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/4/40/Erfurt_Tram_Domplatz.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "gotha-standard": {
      "file": "images/vehicles/gotha-standard.jpg",
      "title": "Straßenbahn alt Erfurt.JPG",
      "author": "Michael Sander",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Stra%C3%9Fenbahn_alt_Erfurt.JPG",
      "original": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Stra%C3%9Fenbahn_alt_Erfurt.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "g4-65": {
      "file": "images/vehicles/g4-65.jpg",
      "title": "Erfurt - Tw 178 Gothawagen G4-65.jpg",
      "author": "Michael Sander",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_-_Tw_178_Gothawagen_G4-65.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Erfurt_-_Tw_178_Gothawagen_G4-65.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "katerexpress": {
      "file": "images/vehicles/katerexpress.jpg",
      "title": "Erfurt tram 190 (48713269541).jpg",
      "author": "Sludge G",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_tram_190_(48713269541).jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Erfurt_tram_190_%2848713269541%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "historic-train": {
      "file": "images/vehicles/historic-train.jpg",
      "title": "Erfurt Straßenbahn Sonderfahrt x1.JPG",
      "author": "PeterBraun74",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "source": "https://commons.wikimedia.org/wiki/File:Erfurt_Stra%C3%9Fenbahn_Sonderfahrt_x1.JPG",
      "original": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Erfurt_Stra%C3%9Fenbahn_Sonderfahrt_x1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "historic-gotha": {
      "file": "images/vehicles/historic-gotha.jpg",
      "title": "Gothaer Strasse, villamosvégállomás az EGA-Parknál. Fortepan 29981.jpg",
      "author": "FOTO:Fortepan — ID 29981: Adományozó/Donor: Mészáros Zoltán.",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "source": "https://commons.wikimedia.org/wiki/File:Gothaer_Strasse,_villamosv%C3%A9g%C3%A1llom%C3%A1s_az_EGA-Parkn%C3%A1l._Fortepan_29981.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/8/86/Gothaer_Strasse%2C_villamosv%C3%A9g%C3%A1llom%C3%A1s_az_EGA-Parkn%C3%A1l._Fortepan_29981.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "g4-61": {
      "file": "images/vehicles/g4-61.jpg",
      "title": "Gotha G4-61 Gelenkwagennr 54, Nordhausen Bahnhof, May 1990 - Flickr - sludgegulper.jpg",
      "author": "Felix O",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "source": "https://commons.wikimedia.org/wiki/File:Gotha_G4-61_Gelenkwagennr_54,_Nordhausen_Bahnhof,_May_1990_-_Flickr_-_sludgegulper.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Gotha_G4-61_Gelenkwagennr_54%2C_Nordhausen_Bahnhof%2C_May_1990_-_Flickr_-_sludgegulper.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "t2-61": {
      "file": "images/vehicles/t2-61.jpg",
      "title": "Bundesarchiv Bild 183-1984-0403-035, Erfurt, Anger, Schneefall.jpg",
      "author": "Jürgen Ludwig",
      "license": "CC BY-SA 3.0 de",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
      "source": "https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-1984-0403-035,_Erfurt,_Anger,_Schneefall.jpg",
      "original": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Bundesarchiv_Bild_183-1984-0403-035%2C_Erfurt%2C_Anger%2C_Schneefall.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    },
    "b2-64": {
      "file": "images/vehicles/b2-64.jpg",
      "title": "Beiwagen 385 Straßenbahnmuseum Halle.JPG",
      "author": "Milenavaleska",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "source": "https://commons.wikimedia.org/wiki/File:Beiwagen_385_Stra%C3%9Fenbahnmuseum_Halle.JPG",
      "original": "https://upload.wikimedia.org/wikipedia/commons/8/87/Beiwagen_385_Stra%C3%9Fenbahnmuseum_Halle.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "changes": "Auf 960 Pixel verkleinerte Commons-Vorschau; sonst unverändert."
    }
  }
});

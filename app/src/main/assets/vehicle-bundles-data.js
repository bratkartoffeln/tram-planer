'use strict';
// Generated from vehicle-bundles/*/bundle.json. Do not edit.
window.VEHICLE_BUNDLES = Object.freeze({
  "default": {
    "id": "default",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    }
  },
  "family-gotha-crank": {
    "id": "family-gotha-crank",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schalterkasten am Kurbelpult",
      "variant": "Nachbildung · Vergleich Kirnitzschtal",
      "description": "Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "b2-60": {
    "id": "b2-60",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1326.410909112147,
          "y": 332.30832108764747
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schalterkasten am Kurbelpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "b2-61": {
    "id": "b2-61",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1328.8864832763486,
          "y": 331.0705852246713
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schalterkasten am Kurbelpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "family-gotha-wheel": {
    "id": "family-gotha-wheel",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schaltplatte am Handradpult",
      "variant": "Nachbildung · Vergleich Naumburg 202",
      "description": "Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "b2-62": {
    "id": "b2-62",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1272.7349537856028,
          "y": 575.2590452468679
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schaltplatte am Handradpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "b2d": {
    "id": "b2d",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schaltplatte am Handradpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "family-combino": {
    "id": "family-combino",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Combino · Standard-Fahrpult",
      "variant": "Standard-Fallback · Combino-Familie",
      "description": "Alle vier Combino-Varianten verwenden das Default-Fallback-Fahrpult der Simulation. Tasten, Druckanimationen, Drehschalter und vier interaktive Eckschrauben entsprechen dem Standard-Fahrpult.",
      "references": [
        {
          "title": "Standard-Fahrpult · Bildquelle und Gestaltung",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#fotorealistisches-fahrerpult-in-623"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    }
  },
  "combino-advanced-long": {
    "id": "combino-advanced-long",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      },
      "layout": {
        "icon-traffic": {
          "x": 872.3425531425604,
          "y": 754.753725706147
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Combino · Standard-Fahrpult",
      "variant": "Standard-Fallback · Combino Advanced lang",
      "description": "Alle vier Combino-Varianten verwenden das Default-Fallback-Fahrpult der Simulation. Tasten, Druckanimationen, Drehschalter und vier interaktive Eckschrauben entsprechen dem Standard-Fahrpult.",
      "references": [
        {
          "title": "Standard-Fahrpult · Bildquelle und Gestaltung",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#fotorealistisches-fahrerpult-in-623"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    }
  },
  "combino-advanced-short": {
    "id": "combino-advanced-short",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      },
      "layout": {
        "icon-passenger": {
          "x": 405.9743098982788,
          "y": 751.684819126208
        },
        "label-emergency": {
          "x": 1499.1515299057207,
          "y": 114.11097280993036
        },
        "icon-traffic": {
          "x": 872.3424497983834,
          "y": 754.7537773784584
        },
        "icon-emergency": {
          "x": 1512.6968043562476,
          "y": 218.63423543196896
        },
        "icon-finish": {
          "x": 1495.6910662866674,
          "y": 750.690060118747
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Combino · Standard-Fahrpult",
      "variant": "Standard-Fallback · Combino Advanced kurz",
      "description": "Alle vier Combino-Varianten verwenden das Default-Fallback-Fahrpult der Simulation. Tasten, Druckanimationen, Drehschalter und vier interaktive Eckschrauben entsprechen dem Standard-Fahrpult.",
      "references": [
        {
          "title": "Standard-Fahrpult · Bildquelle und Gestaltung",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#fotorealistisches-fahrerpult-in-623"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    }
  },
  "combino-basic": {
    "id": "combino-basic",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      },
      "layout": {
        "icon-traffic": {
          "x": 870.9880210147247,
          "y": 753.3991877344506
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Combino · Standard-Fahrpult",
      "variant": "Standard-Fallback · Combino Basic",
      "description": "Alle vier Combino-Varianten verwenden das Default-Fallback-Fahrpult der Simulation. Tasten, Druckanimationen, Drehschalter und vier interaktive Eckschrauben entsprechen dem Standard-Fahrpult.",
      "references": [
        {
          "title": "Standard-Fahrpult · Bildquelle und Gestaltung",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#fotorealistisches-fahrerpult-in-623"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    }
  },
  "combino-classic": {
    "id": "combino-classic",
    "cab": {
      "image": "images/cab-panel-photoreal.webp",
      "width": 1681,
      "height": 936,
      "buttons": {
        "next": {
          "x": 166,
          "y": 247
        },
        "back": {
          "x": 334,
          "y": 247
        },
        "doors": {
          "x": 166,
          "y": 475
        },
        "passenger": {
          "x": 406,
          "y": 749
        },
        "fullscreen": {
          "x": 626,
          "y": 749
        },
        "traffic": {
          "x": 871,
          "y": 748
        },
        "finish": {
          "x": 1493,
          "y": 748
        },
        "emergency": {
          "x": 1510,
          "y": 220
        }
      },
      "indicators": {
        "closed": {
          "x": 884,
          "y": 248
        },
        "open": {
          "x": 884,
          "y": 481
        }
      },
      "headings": [
        [
          "FAHRT & TÜREN",
          432,
          106
        ],
        [
          "SCHEIBE",
          1170,
          106
        ],
        [
          "SPIEGEL",
          1295,
          373
        ],
        [
          "FAHRGASTINFO",
          415,
          616
        ],
        [
          "BETRIEB",
          1295,
          616
        ]
      ],
      "spares": [
        [
          509.5,
          246.5
        ],
        [
          687,
          245.5
        ],
        [
          334.5,
          472.5
        ],
        [
          510,
          472.5
        ],
        [
          685,
          472.5
        ],
        [
          1263.5,
          234.5
        ],
        [
          1096.5,
          485.5
        ],
        [
          1499.5,
          485.5
        ],
        [
          193,
          750
        ],
        [
          1284,
          749
        ]
      ],
      "screws": [
        [
          60,
          50,
          "oben links"
        ],
        [
          1620,
          50,
          "oben rechts"
        ],
        [
          60,
          880,
          "unten links"
        ],
        [
          1620,
          880,
          "unten rechts"
        ]
      ],
      "rotaries": [
        [
          1088,
          236
        ],
        [
          1088,
          750
        ]
      ],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#242932",
        "panel": "#65636f",
        "text": "#eef1f3"
      },
      "layout": {
        "icon-traffic": {
          "x": 872.3425531425604,
          "y": 752.0446497627546
        },
        "label-emergency": {
          "x": 1495.0876234896828,
          "y": 115.46553661778223
        },
        "icon-emergency": {
          "x": 1512.6968043562476,
          "y": 219.98879923982082
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Combino · Standard-Fahrpult",
      "variant": "Standard-Fallback · Combino Classic",
      "description": "Alle vier Combino-Varianten verwenden das Default-Fallback-Fahrpult der Simulation. Tasten, Druckanimationen, Drehschalter und vier interaktive Eckschrauben entsprechen dem Standard-Fahrpult.",
      "references": [
        {
          "title": "Standard-Fahrpult · Bildquelle und Gestaltung",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#fotorealistisches-fahrerpult-in-623"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    }
  },
  "family-gotha-vintage": {
    "id": "family-gotha-vintage",
    "cab": {
      "image": "vehicle-bundles/family-gotha-vintage/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 265,
          "y": 427,
          "size": 200,
          "capWidth": 144,
          "capHeight": 150,
          "shape": "round",
          "ink": "#fff3df"
        },
        "back": {
          "x": 593.5,
          "y": 429,
          "size": 200,
          "capWidth": 150,
          "capHeight": 156,
          "shape": "round",
          "ink": "#18212a"
        },
        "doors": {
          "x": 930,
          "y": 428,
          "size": 200,
          "capWidth": 148,
          "capHeight": 152,
          "shape": "round",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 268,
          "y": 742,
          "size": 200,
          "capWidth": 148,
          "capHeight": 152,
          "shape": "round",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 594.5,
          "y": 744,
          "size": 200,
          "capWidth": 150,
          "capHeight": 158,
          "shape": "round",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 932,
          "y": 744,
          "size": 200,
          "capWidth": 156,
          "capHeight": 162,
          "shape": "round",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1273,
          "y": 740,
          "size": 200,
          "capWidth": 154,
          "capHeight": 158,
          "shape": "round",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1269,
          "y": 425,
          "size": 200,
          "capWidth": 156,
          "capHeight": 154,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 620,
          "y": 170,
          "size": 150,
          "capWidth": 105,
          "capHeight": 105,
          "shape": "round"
        },
        "open": {
          "x": 920,
          "y": 170,
          "size": 150,
          "capWidth": 105,
          "capHeight": 105,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          100,
          104,
          "oben links"
        ],
        [
          1435,
          104,
          "oben rechts"
        ],
        [
          100,
          900,
          "unten links"
        ],
        [
          1435,
          900,
          "unten rechts"
        ],
        [
          549,
          170,
          "Lampenfassung 1",
          28
        ],
        [
          690,
          170,
          "Lampenfassung 2",
          28
        ],
        [
          849,
          170,
          "Lampenfassung 3",
          28
        ],
        [
          991,
          170,
          "Lampenfassung 4",
          28
        ],
        [
          179,
          432,
          "Obere Tasterfassung 1",
          28
        ],
        [
          362,
          432,
          "Obere Tasterfassung 2",
          28
        ],
        [
          509,
          432,
          "Obere Tasterfassung 3",
          28
        ],
        [
          690,
          432,
          "Obere Tasterfassung 4",
          28
        ],
        [
          840,
          432,
          "Obere Tasterfassung 5",
          28
        ],
        [
          1025,
          432,
          "Obere Tasterfassung 6",
          28
        ],
        [
          1173,
          432,
          "Obere Tasterfassung 7",
          28
        ],
        [
          1357,
          432,
          "Obere Tasterfassung 8",
          28
        ],
        [
          179,
          742,
          "Untere Tasterfassung 1",
          28
        ],
        [
          362,
          742,
          "Untere Tasterfassung 2",
          28
        ],
        [
          509,
          742,
          "Untere Tasterfassung 3",
          28
        ],
        [
          690,
          742,
          "Untere Tasterfassung 4",
          28
        ],
        [
          840,
          742,
          "Untere Tasterfassung 5",
          28
        ],
        [
          1025,
          742,
          "Untere Tasterfassung 6",
          28
        ],
        [
          1173,
          742,
          "Untere Tasterfassung 7",
          28
        ],
        [
          1357,
          742,
          "Untere Tasterfassung 8",
          28
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#49261b",
        "panel": "#49261b",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 60,
      "emergencySprites": {
        "mask": [
          1100,
          570,
          40,
          40
        ],
        "ring": [
          1267,
          430,
          230,
          230
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1267,
          430,
          160,
          160
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df"
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "TW 92 · historische Schaltplatte",
      "variant": "Simulationsnachbildung · historischer Stilvergleich",
      "description": "Stilgerechte frontale Schaltplatte mit schwarzen, hellen und dunkelroten Bakelittastern, Messingringen und Holzrahmen nach den Materialien des TW-92-Führerstands. Die acht Taster sind eine ergänzte Simulationsbedienung; eine solche Originalplatte von TW 92 ist nicht belegt.",
      "references": [
        {
          "title": "TW 92 Erfurt · Führerstand, Erhard Beyer",
          "url": "https://altebahnen.startbilder.de/bild/Deutschland~Strassenbahnen+vor+1945~Erfurt+-+Tw+92/142268/fuehrerstand-tw-92.html"
        },
        {
          "title": "EVAG · Traditionswagen 92",
          "url": "https://www.evag-erfurt.de/evag/home/service/strassenbahn-mieten-erfurt"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt TW 92. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "family-kt4d": {
    "id": "family-kt4d",
    "cab": {
      "image": "vehicle-bundles/family-kt4d/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 197,
          "y": 410,
          "size": 170,
          "capWidth": 120,
          "capHeight": 120,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 197.5,
          "y": 614,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 197.5,
          "y": 817,
          "size": 170,
          "capWidth": 120,
          "capHeight": 120,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 1331,
          "y": 201,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 1330,
          "y": 410.5,
          "size": 170,
          "capWidth": 116,
          "capHeight": 116,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 1328,
          "y": 616.5,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1328,
          "y": 818,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 186,
          "y": 185.5,
          "size": 220,
          "capWidth": 184,
          "capHeight": 172,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 665,
          "y": 746,
          "size": 96,
          "capWidth": 80,
          "capHeight": 84,
          "shape": "round"
        },
        "open": {
          "x": 865,
          "y": 746,
          "size": 96,
          "capWidth": 80,
          "capHeight": 84,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          58,
          54,
          "oben links"
        ],
        [
          1478,
          54,
          "oben rechts"
        ],
        [
          58,
          960,
          "unten links"
        ],
        [
          1478,
          960,
          "unten rechts"
        ],
        [
          589,
          539,
          "Instrument 1",
          38
        ],
        [
          941,
          539,
          "Instrument 2",
          38
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#27333e",
        "panel": "#27333e",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          340,
          705,
          40,
          40
        ],
        "ring": [
          200,
          194,
          245,
          245
        ],
        "travel": [
          10,
          11
        ],
        "base": [
          202,
          194,
          214,
          214
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df"
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "KT4D · klassisches Schalterpanel",
      "variant": "Nachbildung · Prototypvergleich Potsdam",
      "description": "Frontale dunkle Metallplatte mit schwarzen Bakelittastern, hellen Kappen und Analoginstrumenten nach dem Potsdamer KT4D-Prototyp. Für die Simulation angepasster Baureihenvergleich; kein exakter Erfurter Serienzustand.",
      "references": [
        {
          "title": "Straßenbahn Potsdam · KT4D-Prototyp",
          "url": "https://www.tram2000.de/wagenpark/museumswagen/kt4d-prototyp/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Prototypvergleich Potsdam. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "family-kt4dc": {
    "id": "family-kt4dc",
    "cab": {
      "image": "vehicle-bundles/family-kt4dc/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 166,
          "y": 251,
          "size": 180,
          "capWidth": 132,
          "capHeight": 132,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 406,
          "y": 251.5,
          "size": 180,
          "capWidth": 130,
          "capHeight": 130,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 164.5,
          "y": 531,
          "size": 180,
          "capWidth": 132,
          "capHeight": 132,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 240,
          "y": 795,
          "size": 180,
          "capWidth": 134,
          "capHeight": 134,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 578,
          "y": 796,
          "size": 180,
          "capWidth": 136,
          "capHeight": 136,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 954.5,
          "y": 795.5,
          "size": 180,
          "capWidth": 130,
          "capHeight": 142,
          "shape": "round",
          "ink": "#3c280c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1279,
          "y": 794.5,
          "size": 180,
          "capWidth": 138,
          "capHeight": 138,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1376,
          "y": 260.5,
          "size": 260,
          "capWidth": 216,
          "capHeight": 224,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 664,
          "y": 580,
          "size": 110,
          "capWidth": 88,
          "capHeight": 92,
          "shape": "round"
        },
        "open": {
          "x": 867,
          "y": 580,
          "size": 110,
          "capWidth": 88,
          "capHeight": 92,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          70,
          65,
          "oben links"
        ],
        [
          1464,
          65,
          "oben rechts"
        ],
        [
          70,
          934,
          "unten links"
        ],
        [
          1464,
          934,
          "unten rechts"
        ],
        [
          574,
          106,
          "Tachometer 1",
          28
        ],
        [
          963,
          106,
          "Tachometer 2",
          28
        ],
        [
          573,
          437,
          "Tachometer 3",
          28
        ],
        [
          961,
          437,
          "Tachometer 4",
          28
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#452020",
        "panel": "#452020",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1280,
          520,
          40,
          40
        ],
        "ring": [
          1350,
          265,
          288,
          288
        ],
        "travel": [
          -18,
          13
        ],
        "base": [
          1341,
          263.5,
          243,
          243
        ]
      },
      "accessories": [
        {
          "kind": "button",
          "label": "Reserve 1",
          "sprite": [
            1114,
            252,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve 2",
          "sprite": [
            405,
            531,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve 3",
          "sprite": [
            1113,
            532,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        }
      ],
      "labelColor": "#fff8df"
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "KT4D-C · Schalterpanel",
      "variant": "Nachbildung · Erfurt 522",
      "description": "Frontales schwarzes Rundtasterpanel im roten Rahmen nach Erfurter Sonderwagen 522. Analogtacho als Bildkulisse. Die Spieltasten sind aus dem Schalterfeld abgeleitet und neu angeordnet; andere Modernisierungen können abweichen.",
      "references": [
        {
          "title": "Erfurt KT4D-C 522 · Christian Meinelt",
          "url": "https://www.strassenbahn-erfurt.de/wagenpark/bilder.php?id=522"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt 522. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "family-mgt": {
    "id": "family-mgt",
    "cab": {
      "image": "vehicle-bundles/family-mgt/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 288,
          "y": 361,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "back": {
          "x": 596.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 901.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "passenger": {
          "x": 288.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "fullscreen": {
          "x": 596.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 903,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "finish": {
          "x": 1225,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "emergency": {
          "x": 1276.5,
          "y": 331.5,
          "size": 300,
          "capWidth": 252,
          "capHeight": 256,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 690,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        },
        "open": {
          "x": 844,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          80,
          86,
          "oben links"
        ],
        [
          1455,
          86,
          "oben rechts"
        ],
        [
          80,
          914,
          "unten links"
        ],
        [
          1455,
          914,
          "unten rechts"
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#4d2b20",
        "panel": "#4d2b20",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 60,
      "emergencySprites": {
        "mask": [
          1100,
          535,
          40,
          40
        ],
        "ring": [
          1255,
          340,
          340,
          340
        ],
        "travel": [
          -20,
          14
        ],
        "base": [
          1250,
          339,
          288,
          288
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df"
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "MGT · Tastenpanel",
      "variant": "Nachbildung · Erfurt 612",
      "description": "Frontale Nachbildung des schwarzen Tastenpanels im braunen Rahmen nach MGT6DE 612. Rechteckige elfenbeinfarbene Taster; Auswahl und Anordnung der Spieltasten sind angepasst. MGT6D nutzt denselben gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "Erfurt MGT6DE 612 · Christian Meinelt",
          "url": "https://www.strassenbahn-erfurt.de/wagenpark/mgt/mgt6de/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt 612. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "family-tramlink": {
    "id": "family-tramlink",
    "cab": {
      "image": "vehicle-bundles/family-tramlink/panel-front.webp",
      "width": 1672,
      "height": 941,
      "buttons": {
        "next": {
          "x": 617,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 114,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 488,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 243,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 743,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 367,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1264,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1522,
          "y": 125,
          "size": 180,
          "capWidth": 134,
          "capHeight": 134,
          "shape": "round",
          "ink": "#fff2df",
          "press": [
            0,
            1,
            0.95
          ],
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 506,
          "y": 124,
          "size": 100,
          "capWidth": 60,
          "capHeight": 60,
          "shape": "round"
        },
        "open": {
          "x": 398,
          "y": 124,
          "size": 100,
          "capWidth": 60,
          "capHeight": 60,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          43,
          39,
          "oben links"
        ],
        [
          1630,
          39,
          "oben rechts"
        ],
        [
          45,
          872,
          "unten links"
        ],
        [
          1628,
          872,
          "unten rechts"
        ],
        [
          613,
          86,
          "Displayrahmen 1",
          26
        ],
        [
          1357,
          86,
          "Displayrahmen 2",
          26
        ],
        [
          612,
          627,
          "Displayrahmen 3",
          26
        ],
        [
          1357,
          627,
          "Displayrahmen 4",
          26
        ],
        [
          43,
          644,
          "Pultsegment 1",
          30
        ],
        [
          1628,
          643,
          "Pultsegment 2",
          30
        ],
        [
          46,
          706,
          "Pultsegment 3",
          30
        ],
        [
          1626,
          706,
          "Pultsegment 4",
          30
        ],
        [
          309,
          238,
          "Tachometer 1",
          18
        ],
        [
          303,
          486,
          "Tachometer 2",
          18
        ],
        [
          117,
          725,
          "Tasterring 1",
          8
        ],
        [
          245,
          725,
          "Tasterring 2",
          8
        ],
        [
          362,
          725,
          "Tasterring 3",
          8
        ],
        [
          490,
          725,
          "Tasterring 4",
          8
        ],
        [
          614,
          725,
          "Tasterring 5",
          8
        ],
        [
          740,
          725,
          "Tasterring 6",
          8
        ],
        [
          865,
          725,
          "Tasterring 7",
          8
        ],
        [
          992,
          725,
          "Tasterring 8",
          8
        ],
        [
          1116,
          725,
          "Tasterring 9",
          8
        ],
        [
          1243,
          725,
          "Tasterring 10",
          8
        ],
        [
          1370,
          725,
          "Tasterring 11",
          8
        ],
        [
          1500,
          725,
          "Tasterring 12",
          8
        ]
      ],
      "rotaries": [
        [
          995,
          778
        ],
        [
          1403,
          778
        ]
      ],
      "rotarySprites": {
        "mask": [
          580,
          650,
          50,
          50
        ],
        "ring": [
          995,
          778,
          114,
          114
        ],
        "grip": [
          995,
          785,
          34,
          130
        ],
        "image": "vehicle-bundles/family-tramlink/rotary-source.webp"
      },
      "colors": {
        "console": "#252a2d",
        "panel": "#141719",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 30,
      "emergencySprites": {
        "color": "#101315",
        "mask": [
          1430,
          225,
          35,
          35
        ],
        "ring": [
          1510,
          134,
          190,
          190
        ],
        "base": [
          1505,
          134,
          168,
          168
        ],
        "travel": [
          -8,
          6
        ]
      },
      "accessories": [
        {
          "kind": "button",
          "label": "Reservetaster oben links",
          "sprite": [
            115,
            120,
            60,
            60
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reservetaster links",
          "sprite": [
            92,
            380,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reservetaster rechts am Tacho",
          "sprite": [
            518,
            381,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß 1",
          "sprite": [
            130,
            581,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß 2",
          "sprite": [
            246,
            582,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau 1",
          "sprite": [
            385,
            581,
            72,
            72
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau 2",
          "sprite": [
            497,
            581,
            72,
            72
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve rot 1",
          "sprite": [
            1511,
            300,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve rot 2",
          "sprite": [
            1511,
            442,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve gelb",
          "sprite": [
            1511,
            584,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß unten",
          "sprite": [
            865,
            777,
            82,
            82
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau unten",
          "sprite": [
            1122,
            778,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve grün unten",
          "sprite": [
            1548,
            778,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        }
      ],
      "labelColor": "#f6f2de"
    },
    "sounds": {
      "effects": {
        "door_open": "vehicle-bundles/family-tramlink/audio/door_open.mp3",
        "door_close": "vehicle-bundles/family-tramlink/audio/door_close.mp3",
        "door_closed": "vehicle-bundles/family-tramlink/audio/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Tramlink · mittleres Instrumentenpult",
      "variant": "Nachbildung · mittleres Pult nach bereitgestelltem Foto",
      "description": "Frontale fotorealistische Nachbildung des mittleren schwarzen Instrumentenpults nach dem bereitgestellten Tramlink-Foto: Analogtacho links, Diagnoseanzeige mittig, Not-Aus rechts und eine untere Bedienleiste. Die Fahrfunktionen sind für die Simulation zugeordnet. Anzeige und Tacho sind Bildkulisse; zusätzliche Taster und die beiden Drehschalter sind als Reserve bedienbar.",
      "soundNote": "Türklänge: vom Nutzer bereitgestellte Tramlink-Aufnahmen für Öffnen, Schließen und Türen zu. Weitere Klänge verwenden die gemeinsamen Standardaufnahmen und Synthesen.",
      "references": [
        {
          "title": "Gestaltung, bereitgestellte Vorlage und Änderungen",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#tramlink-mittleres-instrumentenpanel-in-version-6210"
        }
      ]
    },
    "credits": [
      "Fotorealistische frontale Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026, nach dem im Chat bereitgestellten Foto des mittleren Tramlink-Instrumentenpults. Hardware und Anordnung für die Simulation angepasst; keine exakte Werkszeichnung. Keine rechte Seitenkonsole und kein linkes Fahrhebelpult. Schrift und Funktionensymbole werden in HTML ergänzt.",
      "Türklänge: vom Nutzer am 21.10.2026 bereitgestellte Dateien door_open_tramlink.mp3, door_close_tramlink.mp3 und door_closed_tramlink.mp3, unverändert übernommen. Weitere Herkunft und Lizenz der Aufnahmen sind nicht angegeben."
    ]
  },
  "g4-61": {
    "id": "g4-61",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schaltplatte am Handradpult",
      "variant": "Nachbildung · G4-61 · Familienvergleich nach G4-65",
      "description": "Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "g4-65": {
    "id": "g4-65",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schaltplatte am Handradpult",
      "variant": "Nachbildung · G4-65 · Vergleich Naumburg 202",
      "description": "Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "gotha-standard": {
    "id": "gotha-standard",
    "cab": {
      "image": "vehicle-bundles/family-gotha-vintage/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 265,
          "y": 427,
          "size": 200,
          "capWidth": 144,
          "capHeight": 150,
          "shape": "round",
          "ink": "#fff3df"
        },
        "back": {
          "x": 593.5,
          "y": 429,
          "size": 200,
          "capWidth": 150,
          "capHeight": 156,
          "shape": "round",
          "ink": "#18212a"
        },
        "doors": {
          "x": 930,
          "y": 428,
          "size": 200,
          "capWidth": 148,
          "capHeight": 152,
          "shape": "round",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 268,
          "y": 742,
          "size": 200,
          "capWidth": 148,
          "capHeight": 152,
          "shape": "round",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 594.5,
          "y": 744,
          "size": 200,
          "capWidth": 150,
          "capHeight": 158,
          "shape": "round",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 932,
          "y": 744,
          "size": 200,
          "capWidth": 156,
          "capHeight": 162,
          "shape": "round",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1273,
          "y": 740,
          "size": 200,
          "capWidth": 154,
          "capHeight": 158,
          "shape": "round",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1269,
          "y": 425,
          "size": 200,
          "capWidth": 156,
          "capHeight": 154,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 620,
          "y": 170,
          "size": 150,
          "capWidth": 105,
          "capHeight": 105,
          "shape": "round"
        },
        "open": {
          "x": 920,
          "y": 170,
          "size": 150,
          "capWidth": 105,
          "capHeight": 105,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          100,
          104,
          "oben links"
        ],
        [
          1435,
          104,
          "oben rechts"
        ],
        [
          100,
          900,
          "unten links"
        ],
        [
          1435,
          900,
          "unten rechts"
        ],
        [
          549,
          170,
          "Lampenfassung 1",
          28
        ],
        [
          690,
          170,
          "Lampenfassung 2",
          28
        ],
        [
          849,
          170,
          "Lampenfassung 3",
          28
        ],
        [
          991,
          170,
          "Lampenfassung 4",
          28
        ],
        [
          179,
          432,
          "Obere Tasterfassung 1",
          28
        ],
        [
          362,
          432,
          "Obere Tasterfassung 2",
          28
        ],
        [
          509,
          432,
          "Obere Tasterfassung 3",
          28
        ],
        [
          690,
          432,
          "Obere Tasterfassung 4",
          28
        ],
        [
          840,
          432,
          "Obere Tasterfassung 5",
          28
        ],
        [
          1025,
          432,
          "Obere Tasterfassung 6",
          28
        ],
        [
          1173,
          432,
          "Obere Tasterfassung 7",
          28
        ],
        [
          1357,
          432,
          "Obere Tasterfassung 8",
          28
        ],
        [
          179,
          742,
          "Untere Tasterfassung 1",
          28
        ],
        [
          362,
          742,
          "Untere Tasterfassung 2",
          28
        ],
        [
          509,
          742,
          "Untere Tasterfassung 3",
          28
        ],
        [
          690,
          742,
          "Untere Tasterfassung 4",
          28
        ],
        [
          840,
          742,
          "Untere Tasterfassung 5",
          28
        ],
        [
          1025,
          742,
          "Untere Tasterfassung 6",
          28
        ],
        [
          1173,
          742,
          "Untere Tasterfassung 7",
          28
        ],
        [
          1357,
          742,
          "Untere Tasterfassung 8",
          28
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#49261b",
        "panel": "#49261b",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 60,
      "emergencySprites": {
        "mask": [
          1100,
          570,
          40,
          40
        ],
        "ring": [
          1267,
          430,
          230,
          230
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1267,
          430,
          160,
          160
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df",
      "layout": {
        "icon-emergency": {
          "x": 1273.9244680095671,
          "y": 426.21059788610336
        },
        "icon-next": {
          "x": 261.26349094908505,
          "y": 430.70700902023293
        },
        "icon-back": {
          "x": 597.1957699586899,
          "y": 428.9857919919439
        },
        "icon-passenger": {
          "x": 255.5971217324935,
          "y": 751.8854927007719
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "TW 92 · historische Schaltplatte",
      "variant": "Simulationsnachbildung · historischer Stilvergleich",
      "description": "Stilgerechte frontale Schaltplatte mit schwarzen, hellen und dunkelroten Bakelittastern, Messingringen und Holzrahmen nach den Materialien des TW-92-Führerstands. Die acht Taster sind eine ergänzte Simulationsbedienung; eine solche Originalplatte von TW 92 ist nicht belegt.",
      "references": [
        {
          "title": "TW 92 Erfurt · Führerstand, Erhard Beyer",
          "url": "https://altebahnen.startbilder.de/bild/Deutschland~Strassenbahnen+vor+1945~Erfurt+-+Tw+92/142268/fuehrerstand-tw-92.html"
        },
        {
          "title": "EVAG · Traditionswagen 92",
          "url": "https://www.evag-erfurt.de/evag/home/service/strassenbahn-mieten-erfurt"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt TW 92. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "katerexpress": {
    "id": "katerexpress",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schaltplatte am Handradpult",
      "variant": "Nachbildung · Katerexpress · G4-65-Familienvergleich",
      "description": "Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "kt4d": {
    "id": "kt4d",
    "cab": {
      "image": "vehicle-bundles/family-kt4d/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 197,
          "y": 410,
          "size": 170,
          "capWidth": 120,
          "capHeight": 120,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 197.5,
          "y": 614,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 197.5,
          "y": 817,
          "size": 170,
          "capWidth": 120,
          "capHeight": 120,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 1331,
          "y": 201,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 1330,
          "y": 410.5,
          "size": 170,
          "capWidth": 116,
          "capHeight": 116,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 1328,
          "y": 616.5,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1328,
          "y": 818,
          "size": 170,
          "capWidth": 118,
          "capHeight": 118,
          "shape": "round",
          "ink": "#fff3df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 186,
          "y": 185.5,
          "size": 220,
          "capWidth": 184,
          "capHeight": 172,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 665,
          "y": 746,
          "size": 96,
          "capWidth": 80,
          "capHeight": 84,
          "shape": "round"
        },
        "open": {
          "x": 865,
          "y": 746,
          "size": 96,
          "capWidth": 80,
          "capHeight": 84,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          58,
          54,
          "oben links"
        ],
        [
          1478,
          54,
          "oben rechts"
        ],
        [
          58,
          960,
          "unten links"
        ],
        [
          1478,
          960,
          "unten rechts"
        ],
        [
          589,
          539,
          "Instrument 1",
          38
        ],
        [
          941,
          539,
          "Instrument 2",
          38
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#27333e",
        "panel": "#27333e",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          340,
          705,
          40,
          40
        ],
        "ring": [
          200,
          194,
          245,
          245
        ],
        "travel": [
          10,
          11
        ],
        "base": [
          202,
          194,
          214,
          214
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df",
      "layout": {
        "icon-closed": {
          "x": 659.9903482317602,
          "y": 743.7533261619031
        },
        "icon-emergency": {
          "x": 177.32154541656894,
          "y": 180.5233075939544
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "KT4D · klassisches Schalterpanel",
      "variant": "Nachbildung · KT4D · klassischer Baureihenvergleich",
      "description": "Frontale dunkle Metallplatte mit schwarzen Bakelittastern, hellen Kappen und Analoginstrumenten nach dem Potsdamer KT4D-Prototyp. Für die Simulation angepasster Baureihenvergleich; kein exakter Erfurter Serienzustand.",
      "references": [
        {
          "title": "Straßenbahn Potsdam · KT4D-Prototyp",
          "url": "https://www.tram2000.de/wagenpark/museumswagen/kt4d-prototyp/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Prototypvergleich Potsdam. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "kt4dc": {
    "id": "kt4dc",
    "cab": {
      "image": "vehicle-bundles/family-kt4dc/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 166,
          "y": 251,
          "size": 180,
          "capWidth": 132,
          "capHeight": 132,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 406,
          "y": 251.5,
          "size": 180,
          "capWidth": 130,
          "capHeight": 130,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 164.5,
          "y": 531,
          "size": 180,
          "capWidth": 132,
          "capHeight": 132,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 240,
          "y": 795,
          "size": 180,
          "capWidth": 134,
          "capHeight": 134,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 578,
          "y": 796,
          "size": 180,
          "capWidth": 136,
          "capHeight": 136,
          "shape": "round",
          "ink": "#18212a",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 954.5,
          "y": 795.5,
          "size": 180,
          "capWidth": 130,
          "capHeight": 142,
          "shape": "round",
          "ink": "#3c280c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1279,
          "y": 794.5,
          "size": 180,
          "capWidth": 138,
          "capHeight": 138,
          "shape": "round",
          "ink": "#f7f1df",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1376,
          "y": 260.5,
          "size": 260,
          "capWidth": 216,
          "capHeight": 224,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 664,
          "y": 580,
          "size": 110,
          "capWidth": 88,
          "capHeight": 92,
          "shape": "round"
        },
        "open": {
          "x": 867,
          "y": 580,
          "size": 110,
          "capWidth": 88,
          "capHeight": 92,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          70,
          65,
          "oben links"
        ],
        [
          1464,
          65,
          "oben rechts"
        ],
        [
          70,
          934,
          "unten links"
        ],
        [
          1464,
          934,
          "unten rechts"
        ],
        [
          574,
          106,
          "Tachometer 1",
          28
        ],
        [
          963,
          106,
          "Tachometer 2",
          28
        ],
        [
          573,
          437,
          "Tachometer 3",
          28
        ],
        [
          961,
          437,
          "Tachometer 4",
          28
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#452020",
        "panel": "#452020",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1280,
          520,
          40,
          40
        ],
        "ring": [
          1350,
          265,
          288,
          288
        ],
        "travel": [
          -18,
          13
        ],
        "base": [
          1341,
          263.5,
          243,
          243
        ]
      },
      "accessories": [
        {
          "kind": "button",
          "label": "Reserve 1",
          "sprite": [
            1114,
            252,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve 2",
          "sprite": [
            405,
            531,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve 3",
          "sprite": [
            1113,
            532,
            130,
            130
          ],
          "press": [
            0,
            1,
            0.95
          ]
        }
      ],
      "labelColor": "#fff8df",
      "layout": {
        "icon-emergency": {
          "x": 1389.592669141558,
          "y": 250.58013833513695
        },
        "label-emergency": {
          "x": 1346.2819810728306,
          "y": 116.51967202003328
        },
        "icon-traffic": {
          "x": 945.8242990378417,
          "y": 797.9615466866102
        },
        "icon-open": {
          "x": 866.1853365002596,
          "y": 580.7030914458793
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "KT4D-C · Schalterpanel",
      "variant": "Nachbildung · KT4D-C · Referenz Erfurt 522",
      "description": "Frontales schwarzes Rundtasterpanel im roten Rahmen nach Erfurter Sonderwagen 522. Analogtacho als Bildkulisse. Die Spieltasten sind aus dem Schalterfeld abgeleitet und neu angeordnet; andere Modernisierungen können abweichen.",
      "references": [
        {
          "title": "Erfurt KT4D-C 522 · Christian Meinelt",
          "url": "https://www.strassenbahn-erfurt.de/wagenpark/bilder.php?id=522"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt 522. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "mgt6d": {
    "id": "mgt6d",
    "cab": {
      "image": "vehicle-bundles/family-mgt/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 288,
          "y": 361,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "back": {
          "x": 596.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 901.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "passenger": {
          "x": 288.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "fullscreen": {
          "x": 596.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 903,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "finish": {
          "x": 1225,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "emergency": {
          "x": 1276.5,
          "y": 331.5,
          "size": 300,
          "capWidth": 252,
          "capHeight": 256,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 690,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        },
        "open": {
          "x": 844,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          80,
          86,
          "oben links"
        ],
        [
          1455,
          86,
          "oben rechts"
        ],
        [
          80,
          914,
          "unten links"
        ],
        [
          1455,
          914,
          "unten rechts"
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#4d2b20",
        "panel": "#4d2b20",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 60,
      "emergencySprites": {
        "mask": [
          1100,
          535,
          40,
          40
        ],
        "ring": [
          1255,
          340,
          340,
          340
        ],
        "travel": [
          -20,
          14
        ],
        "base": [
          1250,
          339,
          288,
          288
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df",
      "layout": {
        "icon-emergency": {
          "x": 1290.0920761574655,
          "y": 314.1582996240763
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "MGT · Tastenpanel",
      "variant": "Nachbildung · MGT6D · Familienvariante nach MGT6DE 612",
      "description": "Frontale Nachbildung des schwarzen Tastenpanels im braunen Rahmen nach MGT6DE 612. Rechteckige elfenbeinfarbene Taster; Auswahl und Anordnung der Spieltasten sind angepasst. MGT6D nutzt denselben gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "Erfurt MGT6DE 612 · Christian Meinelt",
          "url": "https://www.strassenbahn-erfurt.de/wagenpark/mgt/mgt6de/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt 612. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "mgt6de": {
    "id": "mgt6de",
    "cab": {
      "image": "vehicle-bundles/family-mgt/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 288,
          "y": 361,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "back": {
          "x": 596.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 901.5,
          "y": 360,
          "size": 240,
          "capWidth": 142,
          "capHeight": 210,
          "shape": "rect",
          "ink": "#18212a"
        },
        "passenger": {
          "x": 288.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "fullscreen": {
          "x": 596.5,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 903,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "finish": {
          "x": 1225,
          "y": 722,
          "size": 240,
          "capWidth": 142,
          "capHeight": 212,
          "shape": "rect",
          "ink": "#18212a"
        },
        "emergency": {
          "x": 1276.5,
          "y": 331.5,
          "size": 300,
          "capWidth": 252,
          "capHeight": 256,
          "shape": "round",
          "ink": "#fff3df"
        }
      },
      "indicators": {
        "closed": {
          "x": 690,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        },
        "open": {
          "x": 844,
          "y": 143,
          "size": 120,
          "capWidth": 80,
          "capHeight": 80,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          80,
          86,
          "oben links"
        ],
        [
          1455,
          86,
          "oben rechts"
        ],
        [
          80,
          914,
          "unten links"
        ],
        [
          1455,
          914,
          "unten rechts"
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#4d2b20",
        "panel": "#4d2b20",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 60,
      "emergencySprites": {
        "mask": [
          1100,
          535,
          40,
          40
        ],
        "ring": [
          1255,
          340,
          340,
          340
        ],
        "travel": [
          -20,
          14
        ],
        "base": [
          1250,
          339,
          288,
          288
        ]
      },
      "accessories": [],
      "labelColor": "#fff8df",
      "layout": {
        "icon-emergency": {
          "x": 1290.0918872976727,
          "y": 321.5846439790648
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "MGT · Tastenpanel",
      "variant": "Nachbildung · MGT6DE · Referenz Erfurt 612",
      "description": "Frontale Nachbildung des schwarzen Tastenpanels im braunen Rahmen nach MGT6DE 612. Rechteckige elfenbeinfarbene Taster; Auswahl und Anordnung der Spieltasten sind angepasst. MGT6D nutzt denselben gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "Erfurt MGT6DE 612 · Christian Meinelt",
          "url": "https://www.strassenbahn-erfurt.de/wagenpark/mgt/mgt6de/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Erfurt 612. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "reko-trailer": {
    "id": "reko-trailer",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schaltplatte am Handradpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "summer-trailer": {
    "id": "summer-trailer",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Zugfahrzeug · Gotha · Schaltplatte am Handradpult",
      "variant": "Beiwagen · zugeordnetes Zugfahrzeugpult",
      "description": "Dieser Beiwagen besitzt kein eigenes Fahrerpult. Für die Simulation ist die Schaltplatte eines passenden Gotha-Zugfahrzeugs zugeordnet. Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "t2-60": {
    "id": "t2-60",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1327.6488850540404,
          "y": 331.0705970284827
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schalterkasten am Kurbelpult",
      "variant": "Nachbildung · T2-60 · Kurbel-Familienvergleich",
      "description": "Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "t2-61": {
    "id": "t2-61",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1328.8864832763486,
          "y": 331.07061768515274
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schalterkasten am Kurbelpult",
      "variant": "Nachbildung · T2-61 · Kurbel-Familienvergleich",
      "description": "Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "t2d": {
    "id": "t2d",
    "cab": {
      "image": "vehicle-bundles/family-gotha-wheel/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 262,
          "y": 580.5,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#fff3df",
          "labelPad": {
            "x": 270,
            "y": 475,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 593,
          "y": 580,
          "size": 180,
          "capWidth": 122,
          "capHeight": 122,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 597,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 935,
          "y": 579,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 935,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 261,
          "y": 815.5,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 267,
            "y": 706,
            "width": 164,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 593.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#18212a",
          "labelPad": {
            "x": 596,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 935.5,
          "y": 815,
          "size": 180,
          "capWidth": 124,
          "capHeight": 124,
          "shape": "round",
          "ink": "#3c280c",
          "labelPad": {
            "x": 935,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1269,
          "y": 815.5,
          "size": 180,
          "capWidth": 126,
          "capHeight": 126,
          "shape": "round",
          "ink": "#f7f1df",
          "labelPad": {
            "x": 1265,
            "y": 706,
            "width": 170,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1271.5,
          "y": 579,
          "size": 180,
          "capWidth": 132,
          "capHeight": 130,
          "shape": "round",
          "ink": "#f7f1df",
          "kind": "push",
          "labelPad": {
            "x": 1262,
            "y": 475,
            "width": 170,
            "ink": "#1d2328"
          }
        }
      },
      "indicators": {
        "closed": {
          "x": 655,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        },
        "open": {
          "x": 875,
          "y": 165,
          "size": 110,
          "capWidth": 70,
          "capHeight": 70,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          64,
          60,
          "oben links"
        ],
        [
          1472,
          60,
          "oben rechts"
        ],
        [
          64,
          944,
          "unten links"
        ],
        [
          1472,
          944,
          "unten rechts"
        ],
        [
          203,
          99,
          "Abdeckplatte 1",
          30
        ],
        [
          519,
          99,
          "Abdeckplatte 2",
          30
        ],
        [
          203,
          231,
          "Abdeckplatte 3",
          30
        ],
        [
          519,
          231,
          "Abdeckplatte 4",
          30
        ],
        [
          1018,
          99,
          "Abdeckplatte 5",
          30
        ],
        [
          1334,
          99,
          "Abdeckplatte 6",
          30
        ],
        [
          1018,
          231,
          "Abdeckplatte 7",
          30
        ],
        [
          1334,
          231,
          "Abdeckplatte 8",
          30
        ],
        [
          567,
          172,
          "Neben Lampen 1",
          28
        ],
        [
          967,
          172,
          "Neben Lampen 2",
          28
        ],
        [
          159,
          310,
          "Mittlere Schalterleiste 1",
          38
        ],
        [
          1377,
          310,
          "Mittlere Schalterleiste 2",
          38
        ],
        [
          159,
          400,
          "Mittlere Schalterleiste 3",
          38
        ],
        [
          1377,
          400,
          "Mittlere Schalterleiste 4",
          38
        ],
        [
          83,
          579,
          "Seitliche Befestigung 1",
          38
        ],
        [
          1454,
          579,
          "Seitliche Befestigung 2",
          38
        ],
        [
          228,
          306,
          "Kleine Schildleiste 1",
          12
        ],
        [
          372,
          306,
          "Kleine Schildleiste 2",
          12
        ],
        [
          466,
          306,
          "Kleine Schildleiste 3",
          12
        ],
        [
          611,
          306,
          "Kleine Schildleiste 4",
          12
        ],
        [
          686,
          306,
          "Kleine Schildleiste 5",
          12
        ],
        [
          828,
          306,
          "Kleine Schildleiste 6",
          12
        ],
        [
          926,
          306,
          "Kleine Schildleiste 7",
          12
        ],
        [
          1071,
          306,
          "Kleine Schildleiste 8",
          12
        ],
        [
          1164,
          306,
          "Kleine Schildleiste 9",
          12
        ],
        [
          1309,
          306,
          "Kleine Schildleiste 10",
          12
        ],
        [
          187,
          474,
          "Obere Beschriftung 1",
          16
        ],
        [
          353,
          474,
          "Obere Beschriftung 2",
          16
        ],
        [
          512,
          474,
          "Obere Beschriftung 3",
          16
        ],
        [
          684,
          474,
          "Obere Beschriftung 4",
          16
        ],
        [
          850,
          474,
          "Obere Beschriftung 5",
          16
        ],
        [
          1022,
          474,
          "Obere Beschriftung 6",
          16
        ],
        [
          1177,
          474,
          "Obere Beschriftung 7",
          16
        ],
        [
          1348,
          474,
          "Obere Beschriftung 8",
          16
        ],
        [
          183,
          705,
          "Untere Beschriftung 1",
          16
        ],
        [
          351,
          705,
          "Untere Beschriftung 2",
          16
        ],
        [
          511,
          705,
          "Untere Beschriftung 3",
          16
        ],
        [
          683,
          705,
          "Untere Beschriftung 4",
          16
        ],
        [
          849,
          705,
          "Untere Beschriftung 5",
          16
        ],
        [
          1021,
          705,
          "Untere Beschriftung 6",
          16
        ],
        [
          1177,
          705,
          "Untere Beschriftung 7",
          16
        ],
        [
          1348,
          705,
          "Untere Beschriftung 8",
          16
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#544431",
        "panel": "#544431",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1130,
          570,
          40,
          40
        ],
        "ring": [
          1270,
          580,
          180,
          180
        ],
        "travel": [
          0,
          7
        ],
        "base": [
          1271.5,
          579,
          136,
          136
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Kippschalter oben",
          "sprite": [
            1177,
            146,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1177,
            192,
            20,
            48
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 1",
          "sprite": [
            297,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            297,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 300,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 2",
          "sprite": [
            538,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            538,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 540,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "button",
          "label": "Reservetaster",
          "sprite": [
            761,
            370,
            62,
            62
          ],
          "labelPad": {
            "x": 758,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          },
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "lever",
          "label": "Kippschalter 3",
          "sprite": [
            999,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            999,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 998,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        },
        {
          "kind": "lever",
          "label": "Kippschalter 4",
          "sprite": [
            1239,
            344,
            20,
            48
          ],
          "profile": "toggle",
          "onSprite": [
            1239,
            390,
            20,
            48
          ],
          "labelPad": {
            "x": 1238,
            "y": 308,
            "width": 130,
            "ink": "#1d2328"
          }
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-off.webp",
          "width": 1536,
          "height": 1024,
          "crop": [
            768,
            511.5,
            326,
            969
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-wheel/lever-on.webp",
          "width": 1024,
          "height": 1536,
          "crop": [
            524,
            768.5,
            436,
            1327
          ]
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schaltplatte am Handradpult",
      "variant": "Nachbildung · T2D · Handrad-Familienvergleich nach G4-65",
      "description": "Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich.",
      "references": [
        {
          "title": "G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0",
          "url": "https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG"
        },
        {
          "title": "Gotha-Bauarten und Fahrschalter",
          "url": "https://www.gothawagen.de/gothawagen/typen/typmerkmale.html"
        },
        {
          "title": "G4 · RSAG / Rostocker Nahverkehrsfreunde",
          "url": "https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf"
        },
        {
          "title": "CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage",
          "url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Naumburg 202. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse.",
      "Grafiken panel-front.webp und lever-*.webp: Bearbeitungen nach ChristianBier, CC BY-SA 3.0. Originalfoto, Lizenz und Änderungen siehe Referenzlinks."
    ]
  },
  "t57e": {
    "id": "t57e",
    "cab": {
      "image": "vehicle-bundles/family-gotha-crank/panel-front.webp",
      "width": 1536,
      "height": 1024,
      "buttons": {
        "next": {
          "x": 227.5,
          "y": 352,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "back": {
          "x": 585,
          "y": 350,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "doors": {
          "x": 953.5,
          "y": 351.5,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "passenger": {
          "x": 227,
          "y": 745,
          "size": 210,
          "capWidth": 134,
          "capHeight": 144,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "fullscreen": {
          "x": 584,
          "y": 746,
          "size": 210,
          "capWidth": 134,
          "capHeight": 146,
          "shape": "rect",
          "ink": "#18212a"
        },
        "traffic": {
          "x": 952.5,
          "y": 746,
          "size": 210,
          "capWidth": 136,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#3c280c"
        },
        "finish": {
          "x": 1309.5,
          "y": 746,
          "size": 210,
          "capWidth": 138,
          "capHeight": 148,
          "shape": "rect",
          "ink": "#fff3df"
        },
        "emergency": {
          "x": 1319,
          "y": 338.5,
          "size": 240,
          "capWidth": 184,
          "capHeight": 182,
          "shape": "round",
          "ink": "#fff3df",
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 590,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        },
        "open": {
          "x": 947,
          "y": 130,
          "size": 160,
          "capWidth": 110,
          "capHeight": 72,
          "shape": "rect"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          60,
          60,
          "oben links"
        ],
        [
          1476,
          60,
          "oben rechts"
        ],
        [
          60,
          960,
          "unten links"
        ],
        [
          1476,
          960,
          "unten rechts"
        ],
        [
          518,
          132,
          "Lampenfassung 1",
          22
        ],
        [
          662,
          132,
          "Lampenfassung 2",
          22
        ],
        [
          874,
          132,
          "Lampenfassung 3",
          22
        ],
        [
          1018,
          132,
          "Lampenfassung 4",
          22
        ],
        [
          142,
          360,
          "Tasterfassung 1",
          30
        ],
        [
          320,
          360,
          "Tasterfassung 2",
          30
        ],
        [
          498,
          360,
          "Tasterfassung 3",
          30
        ],
        [
          676,
          360,
          "Tasterfassung 4",
          30
        ],
        [
          864,
          360,
          "Tasterfassung 5",
          30
        ],
        [
          1042,
          360,
          "Tasterfassung 6",
          30
        ],
        [
          142,
          752,
          "Tasterfassung 7",
          30
        ],
        [
          320,
          752,
          "Tasterfassung 8",
          30
        ],
        [
          498,
          752,
          "Tasterfassung 9",
          30
        ],
        [
          676,
          752,
          "Tasterfassung 10",
          30
        ],
        [
          864,
          752,
          "Tasterfassung 11",
          30
        ],
        [
          1042,
          752,
          "Tasterfassung 12",
          30
        ],
        [
          1218,
          752,
          "Tasterfassung 13",
          30
        ],
        [
          1395,
          752,
          "Tasterfassung 14",
          30
        ],
        [
          658,
          547,
          "Mittlere Fassung 1",
          30
        ],
        [
          878,
          547,
          "Mittlere Fassung 2",
          30
        ]
      ],
      "rotaries": [],
      "rotarySprites": {
        "mask": [
          1172,
          292,
          32,
          32
        ],
        "ring": [
          1262,
          234,
          146,
          146
        ],
        "grip": [
          1088,
          251,
          34,
          124
        ]
      },
      "colors": {
        "console": "#494232",
        "panel": "#494232",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 54,
      "emergencySprites": {
        "mask": [
          1100,
          540,
          50,
          50
        ],
        "ring": [
          1310,
          355,
          230,
          260
        ],
        "travel": [
          -4,
          9
        ],
        "base": [
          1310,
          355,
          208,
          208
        ]
      },
      "accessories": [
        {
          "kind": "lever",
          "label": "Reservehebel",
          "sprite": [
            791,
            581,
            94,
            138
          ],
          "profile": "long",
          "onSprite": [
            791,
            504,
            94,
            138
          ]
        }
      ],
      "labelColor": "#1d2328",
      "leverSprites": {
        "off": {
          "image": "vehicle-bundles/family-gotha-crank/lever-off.webp",
          "width": 1270,
          "height": 1239,
          "crop": [
            635,
            631.5,
            920,
            1087
          ]
        },
        "on": {
          "image": "vehicle-bundles/family-gotha-crank/lever-on.webp",
          "width": 1269,
          "height": 1239,
          "crop": [
            657,
            627.5,
            1014,
            1129
          ],
          "flipX": true
        }
      },
      "layout": {
        "icon-emergency": {
          "x": 1325.1734997496317,
          "y": 329.8329319883751
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "audio/effects/door_open.mp3",
        "door_close": "audio/effects/door_close.mp3",
        "door_closed": "audio/effects/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Gotha · Schalterkasten am Kurbelpult",
      "variant": "Nachbildung · T57E · Kurbel-Familienvergleich",
      "description": "Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten.",
      "references": [
        {
          "title": "T57 Kirnitzschtalbahn 2 · Clemens Kral",
          "url": "https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html"
        },
        {
          "title": "T2-61 · Kurbel-Fahrschalter StNFB1",
          "url": "https://www.gothawagen.de/gothawagen/typen/T2-61.html"
        },
        {
          "title": "ET57 · Straßenbahnmuseum Dresden",
          "url": "https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/"
        }
      ],
      "soundNote": "Standardklänge (Fallback) · vorhandene Aufnahmen und synthetische Mechanik; keine Originalaufnahmen dieser Baureihe."
    },
    "credits": [
      "KI-Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026. Nachbildung · Vergleich Kirnitzschtal. Frontales Schalterpanel aus der Referenz abgeleitet; Tastenanzahl und Anordnung an die Simulation angepasst. Bildkappen und vier fotografierte Schrauben werden animiert. Instrumente sind Bildkulisse."
    ]
  },
  "tramlink": {
    "id": "tramlink",
    "cab": {
      "image": "vehicle-bundles/family-tramlink/panel-front.webp",
      "width": 1672,
      "height": 941,
      "buttons": {
        "next": {
          "x": 617,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "back": {
          "x": 114,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "doors": {
          "x": 488,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "passenger": {
          "x": 243,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "fullscreen": {
          "x": 743,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "traffic": {
          "x": 367,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#15242c",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "finish": {
          "x": 1264,
          "y": 778,
          "size": 120,
          "capWidth": 84,
          "capHeight": 84,
          "shape": "round",
          "ink": "#f4f5ef",
          "press": [
            0,
            1,
            0.95
          ]
        },
        "emergency": {
          "x": 1522,
          "y": 125,
          "size": 180,
          "capWidth": 134,
          "capHeight": 134,
          "shape": "round",
          "ink": "#fff2df",
          "press": [
            0,
            1,
            0.95
          ],
          "kind": "push"
        }
      },
      "indicators": {
        "closed": {
          "x": 506,
          "y": 124,
          "size": 100,
          "capWidth": 60,
          "capHeight": 60,
          "shape": "round"
        },
        "open": {
          "x": 398,
          "y": 124,
          "size": 100,
          "capWidth": 60,
          "capHeight": 60,
          "shape": "round"
        }
      },
      "headings": [],
      "spares": [],
      "screws": [
        [
          43,
          39,
          "oben links"
        ],
        [
          1630,
          39,
          "oben rechts"
        ],
        [
          45,
          872,
          "unten links"
        ],
        [
          1628,
          872,
          "unten rechts"
        ],
        [
          613,
          86,
          "Displayrahmen 1",
          26
        ],
        [
          1357,
          86,
          "Displayrahmen 2",
          26
        ],
        [
          612,
          627,
          "Displayrahmen 3",
          26
        ],
        [
          1357,
          627,
          "Displayrahmen 4",
          26
        ],
        [
          43,
          644,
          "Pultsegment 1",
          30
        ],
        [
          1628,
          643,
          "Pultsegment 2",
          30
        ],
        [
          46,
          706,
          "Pultsegment 3",
          30
        ],
        [
          1626,
          706,
          "Pultsegment 4",
          30
        ],
        [
          309,
          238,
          "Tachometer 1",
          18
        ],
        [
          303,
          486,
          "Tachometer 2",
          18
        ],
        [
          117,
          725,
          "Tasterring 1",
          8
        ],
        [
          245,
          725,
          "Tasterring 2",
          8
        ],
        [
          362,
          725,
          "Tasterring 3",
          8
        ],
        [
          490,
          725,
          "Tasterring 4",
          8
        ],
        [
          614,
          725,
          "Tasterring 5",
          8
        ],
        [
          740,
          725,
          "Tasterring 6",
          8
        ],
        [
          865,
          725,
          "Tasterring 7",
          8
        ],
        [
          992,
          725,
          "Tasterring 8",
          8
        ],
        [
          1116,
          725,
          "Tasterring 9",
          8
        ],
        [
          1243,
          725,
          "Tasterring 10",
          8
        ],
        [
          1370,
          725,
          "Tasterring 11",
          8
        ],
        [
          1500,
          725,
          "Tasterring 12",
          8
        ]
      ],
      "rotaries": [
        [
          995,
          778
        ],
        [
          1403,
          778
        ]
      ],
      "rotarySprites": {
        "mask": [
          580,
          650,
          50,
          50
        ],
        "ring": [
          995,
          778,
          114,
          114
        ],
        "grip": [
          995,
          785,
          34,
          130
        ],
        "image": "vehicle-bundles/family-tramlink/rotary-source.webp"
      },
      "colors": {
        "console": "#252a2d",
        "panel": "#141719",
        "text": "#eef1f3"
      },
      "skin": "panel",
      "screwCap": 30,
      "emergencySprites": {
        "color": "#101315",
        "mask": [
          1430,
          225,
          35,
          35
        ],
        "ring": [
          1510,
          134,
          190,
          190
        ],
        "base": [
          1505,
          134,
          168,
          168
        ],
        "travel": [
          -8,
          6
        ]
      },
      "accessories": [
        {
          "kind": "button",
          "label": "Reservetaster oben links",
          "sprite": [
            115,
            120,
            60,
            60
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reservetaster links",
          "sprite": [
            92,
            380,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reservetaster rechts am Tacho",
          "sprite": [
            518,
            381,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß 1",
          "sprite": [
            130,
            581,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß 2",
          "sprite": [
            246,
            582,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau 1",
          "sprite": [
            385,
            581,
            72,
            72
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau 2",
          "sprite": [
            497,
            581,
            72,
            72
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve rot 1",
          "sprite": [
            1511,
            300,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve rot 2",
          "sprite": [
            1511,
            442,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve gelb",
          "sprite": [
            1511,
            584,
            74,
            74
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve weiß unten",
          "sprite": [
            865,
            777,
            82,
            82
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve blau unten",
          "sprite": [
            1122,
            778,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        },
        {
          "kind": "button",
          "label": "Reserve grün unten",
          "sprite": [
            1548,
            778,
            84,
            84
          ],
          "press": [
            0,
            1,
            0.95
          ]
        }
      ],
      "labelColor": "#f6f2de",
      "layout": {
        "label-reserve-10": {
          "x": 864.9880134126109,
          "y": 708.4078826962685
        },
        "label-rotary-0": {
          "x": 1000.3706746911586,
          "y": 706.0184171905066
        },
        "label-reserve-11": {
          "x": 1121.9961679966875,
          "y": 707.0710648647556
        },
        "icon-emergency": {
          "x": 1527.3652089922346,
          "y": 120.9328050044214
        },
        "label-emergency": {
          "x": 1505.8190559039126,
          "y": 39.99867141103879
        },
        "icon-fullscreen": {
          "x": 738.941770382272,
          "y": 779.3319021383812
        },
        "icon-next": {
          "x": 614.2744252056509,
          "y": 776.6371939912752
        },
        "control-rotary-0": {
          "text": "",
          "icon": "",
          "sounds": {
            "0": "",
            "1": "",
            "2": "",
            "3": ""
          },
          "actions": {
            "0": "",
            "1": "",
            "2": "",
            "3": ""
          },
          "action": "",
          "sound": ""
        },
        "actuation-rotary-0": {
          "press": "",
          "release": ""
        },
        "icon-rotary-0": {
          "x": 993.6344143102484,
          "y": 779.3423661043706
        },
        "control-reserve-10": {
          "text": "",
          "icon": "",
          "sound": "",
          "action": ""
        },
        "actuation-reserve-10": {
          "press": "",
          "release": ""
        },
        "label-passenger": {
          "text": "Fahrgastinfo"
        },
        "heading-free-1": {
          "text": "Vmax 70 km/h",
          "x": 305.1634992793266,
          "y": 198.3406960949187,
          "fontSize": 30,
          "color": "#000000",
          "background": "#ffffff",
          "fontFamily": "serif"
        }
      }
    },
    "sounds": {
      "effects": {
        "door_open": "vehicle-bundles/family-tramlink/audio/door_open.mp3",
        "door_close": "vehicle-bundles/family-tramlink/audio/door_close.mp3",
        "door_closed": "vehicle-bundles/family-tramlink/audio/door_closed.mp3",
        "emergency": "audio/effects/emergency.mp3",
        "traffic": "audio/effects/traffic.mp3",
        "passenger": "audio/effects/passenger.mp3",
        "finish": "audio/effects/finish.mp3",
        "back": "audio/effects/back.mp3"
      },
      "mechanical": {
        "down": "vehicle-bundles/default/audio/push-button.mp3",
        "up": "vehicle-bundles/default/audio/release-button.mp3",
        "latch": "synth:latch",
        "rotary": "vehicle-bundles/default/audio/switch.mp3",
        "screw": "synth:screw",
        "ratchet": "synth:ratchet"
      }
    },
    "presentation": {
      "title": "Tramlink · mittleres Instrumentenpult",
      "variant": "Nachbildung · mittleres Pult nach bereitgestelltem Foto",
      "description": "Frontale fotorealistische Nachbildung des mittleren schwarzen Instrumentenpults nach dem bereitgestellten Tramlink-Foto: Analogtacho links, Diagnoseanzeige mittig, Not-Aus rechts und eine untere Bedienleiste. Die Fahrfunktionen sind für die Simulation zugeordnet. Anzeige und Tacho sind Bildkulisse; zusätzliche Taster und die beiden Drehschalter sind als Reserve bedienbar.",
      "soundNote": "Türklänge: vom Nutzer bereitgestellte Tramlink-Aufnahmen für Öffnen, Schließen und Türen zu. Weitere Klänge verwenden die gemeinsamen Standardaufnahmen und Synthesen.",
      "references": [
        {
          "title": "Gestaltung, bereitgestellte Vorlage und Änderungen",
          "url": "https://github.com/bratkartoffeln/tram-planer/blob/main/IMAGE_SOURCES.md#tramlink-mittleres-instrumentenpanel-in-version-6210"
        }
      ]
    },
    "credits": [
      "Fotorealistische frontale Nachbildung mit dem integrierten Imagegen-Tool, 21.10.2026, nach dem im Chat bereitgestellten Foto des mittleren Tramlink-Instrumentenpults. Hardware und Anordnung für die Simulation angepasst; keine exakte Werkszeichnung. Keine rechte Seitenkonsole und kein linkes Fahrhebelpult. Schrift und Funktionensymbole werden in HTML ergänzt.",
      "Türklänge: vom Nutzer am 21.10.2026 bereitgestellte Dateien door_open_tramlink.mp3, door_close_tramlink.mp3 und door_closed_tramlink.mp3, unverändert übernommen. Weitere Herkunft und Lizenz der Aufnahmen sind nicht angegeben."
    ]
  }
});

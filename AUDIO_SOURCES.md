# Ansagen und Gongs ab Version 6.2.1

Alle 98 MP3-Aufnahmen stammen unverändert aus dem vom Nutzer bereitgestellten Archiv tram-planer-ansagen.zip. Die Originalnamen, lesbaren Bezeichnungen, neuen Dateipfade und SHA-256-Prüfsummen stehen in app/src/main/assets/audio/catalog.json. Auch derzeit nicht benötigte Aufnahmen und beide Varianten von „Nächste Haltestelle“ werden mitgeliefert und offline gespeichert.

Die älteren vollständigen Piper-Ansagen und WAV-Dateien wurden entfernt. Die Zuordnung aller 89 aufgenommenen Haltestellen steht in audio/announcements.json. Für nicht aufgenommene Namen aus importierten Fahrplänen bleibt die vorhandene System-Sprachausgabe als Reserve erhalten.

## Reihenfolge

Eine Sekunde nach „Nächster Halt“ beginnt die Ansage der oben angezeigten Haltestelle:

- Normal: Ding-Dong → Nächste Haltestelle → Haltestellenname.
- Hauptbahnhof: Ding-Dong → Nächste Haltestelle → Hauptbahnhof → Next stop Central Station → Umsteigemöglichkeit zum Stadtbus und zum Busbahnhof.
- Linie 5, direkt vom Anger zum Hauptbahnhof: anschließend Dong-Dong-Ding → Sehr geehrte Fahrgäste, diese Fahrt endet hier. Bitte alle aussteigen.
- Anger: Ding-Dong → Nächste Haltestelle → Anger → Next stop Town Hall → Dong-Dong-Ding → Umsteigemöglichkeit zu allen Stadtbahnlinien (vollständige gelieferte Aufnahme).

Im Archiv gibt es keine Aufnahme mit dem Wortlaut „Nächster Halt“. Beide als Präfix benannten Dateien sagen „Nächste Haltestelle“; aktiv ist die Aufnahme mit der ursprünglichen Endung 004921. „Next stop Town Hall“ wird wie angefordert am Anger verwendet.

Der Wechsel zum oben angezeigten aktuellen Halt gilt in dieser Simulation als Ankunft. Die Zusatzansage der Linie 5 hängt von der eingetragenen Liniennummer und der unmittelbar vorherigen Haltestelle ab. Es wird keine zusätzliche Streckenvorlage erstellt.

Android spielt eine geprüfte Liste lokaler MP3-Pfade nacheinander ab. Die Webfassung decodiert dieselbe Liste und wartet jeweils auf das Ende des vorherigen Clips. Schnelle Haltewechsel und die vorhandenen Abbruchaktionen stoppen die ganze Kette einschließlich Zusatzhinweisen.

## Eigene Gongs

Die beiden Gongs wurden neu durch additive Synthese erstellt. Ding-Dong: 1046,50 / 783,99 Hz. Dong-Dong-Ding: 659,25 / 659,25 / 1046,50 Hz. MP3, Mono, 44,1 kHz, 96 kbit/s. Es wurden keine fremden Gongs verwendet.

Erneute Erzeugung mit Python, numpy und PyAV: python scripts/generate_chimes.py. Das Audioarchiv wird mit python tools/import-audio.py PFAD_ZUM_ZIP importiert. Anschließend python tools/sync-assets.py ausführen. Die MP3-Sprachaufnahmen werden beim Import weder neu codiert noch verändert.

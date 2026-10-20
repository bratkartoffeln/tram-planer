# Ansagen und Gongs ab Version 6.2.1

## Türlampen und Wiedergabeende ab 6.2.6

Die Türdateien bleiben unverändert. Beim Öffnen und Schließen blinkt die orange Kontrollleuchte bis zum tatsächlichen Wiedergabeende: Android meldet `MediaPlayer.OnCompletion`, die PWA verwendet das Ende der Web-Audio-Quelle. Nach dem Öffnen leuchtet die orange Lampe dauerhaft; nach dem vollständigen Schließen erlischt sie und die grüne Lampe leuchtet. Währenddessen bleiben Türtaster und Weiterfahrt gesperrt. Abbruch, Wiedergabefehler oder Audiofokusverlust beim Schließen lassen die Türen offen. Ohne eingeschaltete Tastentöne erfolgt der Wechsel sofort. Alte Abschlussrückmeldungen können neuere Wiedergaben nicht abschließen.

## Bereinigte Türsounds in 6.2.5

Die zu Beginn dieser Bearbeitung im Projekt vorhandenen Türdateien wurden vor der Filterung unter `build/door-cleanup-6.2.5/` gesichert. Diese Eingaben sind länger als die ursprünglich generierten Ausschnitte: Öffnen 4,017 Sekunden, Schließen 6,803 Sekunden. Die aktuelle Fassung filtert das konstante Hintergrundfiepen um 4,96 kHz sowie schmale Nebentöne um 4,8–5,4 und 9,6–10,8 kHz. Schmale Kerbfilter erhalten die breitbandigen Türgeräusche; 5 % Pegelreserve verhindert Übersteuerung. Die Dauer bleibt unverändert. MP3 mit 192 kbit/s, aktualisierte Prüfsummen in `audio/effects/catalog.json`.

Erneut aus den lokal gesicherten Eingaben erzeugen: `python scripts/clean-door-sounds.py`, danach `python tools/sync-assets.py`. Der Filter verwendet FFmpeg aus `FFMPEG_PATH` oder `build/qa-deps/`. Das Hauptfiepen wurde nach dem MP3-Encoding um etwa 47 bzw. 51 dB reduziert. Diese Bearbeitung betrifft nur die beiden Türsounds; die nachfolgenden Angaben zur ursprünglichen Erzeugung bleiben als Quellenstand erhalten.

## Mechanische Geräusche ab 6.2.4

Die beiden Reserve-Drehschalter verwenden einen eigenen synthetischen Rastklang: ein leises Anlaufgeräusch und zwei kurze, gedämpfte mechanische Anschläge beim Erreichen der nächsten 90°-Stellung (0,24 Sekunden, Web Audio in `cockpit.js`). Der Ton folgt der Drehbewegung und beachtet Stummschaltung und Hintergrundwechsel.

Herausdrehen und Herunterfallen verwenden eine eigene Web-Audio-Synthese in `cockpit.js`: kurze Drehimpulse und drei gedämpfte metallische Aufschläge (1,65 Sekunden). Beim Eindrehen erklingt eine separate Ratschenfolge aus vier Drehbewegungen, kurzen Zahnklicks während der Rückbewegungen und einem abschließenden Anschlag (1,25 Sekunden). Beide Klänge werden lokal erzeugt, benötigen keine Aufnahme oder Downloads und beachten die Pult-Stummschaltung sowie den Hintergrundwechsel.

## Neue Rekonstruktion und Tastengeräusche in 6.2.3

Die zu Beginn der Bearbeitung lokal veränderten Dateien `ding_dong.mp3` und `dong_dong_ding.mp3` dienen als Referenz. Sicherung der unveränderten Eingaben: `build/audio-reference-6.2.3/` (lokal, nicht versioniert). Eine additive Rekonstruktion übernimmt nur ausgeprägte Tonfrequenzen mit ihren gemessenen Lautstärkeverläufen. Kein Teil der aufgenommenen Wellenform und kein breitbandiges Restsignal wird beigemischt. Ding-Dong: Grundtöne etwa 523/440 Hz; Dong-Dong-Ding: Tonkomponenten etwa 655/520/388/584/492 Hz, einschließlich wiederholter Anschläge und Obertöne. Dauer etwa 2,28 bzw. 3,27 s; MP3, mono, 44,1 kHz, 192 kbit/s. Herkunft und Lizenz der vom Nutzer veränderten Referenzaufnahmen wurden nicht mitgeliefert.

Die nachgebildeten Hüllkurven und Frequenzen stehen in `scripts/chime-tones.json`. Erneut erzeugen: `python scripts/generate_chimes.py` mit NumPy und FFmpeg (`FFMPEG_PATH` oder lokaler Encoder unter `build/qa-deps/`). Neue Referenzen analysieren: `python scripts/resynthesize_chimes.py --reference-dir VERZEICHNIS`. Anschließend `python tools/sync-assets.py`. Die Sprachaufnahmen bleiben unverändert. Die ältere Synthese unter „Eigene Gongs“ dokumentiert den historischen Stand vor 6.2.3.

Mechanischer Druck, Loslassen und das kräftigere Einrasten des Not-Aus werden direkt mit Web Audio synthetisiert (`cockpit.js`), unabhängig von Android-/Web-Ansageketten. Die kurzen Anschläge bestehen aus gedämpften Resonanzen und deterministischen Impulsen. Stummschaltung und Hintergrundwechsel beenden die mechanischen Töne. Der Notfallbuzzer bleibt dem Not-Aus zugeordnet.

## Ergänzte Haltestellenaufnahmen in 6.2.2

Die sieben am 19.10.2026 vom Nutzer ergänzten MP3-Dateien werden unverändert verwendet: Bergstraße (`bergstrasse.mp3`), Bundesarbeitsgericht (`bundes_arbeitsgericht.mp3`), Humboldtstraße (`humboldtstrasse.mp3`), Landtag/Stadion Nord (`landtag_stadion_nord.mp3`), Löberwallgraben (`loberwallgraben.mp3`), Ringelberg (`ringelberg.mp3`) und Thüringen-Park (`thuringen-park.mp3`). Sie liegen unter `audio/stops/`. Weitere Herkunfts- oder Lizenzangaben wurden für diese Dateien nicht mitgeliefert.

Damit enthält die Zuordnung 96 aufgenommene Haltestellennamen; alle 93 unterschiedlichen Haltestellen der eingebauten Streckenvorlagen sind einschließlich ihrer Namensvarianten abgedeckt. Der Ansagenkatalog enthält nun 105 gelieferte Aufnahmen, zusätzlich zu den beiden Gongs und sieben Fahrpulteffekten. Dateinamen und SHA-256-Prüfsummen der Ergänzungen stehen in `audio/catalog.json`; der Offline-Cache enthält auch diese Dateien. Die Ansagefolge bleibt Ding-Dong → Nächste Haltestelle → Haltestellenname. Es wird keine Sprachsynthese verwendet.

## Fahrpult-Sounds (19.10.2026)

Die sieben Effekte unter `audio/effects/` sind lokal enthalten und werden auch von der PWA offline gespeichert. `audio/effects/catalog.json` enthält Dauer und SHA-256. MP3, mono, 44.100 Hz, 96 kbit/s; der nachträglich bereitgestellte Back-Jingle bleibt unverändert in Stereo, 48.000 Hz, 192 kbit/s. Die neuen Effekte verändern die gelieferten Sprachaufnahmen nicht.

| Taste | Datei | Herkunft und Bearbeitung |
| --- | --- | --- |
| Türen öffnen | `door_open.mp3` | [Tram doors open and close hiss and beeping](https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg), stephan, 07.05.2007, Public Domain. Kölner Straßenbahn, Ausschnitt 0,15–3,10 s, weich ein-/ausgeblendet, Pegel angepasst. |
| Türen schließen | `door_close.mp3` | Dieselbe Aufnahme, Ausschnitt 10,00–13,90 s, nach drei selbst synthetisierten Warnpieptönen (1.568 Hz). Gesamtdauer fünf Sekunden. |
| Notfall | `emergency.mp3` | Eigene Synthese: sechs kurze alternierende Signale mit 880/660 Hz. Kein genormtes oder verbindliches EVAG-Notfallsignal. |
| Stau | `traffic.mp3` | [Audio sound of a busy traffic in Porthacourt](https://commons.wikimedia.org/wiki/File:Audio_sound_of_a_busy_traffic_in_Porthacourt.ogg), ElemePodcast, 27.03.2026, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Ausschnitt 2,00–8,50 s, Pegel reduziert; mit [Car Horn](https://commons.wikimedia.org/wiki/File:Car_Horn.wav), 15HPanska_Ruttner_Jan, 28.02.2019, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), gemischt. |
| Fahrgastanzeige | `passenger.mp3` | Eigener vorhandener Ding-Dong, auf 20 % Amplitude reduziert und tiefpassgefiltert. |
| Fahrt beenden / Ziel erreichen | `finish.mp3` | Original Windows XP Shutdown, Microsoft, aus dem [Winhistory-Archiv](https://www.winhistory.de/more/winstart/winstart_en.htm), [WAV-Download](https://www.winhistory.de/more/winstart/down/winxpshutdown.wav). Amplitude auf 75 % reduziert. Proprietärer Microsoft-Sound; keine CC- oder Public-Domain-Lizenz behauptet. |
| Zurück | `back.mp3` | Während der Bearbeitung im Projekt bereitgestellte Aufnahme, unverändert übernommen. ID3-Titel: „Back To The Future Chimes Jingle sound - single“, Laufzeit 5,02 s. Melodie: „Back to the Future“, Alan Silvestri. Die externe Herkunft und eine Lizenz der Aufnahme sind im Projekt nicht angegeben; es wird keine freie Lizenz behauptet. |

Die Urheber- und Lizenzhinweise sind auch direkt im Fahrpult unter „Tonquellen“ zugänglich. „Tastentöne aus“ schaltet nur die neuen Effekte stumm; Haltestellenansagen bleiben aktiv. Neue Soundaktionen ersetzen vorherige Wiedergaben. Verlassen des Fahrermodus, Hintergrundwechsel und „Nächster Halt“ brechen laufende Effekte ab. Modaldialoge stoppen ihren Sound beim Schließen. Die Türlogik bleibt unverändert: Türen müssen vor dem nächsten Halt geschlossen sein.

Erneute Erzeugung: Quelldateien als `tram-doors.ogg`, `car-horn.wav`, `traffic.ogg` und `xp-shutdown.wav` unter `build/audio-sources/` ablegen, dann `node scripts/generate-driver-sounds.cjs`. Dafür FFmpeg im PATH bereitstellen oder `FFMPEG_PATH` setzen. Der Generator übergibt PCM direkt im Speicher an den MP3-Encoder; WAV-Dateien werden nicht mehr ausgeliefert. Die Wikimedia-Originaldateien sind auf den jeweiligen Beschreibungsseiten verlinkt. Anschließend die Assets synchronisieren. Browserprüfung: `node tests/cockpit.cjs`, Screenshots und Pegelbericht unter `build/qa-cockpit/`.

Der bereitgestellte Back-Jingle wird aus `build/audio-sources/back-provided.mp3` oder der über `DRIVER_BACK_SOUND` angegebenen MP3-Datei unverändert übernommen. Ohne diese Quelldatei erzeugt der Generator als Ersatz neun Noten des Hauptthemas: F4, B♭3, E4, F4, G4, F4, D4, B♭3, E4; 4,22 s, Tempo 176. Dieser Ersatz wurde visuell anhand der [offiziellen Partitur, Arbeitsblatt 7, gedruckte Seite 13 / PDF-Seite 15](https://www.backtothefuturemusical.com/pdfs/education/new/section-2-screen-to-stage-post-show-materials.pdf) geprüft. Die gebundene E4-Note wird gehalten.

Alle 98 MP3-Aufnahmen stammen unverändert aus dem vom Nutzer bereitgestellten Archiv tram-planer-ansagen.zip. Die Originalnamen, lesbaren Bezeichnungen, neuen Dateipfade und SHA-256-Prüfsummen stehen in app/src/main/assets/audio/catalog.json. Auch derzeit nicht benötigte Aufnahmen und beide Varianten von „Nächste Haltestelle“ werden mitgeliefert und offline gespeichert.

Die älteren vollständigen Piper-Ansagen und WAV-Dateien wurden entfernt. Die Zuordnung aller 89 aufgenommenen Haltestellen steht in audio/announcements.json. Es wird ausschließlich mit vorhandenen Aufnahmen gearbeitet. Sprachsynthese ist in Android und PWA entfernt. Abweichende Schreibweisen und die Zuordnungen Lutherkirche/SWE → Lutherkirche Stadtwerke, Boyneburgufer → Boyneburg Ufer und Stadtmuseum/Kaisersaal → Stadtmuseum Kaisersaal werden auf die vorhandenen Dateien abgebildet. Für nicht aufgenommene Namen bleibt die Ansage stumm und ein Hinweis erscheint.

## Reihenfolge

Eine Sekunde nach „Nächster Halt“ beginnt die Ansage der oben angezeigten Haltestelle:

- Normal: Ding-Dong → Nächste Haltestelle → Haltestellenname.
- Hauptbahnhof: Ding-Dong → Nächste Haltestelle → Hauptbahnhof → Next stop Central Station → Umsteigemöglichkeit zum Stadtbus und zum Busbahnhof.
- Linie 5, direkt vom Anger zum Hauptbahnhof: anschließend Dong-Dong-Ding → Sehr geehrte Fahrgäste, diese Fahrt endet hier. Bitte alle aussteigen.
- Anger: Ding-Dong → Nächste Haltestelle → Anger → Dong-Dong-Ding → Umsteigemöglichkeit zu allen Stadtbahnlinien (vollständige gelieferte Aufnahme).
- Fischmarkt: Ding-Dong → Nächste Haltestelle → "Fischmarkt/Radhaus" → Next stop Town Hall
- Lutherkirche/SWE: Ding-Dong → Nächste Haltestelle → vorhandene Aufnahme „Lutherkirche Stadtwerke“ (`audio/stops/lutherkirche_stadtwerke.mp3`). Der Name aus dem Netzplan wird dafür auf den Namen der Aufnahme abgebildet; es wird keine neue Sprachdatei erzeugt.

Im Archiv gibt es keine Aufnahme mit dem Wortlaut „Nächster Halt“. Beide als Präfix benannten Dateien sagen „Nächste Haltestelle“; aktiv ist die Aufnahme mit der ursprünglichen Endung 004921.

Der Wechsel zum oben angezeigten aktuellen Halt gilt in dieser Simulation als Ankunft. Die Zusatzansage der Linie 5 hängt von der eingetragenen Liniennummer und der unmittelbar vorherigen Haltestelle ab. Es wird keine zusätzliche Streckenvorlage erstellt.

Android spielt eine geprüfte Liste lokaler MP3-Pfade nacheinander ab. Die Webfassung decodiert dieselbe Liste und wartet jeweils auf das Ende des vorherigen Clips. Schnelle Haltewechsel und die vorhandenen Abbruchaktionen stoppen die ganze Kette einschließlich Zusatzhinweisen.

## Eigene Gongs

Die beiden Gongs wurden neu durch additive Synthese erstellt. Ding-Dong: 1046,50 / 783,99 Hz. Dong-Dong-Ding: 659,25 / 659,25 / 1046,50 Hz. MP3, Mono, 44,1 kHz, 96 kbit/s. Es wurden keine fremden Gongs verwendet.

Erneute Erzeugung mit Python, numpy und PyAV: python scripts/generate_chimes.py. Das Audioarchiv wird mit python tools/import-audio.py PFAD_ZUM_ZIP importiert. Anschließend python tools/sync-assets.py ausführen. Die MP3-Sprachaufnahmen werden beim Import weder neu codiert noch verändert.

# Erfurter Fahrzeugkatalog

Recherche vom 20.10.2026. Die App trennt den mitgelieferten Typenkatalog von den vom Nutzer angelegten Fahrzeugen. Es werden keine echten EVAG-Umläufe oder Fahrzeugverfügbarkeiten behauptet.

## Daten und Pflege

- Typen und Fachquellen: `app/src/main/assets/vehicle-types.json`.
- Lokale Fotos und Bildnachweise: `app/src/main/assets/images/vehicles/`, insbesondere `credits.json`.
- Fotoauswahl nach Wikimedia-Commons-Datei-ID: `artwork/vehicle-photo-selection.json`.
- `python tools/fetch-vehicle-photos.py` lädt die ausgewählten CC-/CC0-Fotos samt Lizenznachweisen neu. Netzwerkzugriff erforderlich; vorhandene Fotos werden beibehalten.
- `python tools/sync-assets.py` prüft die Katalogreferenzen, erzeugt `vehicle-types-data.js` für den Android-WebView ohne Fetch/CORS und spiegelt alle Assets nach `web-pwa`.
- Eigene Fahrzeuge liegen zusammen mit Fahrplänen in `fm_tablet_state_v1` im lokalen App-/Browserspeicher. Einstellungen → Daten exportieren/importieren sichert die gesamte Liste. Die Typendatei wird dabei nicht verändert.

## Fachquellen und Einordnung

[EVAG: Fahrzeuge und Traditionsbahnen](https://www.evag-erfurt.de/evag/strassenbahn-mieten-erfurt) belegt die heutigen Fahrzeugfamilien sowie TW 92, T2D, Tatra, Katerexpress und Beiwagen. [EVAG: Tramlink](https://www.evag-erfurt.de/evag/tramlink) ergänzt die jüngste Fahrzeuggeneration. Bei Tramlink werden keine widersprüchlichen Sitzplatzzahlen aus älteren Herstellerankündigungen übernommen.

Die Unterscheidung von vier Combino-Ausführungen folgt den dokumentierten Fahrzeugserien: Basic fünf Teile, Advanced fünf oder drei Teile und Classic drei Teile. Quellen: [Fahrzeugchronik Erfurt](https://www.strassenbahn-erfurt.de/wagenpark/) und [Erfurter Fahrzeugdaten mit eigenen Fahrzeugaufnahmen](https://www.tram-mitteldeutschland.de/Erfurt/Fahrzeuge.html). Die [MGT6D-Liste](https://www.strassenbahn-erfurt.de/wagenpark/mgt/mgt6d/) unterscheidet die vier 1994 gebauten Zweirichter von den späteren MGT6DE-Einrichtern. Bestandszahlen werden wegen Abstellungen und laufender Neubeschaffungen nicht als aktuelle Verfügbarkeit angezeigt.

Die historischen Gotha-Bauarten beruhen auf der Originalrecherche von [Gothawagen.de: Erfurt](https://www.gothawagen.de/gothawagen/staedte/erfurt/erfurt.html) und den dortigen Typenbeschreibungen. Insbesondere hatte Erfurt eigene T57E („Erfurt 57“), T2-60 und T2-61. Ein gewöhnlicher T57, der 1993 nach Erfurt gelangte, ging dort nie in Betrieb und wird deshalb nicht als Erfurter Einsatztyp aufgeführt. Die Beiwagen-Bezeichnungen B2-62/B2-64 werden in den Quellen unterschiedlich abgegrenzt und deshalb gemeinsam geführt; [die Erfurter Sonderwagenchronik](https://www.strassenbahn-erfurt.de/wagenpark/sonderwagen/) bezeichnet die erhaltenen Wagen 274 und 275 als B2-64.

Die [EVAG-Fahrzeuggeschichte der 1980er-Jahre](https://jubilaeum.evag-erfurt.de/evag-jubilaeum/home/evag-geschichte/1980er) belegt die Reko-Beiwagen aus Berlin-Schöneweide und den früheren Gotha-Einsatz. Arbeits- und Veranstaltungsumbauten sind bei der Grundbauart genannt; der Katerexpress und der Sommerbeiwagen haben eigene Auswahleinträge. Der Katalog umfasst 23 Einträge einschließlich Varianten und Beiwagen. Er ist keine vollständige Inventarliste der frühen Pferdebahn- und Einzelanfertigungen vor den Gotha-Serien.

## Fotos

Die Fotos stammen aus Wikimedia Commons. Autor, Originaldatei, Lizenzlink und Hinweis auf die durch Commons bereitgestellte Verkleinerung stehen zu jedem Bild in `images/vehicles/credits.json` und sichtbar in der App unter „Foto & Lizenz“. Fotos werden lokal ausgeliefert und vom Service Worker vollständig zwischengespeichert.

Aktuelle Serien und erhaltene Triebwagen sind durch reale Erfurter Fahrzeugfotos vertreten. Bei einigen nicht mehr erhaltenen Untertypen, dem B2D und dem offenen Sommerbeiwagen fehlt in dieser Auswahl ein passendes frei lizenziertes Einzelporträt. Dort werden deutlich beschriftete Zeit- oder Vergleichsaufnahmen verwendet. Das B2-64-Typenfoto zeigt einen Hallenser Museumswagen; der G4-61 ist in Nordhausen aufgenommen. Die Fotos sind keine Aufnahmen des jeweils vom Nutzer angelegten individuellen Fahrzeugs.

## Verhalten und Prüfung

Kürzel sind nach Entfernen äußerer Leerzeichen ohne Unterscheidung der Groß-/Kleinschreibung eindeutig. Umbenennen und Typwechsel aktualisieren verknüpfte gespeicherte Fahrpläne. Fahrzeuge in aktiven oder angehaltenen Fahrten sind gegen Änderungen und Löschen gesperrt. Löschen eines unbenutzten Fahrzeugs erhält die Fahrzeugangaben in Fahrplänen und Historie als Momentaufnahme. Freie Fahrzeugangaben und ältere Backups bleiben verwendbar.

`node tests/vehicles.cjs` prüft Anlegen, Dubletten, Bearbeiten, Fahrplanzuordnung, aktive Sperren, Löschen mit Datenerhalt, Backup, Legacy-Daten, Suchfilter, Mobilansicht und Offline-Fotos. Außerdem wird die Endhaltestelle geprüft: „Nächster Halt“ bleibt gleich beschriftet, ist deaktiviert und beendet die Fahrt auch bei direktem Funktionsaufruf nicht. „Fahrt beenden“ verbucht am Ziel eine regulär beendete Fahrt.

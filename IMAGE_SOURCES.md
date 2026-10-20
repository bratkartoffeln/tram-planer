# Bilder und App-Icon

## Fahrpult-Ergänzungen ab 6.2.4

Der bisherige graue Reservetaster rechts neben „Fahrgastanzeige“ wird über HTML/CSS als blauer Vollbildtaster mit Bildschirmsymbol belegt. Die zugrunde liegende Pultgrafik bleibt unverändert: acht Funktionstaster, zwei Kontrollleuchten für den Türzustand, zwei drehbare Reserve-Drehschalter und zehn rein grafische Reserveelemente. Vollbild (626/749), Stau (871/748) und Fahrtende (1493/748) sind an den gemessenen Tastermitten der Originalgrafik ausgerichtet. Die Schraubenanimationen verwenden lokale Ausschnitte derselben Pultgrafik; Schraubenlöcher werden in CSS ergänzt.

Die beiden Reserve-Drehschalter verwenden CSS-Ebenen mit lokalen Ausschnitten derselben Pultgrafik für die feststehende Einfassung und den drehbaren schwarzen Griff. Es wurden keine neuen Bilddateien erzeugt.

## Fahrzeugfotos ab 6.2.3

Die Fahrzeugverwaltung verwendet reale, lokal gespeicherte Commons-Fotos. Einzelne historische Untertypen nutzen ausdrücklich bezeichnete Zeit- oder Vergleichsaufnahmen. Alle Urheber, Originaldateien und CC-/CC0-Lizenzen stehen in `app/src/main/assets/images/vehicles/credits.json` und direkt unter den Bildern in der App. Fachquellen, Einschränkungen und Pflege: [VEHICLE_SOURCES.md](VEHICLE_SOURCES.md).

## App-Icon ab 6.2.3

- Original: `artwork/app-icon.png`, erzeugt mit dem integrierten Imagegen-Tool.
- Verwendung: Android-Launcher `app/src/main/res/drawable-nodpi/ic_launcher.png`, PWA-Icons `icon-192.png`/`icon-512.png` und Browser-Favicon `favicon-32.png` unter den Android-Assets und in `web-pwa`.
- Vollständiger finaler Prompt: „Use case: logo-brand. Asset type: square production app icon for an offline tram timetable simulator called Fahrplan Manager. Primary request: create a polished instantly readable icon of a modern tram seen exactly from the front, large cream white tram body, deep teal windshield with subtle blue reflection, two warm amber headlights and a small amber blank route display, rails converge subtly beneath, dark deep teal rounded-square background filling the entire square. Restrained professional European transit aesthetic, crisp bold shapes with very subtle material shading, excellent legibility at 32 pixels, centered symmetrical composition and ample safe margin for Android launcher crop. No text, no letters, no logos, no watermark. Single icon, no sheet or presentation mockup.“

## Fotorealistisches Fahrerpult in 6.2.3

- Referenz: die vom Nutzer im Chat gelieferte Abbildung eines Straßenbahnpults mit weißen Gruppenumrandungen. Sie dient als Gestaltungsvorlage.
- Original: `artwork/cab-panel-photoreal.png`, 1681 × 936 Pixel, mit dem integrierten Imagegen-Tool erzeugt.
- Ausgelieferte Grafik: `app/src/main/assets/images/cab-panel-photoreal.webp`, verlustarm komprimiert und unverändert nach `web-pwa/images/` gespiegelt.
- Vollständiger finaler Prompt: [artwork/cab-panel-prompt.txt](artwork/cab-panel-prompt.txt).
- Die Grafik enthält die Lackplatte, weißen Markierungsrahmen, vier Schrauben, elfenbeinfarbenen Tastereinfassungen sowie sieben farbige/weiße Funktionstaster und fünfzehn graue Reserveelemente. HTML ergänzt deutsche Gruppen- und Funktionsbeschriftungen, Symbole, passende Trefferflächen und Druckzustände.

Das fotorealistische Pult ersetzt die vorherige vollständig in CSS gezeichnete Fassung. Das historische Dresdner Fahrpultfoto wird weiterhin nicht angezeigt. Die folgende Quellenangabe bleibt für die im Repository enthaltene Bilddatei erhalten.

## Historisches Fahrpultfoto

- Datei: `app/src/main/assets/images/tram-cockpit.jpg`, gespiegelt in der PWA.
- Titel: „Cockpit NGTD8DD Dresden.jpg“.
- Urheber: Silvio P. – Bus und Bahn DD, 2007.
- [Original und Lizenzangaben auf Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cockpit_NGTD8DD_Dresden.jpg).
- Gewählte Lizenz: [Creative Commons Attribution-ShareAlike 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/).
- Originaldatei: 3008 × 1880 Pixel, SHA-1 `c273a0903b09d5ea2c52de4f36d0c75aaf4d7456`.

Die unveränderte JPEG-Datei steht unter CC BY-SA 3.0. In älteren Fassungen wurde sie per CSS zugeschnitten und abgedunkelt mit Bedienelementen überlagert. Quellen und Lizenz stehen außerdem in `images/credits.json`. Das Foto zeigt eine Dresdner Straßenbahn.

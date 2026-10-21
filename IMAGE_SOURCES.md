# Bilder und App-Icon

Ab Version 6.2.9 verwenden alle vier Combino-Typen das Standard-Fallback-Fahrpult (`images/cab-panel-photoreal.webp`), einschließlich der interaktiven Vorschau. Gestaltung und Bildquelle stehen im Abschnitt „Fotorealistisches Fahrerpult in 6.2.3“. Das zuvor nach dem BERNMOBIL-Vergleich erzeugte Combino-Panel wird nicht mehr verwendet; seine nachfolgende Dokumentation beschreibt den Stand von 6.2.8.

Ebenfalls ab 6.2.9 sind die bewegten Tastenausschnitte an die vollständigen Kappen samt Fasen angepasst. HTML/CSS ergänzt dahinter die Vertiefung. Die übrigen Not-Aus-Taster besitzen eine feste kreisrunde Sockelebene, die bereits im Ruhezustand hinter dem perspektivisch versetzten roten Kopf liegt. Beim Drücken wird mehr derselben Fläche sichtbar. Gelbe Sockel bleiben gelb; Varianten mit dunklem Sitz erhalten keinen gelben Ring. Hierfür wurden keine neuen Bitmapdateien erzeugt.

## Modellabhängige frontale Panels ab 6.2.8

Recherche und Erzeugung: 21.10.2026. Acht separate frontale Schalterplatten mit dem integrierten Imagegen-Tool. Die vom Nutzer gewünschte Default-Grafik dient als Referenz für die frontale Ansicht; die Hardwaretypen und Materialien stammen aus den unten verlinkten, visuell geprüften Referenzfotos. Ausgegeben wird jeweils ein ausgewähltes Schalterfeld, ohne den umgebenden Fahrerraum. Anzahl, Auswahl und Anordnung der Taster sind für die acht Spielaktionen angepasst. Es handelt sich um fotorealistische Nachbildungen, keine unveränderten Originalfotos oder exakten Restaurierungszeichnungen. Instrumente bleiben Bildkulisse. TW 92 besitzt eine ausdrücklich als Simulationsnachbildung bezeichnete stilgerechte Schaltplatte, deren Originalausführung mit acht Tastern nicht belegt ist.

Dateien: `app/src/main/assets/vehicle-bundles/family-*/panel-front.webp`, identisch nach `web-pwa/vehicle-bundles/` gespiegelt. Vollständiger finaler Prompt je Bild: [artwork/cab-model-prompts.json](artwork/cab-model-prompts.json). HTML/CSS animiert gemessene Fotoausschnitte der tatsächlichen runden oder eckigen Kappen und vier fotografierten Eckschrauben; es werden keine zusätzlichen generischen Tasterreihen über eine Gesamtansicht des Fahrerraums gelegt. Die Pulttasten und Schrauben funktionieren auch in der Vorschau mit eigenem Zustand.

| Paneldatei (unter `vehicle-bundles/`) | Fahrzeugtypen | Referenz, Einordnung und Bildlizenz |
| --- | --- | --- |
| `family-tramlink/panel-front.webp` | Stadler Tramlink | Frontale Nachbildung der burgunderroten physischen Tastenleiste eines Tramlink der Traunseetram mit metallischen Rundtasterringen. Auswahl und Anordnung sind für die Simulation angepasst. Baureihenvergleich, keine exakte Erfurter Kabine. [EVAG · Erfurter Tramlink](https://www.evag-erfurt.de/evag/tramlink); [Erfurt · Fahrschalter-Detail](https://www.rynek-kolejowy.pl/wiadomosci/erfurt-nowy-tramlink-zaprezentowany-146884.html); [Tramlink Traunseetram · Simon Legner, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Vossloh_Tramlink_F%C3%BChrerstand.jpg); [CC BY-SA 4.0 · Lizenz der bearbeiteten Vergleichsvorlage](https://creativecommons.org/licenses/by-sa/4.0/). Bearbeitete Panelgrafik ebenfalls unter CC BY-SA 4.0. |
| `family-combino/panel-front.webp` | Combino Basic · 5-teilig, Combino Advanced · 5-teilig, Combino Advanced · 3-teilig, Combino Classic · 3-teilig | Frontales Rundtasterpanel nach dem rechten Schalterfeld des BERNMOBIL Combino Advanced: dunkle Platte, helle und metallische Ringe. Gekennzeichneter Baureihenvergleich für vier Erfurter Varianten; Auswahl und Anordnung sind für die Simulation angepasst. [BERNMOBIL · Combino Advanced, Führerstand](https://www.bernmobil.ch/de/fahrzeugpark/trams/siemens-combino-tram). |
| `family-mgt/panel-front.webp` | MGT6D · Zweirichter, MGT6DE · Einrichter | Frontale Nachbildung des schwarzen Tastenpanels im braunen Rahmen nach MGT6DE 612. Rechteckige elfenbeinfarbene Taster; Auswahl und Anordnung der Spieltasten sind angepasst. MGT6D nutzt denselben gekennzeichneten Familienvergleich. [Erfurt MGT6DE 612 · Christian Meinelt](https://www.strassenbahn-erfurt.de/wagenpark/mgt/mgt6de/). |
| `family-kt4d/panel-front.webp` | Tatra KT4D | Frontale dunkle Metallplatte mit schwarzen Bakelittastern, hellen Kappen und Analoginstrumenten nach dem Potsdamer KT4D-Prototyp. Für die Simulation angepasster Baureihenvergleich; kein exakter Erfurter Serienzustand. [Straßenbahn Potsdam · KT4D-Prototyp](https://www.tram2000.de/wagenpark/museumswagen/kt4d-prototyp/). |
| `family-kt4dc/panel-front.webp` | Tatra KT4D-C · modernisiert | Frontales schwarzes Rundtasterpanel im roten Rahmen nach Erfurter Sonderwagen 522. Analogtacho als Bildkulisse. Die Spieltasten sind aus dem Schalterfeld abgeleitet und neu angeordnet; andere Modernisierungen können abweichen. [Erfurt KT4D-C 522 · Christian Meinelt](https://www.strassenbahn-erfurt.de/wagenpark/bilder.php?id=522). |
| `family-gotha-wheel/panel-front.webp` | Gotha / Tatra T2D, Gotha G4-65, Gotha G4-65 · Katerexpress, Gotha G4-61, Gotha B2-62 / B2-64 · Beiwagen, Tatra B2D · Beiwagen, Gotha B2-64 · Sommerbeiwagen 275, Reko-Beiwagen · BE 70 | Frontale Nachbildung der hellen Schaltplatte links neben dem Fahrschalter-Handrad eines G4-65, Naumburg 202. Bakelittaster und Metallringe; Spieltasten angepasst. G4-61, G4-65, Katerexpress und T2D teilen diesen gekennzeichneten Familienvergleich. [G4-65 Naumburg 202 · ChristianBier, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Fuehrerstand_G4-65.JPG); [Gotha-Bauarten und Fahrschalter](https://www.gothawagen.de/gothawagen/typen/typmerkmale.html); [G4 · RSAG / Rostocker Nahverkehrsfreunde](https://www.depot12.de/fileadmin/Depot12/Fahrzeuge/PDF/Triebwagen_1.pdf); [CC BY-SA 3.0 · Lizenz der bearbeiteten Vergleichsvorlage](https://creativecommons.org/licenses/by-sa/3.0/). Bearbeitete Panelgrafik ebenfalls unter CC BY-SA 3.0. |
| `family-gotha-crank/panel-front.webp` | Gotha T57E · Erfurt 57, Gotha T2-60, Gotha T2-61, Gotha B2-60 · Beiwagen, Gotha B2-61 · Beiwagen | Frontale Nachbildung des mittleren grauen Schalterkastens eines T57 der Kirnitzschtalbahn, ohne umgebende Kurbel und Handbremse. Eckige Bakelittaster und roter Druckknopf; Auswahl und Anordnung für die Simulation angepasst. T57E, T2-60 und T2-61 sind gekennzeichnete Familienvarianten. [T57 Kirnitzschtalbahn 2 · Clemens Kral](https://www.bahnbilder.de/bild/deutschland~strassenbahn~bad-schandau-kirnitzschtalbahn/1391963/das-ist-der-fuehrerstand-eines-gothawagens.html); [T2-61 · Kurbel-Fahrschalter StNFB1](https://www.gothawagen.de/gothawagen/typen/T2-61.html); [ET57 · Straßenbahnmuseum Dresden](https://strassenbahnmuseum-dresden.de/fahrzeuge/fahrzeuge-triebwagen/tw_1587/). |
| `family-gotha-vintage/panel-front.webp` | Gothaer Zweiachser · TW 92 | Stilgerechte frontale Schaltplatte mit schwarzen, hellen und dunkelroten Bakelittastern, Messingringen und Holzrahmen nach den Materialien des TW-92-Führerstands. Die acht Taster sind eine ergänzte Simulationsbedienung; eine solche Originalplatte von TW 92 ist nicht belegt. [TW 92 Erfurt · Führerstand, Erhard Beyer](https://altebahnen.startbilder.de/bild/Deutschland~Strassenbahnen+vor+1945~Erfurt+-+Tw+92/142268/fuehrerstand-tw-92.html); [EVAG · Traditionswagen 92](https://www.evag-erfurt.de/evag/home/service/strassenbahn-mieten-erfurt). |

Beiwagen besitzen kein eigenes Fahrerpult und verwenden ein gekennzeichnetes Zugfahrzeugpanel. Die Familienzuordnung vereinfacht gemeinsame Bedienelemente; unterschiedliche Erfurter Baulose, Modernisierungen und historischen Kabinen sind nicht jeweils einzeln belegt. Alle Variantenhinweise und Referenzen stehen auch in den Familienmanifesten und in der App. Die vorhandenen Standardklänge bleiben ausdrücklich als Fallback gekennzeichnet, ohne neue authentische Baureihenaufnahmen zu behaupten. Urheber, Quellen und Bearbeitungen der Sounds: [AUDIO_SOURCES.md](AUDIO_SOURCES.md).

Für `family-gotha-wheel` und `family-gotha-crank` wurden die hervorstehenden Hebel mit dem integrierten Imagegen-Tool aus der Hintergrundplatte entfernt und als transparente `lever-off.webp` / `lever-on.webp` in zwei gegenüberliegenden Stellungen nachgebildet. Lager, Ringe und Platte bleiben fest. Die sechs ergänzenden Bearbeitungsprompts stehen ebenfalls in `artwork/cab-model-prompts.json`; die beiden bearbeiteten Hintergrundplatten ersetzen jeweils `panel-front.webp`. Die Grafiken der Handradfamilie einschließlich der freigestellten Hebel stehen als Bearbeitungen derselben Vergleichsvorlage unter CC BY-SA 3.0 mit obiger Namensnennung. Beschriftungen und Symbole werden transparent in HTML ergänzt.

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
## Tramlink: mittleres Instrumentenpanel in Version 6.2.10

Die aktuelle Tramlink-Grafik ersetzt die Nachbildung aus 6.2.8. Vorlage ist das vom Nutzer bereitgestellte Foto; nur das mittlere schwarze Instrumentenpult wurde mit dem integrierten Imagegen-Tool frontal nachgebildet. Sitz, Fenster, linke Fahrsteuerung und rechtes seitliches Terminal sind nicht Teil dieses Panels. Die Darstellung ist eine an die Simulation angepasste Nachbildung und keine belegte genaue Erfurter Werksausführung.

- Frontplatte: `app/src/main/assets/vehicle-bundles/family-tramlink/panel-front.webp`, 1672 × 941 Pixel.
- Fotografische Drehgriffquelle: `app/src/main/assets/vehicle-bundles/family-tramlink/rotary-source.webp`; die Frontplatte enthält nur deren feste Einfassungen, damit beim Drehen kein zweiter Griff stehen bleibt.
- Vollständige Generierungs- und Bearbeitungsprompts: [artwork/cab-tramlink-6.2.10-prompts.json](artwork/cab-tramlink-6.2.10-prompts.json).
- Alle physischen Taster und Drehschalter sowie vier Eckschrauben sind bedienbar. Tachometer und Display bleiben Bildkulisse. Beschriftungen und Symbole liegen separat auf dem Panel; Sounds verwenden weiterhin den gekennzeichneten Standard-Fallback.

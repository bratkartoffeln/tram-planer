# Erfurter Straßenbahnvorlagen

Recherche und erneuter Abgleich: 19.10.2026. Die Karte zeigt standardmäßig den an diesem Tag gültigen Baustellenstand; das reguläre Tagesnetz ist zusätzlich umschaltbar. Es handelt sich um manuell nachgebildete Haltestellenfolgen, nicht um einen Live-Datenfeed. Die vorhandenen fiktiven Strecken bleiben erhalten.

## Primärquellen der EVAG

- [Liniennetz und CityTakt](https://www.evag-erfurt.de/evag/fahrplan/liniennetz): Stadtbahn tagsüber Mo–Fr 06–18 Uhr alle zehn Minuten.
- Haltestellenfahrpläne und Haltefolgen, jeweils beide Richtungen: [Linie 1](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=1), [Linie 2](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=2), [Linie 3](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=3), [Linie 4](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=4), [Linie 5](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=5), [Linie 6](https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie=6).
- [Bauinformation Warschauer Straße](https://www.evag-erfurt.de/evag/warschauer%2Bstrasse): abweichende Linien 1 und 6 vom 09.10.2026, 21 Uhr bis 26.10.2026, Betriebsbeginn. Linie 1 Rieth–Lutherkirche/SWE–Thüringenhalle, Linie 6 Europaplatz–Domplatz–Steigerstraße. Diese Führung erscheint standardmäßig auf der Karte und in vier zusätzlichen Vorlagen (beide Richtungen).
- [Baufahrplan Linie 1, F1012](https://www.evag-erfurt.de/site/evag/get/documents_E672057976/evag/documents/Fahrpl%C3%A4ne/Warschauer%20STra%C3%9Fe/TFP_BAU_1_20261010.pdf) und [Baufahrplan Linie 6, F1012](https://www.evag-erfurt.de/site/evag/get/documents_E-1026193312/evag/documents/Fahrpl%C3%A4ne/Warschauer%20STra%C3%9Fe/TFP_BAU_6_20261010.pdf), jeweils gültig ab 10.10.2026. Die aufgeführten Tages-Hauptverläufe bestätigen die Baustellenführung. Einzelne Früh-/Spätfahrten sind abweichend durchgebunden; diese Sonderfahrten werden nicht als vollständiger Tagesfahrplan nachgebildet.

## Umsetzung und Grenzen

Zwölf Regelnetz-Vorlagen: 1 Europaplatz–Thüringenhalle, 2 P+R-Platz Messe–Wiesenhügel, 3 Europaplatz–Urbicher Kreuz, 4 Bindersleben–Ringelberg, 5 Zoopark–Hauptbahnhof und 6 Rieth–Steigerstraße, jeweils in beiden Richtungen. Hinzu kommen vier explizit als Baufahrplan gekennzeichnete Vorlagen für 1 und 6.

Die Karte nutzt die volle Inhaltsbreite und passt sich standardmäßig daran an. Der Editor steht darunter. Verbindungen werden aus beiden Fahrtrichtungen erzeugt, sodass auch die Halte Angerbrunnen, Lange Brücke, Walter-Gropius-Schule, Milchinselstraße und Löberwallgraben angebunden sind. Im Baustellenstand werden nicht bediente Regelverbindungen grau gestrichelt dargestellt; das ist keine Behauptung, dass alle dargestellten Abschnitte baulich gesperrt sind. Der SEV-Bus ist nicht als Stadtbahnlinie eingetragen.

Gleis-/Steigzusätze sind zusammengeführt. Domplatz Nord und Süd bleiben getrennt. Linie 4 berücksichtigt Karl-Marx-Platz/Hirschgarten stadteinwärts, Angerbrunnen/Lange Brücke stadtauswärts sowie Walter-Gropius-Schule Richtung Bindersleben. Linie 5 startet die Rückrichtung gemäß Haltestellenliste am Löberwallgraben. Linie 6 bedient Hochheimer Straße Richtung Steigerstraße und Milchinselstraße Richtung Rieth.

Die frei gezeichnete Karte ist schematisch, ohne geografische Genauigkeit. Farben dienen der Unterscheidung und sind keine verbindliche EVAG-Farbzuordnung. Fahrzeiten sind mit **zwei Minuten je Abschnitt als Simulationswerte** vorbelegt, keine recherchierten realen Abschnittsfahrzeiten. Konkrete Abfahrten, Wochentagsvarianten, Kurzläufer, Nachtlinien und Sonderfahrpläne werden nicht importiert. Offizielle Auskünfte sind im Menü verlinkt.

Eigene Linien werden lokal in `customRoutes` gespeichert und mit dem vorhandenen JSON-Export/-Import gesichert. Änderungen erzeugen bei eingebauten Vorlagen eine eigene Kopie. Gespeicherte Fahrpläne und aktive Fahrten enthalten weiterhin unabhängige Haltestellenkopien.

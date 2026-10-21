# Fahrplan Manager Audio – Version 6.2.7

Offlinefähige Android-App und PWA zur Fahrplansimulation. © MeisterErwat.

## Neu

Version 6.2.7 bereitet modellabhängige Fahrerpulte und Sounds vor. Alle 23 Fahrzeugtypen besitzen ein eigenes erweiterbares Bündel; zunächst erben sie vollständig das bisherige Pult und die bisherigen Sounds. Die Android-App kann in den Einstellungen nach neuen GitHub-Releases suchen, beim Start höchstens einmal täglich prüfen und eine neuere Version mit APK-Download anbieten.

Version 6.2.6 richtet den oberen Streckenstrich der Fahrgastanzeige exakt am weiteren Verlauf aus. Im Vollbild des Fahrpults lässt sich der Streckenverlauf über ein eigenes Symbol weich aus- und wieder einblenden; im Hochformat wird der untere Bereich zusammengefahren. Tastaturbedienung und reduzierte Bewegung werden berücksichtigt.

Beim Öffnen und Schließen blinkt „Türen offen“ bis zum tatsächlichen Wiedergabeende des jeweiligen Türsounds. Danach leuchtet beim Öffnen „Türen offen“ dauerhaft, beim Schließen wechselt die Anzeige auf „Türen zu“. Während der Bewegung ist der Türtaster gesperrt und die Weiterfahrt blockiert. Ein abgebrochener Schließvorgang meldet weiterhin offene Türen. Android meldet das Ende über den MediaPlayer zurück, die PWA über Web Audio; ohne Ton erfolgt der Zustandswechsel sofort. Prüfungen: `node tests/door-motion.cjs`, `node tests/cab-route-panel.cjs` und `node tests/passenger-display.cjs`.

Version 6.2.5 ergänzt Rückgängig in der Linienwerkstatt, das Einrasten ausschließlich auf Netzplanhaltestellen sowie auswählbare Linienbuttons für beide Fahrtrichtungen. Die aktive Linie bleibt farbig, andere Linien werden entsättigt.

Das Seitenmenü fährt in etwa 300 ms weich ein und aus; Beschriftungen und Kopfbereich blenden passend mit. Auf kleinen Displays wird es vertikal zusammengefahren. Netzplan und Fahrpult folgen der Größenänderung. Bei aktivierter Systemeinstellung für reduzierte Bewegung entfällt die Animation.

Die Fahrgastanzeige folgt der bereitgestellten Monitorvorlage: heller LCD im dunklen Gehäuse, blaues Linienfeld, aktueller Halt, Uhrzeit, zweisprachige Abfahrtsinformation und zwei folgende Halte mit Minutenangaben. Die Endhaltestelle wird bei ausgelassenen Zwischenhalten über einen gestrichelten Streckenabschnitt verbunden; Anschlusslinien stammen aus dem hinterlegten Netz. Die Minuten berücksichtigen Fahr- und Pausenzeiten sowie erfasste Stauzeit, bleiben jedoch Simulationswerte. Die Anzeige aktualisiert sich jede Sekunde und bleibt auch im Darkmode hell. Browserprüfung: `node tests/passenger-display.cjs`.

Version 6.2.4 ergänzt **Menü einklappen** oben im linken Seitenmenü. Auf breiten Bildschirmen bleibt eine schmale Symbolleiste mit erreichbaren Menüpunkten; das Fahrpult nutzt die zusätzliche Breite. Auf kleinen Displays wird die Menüleiste verborgen, der Ausklappschalter bleibt sichtbar. Die Einstellung wird lokal gespeichert und mit den Einstellungen gesichert.

Der zuvor freie Taster **Vollbild** rechts neben „Fahrgastanzeige“ schaltet eine große Fahrpultansicht samt aktuellem Halt, Zeitabweichung und Streckenverlauf ein oder aus. Am Desktop/Tablet steht die Strecke rechts, im schmalen Hochformat darunter. Escape beziehungsweise Android-Zurück verlässt zuerst den Vollbildmodus. Die laufende Fahrt bleibt erhalten. Im Browser wird die Vollbild-API verwendet; bei fehlender Unterstützung bleibt die bildschirmfüllende App-Ansicht verfügbar. Die Android-App blendet über ihre lokale Display-Anbindung auch die Systemleisten aus. Acht Taster sind jetzt belegt, zwei Kontrollleuchten zeigen den Türzustand, zwei Reserve-Drehschalter sind drehbar, zehn Elemente bleiben rein grafische Reserve. Browserprüfung: `node tests/display.cjs`.

Die jeweils fünften Elemente der ersten und zweiten Reihe zeigen **Türen zu** (grün) beziehungsweise **Türen offen** (orange). Die bisherige Türanzeige rechts oben entfällt. Vollbild-, Stau- und Fahrtende-Symbole sind an den tatsächlichen Tastermitten ausgerichtet.

Die beiden schwarzen **Reserve-Drehschalter** drehen sich bei jedem Klick oder Tippen um 90° im Uhrzeigersinn und rasten hörbar ein. Enter und Leertaste funktionieren ebenfalls. Die Einfassungen stehen fest; nur die Griffe drehen sich. Die unabhängigen Stellungen bleiben während derselben Fahrt auch beim Ansichtswechsel erhalten und setzen sich bei einer neuen Fahrt zurück. Die Schalter haben keine Fahrfunktion; die übrigen Reserveelemente bleiben ausgegraut.

Das Häkchen **Dev-Modus** ist zunächst verborgen. In den Einstellungen zehnmal direkt hintereinander innerhalb von fünf Sekunden auf die Versionsnummer klicken, um es freizuschalten. Andere Klicks unterbrechen die Folge. Weitere zehn Klicks innerhalb von fünf Sekunden deaktivieren den Dev-Modus und verbergen das Häkchen wieder; gespeicherte Netzplananpassungen bleiben erhalten. Freischaltung und Einstellung werden lokal gespeichert. Prüfung: `node tests/dev-mode.cjs`.

**Schrauben-Easter-Egg:** Doppelklick beziehungsweise Doppeltippen auf eine der vier Pultschrauben dreht sie gegen den Uhrzeigersinn heraus und lässt sie mit Metallklang herunterfallen. Erneuter Doppelklick auf das Loch dreht die Schraube mit Ratschenklang wieder hinein. Während einer Animation werden weitere Auslösungen ignoriert. Stummschaltung und reduzierte Bewegung werden berücksichtigt. Eine neue Fahrt setzt alle Schrauben zurück; Fahrtdaten bleiben unverändert. Prüfung: `node tests/cab-extras.cjs`.

Das Menü **Fahrzeuge** verwaltet mehrere eigene Fahrzeuge mit eindeutigem Kürzel, auswählbarem Typ und optionaler Notiz. Im Fahrplanformular „Tram / Fahrzeug“ lassen sich diese Fahrzeuge auswählen. Ein recherchierter Katalog mit 23 Bauarten und Varianten enthält Informationen, lokale Fotos und Quellen zu aktuellen Erfurter Straßenbahnen sowie historischen Gotha-/Tatra-Wagen und Beiwagen. Vergleichsaufnahmen sind gekennzeichnet. Datenpflege und Recherche: [VEHICLE_SOURCES.md](VEHICLE_SOURCES.md). Die Fahrzeugliste wird mit dem gesamten Datenbestand exportiert und importiert.

Im Fahrermodus bleibt **Nächster Halt** am letzten Halt gleich beschriftet und deaktiviert. Die Fahrt bleibt aktiv, bis **Fahrt beenden** gedrückt wird; am Ziel wird sie als regulär beendet gespeichert. Der Zurück-Taster ermöglicht weiterhin die Rückkehr zum vorherigen Halt. Prüfung: `node tests/vehicles.cjs`.

Version 6.2.3 ergänzt ein fotorealistisches frontales Fahrerpult nach der bereitgestellten Vorlage: graue Lackplatte, vier versenkte Schrauben, weiße Gruppenumrandungen, elfenbeinfarbene Tasterringe, sieben Funktionstaster und fünfzehn ausgegraute Reserveelemente. Fahrt und Türen liegen links, Fahrgastinfo unten links, Stau mittig und Fahrtende unten rechts; der Not-Aus-Pilztaster sitzt oben rechts. Die erzeugte Pultgrafik liegt lokal vor und wird auch offline geladen. Auf schmalen Displays lässt sich das Pult seitlich verschieben. Mechanische Druck-/Loslassgeräusche sowie das Einrasten laufen unabhängig von Ansagen und Funktionssounds. App, PWA und Browser-Favicon verwenden ein neues Straßenbahn-Icon.

Auf breiten Bildschirmen steht das verkleinerte Pult links unter dem aktuellen Fahrtstatus; der Streckenverlauf bleibt rechts daneben sichtbar. Auf schmalen Displays folgen Fahrtstatus, Pult und Streckenverlauf untereinander.

Unter „Meine Fahrpläne“ öffnet „Bearbeiten“ Strecke, Fahrzeug und Fahr-/Pausenzeiten eines vorhandenen Plans. Bei aktiver oder angehaltener Fahrt dieses Plans ist die Bearbeitung gesperrt. „Fahrt vorbereiten“ bietet neben „Jetzt“ auch „in 5 min.“ einschließlich Tageswechsel.

Der Dev-Modus ist in den Einstellungen standardmäßig ausgeschaltet. Nach dem Einschalten erscheint neben „Ganzes Netz“ der dunkel markierbare Schalter „Netz bearbeiten“. Punkte mit Maus oder Touch ziehen; Namen direkt am Text verschieben oder unten über Zahlenwerte ausrichten. Haltestellen auswählen, um ihre Netzplanbeschriftung zu ändern. „Gleis verbinden“ verknüpft zwei Halte, „Gleis entfernen“ bietet die Auswahl bei überlappenden Verbindungen. Farben lassen sich aus vorhandenen/vorgefertigten Farben oder frei wählen. Änderungen werden lokal gespeichert, mit JSON-Backups übertragen und bleiben bei ausgeschaltetem Dev-Modus sichtbar. „Rückgängig“ und „Original wiederherstellen“ sind verfügbar. Gespeicherte Fahrpläne und Ansagezuordnungen behalten ihre bisherigen Haltestellenkennungen.

Beide Gongs wurden aus den aktuell bereitgestellten Aufnahmen tonal rekonstruiert, ohne das aufgenommene Rauschen oder Hintergrundgeräusche einzumischen. Referenzen werden lokal unter `build/audio-reference-6.2.3/` gesichert. Erzeugung: `python scripts/generate_chimes.py` (NumPy und FFmpeg); technische Daten in `scripts/chime-tones.json`. Browserprüfung der neuen Bedienung: `node tests/editor.cjs`.

Version 6.2.2 ergänzt die sieben gelieferten Haltestellenaufnahmen für Bergstraße, Bundesarbeitsgericht, Humboldtstraße, Landtag/Stadion Nord, Löberwallgraben, Ringelberg und Thüringen-Park. Damit sind alle 93 Haltestellen der eingebauten Streckenvorlagen mit vorhandenen Aufnahmen abgedeckt, auch offline. Eigene Haltestellen ohne Aufnahme bleiben stumm.

Der Fahrermodus hat ein Fahrpult mit runden farbigen Tastern, Symbolen, Beschriftungen und Türstatusleuchte. Türen, Notfall, Stau, Fahrgastanzeige, Fahrtende und Zurück besitzen eigene offline verfügbare Sounds. Die Effekte lassen sich direkt am Pult stummschalten. Quellen und Bearbeitungen stehen unter „Tonquellen“ und in AUDIO_SOURCES.md. Browserprüfung mit Tondecodierung, Türlogik und mobiler Ansicht: `node tests/cockpit.cjs`.

98 gelieferte MP3-Aufnahmen ersetzen die alten vollständigen Sprachdateien. Alle aufgenommenen Haltestellen werden aus „Nächste Haltestelle“ und dem Namen zusammengesetzt. Hauptbahnhof und Fischmarkt/Rathaus erhalten die passenden englischen Ansagen; Hauptbahnhof und Anger die Umsteigehinweise; Linie 5 vom Anger zum Hauptbahnhof zusätzlich den neu erzeugten Dong-Dong-Ding und die Endstellenansage. Auch ungenutzte Aufnahmen sind enthalten und offline verfügbar. Reihenfolgen, Zuordnungen und Originaldateinamen: AUDIO_SOURCES.md und audio/catalog.json.

Die Ansage beginnt weiterhin eine Sekunde nach dem Haltewechsel. Schnelles Weiterschalten, Zurückschalten, Ansichtwechsel, Notfall, Fahrtende und Hintergrundwechsel beenden die gesamte Wiedergabekette.

## Linien & Netz

Gemeinsame Streckenabschnitte werden mit getrennten parallelen Linienzügen gezeichnet. Die Linien treffen an den Haltestellen zusammen; beim Verschieben eines Halts werden alle Abstände und Anschlüsse neu berechnet. Beide Fahrtrichtungen derselben Linie belegen gemeinsam eine Spur.

Im Dev-Modus unter „Netz bearbeiten“ eine Verbindung anklicken. Bei „Darstellung dieses Abschnitts“ lässt sich „Regulär“, „Baustelle“ oder „Nicht bedient“ wählen. Baustellen sind orange gestrichelt, nicht bediente Abschnitte grau gestrichelt vorbelegt. „Gestrichelt darstellen“ sowie die Abschnittsfarbe lassen sich unabhängig ändern. „Abschnittsmarkierung zurücksetzen“ stellt die bisherige Darstellung dieses Abschnitts wieder her. Die Auswahl oberhalb ändert weiterhin die Grundfarbe der gesamten Linie; individuelle Abschnittsmarkierungen haben Vorrang.

### Angepassten Netzplan im Projekt hinterlegen

Der integrierte Plan in 6.2.4 übernimmt die bereitgestellte Exportdatei: elf angepasste Haltestellen-/Textpositionen und den grau gestrichelten, als „Nicht bedient“ markierten Abschnitt der Linie 6 zwischen Berliner Straße und Riethstraße. Bei vorhandenen lokalen Netzplananpassungen im Dev-Modus **Projektdatei laden** wählen, um diesen Projektstand zu übernehmen.

1. In den Einstellungen zehnmal innerhalb von fünf Sekunden auf die Versionsnummer klicken, den eingeblendeten **Dev-Modus** einschalten und „Linien & Netz“ öffnen. Die Dateischaltflächen sind auch bei ausgeschaltetem Bearbeitungswerkzeug sichtbar.
2. **Netzplan exportieren** speichert `network-plan.json`. Der Browser lädt die Datei herunter; unter Android öffnet sich die Dateiauswahl. Enthalten sind Positionen, Namen und Textversätze, zusätzliche/entfernte Gleise, Linienfarben sowie Strichelungen und Abschnittsmarkierungen.
3. Die Datei im Projekt als [app/src/main/assets/network-plan.json](app/src/main/assets/network-plan.json) ablegen und die dortige Datei ersetzen. Der Browser kann den Projektordner nicht automatisch beschreiben.
4. Im Projektstamm `python tools/sync-assets.py` ausführen. Das erzeugt `app/src/main/assets/network-plan-data.js` für Android und spiegelt beide Dateien nach `web-pwa/network-plan.json` und `web-pwa/network-plan-data.js`. Diese generierten Kopien nicht von Hand ändern.
5. Die Browser-Vorschau neu laden, bei einem bestehenden Offline-Cache mit **Strg+F5**. Bei bereits lokal gespeicherten Anpassungen im Dev-Modus **Projektdatei laden** wählen. Neue App-Daten verwenden die Projektdatei automatisch. Für Android anschließend neu bauen und installieren.

**Netzplan importieren** lädt dieselbe Datei direkt in die aktuelle App. Import und „Projektdatei laden“ können über „Rückgängig“ im Bearbeitungswerkzeug zurückgenommen werden. Fahrpläne, Historie und Einstellungen werden dabei beibehalten. Dateiformat: `fahrplan-manager-network-plan`, Formatversion 1; ältere Netzplandateien ohne Abschnittsmarkierungen bleiben kompatibel. Beschädigte Dateien werden ohne Übernahme abgewiesen.

Die Basisdaten des schematischen Erfurter Netzes (Haltestellenkennungen, Standardpositionen und Haltefolgen) stehen in [app/src/main/assets/erfurt-network.js](app/src/main/assets/erfurt-network.js). Die oben genannte JSON-Datei enthält die Anpassungen an diesem Netz. Prüfungen: `node tests/network.cjs`, `node tests/editor.cjs` und `node tests/network-files.cjs` (letztere mit Playwright).

Die Karte nutzt die ganze Inhaltsbreite und zeichnet auch die Verbindungen der Rückrichtungen. Der am 19.10.2026 gültige Baufahrplan für die Linien 1 und 6 sowie das Regelnetz sind umschaltbar. Eigene Linien können ein Streckenkürzel erhalten; ohne Eingabe wird etwa „L7“ angezeigt. Die interne Kennung erscheint nicht als Kürzel.

Der Menüpunkt „Linien & Netz“ bietet zwölf EVAG-Vorlagen (Linien 1–6 in beiden Richtungen) und einen grafischen Editor. Vorhandene Haltestellen anklicken, nummerierte Halte auf andere Haltestellenkreise ziehen, Reihenfolge, Name, Farbe und Fahrzeiten ändern und als eigene Linie speichern. Freie Positionierungen sind gesperrt; Rückgängig stellt vorherige Bearbeitungsschritte wieder her. Im normalen Netzplan hebt ein Linienbutton die gewählte Fahrtrichtung hervor; ein erneuter Klick hebt die Auswahl auf. Die Gegenrichtung steht jeweils darunter. Gespeicherte Linien stehen unter „Neue Fahrt“ bereit und sind im Datenexport enthalten. Bestehende Strecken und gespeicherte Fahrpläne bleiben erhalten.

Die Karte ist schematisch. Haltefolgen stammen aus den offiziellen EVAG-Haltestellenfahrplänen; Fahrzeiten bleiben einstellbare Simulationswerte. Recherche, Gültigkeit und Quellen: [NETWORK_SOURCES.md](NETWORK_SOURCES.md). Zusätzlicher Browsertest ohne npm-Abhängigkeiten: `node tests/network.cjs` (standardmäßig Microsoft Edge unter Windows, alternativ `FAHRPLAN_BROWSER_PATH`).

## Installation und Signierung

App-Kennung: de.meistererwat.fahrplanmanager.audio. Anzeigename: Fahrplan Manager Audio. Mindestversion Android 8.0, Ziel- und Compile-SDK 35, Versioncode 627.

Da der frühere private Signierschlüssel nicht verfügbar ist, verwendet diese Fassung eine eigene App-Kennung und einen neu angelegten Schlüssel. Sie kann neben den bisherigen Fassungen installiert werden. Bestehende Daten über Einstellungen → Daten exportieren/importieren übertragen. Künftige Updates dieser Audio-Fassung müssen denselben neuen Schlüssel verwenden.

Der Release-Schlüssel wurde am 19.10.2026 auf ausdrücklichen Wunsch neu angelegt, weil kein bisheriger Schlüssel mehr vorhanden war. Schlüssel und Passwortdatei liegen ausschließlich im ignorierten `signing`-Ordner. Dieser Ordner muss privat gesichert und für spätere Updates unverändert aufbewahrt werden. Eine externe Sicherung wurde hier nicht angelegt. APKs mit früheren Signaturen lassen sich nicht direkt durch diese APK aktualisieren; Daten vorher exportieren. Ohne ausdrückliche Anweisung keinen neuen Schlüssel für ein Update erzeugen.

### Updates aus der Android-App

Unter **Einstellungen → App-Updates** lassen sich automatische Prüfungen abschalten, manuelle Prüfungen auslösen und verfügbare Updates herunterladen. Die App prüft beim Start nach 1,5 Sekunden, höchstens einmal in 24 Stunden; es gibt keinen Hintergrunddienst und keine Push-Nachrichten. Ein erkannter Hinweis bleibt über App-Neustarts erhalten. Ohne Internet bleiben alle Simulationsfunktionen verfügbar. Die PWA verwendet weiterhin ihren Service Worker und bietet keine Android-APK-Updates an.

Updatequelle ist das öffentliche GitHub-Repository `bratkartoffeln/tram-planer`, Endpunkt `https://api.github.com/repos/bratkartoffeln/tram-planer/releases/latest`. Repository und Endpunkt stehen in `updates.js` beziehungsweise `AppUpdateBridge.java`. Es werden ausschließlich stabile Releases mit Tags wie `6.2.8` oder `v6.2.8` berücksichtigt; die drei Versionsbestandteile werden numerisch verglichen. Private Repositories benötigen eine andere öffentlich erreichbare Updatequelle; Zugangsdaten werden nicht in der App hinterlegt.

Für jede neue Veröffentlichung die mit dem bestehenden Release-Schlüssel signierte APK als **Release-Anhang** mit dem Namen `FahrplanManager_v<VERSION>_release.apk` hochladen. Auch der bestehende manuelle Buildname `FahrplanManager_Tablet_v<VERSION>.apk` wird erkannt. Debug-, Parallel-, Entwurfs- und Vorabversionen werden nicht als Update angeboten. Ein Git-Tag oder ein Actions-Artefakt allein reicht nicht. Bei einer neueren Version ohne passende APK erscheint ein Hinweis, bis der Anhang veröffentlicht und erneut geprüft wurde. Releases werden separat aus der signierten APK erstellt.

**Update herunterladen** öffnet die HTTPS-Adresse des Release-Anhangs im Systembrowser. Nach dem Download die APK öffnen und die Android-Installation bestätigen; gegebenenfalls für den Browser „Unbekannte Apps installieren“ erlauben. Gleiche App-Kennung, gleicher Signierschlüssel und höherer `versionCode` sind für ein reguläres Update nötig. Die neue Prüfung steht erst ab Installation dieser Fassung zur Verfügung. Android-Gerätetest mit einem späteren signierten Release bleibt erforderlich. Technischer Hintergrund: [GitHub-Releases-API](https://docs.github.com/en/rest/releases/releases), [Android-Installationsfreigabe](https://developer.android.com/reference/android/content/pm/PackageManager#canRequestPackageInstalls()).

### Fahrerpult- und Soundbündel erweitern

Die Quelldaten liegen unter `app/src/main/assets/vehicle-bundles/<Typkennung>/bundle.json`; Typkennungen entsprechen `vehicle-types.json`. `default/bundle.json` enthält das bisherige Pult samt Sounds. Jedes Modell erbt zunächst mit `"extends": "default"`. Gemeinsame Familienbündel können als zusätzliche Ordner angelegt und über `extends` von mehreren Varianten verwendet werden. Vererbungszyklen und unbekannte Eltern werden beim Synchronisieren abgewiesen.

Objekte werden feldweise vererbt, Listen vollständig ersetzt. Nur Abweichungen müssen im Modellbündel stehen. Beispiel für `tramlink/bundle.json`, nachdem die referenzierten Medien abgelegt wurden:

```json
{
  "id": "tramlink",
  "extends": "default",
  "cab": {
    "image": "vehicle-bundles/tramlink/panel.webp",
    "buttons": {"doors": {"x": 166, "y": 475}},
    "colors": {"console": "#30383f"}
  },
  "sounds": {
    "effects": {"door_open": "vehicle-bundles/tramlink/audio/door_open.mp3"},
    "mechanical": {"down": "vehicle-bundles/tramlink/audio/button_down.mp3"}
  },
  "credits": ["Quellen, Urheber, Lizenzen und Bearbeitungen der eigenen Medien angeben."]
}
```

Alle Medienpfade gelten relativ zum Asset-Stamm. MP3-Dateien für neue Modelle liegen unter `vehicle-bundles/<Typkennung>/audio/`; Dateinamen verwenden kleine Buchstaben, Ziffern, Bindestriche und Unterstriche. `cab.width` und `cab.height` beschreiben die Bildkoordinaten. `buttons`, `indicators`, `headings`, `spares`, `screws`, `rotaries` und `rotarySprites` steuern die Positionen und Bildausschnitte des bestehenden Pult-Renderers. Die Grafik sollte passende Taster, Schrauben und Drehschalter enthalten. Leere Listen können Reserveelemente, Schrauben oder Überschriften ausblenden; maximal zwei Reserve-Drehschalter werden unterstützt. Fahrfunktionen und Türsperren bleiben im gemeinsamen Renderer.

Effektschlüssel: `door_open`, `door_close`, `emergency`, `traffic`, `passenger`, `finish`, `back`. Mechanische Schlüssel: `down`, `up`, `latch`, `rotary`, `screw`, `ratchet`; deren Standardwerte `synth:<Schlüssel>` verwenden die bisherigen Synthesen. Mechanik spielt unabhängig von Funktionssounds und Ansagen. Haltestellenansagen bleiben streckenabhängig. Eigene Quellenangaben erscheinen über „Bild- & Tonquellen“; bei Übernahme von Standardbestandteilen deren Quellen in IMAGE_SOURCES.md und AUDIO_SOURCES.md beibehalten.

Die Zuordnung verwendet zuerst `vehicleTypeId` der Fahrt, für ältere Pläne die verknüpfte Fahrzeug-ID beziehungsweise das Kürzel. Ein unbekannter oder fehlender Typ nutzt `default`; gelöschte Fahrzeuge behalten über die gespeicherte Typkennung ihr Bündel. Neue Typen sowohl im Fahrzeugkatalog als auch mit eigenem Bündel anlegen.

Nach Änderungen `python tools/sync-assets.py` ausführen. Das prüft Vererbung, Medienpfade, Positionsdaten und Soundzuordnungen, erzeugt `vehicle-bundles-data.js` sowie `vehicle-bundle-assets.json` und spiegelt die Assets nach `web-pwa`. Die generierten Dateien nicht von Hand ändern. Der Service Worker nimmt alle Bündelmanifeste und deren Medien automatisch in den Offline-Cache auf; bei Veröffentlichungen die Cacheversion erhöhen. Android erhält die Bündeldaten ohne Netzwerkabruf über ein lokales Script. Prüfungen: `node tests/vehicle-bundles.cjs`, `node tests/updates.cjs`, `python tests/vehicle-bundles.py` und `node tests/door-motion.cjs`.

## Bauen und prüfen

Alle ausgelieferten Audioeffekte liegen als MP3 vor; auch Wiedergabepfade, Android-Prüfung und Offline-Cache nutzen MP3. Der Zurück-Taster verwendet den nachträglich im Projekt bereitgestellten Back-to-the-Future-Jingle. `node tools/preview.cjs` startet die lokale PWA-Vorschau unter `http://127.0.0.1:4173`. Nach einem Debug-Build liegt die installierbare Test-APK unter `app/build/outputs/apk/debug/app-debug.apk`.

Nach `:app:assembleRelease` signiert `powershell -File tools/sign-release.ps1` die APK mit dem vorhandenen privaten Schlüssel aus `signing`. Ergebnis: `app/build/outputs/apk/release/FahrplanManager_v6.2.7_release.apk`. Das Skript erzeugt niemals selbst einen neuen Schlüssel.

Android Studio oder JDK 17, Gradle 8.7 und Android SDK 35 verwenden. gradle :app:assembleRelease erzeugt eine unsignierte Release-APK; anschließend mit dem separat verwahrten Schlüssel signieren. gradle :app:assembleDebug erzeugt eine Test-APK. GitHub Actions prüft den Debug-Build ohne private Release-Schlüssel.

Nach Änderungen an den Assets: python tools/sync-assets.py. tests/behavior.cjs mit Node und Playwright ausführen; FAHRPLAN_BROWSER_PATH bezeichnet die Chromium-Datei, NODE_PATH gegebenenfalls die installierten Node-Pakete. tests/results/ enthält die historischen Prüfberichte aus dem ursprünglichen 6.2.0-Archiv, aktuelle Läufe schreiben nach build/qa-integration/.

Die App enthält fiktive Fahrpläne und keine Echtzeitdaten. Der Android-Gerätetest bleibt zusätzlich zur Kompilierung und den Browserprüfungen erforderlich, insbesondere für Medienlautstärke und Dateiauswahl.

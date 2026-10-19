# Fahrplan Manager Audio – Version 6.2.1

Offlinefähige Android-App und PWA zur Fahrplansimulation. © MeisterErwat.

## Neu

Der Fahrermodus hat ein Fahrpult mit runden farbigen Tastern, Symbolen, Beschriftungen und Türstatusleuchte. Türen, Notfall, Stau, Fahrgastanzeige, Fahrtende und Zurück besitzen eigene offline verfügbare Sounds. Die Effekte lassen sich direkt am Pult stummschalten. Quellen und Bearbeitungen stehen unter „Tonquellen“ und in AUDIO_SOURCES.md. Browserprüfung mit Tondecodierung, Türlogik und mobiler Ansicht: `node tests/cockpit.cjs`.

98 gelieferte MP3-Aufnahmen ersetzen die alten vollständigen Sprachdateien. Alle aufgenommenen Haltestellen werden aus „Nächste Haltestelle“ und dem Namen zusammengesetzt. Hauptbahnhof und Fischmarkt/Rathaus erhalten die passenden englischen Ansagen; Hauptbahnhof und Anger die Umsteigehinweise; Linie 5 vom Anger zum Hauptbahnhof zusätzlich den neu erzeugten Dong-Dong-Ding und die Endstellenansage. Auch ungenutzte Aufnahmen sind enthalten und offline verfügbar. Reihenfolgen, Zuordnungen und Originaldateinamen: AUDIO_SOURCES.md und audio/catalog.json.

Die Ansage beginnt weiterhin eine Sekunde nach dem Haltewechsel. Schnelles Weiterschalten, Zurückschalten, Ansichtwechsel, Notfall, Fahrtende und Hintergrundwechsel beenden die gesamte Wiedergabekette.

## Linien & Netz

Die Karte nutzt die ganze Inhaltsbreite und zeichnet auch die Verbindungen der Rückrichtungen. Der am 19.10.2026 gültige Baufahrplan für die Linien 1 und 6 sowie das Regelnetz sind umschaltbar. Eigene Linien können ein Streckenkürzel erhalten; ohne Eingabe wird etwa „L7“ angezeigt. Die interne Kennung erscheint nicht als Kürzel.

Der neue Menüpunkt „Linien & Netz“ bietet zwölf EVAG-Vorlagen (Linien 1–6 in beiden Richtungen) und einen grafischen Editor. Vorhandene Haltestellen anklicken oder eigene Halte auf der Karte hinzufügen, Punkte verschieben, Reihenfolge, Name, Farbe und Fahrzeiten ändern und als eigene Linie speichern. Gespeicherte Linien stehen unter „Neue Fahrt“ bereit und sind im Datenexport enthalten. Bestehende Strecken und gespeicherte Fahrpläne bleiben erhalten.

Die Karte ist schematisch. Haltefolgen stammen aus den offiziellen EVAG-Haltestellenfahrplänen; Fahrzeiten bleiben einstellbare Simulationswerte. Recherche, Gültigkeit und Quellen: [NETWORK_SOURCES.md](NETWORK_SOURCES.md). Zusätzlicher Browsertest ohne npm-Abhängigkeiten: `node tests/network.cjs` (standardmäßig Microsoft Edge unter Windows, alternativ `FAHRPLAN_BROWSER_PATH`).

## Installation und Signierung

App-Kennung: de.meistererwat.fahrplanmanager.audio. Anzeigename: Fahrplan Manager Audio. Mindestversion Android 8.0, Ziel- und Compile-SDK 35, Versioncode 621.

Da der frühere private Signierschlüssel nicht verfügbar ist, verwendet diese Fassung eine eigene App-Kennung und einen neu angelegten Schlüssel. Sie kann neben den bisherigen Fassungen installiert werden. Bestehende Daten über Einstellungen → Daten exportieren/importieren übertragen. Künftige Updates dieser Audio-Fassung müssen denselben neuen Schlüssel verwenden.

Der Release-Schlüssel wurde am 19.10.2026 auf ausdrücklichen Wunsch neu angelegt, weil kein bisheriger Schlüssel mehr vorhanden war. Schlüssel und Passwortdatei liegen ausschließlich im ignorierten `signing`-Ordner. Dieser Ordner muss privat gesichert und für spätere Updates unverändert aufbewahrt werden. Eine externe Sicherung wurde hier nicht angelegt. APKs mit früheren Signaturen lassen sich nicht direkt durch diese APK aktualisieren; Daten vorher exportieren. Ohne ausdrückliche Anweisung keinen neuen Schlüssel für ein Update erzeugen.

## Bauen und prüfen

Alle ausgelieferten Audioeffekte liegen als MP3 vor; auch Wiedergabepfade, Android-Prüfung und Offline-Cache nutzen MP3. Der Zurück-Taster verwendet den nachträglich im Projekt bereitgestellten Back-to-the-Future-Jingle. `node tools/preview.cjs` startet die lokale PWA-Vorschau unter `http://127.0.0.1:4173`. Nach einem Debug-Build liegt die installierbare Test-APK unter `app/build/outputs/apk/debug/app-debug.apk`.

Nach `:app:assembleRelease` signiert `powershell -File tools/sign-release.ps1` die APK mit dem vorhandenen privaten Schlüssel aus `signing`. Ergebnis: `app/build/outputs/apk/release/FahrplanManager_v6.2.1_release.apk`. Das Skript erzeugt niemals selbst einen neuen Schlüssel.

Android Studio oder JDK 17, Gradle 8.7 und Android SDK 35 verwenden. gradle :app:assembleRelease erzeugt eine unsignierte Release-APK; anschließend mit dem separat verwahrten Schlüssel signieren. gradle :app:assembleDebug erzeugt eine Test-APK. GitHub Actions prüft den Debug-Build ohne private Release-Schlüssel.

Nach Änderungen an den Assets: python tools/sync-assets.py. tests/behavior.cjs mit Node und Playwright ausführen; FAHRPLAN_BROWSER_PATH bezeichnet die Chromium-Datei, NODE_PATH gegebenenfalls die installierten Node-Pakete. tests/results/ enthält die historischen Prüfberichte aus dem ursprünglichen 6.2.0-Archiv, aktuelle Läufe schreiben nach build/qa-integration/.

Die App enthält fiktive Fahrpläne und keine Echtzeitdaten. Der Android-Gerätetest bleibt zusätzlich zur Kompilierung und den Browserprüfungen erforderlich, insbesondere für Medienlautstärke und Dateiauswahl.

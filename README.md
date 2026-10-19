# Fahrplan Manager Audio – Version 6.2.1

Offlinefähige Android-App und PWA zur Fahrplansimulation. © MeisterErwat.

## Neu

98 gelieferte MP3-Aufnahmen ersetzen die alten vollständigen Sprachdateien. Alle aufgenommenen Haltestellen werden aus „Nächste Haltestelle“ und dem Namen zusammengesetzt. Hauptbahnhof und Anger erhalten die gewünschten englischen Ansagen und Umsteigehinweise; Linie 5 vom Anger zum Hauptbahnhof zusätzlich den neu erzeugten Dong-Dong-Ding und die Endstellenansage. Auch ungenutzte Aufnahmen sind enthalten und offline verfügbar. Reihenfolgen, Zuordnungen und Originaldateinamen: AUDIO_SOURCES.md und audio/catalog.json.

Die Ansage beginnt weiterhin eine Sekunde nach dem Haltewechsel. Schnelles Weiterschalten, Zurückschalten, Ansichtwechsel, Notfall, Fahrtende und Hintergrundwechsel beenden die gesamte Wiedergabekette.

## Installation und Signierung

App-Kennung: de.meistererwat.fahrplanmanager.audio. Anzeigename: Fahrplan Manager Audio. Mindestversion Android 8.0, Ziel- und Compile-SDK 35, Versioncode 621.

Da der frühere private Signierschlüssel nicht verfügbar ist, verwendet diese Fassung eine eigene App-Kennung und einen neuen dauerhaft gesicherten Schlüssel. Sie kann neben den bisherigen Fassungen installiert werden. Bestehende Daten über Einstellungen → Daten exportieren/importieren übertragen. Künftige Updates dieser Audio-Fassung müssen denselben neuen Schlüssel verwenden.

Private Signierdateien und Passwörter liegen ausschließlich im ignorierten signing-Ordner und in einer separaten privaten Sicherung außerhalb des Repositories. Das Sicherungsarchiv gehört nicht in GitHub. Ohne vorhandene Signierdaten keinen neuen Schlüssel für ein Update erzeugen.

## Bauen und prüfen

Android Studio oder JDK 17, Gradle 8.7 und Android SDK 35 verwenden. gradle :app:assembleRelease erzeugt eine unsignierte Release-APK; anschließend mit dem separat verwahrten Schlüssel signieren. gradle :app:assembleDebug erzeugt eine Test-APK. GitHub Actions prüft den Debug-Build ohne private Release-Schlüssel.

Nach Änderungen an den Assets: python tools/sync-assets.py. tests/behavior.cjs mit Node und Playwright ausführen; FAHRPLAN_BROWSER_PATH bezeichnet die Chromium-Datei, NODE_PATH gegebenenfalls die installierten Node-Pakete. tests/results/ enthält die historischen Prüfberichte aus dem ursprünglichen 6.2.0-Archiv, aktuelle Läufe schreiben nach build/qa-integration/.

Die App enthält fiktive Fahrpläne und keine Echtzeitdaten. Der Android-Gerätetest bleibt zusätzlich zur Kompilierung und den Browserprüfungen erforderlich, insbesondere für Medienlautstärke und Dateiauswahl.

# Fahrplan Manager Tablet – Version 6.2.0

**© MeisterErwat** · Offlinefähige Android-App und Web-/PWA-Fassung.

## Neu in 6.2.0

- Nach einem gültigen Druck auf **Nächster Halt** erscheint sofort der neue Haltestellenname. **Eine Sekunde später** beginnt ein eigener Ding-Dong-Gong; anschließend folgt „Nächste Haltestelle, {Haltestellenname}.“
- Alle 15 unterschiedlichen Haltestellennamen der vorhandenen Strecken liegen als vollständige Aufnahmen einer fest ausgewählten deutschen Frauenstimme bei. Die Aufnahmen funktionieren ohne Internet und ohne nachzuladende Android-Stimme. Herkunft, Erzeugung und Recherche nach Erfurter Originalklängen stehen in `AUDIO_SOURCES.md`.
- Beim schnellen Weiterschalten ersetzt die zuletzt gewählte Haltestelle eine ausstehende oder laufende Ansage. Zurückschalten, Verlassen des Fahrermodus, Notfall, Fahrtende und Wechsel der App in den Hintergrund beenden die Ansage.
- Beim Erstellen eines Fahrplans wird **keine Abfahrtszeit** mehr verlangt. Die Vorschau zeigt Minuten ab Start. Unter **Fahrt vorbereiten → Abfahrt** muss für die konkrete Fahrt eine Uhrzeit eingetragen werden; bis dahin ist **Fahrt starten** gesperrt. Nach der Eingabe aktualisiert sich die Ankunftszeit jedes Halts.
- Persönliche sechsstellige Codes, ihre Erzeugung, Anzeige und Kopierfunktionen sind entfernt. Eigene Streckenbezeichnungen wie W2D und L3D bleiben erhalten.
- Versionsbadge, Systemstatus und Einstellungen zeigen denselben Wert aus `APP_VERSION`.
- Die Menüeinträge beginnen 48 Pixel weiter unten. Durchgehende Streckenlinien verbinden die Haltestellenkreise auch bei umgebrochenen Namen, in Fahrplan und Fahrermodus.
- Im Dunkelmodus ist das Uhrsymbol des Abfahrtsfeldes weiß. Die Android-Systemuhr und Statussymbole bleiben in beiden App-Designs weiß auf dunklem Hintergrund.
- Android-Dateiauswahl für JSON-Import und -Export ist eingebaut.

## Installation und vorhandene Daten

Es gibt zwei APK-Varianten mit identischem Funktionsumfang:

| Datei | App-Paket | Verwendung |
| --- | --- | --- |
| `FahrplanManager_Tablet_v6.2.0_Parallel.apk` | `de.meistererwat.fahrplanmanager.preview` | Empfohlene Testinstallation neben der bisherigen 6.1.5. Erscheint als **Fahrplan Manager 6.2**. |
| `FahrplanManager_Tablet_v6.2.0.apk` | `de.meistererwat.fahrplanmanager` | Reguläres App-Paket für eine Neuinstallation oder Updates, die bereits denselben neuen Signierschlüssel verwenden. |

Die vorherige APK 6.1.5 wurde mit einem anderen Schlüssel signiert. Dieser private Schlüssel war nicht im Ausgangsprojekt enthalten. Android akzeptiert die reguläre neue APK deshalb nicht als direktes Update über die alte Installation. **Die bisherige App für den Test nicht deinstallieren:** Eine Deinstallation würde deren lokale Daten entfernen. Die Parallelfassung hat einen eigenen Datenbereich; sie liest die Daten der bisherigen Installation nicht automatisch.

Vorhandene JSON-Sicherungen lassen sich unter **Einstellungen → Daten importieren** übernehmen. Der Export der alten 6.1.5-APK wird nicht als funktionierend vorausgesetzt; deren nativer WebView enthielt dafür noch keine Dateischnittstelle. Die neue Version öffnet beim Sichern und Laden die Android-Dateiauswahl.

Beide neuen APKs sind mit demselben beständigen Schlüssel signiert. Für spätere kompatible Updates werden genau dieser Schlüssel und sein Passwort benötigt. Die privaten Signierdateien sind nicht Bestandteil des Quellpakets; sie werden ausschließlich separat und privat aufbewahrt. Ein solches Archiv gehört nicht in ein öffentliches Quellprojekt.

## Umgang mit gespeicherten Fahrplänen

Der vorhandene lokale Speicherschlüssel bleibt `fm_tablet_state_v1`. Beim Laden oder Importieren werden alte Fahrpläne auf interne, nicht angezeigte IDs umgestellt. Verknüpfungen zu aktiven Fahrten und Notfall-Fortsetzungen bleiben erhalten. Die alte feste Abfahrtszeit wird aus der Fahrplanvorlage entfernt; eine schon laufende Fahrt behält ihre Abfahrtszeit, ihren Beginn, Fortschritt und Pausenzustand.

Eine neu vorbereitete Abfahrt wird dem zur Systemzeit nächstliegenden Kalendertag zugeordnet (bis zu zwölf Stunden davor oder danach). So wird beispielsweise um 00:05 eine Abfahrt um 23:59 als sechs Minuten zurückliegend behandelt. Nach dem Start bleibt der Zeitbezug fest, auch beim Überschreiten von Mitternacht.

## Projekt bearbeiten

| Datei/Ordner | Inhalt |
| --- | --- |
| `app/src/main/assets/index.html` | Oberfläche und CSS |
| `app/src/main/assets/app.js` | Fahrpläne, Fahrten, Migration, Einstellungen |
| `app/src/main/assets/announcements.js` | Ansagetiming und Audiowiedergabe der PWA |
| `app/src/main/assets/audio/` | Gong, Sprachaufnahmen und Zuordnung der Namen |
| `app/src/main/java/de/meistererwat/fahrplanmanager/MainActivity.java` | Android-Systemleisten, Audio, Sprachausgabe als Reserve und Dateiauswahl |
| `web-pwa/` | Vollständige Webfassung einschließlich Offline-Audio |
| `scripts/generate_audio.py` | Erneute Erzeugung von Gong und Aufnahmen |
| `tools/sync-assets.py` | Audiozuordnung erstellen und Android-/Webdateien synchronisieren |
| `tools/build-apk.sh` | APK-Bau mit offiziellen Android-SDK-Werkzeugen |
| `tests/behavior.cjs` | Automatisierte Funktionsprüfung der Oberfläche |

Nach Änderungen an Oberfläche oder Audio ausführen:

```bash
python3 tools/sync-assets.py
```

Die WAV-Dateien werden im APK unkomprimiert abgelegt, damit Android sie direkt über einen Asset-Dateideskriptor abspielen kann. Für importierte, abweichend benannte Haltestellen verwendet die Android-App bei Bedarf eine installierte deutsche Offline-Systemstimme. Nur dieser Reserveweg hängt von den auf dem Gerät verfügbaren Stimmen ab.

## APK selbst bauen

### Android Studio

Den entpackten Ordner `FahrplanManagerAndroid` öffnen, Gradle synchronisieren und die angeforderten SDK-Komponenten installieren. Das Projekt verwendet JDK 17, Android SDK 35, Mindestversion Android 8.0 (API 26) und Ziel-API 35. Unter **Build → Build Bundle(s) / APK(s) → Build APK(s)** entsteht eine Debug-APK. Eine mit einem anderen Debug- oder Releaseschlüssel gebaute APK kann die bereitgestellten APKs nicht direkt aktualisieren.

### Eigenständiges Buildskript

Benötigt werden Bash, Python 3, Java/JDK 17, `rg`, Android SDK Platform 35 und Build-Tools 35.0.0. Der SDK-Ordner und die Signierdaten gehören nicht in das Quellarchiv.

```bash
export FPM_ANDROID_SDK='/pfad/zum/android-sdk'
python3 tools/sync-assets.py
bash tools/build-apk.sh release
bash tools/build-apk.sh parallel
```

Für kompatible Folgeversionen das separate Signierarchiv so wiederherstellen, dass `signing/fahrplan-manager.p12` und `signing/storepass.txt` im Projekt vorhanden sind; alternativ `FPM_SIGNING_DIR` auf diesen Ordner setzen. Ohne vorhandenen Schlüssel erzeugt das Skript einen neuen, der bestehende Installationen nicht aktualisieren kann.

Die APKs liegen danach in `app/build/outputs/apk/release/`. Das Skript prüft die Paketversion, kompiliert Java und DEX, richtet das APK aus und verifiziert die Signaturen.

## Prüfung und Grenzen

Die Änderung wird durch Funktionsprüfungen in Chromium, visuelle und geometrische Prüfungen in Tablet-/Mobilgrößen, vollständiges Dekodieren aller WAV-Dateien und die Android-Compiler-/APK-Signaturprüfung abgesichert. Ein Lauf auf einem echten Android-Gerät oder Emulator ist in dieser Arbeitsumgebung nicht möglich. Medienlautstärke, Ausgabegerät sowie das Verhalten des jeweiligen Android-Dateidialogs sollten bei der Installation auf dem Tablet geprüft werden.

Fahrplan Manager Tablet ist eine fiktive Simulation und nicht offiziell mit EVAG oder SWE verbunden. Die App enthält keine Echtzeitdaten und die neuen Ansagen sind keine Originalaufnahmen der EVAG.

# Projektregeln für KI-Agenten

Diese Datei liegt bewusst im Projektstamm: Hier finden Codex und kompatible KI-Agenten die projektweiten Anweisungen. Für GitHub Copilot in VS Code verweist `.github/copilot-instructions.md` auf diese zentrale Regeldatei.

## Branch und Projektversion vor Quellcodeänderungen

- Vor jeder Quellcodeänderung den aktiven Git-Branch und die aktuelle Projektversion (`versionName` und `versionCode`) in `app/build.gradle` prüfen.
- Ist der aktive Branch `main`, vor der ersten Quellcodeänderung einen neuen Versionsbranch erstellen und auf diesen wechseln. Dafür die Patch-Versionsnummer um eins erhöhen: beispielsweise von `6.2.1` auf `6.2.2`. Der Branch heißt exakt wie die neue Version, ohne Präfix.
- Einen bereits vorhandenen gleichnamigen lokalen oder Remote-Branch nicht überschreiben oder löschen. In diesem Fall die nächste freie höhere Patch-Version als Branch und Projektversion verwenden.
- Auf dem neuen Branch `versionName` in `app/build.gradle` und `APP_VERSION` in `app/src/main/assets/app.js` auf dieselbe neue Versionsnummer setzen. Den Android-`versionCode` gegenüber der bisherigen Version erhöhen, damit Updates installierbar bleiben.
- Die Android-Assets mit `python tools/sync-assets.py` nach `web-pwa` spiegeln. Android-App und PWA müssen dieselbe Version und dieselben Assets verwenden. Den Offline-Cache in `service-worker.js` für die neue Fassung aktualisieren und betroffene Versionsannahmen in Prüfungen, Build-/Signierwerkzeugen und Ausgabedateinamen konsistent nachführen.
- Aktuelle Versionsangaben in der Projektdokumentation entsprechend aktualisieren; historische Versionsangaben, Quellenstände und Changelog-Einträge beibehalten.
- Erst danach die angeforderten Quellcodeänderungen durchführen. Quellcode nicht direkt auf `main` ändern.
- Ist bereits ein anderer Branch aktiv, verursacht diese Regel allein keinen weiteren Branchwechsel oder Versionssprung.
- Reine Dokumentations- oder Regeländerungen ohne Quellcodeänderung erfordern keinen Versionsbranch und keinen Versionssprung.

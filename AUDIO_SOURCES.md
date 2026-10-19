# Haltestellenansagen und Gong

## Inhalt und Wiedergabe

Die APK enthält einen eigenen Ding-Dong sowie vollständige deutsche Ansagen
für alle 15 unterschiedlichen Haltestellennamen der mitgelieferten Strecken.
Jede Ansage lautet „Nächste Haltestelle, {Haltestellenname}.“ Der zusammengesetzte
Name „Fischmarkt/Rathaus“ wird mit einer kurzen Sprechpause zwischen den Namen
ausgegeben. Die JSON-Zuordnung behält den angezeigten Namen einschließlich
Schrägstrich unverändert bei.

- Gong: `app/src/main/assets/audio/ding-dong.wav`, 1,10 Sekunden,
  PCM-WAV, 44.100 Hz, 16 Bit, Mono.
- Ansagen: `app/src/main/assets/audio/stops/*.wav`, PCM-WAV,
  16.000 Hz, 16 Bit, Mono.
- Namenszuordnung: `app/src/main/assets/audio/announcements.json`.

Die fertigen Audiodateien werden mit der App ausgeliefert. Für ihre Wiedergabe
sind weder eine Internetverbindung noch nachinstallierte Android-Stimmen nötig.
Die Audioassets enthalten synthetische Sprache; es handelt sich nicht um
Originalaufnahmen der EVAG oder um eine nachgeahmte EVAG-Sprecherin.

## Eigener Gong

Der Zweitongong wurde für diese Anwendung durch additive Klangsynthese erzeugt.
Zwei sanft ausklingende Töne mit 1.046,50 und 783,99 Hz, leisen Obertönen sowie
kurzen Ein- und Ausblendungen ergeben das Ding-Dong. Dafür wurden keine fremden
Aufnahmen, Samples oder Ausschnitte verwendet.

Die Suche nach einem eindeutig freigegebenen Erfurter Originalgong ergab keinen
unmittelbar nutzbaren Kandidaten. Ein gefundenes Community-Paket nennt zwar
einen Erfurter/Dresdner Gong, weist aber „Alle Rechte vorbehalten“ aus:

- <https://reboot.omsi-webdisk.de/file/11559-ansagen-gerolstein-mit-hall-effekt/>
- Geprüfte offizielle Downloads: <https://www.evag-erfurt.de/evag/home/service/downloads>

## Deutsche Frauenstimme

Die Haltestellenansagen wurden lokal mit **Piper 1.8.0** und der fest ausgewählten
Stimme **Kerstin / de_DE-kerstin-low** erzeugt. Es gibt bei diesen mitgelieferten
Dateien keinen Wechsel auf eine zufällig vorhandene Systemstimme. Der Urheber
beschreibt Kerstins Datensatz ausdrücklich als Aufnahme einer deutschen
Muttersprachlerin und veröffentlicht ihn unter **CC0 1.0**. Die Model Card nennt
ebenfalls CC0 für den Datensatz; das Modell wird im Piper-Voices-Repository mit
MIT-Lizenz bereitgestellt.

- Datensatz und Angabe „Gender: female“:
  <https://github.com/rhasspy/dataset-voice-kerstin>
- Datensatzlizenz:
  <https://github.com/rhasspy/dataset-voice-kerstin/blob/master/LICENSE>
- Model Card:
  <https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/de/de_DE/kerstin/low/MODEL_CARD>
- Piper-Voices-Repository:
  <https://huggingface.co/rhasspy/piper-voices>
- Piper und Python-Schnittstelle:
  <https://github.com/OHF-Voice/piper1-gpl>
  <https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/API_PYTHON.md>

Piper steht unter GPL-3.0-or-later und wird ausschließlich bei der Erstellung der
Audiodateien eingesetzt. Weder die Piper-Laufzeit noch ONNX Runtime oder das
63-MB-Stimmmodell werden in die APK eingebaut.

## Erstellung und Prüfung

Das Skript `scripts/generate_audio.py` liest die Haltestellennamen aus den
Streckendefinitionen in `app.js` und erzeugt Gong, Ansagen und JSON-Zuordnung.
Es prüft die SHA-256-Summen des auf `v1.0.0` festgelegten Stimmmodells und seiner
Konfiguration. Die Stimme spricht mit moderat reduziertem Tempo
(`length_scale=1.04`). Unicode-Normalisierung der Lautschrift erhält insbesondere
das deutsche „ch“ mit der verwendeten Piper-/eSpeak-Version.

Die Audio-Prüfung umfasst die fehlerfreie vollständige Dekodierung mit FFmpeg,
Dateiformat, Länge, nicht stumme Signalpegel und eine Reserve vor Übersteuerung.
Die Ergebnisse und Dateiprüfsummen stehen in
`app/src/main/assets/audio/audio-validation.json`.

Beispiel zum erneuten Erzeugen in einer separaten Python-Umgebung:

```sh
python -m pip install piper-tts==1.8.0
python scripts/generate_audio.py --model-dir /tmp/fahrplan_audio_models --download-model
```

FFmpeg muss installiert sein. Erneute Synthese kann abhängig von Laufzeit und
Plattform geringfügig andere Wellenformen erzeugen. Die für die App mitgelieferten
WAV-Dateien sind die geprüften Ausgabeassets.

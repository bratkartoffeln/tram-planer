#!/usr/bin/env bash
# Standalone build with official Android SDK 35; no Gradle download required.
set -euo pipefail
umask 077

PROJECT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
SDK=${FPM_ANDROID_SDK:-${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}}
if [[ -z "$SDK" ]]; then
    echo "Set FPM_ANDROID_SDK to an Android SDK containing platforms/android-35 and build-tools/35.0.0." >&2
    exit 1
fi
BUILD_TOOLS="$SDK/build-tools/35.0.0"
PLATFORM="$SDK/platforms/android-35/android.jar"
for tool in aapt2 d8 apksigner zipalign; do
    [[ -x "$BUILD_TOOLS/$tool" ]] || { echo "Missing SDK tool: $BUILD_TOOLS/$tool" >&2; exit 1; }
done
[[ -f "$PLATFORM" ]] || { echo "Missing Android SDK Platform 35." >&2; exit 1; }

MODE=${1:-release}
PACKAGE=de.meistererwat.fahrplanmanager.audio
LABEL='Fahrplan Manager Audio'
SUFFIX=''
if [[ "$MODE" == parallel ]]; then
    PACKAGE=de.meistererwat.fahrplanmanager.preview
    LABEL='Fahrplan Manager 6.2'
    SUFFIX='_Parallel'
elif [[ "$MODE" != release && "$MODE" != compile-only ]]; then
    echo "Usage: $0 [release|parallel|compile-only]" >&2
    exit 1
fi

BUILD="$PROJECT/app/build/manual${SUFFIX}"
mkdir -p "$BUILD/classes" "$BUILD/dex" "$BUILD/generated" "$PROJECT/app/build/outputs/apk/release"
# Remove only this build's intermediate products, never project/user data.
python3 - "$BUILD" <<'PY'
from pathlib import Path
import shutil,sys
root=Path(sys.argv[1])
for name in ('classes','dex','generated'):
    shutil.rmtree(root/name)
    (root/name).mkdir()
PY
mapfile -t JAVA_SOURCES < <(rg --files "$PROJECT/app/src/main/java" -g '*.java' | LC_ALL=C sort)
if command -v javac >/dev/null 2>&1; then
    JAVAC=(javac)
else
    JAVAC=(java -m jdk.compiler/com.sun.tools.javac.Main)
fi
"${JAVAC[@]}" -encoding UTF-8 -source 8 -target 8 -g:none \
    -bootclasspath "$PLATFORM:$BUILD_TOOLS/core-lambda-stubs.jar" \
    -d "$BUILD/classes" "${JAVA_SOURCES[@]}"
python3 - "$BUILD" <<'PY'
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import sys
root=Path(sys.argv[1])
with ZipFile(root/'classes.jar','w',ZIP_DEFLATED) as archive:
    for p in sorted((root/'classes').rglob('*.class')):
        archive.write(p,p.relative_to(root/'classes').as_posix())
PY
"$BUILD_TOOLS/d8" --release --min-api 26 --lib "$PLATFORM" --output "$BUILD/dex" "$BUILD/classes.jar"
if [[ "$MODE" == compile-only ]]; then
    echo "Java and DEX compilation successful: $BUILD/dex/classes.dex"
    exit 0
fi

python3 - "$PROJECT" "$BUILD" "$PACKAGE" "$LABEL" <<'PY'
from pathlib import Path
import re,sys,xml.etree.ElementTree as E
root,out,package,label=Path(sys.argv[1]),Path(sys.argv[2]),sys.argv[3],sys.argv[4]
ns='http://schemas.android.com/apk/res/android'
E.register_namespace('android',ns)
manifest=E.parse(root/'app/src/main/AndroidManifest.xml')
manifest.getroot().set('package',package)
app=manifest.getroot().find('application')
app.set('{'+ns+'}label',label)
for activity in app.findall('activity'):
    name=activity.get('{'+ns+'}name')
    if name and name.startswith('.'):
        activity.set('{'+ns+'}name','de.meistererwat.fahrplanmanager'+name)
manifest.write(out/'AndroidManifest.xml',encoding='utf-8',xml_declaration=True)
assets=root/'app/src/main/assets'
app_source='\n'.join(p.read_text(encoding='utf-8') for p in (assets/'index.html',assets/'app.js') if p.is_file())
if not re.search(r"APP_VERSION\s*=\s*['\"]6\.2\.4['\"]",app_source):
    raise SystemExit('App HTML version must be 6.2.4 before a release build.')
if not (root/'app/src/main/assets/audio/chimes/ding_dong.mp3').is_file():
    raise SystemExit('Missing embedded announcement audio/chimes/ding_dong.mp3.')
PY
"$BUILD_TOOLS/aapt2" compile --dir "$PROJECT/app/src/main/res" -o "$BUILD/resources.zip"
"$BUILD_TOOLS/aapt2" link -o "$BUILD/resources.apk" \
    --manifest "$BUILD/AndroidManifest.xml" -I "$PLATFORM" \
    --min-sdk-version 26 --target-sdk-version 35 --version-code 624 --version-name 6.2.4 \
    --java "$BUILD/generated" -A "$PROJECT/app/src/main/assets" \
    -0 wav -0 mp3 -0 ogg "$BUILD/resources.zip"
python3 - "$BUILD" <<'PY'
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import shutil,sys
root=Path(sys.argv[1])
shutil.copyfile(root/'resources.apk',root/'unsigned.apk')
with ZipFile(root/'unsigned.apk','a',ZIP_DEFLATED) as archive:
    for p in sorted((root/'dex').glob('*.dex')):
        archive.write(p,p.name)
PY
"$BUILD_TOOLS/zipalign" -f -p 4 "$BUILD/unsigned.apk" "$BUILD/aligned.apk"

SIGNING=${FPM_SIGNING_DIR:-"$PROJECT/signing"}
mkdir -p "$SIGNING"
chmod 700 "$SIGNING"
if [[ ! -f "$SIGNING/fahrplan-manager.p12" ]]; then
    if [[ -e "$SIGNING/storepass.txt" ]]; then
        echo "Signing password exists without a key. Restore the matching key or choose a new FPM_SIGNING_DIR." >&2
        exit 1
    fi
    python3 - "$SIGNING/storepass.txt" <<'PY'
import secrets,sys
from pathlib import Path
p=Path(sys.argv[1]);p.write_text(secrets.token_urlsafe(36)+'\n',encoding='utf-8');p.chmod(0o600)
PY
    keytool -genkeypair -keystore "$SIGNING/fahrplan-manager.p12" -storetype PKCS12 \
        -storepass:file "$SIGNING/storepass.txt" -keypass:file "$SIGNING/storepass.txt" \
        -alias fahrplan-manager -keyalg RSA -keysize 3072 -sigalg SHA256withRSA \
        -validity 10000 -dname 'CN=Fahrplan Manager, OU=Private Android Build'
fi
[[ -f "$SIGNING/storepass.txt" ]] || { echo "Missing signing password file." >&2; exit 1; }
chmod 600 "$SIGNING/fahrplan-manager.p12" "$SIGNING/storepass.txt"
APK="$PROJECT/app/build/outputs/apk/release/FahrplanManager_Tablet_v6.2.4${SUFFIX}.apk"
"$BUILD_TOOLS/apksigner" sign --ks "$SIGNING/fahrplan-manager.p12" --ks-key-alias fahrplan-manager \
    --ks-pass "file:$SIGNING/storepass.txt" \
    --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
    --out "$APK" "$BUILD/aligned.apk"
"$BUILD_TOOLS/zipalign" -c -p 4 "$APK" >/dev/null
"$BUILD_TOOLS/apksigner" verify --verbose --print-certs "$APK"
"$BUILD_TOOLS/aapt2" dump badging "$APK"
sha256sum "$APK"
echo "APK ready: $APK"

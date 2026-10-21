param(
    [string]$SigningDirectory = $env:FPM_SIGNING_DIR
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (!$SigningDirectory) { $SigningDirectory = Join-Path $projectRoot 'signing' }
$keyFile = Join-Path $SigningDirectory 'fahrplan-manager.p12'
$passwordFile = Join-Path $SigningDirectory 'storepass.txt'
if (!(Test-Path -LiteralPath $keyFile) -or !(Test-Path -LiteralPath $passwordFile)) {
    throw 'Restore the existing release key and password file before signing. This script never generates a new key.'
}
$toolchain = Join-Path $projectRoot 'build/toolchain'
$javaRoot = $env:JAVA_HOME
if (!$javaRoot) { $javaRoot = (Get-ChildItem -LiteralPath (Join-Path $toolchain 'jdk') -Directory | Select-Object -First 1).FullName }
$sdkRoot = $env:ANDROID_HOME
if (!$sdkRoot) { $sdkRoot = Join-Path $toolchain 'android-sdk' }
$java = Join-Path $javaRoot 'bin/java.exe'
$buildTools = Join-Path $sdkRoot 'build-tools/35.0.0'
$outputDirectory = Join-Path $projectRoot 'app/build/outputs/apk/release'
$unsigned = Join-Path $outputDirectory 'app-release-unsigned.apk'
$signed = Join-Path $outputDirectory 'FahrplanManager_v6.2.11_release.apk'
if (!(Test-Path -LiteralPath $unsigned)) { throw 'Run :app:assembleRelease first.' }
& (Join-Path $buildTools 'zipalign.exe') -c -p 4 $unsigned
if ($LASTEXITCODE -ne 0) { throw 'Unsigned APK is not correctly aligned.' }
& $java -jar (Join-Path $buildTools 'lib/apksigner.jar') sign --ks $keyFile --ks-key-alias fahrplan-manager --ks-pass ('file:' + $passwordFile) --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out $signed $unsigned
if ($LASTEXITCODE -ne 0) { throw 'Release signing failed.' }
& $java -jar (Join-Path $buildTools 'lib/apksigner.jar') verify --verbose --print-certs $signed
if ($LASTEXITCODE -ne 0) { throw 'Release signature verification failed.' }
& (Join-Path $buildTools 'zipalign.exe') -c -p 4 $signed
if ($LASTEXITCODE -ne 0) { throw 'Signed APK alignment check failed.' }
Write-Output ('Signed release APK: ' + $signed)

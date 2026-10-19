package de.meistererwat.fahrplanmanager;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.json.JSONObject;
import org.json.JSONArray;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Offline WebView host. Native bridges are exposed only to packaged app content. */
public class MainActivity extends Activity {
    private static final String APP_URL = "file:///android_asset/index.html";
    private static final int BAR_COLOR = Color.rgb(16, 42, 54);
    private static final int CREATE_BACKUP = 101;
    private static final int OPEN_BACKUP = 102;
    private static final int MAX_BACKUP_BYTES = 8 * 1024 * 1024;
    private static final AudioAttributes ANNOUNCEMENT_ATTRIBUTES = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final ExecutorService fileExecutor = Executors.newSingleThreadExecutor();
    private WebView webView;
    private boolean resumed;
    private boolean destroyed;
    private MediaPlayer player;
    private AudioManager audioManager;
    private AudioFocusRequest focusRequest;
    private TextToSpeech textToSpeech;
    private boolean ttsInitialized;
    private boolean ttsReady;
    private long announcementGeneration;
    private String pendingSpeech;
    private long pendingSpeechGeneration;
    private Runnable speechTimeout;
    private byte[] pendingBackup;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        audioManager = (AudioManager) getSystemService(AUDIO_SERVICE);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BAR_COLOR);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(237, 242, 244));
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets keyboard = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, keyboard.bottom));
                return insets;
            });
            root.requestApplyInsets();
        }
        applySystemBarStyle();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true); // Needed for a user-selected JSON backup.
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        webView.setWebViewClient(new LocalContentClient());
        webView.setWebChromeClient(new BackupChromeClient());
        webView.addJavascriptInterface(new AnnouncementBridge(), "AndroidAnnouncements");
        webView.addJavascriptInterface(new BackupBridge(), "AndroidBackup");
        webView.loadUrl(APP_URL);
        initializeSpeech();

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    @SuppressWarnings("deprecation")
    private void applySystemBarStyle() {
        getWindow().setStatusBarColor(BAR_COLOR);
        getWindow().setNavigationBarColor(BAR_COLOR);
        int flags = getWindow().getDecorView().getSystemUiVisibility();
        flags &= ~(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        getWindow().getDecorView().setSystemUiVisibility(flags);
        if (Build.VERSION.SDK_INT >= 29) {
            getWindow().setStatusBarContrastEnforced(false);
            getWindow().setNavigationBarContrastEnforced(false);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsAppearance(0,
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                                | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
            }
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applySystemBarStyle();
    }

    private boolean isTrustedPage() {
        if (destroyed || webView == null) return false;
        String url = webView.getUrl();
        return APP_URL.equals(url) || (url != null && url.startsWith(APP_URL + "#"));
    }

    private static boolean isPackagedResource(Uri uri) {
        if (!"file".equals(uri.getScheme()) || (uri.getHost() != null && !uri.getHost().isEmpty())) return false;
        String path = uri.getPath();
        if (path == null || !path.startsWith("/android_asset/")) return false;
        for (String part : path.split("/")) if ("..".equals(part)) return false;
        return true;
    }

    private final class LocalContentClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            return !APP_URL.equals(url) && !url.startsWith(APP_URL + "#");
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return !APP_URL.equals(url) && !url.startsWith(APP_URL + "#");
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            if (isPackagedResource(request.getUrl())) return null;
            return new WebResourceResponse("text/plain", "UTF-8", 403, "Local content only",
                    java.util.Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
        }
    }

    public final class AnnouncementBridge {
        @JavascriptInterface
        public void playSequence(String stopName, String json) {
            mainHandler.post(() -> {
                if (!resumed || !isTrustedPage()) return;
                stopAnnouncement();
                final long generation = announcementGeneration;
                try {
                    if (json == null || json.length() > 8192) throw new IllegalArgumentException();
                    JSONArray paths = new JSONArray(json);
                    if (paths.length() < 1 || paths.length() > 12) throw new IllegalArgumentException();
                    for (int i = 0; i < paths.length(); i++) {
                        if (!paths.getString(i).matches("audio/(stops|phrases|chimes)/[a-z0-9_-]+\\.mp3")) {
                            throw new IllegalArgumentException();
                        }
                    }
                    if (!requestAnnouncementFocus()) {
                        failAnnouncement("Die Ansage konnte keinen Audiozugriff erhalten.", generation);
                        return;
                    }
                    playSequenceItem(paths, 0, generation);
                } catch (Exception exception) {
                    failAnnouncement("Die Ansage enthält eine ungültige Audiodatei.", generation);
                }
            });
        }

        @JavascriptInterface
        public void play(String stopName, String assetPath) {
            mainHandler.post(() -> {
                if (resumed && isTrustedPage()) playAnnouncement(stopName, assetPath);
            });
        }

        @JavascriptInterface
        public void stop() {
            mainHandler.post(MainActivity.this::stopAnnouncement);
        }
    }

    private void playSequenceItem(JSONArray paths, int index, long generation) {
        if (generation != announcementGeneration || !resumed || destroyed) return;
        if (index >= paths.length()) {
            finishAnnouncement(generation);
            return;
        }
        playAsset(paths.optString(index), generation,
                () -> playSequenceItem(paths, index + 1, generation),
                () -> failAnnouncement("Eine Audiodatei der Ansage konnte nicht abgespielt werden.", generation));
    }

    private void playAnnouncement(String rawStopName, String assetPath) {
        stopAnnouncement();
        final long generation = announcementGeneration;
        String stopName = rawStopName == null ? "" : rawStopName.replaceAll("[\\p{Cntrl}]", " ").trim();
        if (stopName.isEmpty() || stopName.length() > 200) {
            failAnnouncement("Die Haltestelle kann nicht angesagt werden: ungültiger Name.", generation);
            return;
        }
        String path = assetPath == null ? "" : assetPath;
        if (!path.isEmpty() && !path.matches("audio/stops/[a-z0-9_-]+\\.(wav|mp3|ogg)")) {
            failAnnouncement("Die Audiodatei der Haltestelle ist ungültig.", generation);
            return;
        }
        if (!requestAnnouncementFocus()) {
            failAnnouncement("Die Ansage konnte keinen Audiozugriff erhalten. Bitte nach dem laufenden Anruf erneut versuchen.", generation);
            return;
        }
        playAsset("audio/chimes/ding_dong.mp3", generation, () -> {
            if (path.isEmpty()) {
                speakStop(stopName, generation);
            } else {
                playAsset(path, generation, () -> finishAnnouncement(generation),
                        () -> speakStop(stopName, generation));
            }
        }, () -> failAnnouncement("Der Ding-Dong-Ton konnte nicht abgespielt werden.", generation));
    }

    private boolean requestAnnouncementFocus() {
        if (audioManager == null) return false;
        final long focusGeneration = announcementGeneration;
        focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(ANNOUNCEMENT_ATTRIBUTES)
                .setAcceptsDelayedFocusGain(false)
                .setWillPauseWhenDucked(true)
                .setOnAudioFocusChangeListener(change -> {
                    if (change < 0 && focusGeneration == announcementGeneration) stopAnnouncement();
                }, mainHandler)
                .build();
        return audioManager.requestAudioFocus(focusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    private void playAsset(String path, long generation, Runnable completion, Runnable failure) {
        if (generation != announcementGeneration || !resumed || destroyed) return;
        releasePlayer();
        MediaPlayer next = new MediaPlayer();
        player = next;
        try (AssetFileDescriptor descriptor = getAssets().openFd(path)) {
            next.setAudioAttributes(ANNOUNCEMENT_ATTRIBUTES);
            next.setDataSource(descriptor.getFileDescriptor(), descriptor.getStartOffset(), descriptor.getLength());
            next.setOnPreparedListener(prepared -> {
                if (generation == announcementGeneration && player == prepared && resumed) {
                    try {
                        prepared.start();
                    } catch (IllegalStateException exception) {
                        releasePlayer();
                        failure.run();
                    }
                }
            });
            next.setOnCompletionListener(completed -> {
                if (generation != announcementGeneration || player != completed) return;
                releasePlayer();
                completion.run();
            });
            next.setOnErrorListener((failed, what, extra) -> {
                if (generation == announcementGeneration && player == failed) {
                    releasePlayer();
                    failure.run();
                }
                return true;
            });
            next.prepareAsync();
        } catch (IOException | RuntimeException exception) {
            releasePlayer();
            if (generation == announcementGeneration) failure.run();
        }
    }

    private void initializeSpeech() {
        try {
            textToSpeech = new TextToSpeech(this, result -> mainHandler.post(() -> {
                if (destroyed) return;
                ttsInitialized = true;
                if (result == TextToSpeech.SUCCESS && textToSpeech != null) {
                    try {
                        textToSpeech.setAudioAttributes(ANNOUNCEMENT_ATTRIBUTES);
                        textToSpeech.setSpeechRate(0.92f);
                        textToSpeech.setPitch(1.04f);
                        Voice selected = chooseOfflineGermanVoice(textToSpeech.getVoices(), textToSpeech.getDefaultVoice());
                        if (selected != null) ttsReady = textToSpeech.setVoice(selected) == TextToSpeech.SUCCESS;
                        textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                            @Override public void onStart(String id) { }
                            @Override public void onDone(String id) {
                                mainHandler.post(() -> {
                                    if (id.equals(utteranceId(announcementGeneration))) finishAnnouncement(announcementGeneration);
                                });
                            }
                            @Override public void onError(String id) {
                                mainHandler.post(() -> {
                                    if (id.equals(utteranceId(announcementGeneration))) {
                                        failAnnouncement("Die deutsche Offline-Sprachausgabe konnte die Haltestelle nicht vorlesen.", announcementGeneration);
                                    }
                                });
                            }
                        });
                    } catch (RuntimeException exception) {
                        ttsReady = false;
                    }
                }
                if (pendingSpeech != null && pendingSpeechGeneration == announcementGeneration) {
                    String stop = pendingSpeech;
                    clearPendingSpeech();
                    speakStop(stop, announcementGeneration);
                }
            }));
        } catch (RuntimeException exception) {
            ttsInitialized = true;
            ttsReady = false;
        }
    }

    /** Android has no standardized gender field; prefer known female voice names when available. */
    private static Voice chooseOfflineGermanVoice(Set<Voice> voices, Voice defaultVoice) {
        if (voices == null) return null;
        Voice best = null;
        int bestScore = Integer.MIN_VALUE;
        for (Voice voice : voices) {
            if (voice.isNetworkConnectionRequired() || !"de".equals(voice.getLocale().getLanguage())) continue;
            if (voice.getFeatures() != null && voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
            String name = voice.getName().toLowerCase(Locale.ROOT);
            int score = voice.getQuality() - voice.getLatency();
            if ("DE".equals(voice.getLocale().getCountry())) score += 2000;
            if (voice.equals(defaultVoice)) score += 1000;
            if (name.contains("female") || name.contains("frau") || name.contains("katja")
                    || name.contains("hedda") || name.contains("vicki") || name.contains("anna")) score += 10000;
            if (score > bestScore || (score == bestScore && (best == null || voice.getName().compareTo(best.getName()) < 0))) {
                best = voice;
                bestScore = score;
            }
        }
        return best;
    }

    private String utteranceId(long generation) {
        return "stop-" + generation;
    }

    private void speakStop(String stopName, long generation) {
        if (generation != announcementGeneration || !resumed || destroyed) return;
        if (!ttsInitialized) {
            clearPendingSpeech();
            pendingSpeech = stopName;
            pendingSpeechGeneration = generation;
            speechTimeout = () -> {
                if (generation == announcementGeneration && pendingSpeech != null) {
                    failAnnouncement("Die Android-Sprachausgabe ist noch nicht bereit. Bitte die Offline-Stimme in den Android-Einstellungen prüfen.", generation);
                }
            };
            mainHandler.postDelayed(speechTimeout, 8000);
            return;
        }
        if (!ttsReady || textToSpeech == null) {
            failAnnouncement("Keine deutsche Offline-Stimme installiert. Bitte in den Android-Einstellungen eine deutsche Sprachausgabe herunterladen.", generation);
            return;
        }
        try {
            Bundle params = new Bundle();
            params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1.0f);
            int result = textToSpeech.speak("Nächste Haltestelle " + stopName,
                    TextToSpeech.QUEUE_FLUSH, params, utteranceId(generation));
            if (result != TextToSpeech.SUCCESS) failAnnouncement("Die Haltestellenansage konnte nicht gestartet werden.", generation);
        } catch (RuntimeException exception) {
            failAnnouncement("Die deutsche Offline-Sprachausgabe ist nicht verfügbar.", generation);
        }
    }

    private void clearPendingSpeech() {
        pendingSpeech = null;
        if (speechTimeout != null) mainHandler.removeCallbacks(speechTimeout);
        speechTimeout = null;
    }

    private void releasePlayer() {
        MediaPlayer old = player;
        player = null;
        if (old != null) {
            old.setOnPreparedListener(null);
            old.setOnCompletionListener(null);
            old.setOnErrorListener(null);
            old.release();
        }
    }

    private void stopAnnouncement() {
        announcementGeneration++;
        clearPendingSpeech();
        releasePlayer();
        if (textToSpeech != null) {
            try { textToSpeech.stop(); } catch (RuntimeException ignored) { }
        }
        if (audioManager != null && focusRequest != null) {
            audioManager.abandonAudioFocusRequest(focusRequest);
            focusRequest = null;
        }
    }

    private void finishAnnouncement(long generation) {
        if (generation == announcementGeneration) stopAnnouncement();
    }

    private void failAnnouncement(String message, long generation) {
        if (generation != announcementGeneration) return;
        stopAnnouncement();
        notifyJavaScript("onAnnouncementError", false, message, false);
    }

    public final class BackupBridge {
        @JavascriptInterface
        public void save(String json) {
            mainHandler.post(() -> {
                if (!resumed || !isTrustedPage()) return;
                if (pendingBackup != null || fileCallback != null) {
                    notifyJavaScript("onNativeBackupResult", false, "Bitte zuerst die bereits geöffnete Dateiauswahl schließen.", true);
                    return;
                }
                try {
                    if (json == null || json.length() > MAX_BACKUP_BYTES) throw new IllegalArgumentException();
                    byte[] data = json.getBytes(StandardCharsets.UTF_8);
                    if (data.length > MAX_BACKUP_BYTES) throw new IllegalArgumentException();
                    JSONObject backup = new JSONObject(json);
                    if (backup.optJSONArray("plans") == null || backup.optJSONArray("history") == null
                            || backup.optJSONObject("settings") == null) throw new IllegalArgumentException();
                    pendingBackup = data;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
                            .addCategory(Intent.CATEGORY_OPENABLE)
                            .setType("application/json")
                            .putExtra(Intent.EXTRA_TITLE, "FahrplanManager-Backup-"
                                    + new SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).format(new Date()) + ".json");
                    startActivityForResult(intent, CREATE_BACKUP);
                } catch (ActivityNotFoundException exception) {
                    pendingBackup = null;
                    notifyJavaScript("onNativeBackupResult", false, "Auf diesem Gerät fehlt die Android-Dateiauswahl.", true);
                } catch (Exception exception) {
                    pendingBackup = null;
                    notifyJavaScript("onNativeBackupResult", false, "Die Sicherung ist ungültig oder größer als 8 MB.", true);
                }
            });
        }
    }

    private final class BackupChromeClient extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (!isTrustedPage() || pendingBackup != null) {
                callback.onReceiveValue(null);
                return true;
            }
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;
            try {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT)
                        .addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("*/*")
                        .putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/json", "text/plain", "application/octet-stream"})
                        .putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);
                startActivityForResult(intent, OPEN_BACKUP);
            } catch (ActivityNotFoundException exception) {
                fileCallback.onReceiveValue(null);
                fileCallback = null;
                notifyJavaScript("onNativeBackupResult", false, "Auf diesem Gerät fehlt die Android-Dateiauswahl.", true);
            }
            return true;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Uri uri = resultCode == RESULT_OK && data != null ? data.getData() : null;
        if (uri != null && !"content".equals(uri.getScheme())) uri = null;
        if (requestCode == OPEN_BACKUP) {
            ValueCallback<Uri[]> callback = fileCallback;
            fileCallback = null;
            if (callback != null) callback.onReceiveValue(uri == null ? null : new Uri[]{uri});
        } else if (requestCode == CREATE_BACKUP) {
            byte[] backup = pendingBackup;
            pendingBackup = null;
            if (uri == null || backup == null) {
                notifyJavaScript("onNativeBackupResult", false, "Sicherung abgebrochen.", true);
                return;
            }
            final Uri destination = uri;
            fileExecutor.execute(() -> {
                try (OutputStream output = getContentResolver().openOutputStream(destination, "wt")) {
                    if (output == null) throw new IOException("No output stream");
                    output.write(backup);
                    output.flush();
                    mainHandler.post(() -> notifyJavaScript("onNativeBackupResult", true, "Sicherung gespeichert.", true));
                } catch (IOException | RuntimeException exception) {
                    mainHandler.post(() -> notifyJavaScript("onNativeBackupResult", false, "Die Sicherung konnte nicht gespeichert werden.", true));
                }
            });
        }
    }

    private void notifyJavaScript(String function, boolean success, String message, boolean includeSuccess) {
        if (destroyed) return;
        if (!isTrustedPage()) {
            Toast.makeText(this, message, Toast.LENGTH_LONG).show();
            return;
        }
        String arguments = (includeSuccess ? success + "," : "") + JSONObject.quote(message);
        String script = "(function(){if(typeof window." + function + "==='function'){window."
                + function + "(" + arguments + ");return true;}return false;})()";
        webView.evaluateJavascript(script, handled -> {
            if (!"true".equals(handled) && !destroyed) Toast.makeText(this, message, Toast.LENGTH_LONG).show();
        });
    }

    private void handleBack() {
        if (webView != null && isTrustedPage()) {
            webView.evaluateJavascript("if (window.appBack) { window.appBack(); }", null);
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (webView != null) handleBack();
        else super.onBackPressed();
    }

    @Override
    protected void onResume() {
        super.onResume();
        resumed = true;
        if (webView != null) webView.onResume();
        applySystemBarStyle();
    }

    @Override
    protected void onPause() {
        resumed = false;
        stopAnnouncement();
        if (webView != null) {
            webView.evaluateJavascript("if(window.onNativeAnnouncementPause){window.onNativeAnnouncementPause();}", null);
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        destroyed = true;
        stopAnnouncement();
        if (textToSpeech != null) {
            textToSpeech.shutdown();
            textToSpeech = null;
        }
        if (fileCallback != null) {
            fileCallback.onReceiveValue(null);
            fileCallback = null;
        }
        pendingBackup = null;
        fileExecutor.shutdown();
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidAnnouncements");
            webView.removeJavascriptInterface("AndroidBackup");
            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}

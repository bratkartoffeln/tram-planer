package de.meistererwat.fahrplanmanager;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.BooleanSupplier;
import javax.net.ssl.HttpsURLConnection;

/** Checks only public release metadata; APK downloads are handed to the browser. */
public final class AppUpdateBridge {
    private static final String REPOSITORY = "bratkartoffeln/tram-planer";
    private final Activity activity;
    private final WebView webView;
    private final BooleanSupplier trusted;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private boolean checking;
    private volatile boolean closed;

    public AppUpdateBridge(Activity activity, WebView webView, BooleanSupplier trusted) {
        this.activity = activity;
        this.webView = webView;
        this.trusted = trusted;
    }

    @JavascriptInterface
    public void check(int requestId) {
        main.post(() -> {
            if (closed || !trusted.getAsBoolean() || checking) return;
            checking = true;
            executor.execute(() -> {
                String data = "null", error = "null";
                HttpsURLConnection connection = null;
                try {
                    connection = (HttpsURLConnection) new URL("https://api.github.com/repos/" + REPOSITORY + "/releases/latest").openConnection();
                    connection.setConnectTimeout(8000);
                    connection.setReadTimeout(8000);
                    connection.setInstanceFollowRedirects(false);
                    connection.setUseCaches(false);
                    connection.setRequestProperty("Accept", "application/vnd.github+json");
                    connection.setRequestProperty("User-Agent", "Fahrplan-Manager-Android");
                    connection.setRequestProperty("X-GitHub-Api-Version", "2022-11-28");
                    int status = connection.getResponseCode();
                    if (status == 200) {
                        try (InputStream input = connection.getInputStream();
                             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                            byte[] buffer = new byte[8192];
                            int count;
                            long deadline = android.os.SystemClock.elapsedRealtime() + 10000;
                            while ((count = input.read(buffer)) != -1) {
                                if (output.size() + count > 2 * 1024 * 1024
                                        || android.os.SystemClock.elapsedRealtime() > deadline) throw new java.io.IOException();
                                output.write(buffer, 0, count);
                            }
                            data = new JSONObject(new String(output.toByteArray(), StandardCharsets.UTF_8)).toString();
                        }
                    } else if (status == 404) {
                        error = JSONObject.quote("Keine öffentliche Release-Version gefunden. Das Repository muss öffentlich erreichbar sein und ein Release enthalten.");
                    } else {
                        error = JSONObject.quote(status == 403 || status == 429
                                ? "GitHub begrenzt gerade die Updateprüfungen. Bitte später erneut versuchen."
                                : "Die Updatequelle ist momentan nicht erreichbar (HTTP " + status + ").");
                    }
                } catch (Exception exception) {
                    error = JSONObject.quote("Updates konnten nicht geprüft werden. Bitte Internetverbindung prüfen und später erneut versuchen.");
                } finally {
                    if (connection != null) connection.disconnect();
                }
                final String result = data, message = error;
                main.post(() -> {
                    checking = false;
                    if (!closed && trusted.getAsBoolean()) webView.evaluateJavascript(
                            "window.onNativeAppUpdate&&window.onNativeAppUpdate(" + requestId + "," + result + "," + message + ")", null);
                });
            });
        });
    }

    @JavascriptInterface
    public void openDownload(String value) {
        main.post(() -> {
            if (closed || !trusted.getAsBoolean() || value == null) return;
            Uri uri = Uri.parse(value);
            String path = uri.getEncodedPath();
            if (!"https".equals(uri.getScheme()) || !"github.com".equals(uri.getHost())
                    || uri.getUserInfo() != null || uri.getPort() != -1 || uri.getQuery() != null || uri.getFragment() != null
                    || path == null || !path.startsWith("/" + REPOSITORY + "/releases/download/")
                    || !path.endsWith(".apk") || path.contains("..") || path.contains("%")) return;
            try {
                activity.startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE));
            } catch (RuntimeException exception) {
                Toast.makeText(activity, "Kein Browser zum Öffnen des APK-Downloads verfügbar.", Toast.LENGTH_LONG).show();
            }
        });
    }

    public void close() { closed = true; executor.shutdownNow(); }
}

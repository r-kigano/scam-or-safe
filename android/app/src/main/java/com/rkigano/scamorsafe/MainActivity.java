package com.rkigano.scamorsafe;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ask the game what to do with the Android Back button/gesture instead of closing the
        // app straight away. app.js defines window.scamOrSafeBack(): it returns true when it
        // handled Back (e.g. asked "Leave this game?"), false when the app should close.
        // This calls the game directly rather than relying on WebView page history, which
        // some devices' WebViews don't report reliably.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView == null) {
                    closeApp(this);
                    return;
                }
                webView.evaluateJavascript(
                    "(typeof window.scamOrSafeBack === 'function') ? window.scamOrSafeBack() : false",
                    result -> {
                        if (!"true".equals(result)) closeApp(this);
                    }
                );
            }
        });
    }

    // Let the system handle Back (exit, or background the app on Android 12+), then re-arm
    // the callback so Back is still routed to the game when the player returns.
    private void closeApp(OnBackPressedCallback callback) {
        callback.setEnabled(false);
        getOnBackPressedDispatcher().onBackPressed();
        callback.setEnabled(true);
    }
}

package com.yair.crumbdefense;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // v0.7.3: draw edge-to-edge on every Android version (Android 15+ forces it at targetSdk 36), so env(safe-area-inset-*) is reliable and the
        // game's bottom tab bar can sit above the gesture / 3-button navigation bar (Capacitor's SystemBars plugin forwards the insets to the WebView).
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        // Android back button -> in-game back (pause battle / return to map) via WebView history.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (bridge != null && bridge.getWebView() != null && bridge.getWebView().canGoBack()) {
                    bridge.getWebView().goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                }
            }
        });
    }
}

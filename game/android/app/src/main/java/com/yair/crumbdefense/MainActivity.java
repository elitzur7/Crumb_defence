package com.yair.crumbdefense;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // v0.7.3: draw edge-to-edge on every Android version (Android 15+ forces it at targetSdk 36), so env(safe-area-inset-*) is reliable and the
        // game's bottom tab bar can sit above the gesture / 3-button navigation bar (Capacitor's SystemBars plugin forwards the insets to the WebView).
        // v0.7.4.1: this MUST run AFTER super.onCreate(). BridgeActivity.onCreate is where the activity leaves the launch theme
        // (AppTheme.NoActionBarLaunch) for AppTheme.NoActionBar; EdgeToEdge.enable() touches the window's decor view, and calling it before that
        // built the decor under the launch theme, so the native ActionBar ("Crumb Defense" strip) survived on top of the game.
        EdgeToEdge.enable(this);
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

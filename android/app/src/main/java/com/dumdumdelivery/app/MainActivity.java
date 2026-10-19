package com.dumdumdelivery.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        // Allow the system to fit windows naturally so content starts below the status bar
        WindowCompat.setDecorFitsSystemWindows(window, true);

        // Set matching cream color for status bar (#FFF7E8)
        int creamColor = Color.parseColor("#FFF7E8");
        window.setStatusBarColor(creamColor);

        // Ensure status bar icons (clock, battery, notifications) are dark and clearly readable
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(true);
            insetsController.show(androidx.core.view.WindowInsetsCompat.Type.statusBars());
        }
    }
}


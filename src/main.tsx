import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

// Configure native status bar edge-to-edge overlay with visible icons
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true }).catch((err) => {
    console.warn("Failed to set overlaysWebView:", err);
  });
  StatusBar.show().catch((err) => {
    console.warn("Failed to show status bar:", err);
  });
  StatusBar.setStyle({ style: Style.Light }).catch((err) => {
    console.warn("Failed to set status bar style:", err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Capacitor } from '@capacitor/core'
import { StatusBar } from '@capacitor/status-bar'

import { Style } from '@capacitor/status-bar'

// Configure native status bar: normal visible bar with matching cream background and dark icons
if (Capacitor.isNativePlatform()) {
  StatusBar.show().catch((err) => {
    console.warn("Failed to show status bar:", err);
  });
  StatusBar.setOverlaysWebView({ overlay: false }).catch((err) => {
    console.warn("Failed to set overlaysWebView:", err);
  });
  StatusBar.setBackgroundColor({ color: '#FFF7E8' }).catch((err) => {
    console.warn("Failed to set status bar background color:", err);
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


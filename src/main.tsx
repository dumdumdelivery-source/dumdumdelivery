import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Capacitor } from '@capacitor/core'
import { StatusBar } from '@capacitor/status-bar'

// Configure native status bar: hidden with overlay so content extends to the top edge
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true }).catch((err) => {
    console.warn("Failed to set overlaysWebView:", err);
  });
  StatusBar.hide().catch((err) => {
    console.warn("Failed to hide status bar:", err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


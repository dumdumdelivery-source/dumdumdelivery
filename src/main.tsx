import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Capacitor } from '@capacitor/core'
import { StatusBar } from '@capacitor/status-bar'

// Hide status bar when running as an app
if (Capacitor.isNativePlatform()) {
  StatusBar.hide().catch((err) => {
    console.warn("Failed to hide status bar:", err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


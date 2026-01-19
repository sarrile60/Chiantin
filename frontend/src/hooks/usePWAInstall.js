// PWA Install Hook - Handles the beforeinstallprompt event
// With safe error handling for restricted browser environments (Telegram, Facebook, etc.)
import { useState, useEffect, useCallback } from 'react';

// Detect if running in a restricted in-app browser
const isRestrictedBrowser = () => {
  try {
    const ua = navigator.userAgent || '';
    const isInAppBrowser = 
      ua.includes('FBAN') || // Facebook App
      ua.includes('FBAV') || // Facebook App
      ua.includes('Instagram') ||
      ua.includes('Twitter') ||
      ua.includes('TelegramBot') ||
      ua.includes('Telegram') ||
      ua.includes('Line/') ||
      ua.includes('KAKAOTALK') ||
      ua.includes('WhatsApp') ||
      ua.includes('Snapchat') ||
      // Check for generic WebView indicators
      (ua.includes('wv') && ua.includes('Android')) ||
      // Telegram WebView detection
      (window.TelegramWebviewProxy !== undefined) ||
      (window.Telegram !== undefined);
    
    return isInAppBrowser;
  } catch (e) {
    // If we can't check, assume it's safe
    return false;
  }
};

// Check if PWA features are supported
const isPWASupported = () => {
  try {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'addEventListener' in window &&
      !isRestrictedBrowser()
    );
  } catch (e) {
    return false;
  }
};

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Skip if PWA is not supported in this environment
    if (!isPWASupported()) {
      console.log('[PWA] PWA features not supported in this browser environment');
      return;
    }

    try {
      // Check if already installed (standalone mode)
      let isStandalone = false;
      
      try {
        isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      } catch (e) {
        // matchMedia might not be available
      }
      
      try {
        isStandalone = isStandalone || window.navigator.standalone === true;
      } catch (e) {
        // navigator.standalone might not be available
      }
      
      try {
        isStandalone = isStandalone || document.referrer.includes('android-app://');
      } catch (e) {
        // document.referrer might throw
      }
      
      if (isStandalone) {
        setIsInstalled(true);
        setIsInstallable(false);
        console.log('[PWA] App is running in standalone mode');
        return;
      }

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e) => {
        try {
          console.log('[PWA] beforeinstallprompt event fired');
          // Prevent Chrome's mini-infobar from appearing
          e.preventDefault();
          // Store the event for later use
          setDeferredPrompt(e);
          setIsInstallable(true);
        } catch (err) {
          console.warn('[PWA] Error handling beforeinstallprompt:', err);
        }
      };

      // Listen for app installed event
      const handleAppInstalled = () => {
        try {
          console.log('[PWA] App was installed');
          setDeferredPrompt(null);
          setIsInstallable(false);
          setIsInstalled(true);
        } catch (err) {
          console.warn('[PWA] Error handling appinstalled:', err);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        try {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          window.removeEventListener('appinstalled', handleAppInstalled);
        } catch (err) {
          // Ignore cleanup errors
        }
      };
    } catch (err) {
      console.warn('[PWA] Error initializing PWA install hook:', err);
    }
  }, []);

  const installApp = useCallback(async () => {
    try {
      if (!deferredPrompt) {
        console.log('[PWA] No deferred prompt available');
        return { outcome: 'unavailable' };
      }

      console.log('[PWA] Showing install prompt');
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      
      return { outcome };
    } catch (err) {
      console.warn('[PWA] Error during install:', err);
      return { outcome: 'error', error: err.message };
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installApp
  };
}

export default usePWAInstall;

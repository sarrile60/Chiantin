// PWA Install Hook - Handles the beforeinstallprompt event
import { useState, useEffect, useCallback } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone === true
      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
      setIsInstallable(false);
      console.log('[PWA] App is running in standalone mode');
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] beforeinstallprompt event fired');
      // Prevent Chrome's mini-infobar from appearing
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed');
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
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
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installApp
  };
}

export default usePWAInstall;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/AppContext';

const CONSENT_KEY = 'chiantin_cookie_consent';

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('open-cookie-settings', handler);
    return () => window.removeEventListener('open-cookie-settings', handler);
  }, []);

  const saveConsent = (type) => {
    const consent = {
      type,
      preferences: type === 'all' 
        ? { necessary: true, functional: true, analytics: true }
        : type === 'reject'
        ? { necessary: true, functional: false, analytics: false }
        : preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999]" data-testid="cookie-consent-banner">
      <div className="bg-white border-t border-gray-200 shadow-2xl shadow-gray-900/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {!showPreferences ? (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">{t('cookieConsentTitle')}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('cookieConsentDesc')}{' '}
                  <a href="/cookies" className="text-red-600 hover:underline">{t('cookiePolicy')}</a>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="cookie-manage-btn"
                >
                  {t('cookieManage')}
                </button>
                <button
                  onClick={() => saveConsent('reject')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="cookie-reject-btn"
                >
                  {t('cookieRejectNonEssential')}
                </button>
                <button
                  onClick={() => saveConsent('all')}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                  data-testid="cookie-accept-btn"
                >
                  {t('cookieAcceptAll')}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900">{t('cookiePreferencesTitle')}</p>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t('back')}
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('cookieNecessaryTitle')}</p>
                    <p className="text-xs text-gray-500">{t('cookieNecessaryDesc')}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded">{t('cookieAlwaysActive')}</span>
                </div>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('cookieFunctionalTitle')}</p>
                    <p className="text-xs text-gray-500">{t('cookieFunctionalDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    data-testid="cookie-functional-toggle"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('cookieAnalyticsTitle')}</p>
                    <p className="text-xs text-gray-500">{t('cookieAnalyticsDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    data-testid="cookie-analytics-toggle"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => saveConsent('custom')}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                  data-testid="cookie-save-preferences-btn"
                >
                  {t('cookieSavePreferences')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

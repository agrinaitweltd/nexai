import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const COOKIE_KEY = 'nexa_cookie_consent';

type ConsentState = {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

export function useCookieConsent() {
  const getStored = (): ConsentState | null => {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const [consent, setConsentState] = useState<ConsentState | null>(getStored);

  const saveConsent = (state: ConsentState) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(state));
    setConsentState(state);
  };

  return { consent, saveConsent };
}

export default function CookiesConsent() {
  const { consent, saveConsent } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  if (!visible || consent) return null;

  const handleAcceptAll = () => {
    saveConsent({ accepted: true, analytics: true, marketing: true, timestamp: Date.now() });
    setVisible(false);
  };

  const handleAcceptSelected = () => {
    saveConsent({ accepted: true, analytics, marketing, timestamp: Date.now() });
    setVisible(false);
  };

  const handleRejectAll = () => {
    saveConsent({ accepted: false, analytics: false, marketing: false, timestamp: Date.now() });
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[500] p-4 md:p-6 animate-in slide-in-from-bottom duration-500"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 border border-slate-100 overflow-hidden">
        {/* Main content */}
        <div className="p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 text-sm tracking-tight mb-1">We use cookies</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Nexa uses essential cookies to keep the platform running and optional cookies to improve your experience.{' '}
                  <a href="/privacy" className="text-emerald-600 hover:underline font-bold">Privacy Policy</a>
                </p>
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>

          {/* Expandable preferences */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Essential Cookies</p>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">Required for authentication and core functionality.</p>
                </div>
                <div className="w-[42px] h-6 bg-slate-900 rounded-full relative shrink-0 opacity-60 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Analytics Cookies</p>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">Help us understand how the platform is used.</p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`w-[42px] h-6 rounded-full relative transition-colors shrink-0 ${analytics ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  aria-pressed={analytics}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${analytics ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Marketing Cookies</p>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">Used for relevant communications and updates.</p>
                </div>
                <button
                  onClick={() => setMarketing(!marketing)}
                  className={`w-[42px] h-6 rounded-full relative transition-colors shrink-0 ${marketing ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  aria-pressed={marketing}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${marketing ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-4">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all"
            >
              Accept All
            </button>

            {expanded ? (
              <button
                onClick={handleAcceptSelected}
                className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                <span>Manage</span>
                <ChevronDown size={13} />
              </button>
            )}

            <button
              onClick={handleRejectAll}
              className="w-full sm:w-auto text-slate-400 px-4 py-2.5 font-bold text-xs uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

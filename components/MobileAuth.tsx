import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Lock, X, Check, ShieldCheck, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

// ── Storage helpers ───────────────────────────────────────────

const STORAGE_KEY = 'nexa_mobile_auth';

interface SavedAuth {
  email: string;
  type: 'passcode' | 'biometric';
  passcodeHash?: string;
  passcodeSalt?: string;
  credentialId?: string; // WebAuthn credential id (base64)
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getSavedAuth(): SavedAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSavedAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── In-memory session flag (resets on every page refresh) ────
// sessionStorage persists through refresh, so we use a module-level var instead.
let _sessionPinVerified = false;
export function isSessionPinVerified(): boolean { return _sessionPinVerified; }
export function setSessionPinVerified(): void { _sessionPinVerified = true; }

// ── Check biometric availability ──────────────────────────────

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) return false;
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch { return false; }
}

export function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// ── Biometric setup with WebAuthn ────────────────────────────

export async function setupBiometric(userId: string, email: string): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userIdBytes = new TextEncoder().encode(userId.slice(0, 64));

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Nexa', id: window.location.hostname },
        user: { id: userIdBytes, name: email, displayName: email },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -257 },  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
        timeout: 60000,
      }
    }) as PublicKeyCredential | null;

    if (!credential) return false;

    const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

    const saved: SavedAuth = { email, type: 'biometric', credentialId: credId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  } catch (err) {
    console.warn('Biometric setup failed:', err);
    return false;
  }
}

export async function verifyBiometric(savedAuth: SavedAuth): Promise<boolean> {
  try {
    if (!savedAuth.credentialId) return false;
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const credIdBytes = Uint8Array.from(atob(savedAuth.credentialId), c => c.charCodeAt(0));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ type: 'public-key', id: credIdBytes }],
        userVerification: 'required',
        timeout: 60000,
      }
    });

    return !!assertion;
  } catch { return false; }
}

// ── Passcode setup ────────────────────────────────────────────

export async function setupPasscode(email: string, pin: string): Promise<boolean> {
  const salt = generateSalt();
  const hash = await sha256(pin + salt);
  const saved: SavedAuth = { email, type: 'passcode', passcodeHash: hash, passcodeSalt: salt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return true;
}

export async function verifyPasscode(savedAuth: SavedAuth, pin: string): Promise<boolean> {
  if (!savedAuth.passcodeHash || !savedAuth.passcodeSalt) return false;
  const hash = await sha256(pin + savedAuth.passcodeSalt);
  return hash === savedAuth.passcodeHash;
}

// ── Component: post-login "Save Login" sheet ──────────────────

interface Props {
  userEmail: string;
  userId: string;
  onDone: () => void;
}

export function MobileLoginSaveSheet({ userEmail, userId, onDone }: Props) {
  const [step, setStep] = useState<'choose' | 'passcode' | 'passcode-confirm' | 'done' | 'biometric'>('choose');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  const handlePickPasscode = () => {
    setPin('');
    setConfirmPin('');
    setPinError('');
    setStep('passcode');
  };

  const handlePasscodeNext = async () => {
    if (pin.length !== 4) { setPinError('Enter all 4 digits.'); return; }
    setPinError('');
    setStep('passcode-confirm');
    setConfirmPin('');
  };

  const handlePasscodeConfirm = async () => {
    if (confirmPin.length !== 4) { setPinError('Enter all 4 digits.'); return; }
    if (pin !== confirmPin) { setPinError('PINs do not match. Try again.'); setConfirmPin(''); return; }
    await setupPasscode(userEmail, pin);
    setStep('done');
  };

  const handleBiometric = async () => {
    setStep('biometric');
    const ok = await setupBiometric(userId, userEmail);
    if (ok) setStep('done');
    else setStep('choose');
  };

  const PinDots = ({ value }: { value: string }) => (
    <div className="flex justify-center space-x-5 my-8">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`w-5 h-5 rounded-full border-[2.5px] transition-all duration-150 ${
            value.length > i ? 'bg-slate-900 border-slate-900 scale-110 shadow-[0_0_0_4px_rgba(15,23,42,0.08)]' : 'bg-transparent border-slate-300'
          }`}
        />
      ))}
    </div>
  );

  const NumPad = ({ onDigit, onDelete }: { onDigit: (d: string) => void; onDelete: () => void }) => (
    <div className="grid grid-cols-3 gap-2.5 mt-2">
      {['1','2','3','4','5','6','7','8','9'].map(d => (
        <button key={d} type="button" onClick={() => onDigit(d)}
          className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl text-xl font-black text-slate-900 transition-all duration-100 select-none"
        >{d}</button>
      ))}
      <div />
      <button type="button" onClick={() => onDigit('0')}
        className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl text-xl font-black text-slate-900 transition-all duration-100 select-none"
      >0</button>
      <button type="button" onClick={onDelete}
        className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl flex items-center justify-center text-slate-700 transition-all duration-100 select-none"
      ><span className="text-2xl font-medium">⌫</span></button>
    </div>
  );

  if (step === 'done') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[300] p-4">
        <div className="bg-white rounded-t-[2.5rem] w-full max-w-md p-8 text-center animate-in slide-in-from-bottom duration-300">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Login Saved</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Next time you visit this device, your login will be available quickly.</p>
          <button onClick={onDone} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === 'biometric') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[300] p-4">
        <div className="bg-white rounded-t-[2.5rem] w-full max-w-md p-8 text-center animate-in slide-in-from-bottom duration-300">
          <Fingerprint size={48} className="text-emerald-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Authenticate Now</h3>
          <p className="text-slate-500 text-sm font-medium">Follow your device's prompt to set up Face ID or fingerprint.</p>
        </div>
      </div>
    );
  }

  if (step === 'passcode' || step === 'passcode-confirm') {
    const isConfirm = step === 'passcode-confirm';
    const currentPin = isConfirm ? confirmPin : pin;
    const setCurrentPin = isConfirm ? setConfirmPin : setPin;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[300] p-4">
        <div className="bg-white rounded-t-[2.5rem] w-full max-w-md p-8 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setStep('choose')} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {isConfirm ? 'Confirm PIN' : 'Set 4-Digit PIN'}
            </h3>
            <div className="w-6" />
          </div>

          <p className="text-center text-slate-500 text-sm font-medium mb-2">
            {isConfirm ? 'Re-enter your 4-digit PIN to confirm' : 'Choose a 4-digit PIN for quick access'}
          </p>

          <PinDots value={currentPin} />

          {pinError && (
            <p className="text-center text-red-500 text-xs font-bold mb-3 animate-in slide-in-from-top-2">{pinError}</p>
          )}

          <NumPad
            onDigit={d => {
              if (currentPin.length >= 4) return;
              const next = currentPin + d;
              setCurrentPin(next);
              if (next.length === 4) {
                setPinError('');
                setTimeout(isConfirm ? handlePasscodeConfirm : handlePasscodeNext, 200);
              }
            }}
            onDelete={() => { setCurrentPin(currentPin.slice(0, -1)); setPinError(''); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[300] p-4">
      <div className="bg-white rounded-t-[2.5rem] w-full max-w-md p-8 animate-in slide-in-from-bottom duration-300">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Save Login for Next Time</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Protect your login with a PIN or use your device's biometrics for quick access.
          </p>
        </div>

        <div className="space-y-3">
          {biometricAvailable && (
            <button
              onClick={handleBiometric}
              className="w-full flex items-center space-x-4 p-5 border-2 border-emerald-100 bg-emerald-50 rounded-2xl hover:border-emerald-300 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Fingerprint size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 text-sm">Face ID / Fingerprint</p>
                <p className="text-slate-500 text-xs font-medium">Use your device's biometric sensor</p>
              </div>
            </button>
          )}

          <button
            onClick={handlePickPasscode}
            className="w-full flex items-center space-x-4 p-5 border-2 border-slate-100 bg-slate-50 rounded-2xl hover:border-slate-300 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900 text-sm">4-Digit PIN</p>
              <p className="text-slate-500 text-xs font-medium">Set a custom passcode for this device</p>
            </div>
          </button>

          <button onClick={onDone} className="w-full py-3 text-slate-400 font-bold text-sm">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Component: Passcode / Biometric unlock on login page ───────

interface UnlockProps {
  savedAuth: SavedAuth;
  onSuccess: (email: string) => void;
  onFallback: () => void;
  onDifferentAccount: () => void;
}

export function MobileUnlockPrompt({ savedAuth, onSuccess, onFallback, onDifferentAccount }: UnlockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState(savedAuth.email);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (savedAuth.type === 'biometric') {
      handleBiometric();
    }
  }, []);

  const handleBiometric = async () => {
    setIsLoading(true);
    setError('');
    const ok = await verifyBiometric(savedAuth);
    setIsLoading(false);
    if (ok) {
      onSuccess(savedAuth.email);
    } else {
      setError('Biometric verification failed. Try again or use fallback login.');
    }
  };

  const addDigit = (d: string) => {
    if (isLoading || pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    if (newPin.length === 4) handleVerify(newPin);
  };

  const deleteDigit = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    setError('');
    const ok = await verifyPasscode(savedAuth, code);
    if (ok) {
      onSuccess(savedAuth.email);
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + '/',
    });
    setIsLoading(false);
    if (!err) setResetSent(true);
    else setError(err.message);
  };

  if (showReset) {
    return (
      <div className="w-full space-y-6 text-center">
        {resetSent ? (
          <>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check size={28} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Check Your Email</h3>
            <p className="text-slate-500 text-sm font-medium">A reset link has been sent to <strong>{resetEmail}</strong>. Follow the link to reset your PIN or password.</p>
            <button onClick={onFallback} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Reset PIN</h3>
            <p className="text-slate-500 text-sm font-medium">We'll send a reset link to your registered email.</p>
            <input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button
              onClick={handlePasswordReset}
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <button onClick={() => setShowReset(false)} className="text-slate-400 text-sm font-bold">Cancel</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-center">
      {savedAuth.type === 'biometric' ? (
        <>
          <Fingerprint size={48} className="text-emerald-600 mx-auto" />
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {/iPhone|iPad/.test(navigator.userAgent) ? 'Face ID' : 'Biometric Login'}
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Verify with your device's biometric to sign into <strong>{savedAuth.email}</strong>
          </p>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          {isLoading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <button onClick={handleBiometric} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">
              Try Again
            </button>
          )}
        </>
      ) : (
        <>
          <Lock size={36} className="text-slate-900 mx-auto" />
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Enter PIN</h3>
          <p className="text-slate-500 text-sm font-medium">Welcome back, <strong>{savedAuth.email.split('@')[0]}</strong></p>

          <div className="flex justify-center space-x-5 my-4">
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-[2.5px] transition-all duration-150 ${
                  pin.length > i ? 'bg-slate-900 border-slate-900 scale-110 shadow-[0_0_0_4px_rgba(15,23,42,0.08)]' : 'bg-transparent border-slate-300'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs font-bold animate-in slide-in-from-top-2">{error}</p>}

          <div className="grid grid-cols-3 gap-2.5 mt-3">
            {['1','2','3','4','5','6','7','8','9'].map(d => (
              <button key={d} type="button" onClick={() => addDigit(d)} disabled={isLoading}
                className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl text-xl font-black text-slate-900 transition-all duration-100 disabled:opacity-50 select-none"
              >{d}</button>
            ))}
            <div />
            <button type="button" onClick={() => addDigit('0')} disabled={isLoading}
              className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl text-xl font-black text-slate-900 transition-all duration-100 disabled:opacity-50 select-none"
            >0</button>
            <button type="button" onClick={deleteDigit} disabled={isLoading}
              className="h-[58px] bg-slate-100 hover:bg-slate-200 active:scale-95 active:bg-slate-300 rounded-2xl flex items-center justify-center text-slate-700 transition-all duration-100 disabled:opacity-50 select-none"
            ><span className="text-2xl font-medium">⌫</span></button>
          </div>
          <button onClick={() => setShowReset(true)} className="text-emerald-600 text-xs font-bold uppercase tracking-wider mt-2">
            Forgot PIN?
          </button>
        </>
      )}

      <button onClick={onFallback} className="w-full py-3 flex items-center justify-center space-x-2 text-slate-400 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
        <RefreshCw size={14} />
        <span>Sign in with password instead</span>
      </button>
      <button onClick={onDifferentAccount} className="w-full py-2 text-slate-400 text-xs font-bold uppercase tracking-wider hover:text-slate-600 transition-colors">
        Use a different account
      </button>
    </div>
  );
}

// ── Component: Manage passcode/biometric in Settings ──────────

interface ManageProps {
  userId: string;
  userEmail: string;
}

export function MobileAuthSettings({ userId, userEmail }: ManageProps) {
  const [saved, setSaved] = useState<SavedAuth | null>(getSavedAuth());
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [step, setStep] = useState<'idle' | 'set-pin' | 'confirm-pin' | 'success'>('idle');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
    setSaved(getSavedAuth());
  }, []);

  const handlePinDigit = (index: number, value: string, current: string, setCurrent: (v: string) => void) => {
    if (!/^\d?$/.test(value)) return;
    const digits = current.split('');
    digits[index] = value;
    const newPin = digits.join('').slice(0, 4);
    setCurrent(newPin);
    if (value && index < 3) inputRefs[index + 1]?.current?.focus();
  };

  const handleSetPin = async () => {
    if (pin !== confirmPin) { setPinError('PINs do not match.'); setConfirmPin(''); return; }
    setIsLoading(true);
    await setupPasscode(userEmail, pin);
    setSaved(getSavedAuth());
    setStep('success');
    setIsLoading(false);
  };

  const handleSetBiometric = async () => {
    setIsLoading(true);
    const ok = await setupBiometric(userId, userEmail);
    if (ok) setSaved(getSavedAuth());
    setIsLoading(false);
  };

  const handleDisable = () => {
    clearSavedAuth();
    setSaved(null);
  };

  if (step === 'set-pin') {
    return (
      <div className="space-y-4">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Enter new 4-digit PIN:</p>
        <div className="flex space-x-3">
          {[0, 1, 2, 3].map(i => (
            <input key={i} ref={inputRefs[i]} type="password" inputMode="numeric" maxLength={1}
              value={pin[i] || ''}
              onChange={e => handlePinDigit(i, e.target.value, pin, setPin)}
              className="w-12 h-12 text-center text-xl font-black border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          ))}
        </div>
        <button onClick={() => { setPinError(''); setConfirmPin(''); setStep('confirm-pin'); setTimeout(() => inputRefs[0]?.current?.focus(), 50); }} disabled={pin.length !== 4}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-40">
          Next
        </button>
        <button onClick={() => setStep('idle')} className="px-4 py-2 text-slate-400 text-sm font-bold">Cancel</button>
      </div>
    );
  }

  if (step === 'confirm-pin') {
    return (
      <div className="space-y-4">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Confirm your PIN:</p>
        <div className="flex space-x-3">
          {[0, 1, 2, 3].map(i => (
            <input key={i} ref={inputRefs[i]} type="password" inputMode="numeric" maxLength={1}
              value={confirmPin[i] || ''}
              onChange={e => handlePinDigit(i, e.target.value, confirmPin, setConfirmPin)}
              className="w-12 h-12 text-center text-xl font-black border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          ))}
        </div>
        {pinError && <p className="text-red-500 text-xs font-bold">{pinError}</p>}
        <button onClick={handleSetPin} disabled={confirmPin.length !== 4 || isLoading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-40">
          {isLoading ? 'Saving...' : 'Save PIN'}
        </button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
        <Check size={20} className="text-emerald-600 shrink-0" />
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">PIN saved! It will be used for quick login on this device.</p>
        <button onClick={() => setStep('idle')} className="text-slate-400 ml-auto"><X size={16} /></button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {saved ? (
        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center space-x-3">
            {saved.type === 'biometric' ? <Fingerprint size={20} className="text-emerald-600" /> : <Lock size={20} className="text-emerald-600" />}
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{saved.type === 'biometric' ? 'Face ID / Fingerprint' : '4-Digit PIN'} Active</p>
              <p className="text-xs text-slate-500">{saved.email}</p>
            </div>
          </div>
          <button onClick={handleDisable} className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-wider">Remove</button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 font-medium">No quick login set up for this device.</p>
      )}

      <div className="flex flex-wrap gap-3">
        {biometricAvailable && (
          <button onClick={handleSetBiometric} disabled={isLoading}
            className="flex items-center space-x-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-wider shadow-sm disabled:opacity-50">
            <Fingerprint size={15} />
            <span>Set up Face ID</span>
          </button>
        )}
        <button onClick={() => { setPin(''); setStep('set-pin'); setTimeout(() => inputRefs[0]?.current?.focus(), 50); }}
          className="flex items-center space-x-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-wider">
          <Lock size={15} />
          <span>{saved?.type === 'passcode' ? 'Change PIN' : 'Set up PIN'}</span>
        </button>
      </div>
    </div>
  );
}

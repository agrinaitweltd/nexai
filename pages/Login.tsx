import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, useLocation, Link } = ReactRouterDOM as any;
import { Eye, EyeOff, Search, ChevronDown, ArrowRight, Globe2, Mail, Lock, Building, AlertCircle, CheckCircle2, FlaskConical, ShieldAlert, Sparkles, RefreshCw, Smartphone, Landmark, ClipboardCheck, Phone, X, Shield, Lock as LockIcon, Home } from 'lucide-react';
import { BUSINESS_CATEGORIES, mapTypeToSector } from '../services/businessCategories';
import { NexaLogo } from '../components/NexaLogo';
import { User } from '../types';
import { getSavedAuth, clearSavedAuth, isMobileDevice, isSessionPinVerified, setSessionPinVerified, MobileLoginSaveSheet, MobileUnlockPrompt } from '../components/MobileAuth';

const AFRICAN_COUNTRIES = [
    "Kenya", "Uganda", "Tanzania", "Nigeria", "Ghana", "South Africa", "Rwanda", "Ethiopia", 
    "Egypt", "Morocco", "Mauritius", "Zambia", "Botswana", "Namibia", "Senegal", "Ivory Coast",
    "United States", "United Kingdom"
].sort();

const UG_BANKS = [
  "Stanbic Bank","Equity Bank Uganda","Absa Bank Uganda","Centenary Bank",
  "Standard Chartered Uganda","DFCU Bank","KCB Bank Uganda","I&M Bank Uganda",
  "Pearl Bank","Orient Bank","Housing Finance Bank","Finance Trust Bank",
  "Bank of Africa","NC Bank Uganda",
  // Kenya
  "Equity Bank (KE)","KCB Bank (KE)","Co-operative Bank","NCBA Bank","DTB Bank","Family Bank",
  // Tanzania
  "CRDB Bank","NMB Bank",
  // Nigeria
  "GTBank","Access Bank","First Bank","UBA","Zenith Bank","Stanbic IBTC",
  // Ghana
  "GCB Bank","Ecobank","Fidelity Bank (GH)",
  // South Africa
  "FNB","Nedbank","Standard Bank SA","Capitec","ABSA South Africa",
  // Rwanda
  "Bank of Kigali","BPR Bank Rwanda",
  // UK
  "Lloyds Bank","Barclays","HSBC","NatWest","Santander","Halifax","Nationwide","TSB","Metro Bank",
  // International
  "Standard Chartered Bank","Revolut","Wise","Monzo","Starling Bank",
];

type AuthView = 'LOGIN' | 'SIGNUP' | 'SIGNUP_SUCCESS' | 'PAYMENT' | 'VERIFICATION' | 'AWAITING' | 'REJECTED' | 'LIMIT' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

type ActivationMethod = 'MTN' | 'AIRTEL' | 'MPESA' | 'BANK';

interface CountryPayCfg {
  methods: ActivationMethod[];
  currency: string;
  amount: string;
  momoNumbers: Partial<Record<ActivationMethod, { number: string; name: string }>>;
  banks: string[];
  bankDetails?: { accountName: string; bank: string; accountNumber: string; note?: string };
}

const COUNTRY_PAYMENT_CFG: Record<string, CountryPayCfg> = {
  Uganda: {
    methods: ['MTN', 'AIRTEL', 'BANK'],
    currency: 'UGX', amount: '15,000/mo',
    momoNumbers: {
      MTN: { number: '+256 768 638225', name: 'Nexa Intelligence Hub' },
      AIRTEL: { number: '+256 758 762690', name: 'Nexa Intelligence Hub' },
    },
    banks: ['Stanbic Bank','Equity Bank Uganda','Absa Bank Uganda','Centenary Bank','Standard Chartered Uganda','DFCU Bank','KCB Bank Uganda','I&M Bank Uganda','Pearl Bank','Orient Bank','Finance Trust Bank','Bank of Africa'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Stanbic Bank Uganda', accountNumber: '9030005XXXXXXX', note: 'Use your registration email as reference.' },
  },
  Kenya: {
    methods: ['MPESA', 'BANK'],
    currency: 'KES', amount: '500/mo',
    momoNumbers: { MPESA: { number: 'Paybill: 891300  |  Acc: Your Email', name: 'Nexa Intelligence Hub' } },
    banks: ['Equity Bank (KE)','KCB Bank (KE)','Co-operative Bank','NCBA Bank','DTB Bank','Family Bank','Standard Chartered Bank'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Equity Bank Kenya', accountNumber: 'billing@nexaagri.com', note: 'Contact us for account number. Use your email as reference.' },
  },
  Tanzania: {
    methods: ['MPESA', 'AIRTEL', 'BANK'],
    currency: 'TZS', amount: '12,000/mo',
    momoNumbers: {
      MPESA: { number: 'billing@nexaagri.com', name: 'Nexa Intelligence Hub' },
      AIRTEL: { number: 'billing@nexaagri.com', name: 'Nexa Intelligence Hub' },
    },
    banks: ['CRDB Bank','NMB Bank','Stanbic Bank','Standard Chartered Bank'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'CRDB Bank', accountNumber: 'billing@nexaagri.com', note: 'Contact us for local TZS account details.' },
  },
  Rwanda: {
    methods: ['MTN', 'AIRTEL', 'BANK'],
    currency: 'RWF', amount: '6,000/mo',
    momoNumbers: {
      MTN: { number: 'billing@nexaagri.com', name: 'Nexa Intelligence Hub' },
      AIRTEL: { number: 'billing@nexaagri.com', name: 'Nexa Intelligence Hub' },
    },
    banks: ['Bank of Kigali','BPR Bank Rwanda','Equity Bank Rwanda'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Bank of Kigali', accountNumber: 'billing@nexaagri.com', note: 'Contact us for RWF account details.' },
  },
  Nigeria: {
    methods: ['BANK'],
    currency: 'NGN', amount: '4,500/mo',
    momoNumbers: {},
    banks: ['GTBank','Access Bank','First Bank','UBA','Zenith Bank','Stanbic IBTC'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Wise (wise.com)', accountNumber: 'billing@nexaagri.com', note: 'Bank transfer via Wise. Use email as reference.' },
  },
  Ghana: {
    methods: ['MTN', 'BANK'],
    currency: 'GHS', amount: '70/mo',
    momoNumbers: { MTN: { number: 'billing@nexaagri.com', name: 'Nexa Intelligence Hub (Ghana)' } },
    banks: ['GCB Bank','Ecobank Ghana','Fidelity Bank (GH)','Absa Ghana','Standard Chartered Ghana'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Ecobank Ghana', accountNumber: 'billing@nexaagri.com', note: 'Contact us for GHS account details.' },
  },
  'South Africa': {
    methods: ['BANK'],
    currency: 'ZAR', amount: '90/mo',
    momoNumbers: {},
    banks: ['FNB','Nedbank','Standard Bank SA','Capitec','ABSA South Africa'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Wise / International Wire', accountNumber: 'billing@nexaagri.com', note: 'EFT or Wise transfer accepted.' },
  },
  'United Kingdom': {
    methods: ['BANK'],
    currency: 'GBP', amount: '3.99/mo',
    momoNumbers: {},
    banks: ['Lloyds Bank','Barclays','HSBC','NatWest','Santander','Halifax','Nationwide','Monzo','Starling Bank','Revolut','Wise'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Wise (wise.com)', accountNumber: 'billing@nexaagri.com', note: 'UK bank transfer or Wise accepted.' },
  },
  'United States': {
    methods: ['BANK'],
    currency: 'USD', amount: '4.99/mo',
    momoNumbers: {},
    banks: ['Chase','Bank of America','Wells Fargo','Citibank','Wise','Revolut'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Wise (wise.com)', accountNumber: 'billing@nexaagri.com', note: 'ACH or Wise transfer accepted.' },
  },
};
const getPayCfg = (country: string): CountryPayCfg =>
  COUNTRY_PAYMENT_CFG[country] ?? {
    methods: ['BANK'],
    currency: 'USD', amount: '4.99/mo',
    momoNumbers: {},
    banks: ['Wise','Revolut'],
    bankDetails: { accountName: 'Nexa Intelligence Ltd', bank: 'Wise (wise.com)', accountNumber: 'billing@nexaagri.com', note: 'International wire or Wise accepted.' },
  };

// ─── Signup Success / Welcome Screen ──────────────────────────────────────────
interface SignupSuccessProps {
  name: string;
  email: string;
  onContinue: () => void;
  onSignOut: () => void;
}

function SignupSuccessScreen({ name, email, onContinue, onSignOut }: SignupSuccessProps) {
  const [onboardingStep, setOnboardingStep] = React.useState<'welcome' | 'intro'>('welcome');
  const [visible, setVisible] = React.useState(false);
  const [checkDone, setCheckDone] = React.useState(false);
  const [orbs, setOrbs] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setCheckDone(true), 600);
    const t3 = setTimeout(() => setOrbs(true), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const firstName = name.split(' ')[0] || name;

  /* ── INTRO step ─────────────────────────────────────────────── */
  if (onboardingStep === 'intro') {
    return (
      <div className="fixed inset-0 z-[500] bg-[#0d0020] flex flex-col overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-900/30 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-900/20 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-900/20 rounded-full blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-8 shrink-0">
          <button onClick={onSignOut} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-[10px] font-black uppercase tracking-widest">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
          {/* Step indicators */}
          <div className="flex items-center gap-1.5">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={`rounded-full transition-all duration-500 ${i === 0 ? 'w-8 h-1.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-white/15'}`} />
            ))}
          </div>
        </div>

        {/* Center */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center" style={{animation: 'nexaFadeUp 0.7s ease-out both'}}>
          {/* Icon */}
          <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center shadow-2xl shadow-violet-900/50 backdrop-blur-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          {/* Step label */}
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-5">Step 1 of 5</p>
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-5 max-w-lg">
            Let&apos;s build your<br/>
            <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
              Corporate Hub.
            </span>
          </h1>
          <p className="text-white/40 text-base md:text-lg font-medium max-w-md mb-12 leading-relaxed">
            A few quick steps to configure your farm profile, workforce, and financial infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-violet-900/60 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Let&apos;s Begin
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button onClick={onContinue} className="text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Skip setup
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 pb-8 text-white/20 text-[10px] font-medium shrink-0">
          <span>© 2026 Nexa Intelligence Ltd</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-white/40 transition-colors">Terms</button>
            <button className="hover:text-white/40 transition-colors">Privacy</button>
          </div>
        </div>

        <style>{`@keyframes nexaFadeUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  /* ── WELCOME step ───────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-[500] bg-[#0d0020] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-violet-800/25 rounded-full blur-[160px] transition-all duration-1500 ${orbs ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
        <div className={`absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-900/20 rounded-full blur-[120px] transition-all duration-1000 delay-300 ${orbs ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 left-0 w-80 h-80 bg-cyan-900/15 rounded-full blur-[100px] transition-all duration-1000 delay-500 ${orbs ? 'opacity-100' : 'opacity-0'}`} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0d0020_100%)]" />
      </div>

      {/* Top bar */}
      <div className={`relative z-10 flex items-center justify-start px-6 md:px-12 pt-8 shrink-0 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <button onClick={onSignOut} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-[10px] font-black uppercase tracking-widest group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign out</span>
          <span className="text-white/20 font-normal normal-case tracking-normal">({email})</span>
        </button>
      </div>

      {/* Center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Animated ring + checkmark */}
        <div className={`mb-10 transition-all duration-700 delay-150 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative w-24 h-24">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-xl transition-all duration-1000 delay-300 ${checkDone ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`} />
            <svg viewBox="0 0 96 96" className="w-full h-full relative" fill="none">
              {/* Track */}
              <circle cx="48" cy="48" r="43" stroke="white" strokeWidth="1.5" strokeOpacity="0.06" />
              {/* Animated arc */}
              <circle
                cx="48" cy="48" r="43"
                stroke="url(#nexaRingGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="270"
                strokeDashoffset={checkDone ? 0 : 270}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
              <defs>
                <linearGradient id="nexaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            {/* Checkmark */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-600 delay-700 ${checkDone ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" stroke="url(#chkGrad)"/>
                <defs>
                  <linearGradient id="chkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#22d3ee"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Account confirmed badge */}
        <div className={`mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Account Confirmed
          </span>
        </div>

        {/* Headline */}
        <div className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.92] mb-3">
            Welcome,<br/>
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">
              {firstName}.
            </span>
          </h1>
          <p className="text-white/30 text-base md:text-lg font-medium mb-12 tracking-wide">
            Your Treasury awaits.
          </p>
        </div>

        {/* Info row */}
        <div className={`w-full max-w-sm mb-8 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-400/20 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">Registered as</p>
              <p className="text-xs font-bold text-white/70 truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`w-full max-w-sm transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => setOnboardingStep('intro')}
            className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-violet-900/60 hover:scale-[1.03] active:scale-95 transition-all"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Access Your Hub
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
            {/* Shimmer */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{animationDelay:'1s'}} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}

export default function Login() {
  const { login, register, submitVerification, resetUserStatus, requestPasswordReset, resetPassword, isPasswordRecovery, clearPasswordRecovery } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAdminLogin = queryParams.get('mode') === 'admin';
  const resetToken = queryParams.get('token');

  const isMobileSetup = queryParams.get('mobile') === '1';
  const emailHint = queryParams.get('hint') ? decodeURIComponent(queryParams.get('hint')!) : '';

  const [view, setView] = useState<AuthView>('LOGIN');

  // Switch to password reset view when Supabase fires the PASSWORD_RECOVERY event
  React.useEffect(() => {
    if (isPasswordRecovery) setView('RESET_PASSWORD');
  }, [isPasswordRecovery]);

  // Mobile auth state
  const [savedMobileAuth] = useState(() => getSavedAuth());
  const [showMobileUnlock, setShowMobileUnlock] = useState(() => {
    const savedAuth = getSavedAuth();
    if (!savedAuth) return false;
    return !isSessionPinVerified();
  });
  const [showSaveLoginSheet, setShowSaveLoginSheet] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');

  // Switch to password reset view when Supabase fires the PASSWORD_RECOVERY event
  React.useEffect(() => {
    if (isPasswordRecovery) setView('RESET_PASSWORD');
  }, [isPasswordRecovery]);
  
  // States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Login State
  const [email, setEmail] = useState(emailHint);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Comprehensive Signup State
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Uganda');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Password Strength State
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

  // Verification Form State
  const [txId, setTxId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [payMethod, setPayMethod] = useState<ActivationMethod>('MTN');
  const [selectedBank, setSelectedBank] = useState(UG_BANKS[0]);
  const [accountName, setAccountName] = useState('');
  const [selectedActivationProvider, setSelectedActivationProvider] = useState<ActivationMethod>('MTN');

  // Reset payment method when country changes
  useEffect(() => {
    const cfg = getPayCfg(selectedCountry);
    setSelectedActivationProvider(cfg.methods[0]);
    setPayMethod(cfg.methods[0]);
    setSelectedBank(cfg.banks[0] || '');
  }, [selectedCountry]);

  useEffect(() => {
      calculateStrength(newPassword);
  }, [newPassword]);

  const payConfig = getPayCfg(selectedCountry);
  const isMoMoProvider = selectedActivationProvider !== 'BANK';
  const momoInfo = payConfig.momoNumbers[selectedActivationProvider];

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    let label = 'Weak';
    let color = 'bg-red-500';

    if (score === 2 || score === 3) {
        label = 'Moderate';
        color = 'bg-yellow-500';
    } else if (score === 4) {
        label = 'Strong';
        color = 'bg-emerald-500';
    }

    setStrength({ score, label, color });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await login(email, password);
        if (result === true) {
            // On mobile with no saved auth, offer to save login
            if (isMobileDevice() && !getSavedAuth()) {
                // Get the user id from supabase session for biometric setup
                const { supabase: sb } = await import('../supabaseClient');
                const { data: { session } } = await sb.auth.getSession();
                setLoggedInUserId(session?.user?.id || '');
                setLoggedInEmail(email);
                setShowSaveLoginSheet(true);
                setIsLoading(false);
            } else {
                navigate('/app', { replace: true });
            }
        } else if (result === 'PENDING') {
            setView('AWAITING');
            setIsLoading(false);
        } else if (result === 'REJECTED') {
            setView('REJECTED');
            setIsLoading(false);
        } else if (result === 'LIMIT_REACHED') {
            setView('LIMIT');
            setIsLoading(false);
        } else if (result === 'INVALID') {
            setError("Incorrect email or password. Please try again.");
            setIsLoading(false);
        } else {
            setError("Network authentication failure.");
            setIsLoading(false);
        }
    } catch (err) {
        setError("System error during authentication.");
        setIsLoading(false);
    }
  };

  const handleInitialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (strength.label !== 'Strong') {
        setError("Password safety protocols not met. Strength must be 'Strong'.");
        return;
    }

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match. Please confirm your password.");
        return;
    }

    if (!name || !newEmail || !companyName || !selectedType) {
        setError("All fields are required to initialize your corporate account.");
        return;
    }

    setIsLoading(true);
    const sector = mapTypeToSector(selectedType || '', selectedCategory || '');
    
    try {
        const result = await register({
            name,
            email: newEmail,
            password: newPassword,
            companyName,
            businessCategory: selectedCategory || "General",
            businessType: selectedType,
            sector,
            role: 'ADMIN',
            preferredCurrency: 'UGX',
            location: selectedCountry
        });

        if (result.success && result.user) {
            setPendingUser(result.user);
            setView('SIGNUP_SUCCESS');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    } catch (err) {
        setError("Sign up failed.");
        setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setError('Please enter your email address.');
        return;
    }
    setIsLoading(true);
    setError('');
    const result = await requestPasswordReset(email);
    setIsLoading(false);
    if (result.success) {
        setForgotSuccess(true);
    } else {
        setError(result.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    if (strength.label !== 'Strong') {
        setError("Password must be 'Strong'.");
        return;
    }
    setIsLoading(true);
    setError('');
    const result = await resetPassword('', newPassword);
    if (result.success) {
        clearPasswordRecovery();
        setView('LOGIN');
        setNewPassword('');
        setConfirmPassword('');
    } else {
        setError(result.message);
    }
    setIsLoading(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!txId || !paymentPhone) {
          setError("Please provide all transaction verification details.");
          return;
      }

      if (paymentPhone.length > 11) {
          setError("Payment phone number must not exceed 11 characters.");
          return;
      }
      
      setIsLoading(true);
      await submitVerification({
          userId: pendingUser?.id || '',
          userName: pendingUser?.name || '',
          userEmail: pendingUser?.email || '',
          transactionId: txId,
          paymentPhone,
          paymentMethod: payMethod,
          bankName: payMethod === 'BANK' ? selectedBank : undefined,
          accountName: payMethod === 'BANK' ? accountName : undefined
      });
      
      setView('AWAITING');
      setIsLoading(false);
  };

  const filteredCategories = BUSINESS_CATEGORIES.map(cat => ({
      ...cat,
      types: cat.types.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.types.length > 0 || cat.category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-[100dvh] flex bg-white font-sans overflow-hidden">

      {/* Mobile unlock prompt (PIN / Face ID) */}
      {showMobileUnlock && savedMobileAuth && (
        <div className="fixed inset-0 bg-white z-[400] flex flex-col items-center justify-center p-6">
          <div className="mb-8"><NexaLogo className="h-10" /></div>
          <div className="w-full max-w-sm">
            <MobileUnlockPrompt
              savedAuth={savedMobileAuth}
              onSuccess={async (savedEmail) => {
                // Check if Supabase session is still active — go directly to dashboard
                const sbModule = await import('../supabaseClient');
                const { data: { session } } = await sbModule.supabase.auth.getSession();
                if (session && session.user) {
                  setSessionPinVerified();
                  setShowMobileUnlock(false);
                  navigate('/app', { replace: true });
                } else {
                  // Session expired — pre-fill email
                  setShowMobileUnlock(false);
                  setEmail(savedEmail);
                  setError('Your session has expired. Please sign in again.');
                }
              }}
              onFallback={() => {
                // Stay on same account but use password
                setShowMobileUnlock(false);
                setEmail(savedMobileAuth?.email || '');
              }}
              onDifferentAccount={() => {
                // Clear saved auth and show blank login form
                clearSavedAuth();
                setShowMobileUnlock(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Save login sheet (shown after first mobile login) */}
      {showSaveLoginSheet && (
        <MobileLoginSaveSheet
          userEmail={loggedInEmail}
          userId={loggedInUserId}
          onDone={() => {
            setShowSaveLoginSheet(false);
            navigate('/app', { replace: true });
          }}
        />
      )}
      {/* Branding Side - Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-nexa-dark flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexa-blue rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-nexa-green rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 opacity-20"></div>

        <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-12">
              <NexaLogo className="h-12" light />
              <div className="w-px h-8 bg-white/20 mx-2"></div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase tracking-widest">{isAdminLogin ? 'Executive' : 'Enterprise'}</h2>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-[0.9] text-white">Digitize Your <br/>Value Chain.</h1>
            <p className="text-nexa-blue text-xl opacity-90 font-medium max-w-md">The modern mission-critical operating system for the global agricultural market.</p>
        </div>

        <div className="relative z-10 space-y-12">
            <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                    <CheckCircle2 className="text-nexa-green" size={28} />
                    <h4 className="font-black uppercase tracking-widest text-xs">Real-time Stock</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">End-to-end inventory monitoring across multiple warehouse hubs.</p>
                </div>
                <div className="space-y-3">
                    <CheckCircle2 className="text-nexa-blue" size={28} />
                    <h4 className="font-black uppercase tracking-widest text-xs">Export Control</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">International manifest automation and real-time shipment tracking.</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 w-fit px-8 py-4 rounded-[2.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl">
                <Globe2 className="text-nexa-blue" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Market Integrity</span>
            </div>
        </div>
      </div>

      {/* Form Side - Right */}
      <div className="w-full lg:w-1/2 flex flex-col h-full items-center justify-start p-5 md:p-16 overflow-y-auto bg-slate-50/50 relative">
        {/* Back to Homepage Button */}
        <div className="w-full max-w-lg flex items-center pt-4 pb-2 md:pt-8 md:pb-4 shrink-0">
            <Link 
                to="/" 
                className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
                <Home size={13} />
                <span>Back to Home</span>
            </Link>
        </div>

        <div className="w-full max-w-lg space-y-5 md:space-y-10 animate-in fade-in zoom-in duration-500 py-4 md:py-10 flex flex-col flex-1">
            
            {/* LOGIN VIEW */}
            {view === 'LOGIN' && (
                <div className="flex-1">
                    <div className="mb-4 md:mb-8 lg:hidden flex justify-center">
                        <NexaLogo className="h-8 md:h-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">{isAdminLogin ? 'Sign In' : 'Sign In'}</h2>
                        <p className="text-slate-500 font-medium text-base md:text-lg">{isAdminLogin ? 'Authorized Executive Credentials Required.' : 'Secure verification for enterprise hub entry.'}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 md:space-y-6 mt-5 md:mt-10">
                        {error && (
                            <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                <AlertCircle size={20} className="mr-3 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-8 py-3 md:py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder={isAdminLogin ? "admin@nexaagri.com" : "admin@company.com"} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Password</label>
                                    <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-[9px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-[0.2em] px-6">Forgot Password?</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-18 py-3 md:py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder="••••••••" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-nexa-dark text-white py-4 md:py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center group active:scale-95 text-xs disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : isAdminLogin ? 'Sign In' : 'Sign In'} 
                            {!isLoading && <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />}
                        </button>
                        
                        {!isAdminLogin && (
                            <div className="text-center pt-6">
                                <p className="text-sm text-slate-500 font-medium">
                                    No account? <button type="button" onClick={() => setView('SIGNUP')} className="text-nexa-green font-black hover:underline uppercase text-xs tracking-[0.1em] ml-2">Sign Up</button>
                                </p>
                            </div>
                        )}
                        {isAdminLogin && (
                            <div className="text-center pt-6">
                                <button type="button" onClick={() => navigate('/login')} className="text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900">User Sign In</button>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {view === 'FORGOT_PASSWORD' && (
                <div className="flex-1">
                    {forgotSuccess ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Check Your Inbox</h2>
                            <p className="text-slate-500 font-medium text-lg max-w-sm mb-10">A password reset link has been sent to <span className="font-black text-slate-900">{email}</span>. Click the link to set a new password.</p>
                            <button type="button" onClick={() => { setView('LOGIN'); setForgotSuccess(false); setEmail(''); }} className="text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900">Back to Sign In</button>
                        </div>
                    ) : (
                        <>
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Reset Password</h2>
                            <p className="text-slate-500 font-medium text-lg">Enter your email to receive recovery instructions.</p>
                        </div>

                        <form onSubmit={handleForgotPassword} className="space-y-6 mt-12">
                            {error && (
                                <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                    <AlertCircle size={20} className="mr-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                            className="w-full border-none rounded-[2.5rem] pl-18 pr-8 py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                            placeholder="your@email.com" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl flex items-center justify-center group active:scale-95 text-xs disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'} 
                                {!isLoading && <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />}
                            </button>
                            
                            <div className="text-center pt-6">
                                <button type="button" onClick={() => setView('LOGIN')} className="text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900">Back to Sign In</button>
                            </div>
                        </form>
                        </>
                    )}
                </div>
            )}

            {/* RESET PASSWORD VIEW */}
            {view === 'RESET_PASSWORD' && (
                <div className="flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">New Password</h2>
                        <p className="text-slate-500 font-medium text-lg">Create a secure new password for your account.</p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-6 mt-12">
                        {error && (
                            <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                <AlertCircle size={20} className="mr-3 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-18 py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder="••••••••" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 space-y-4 bg-slate-100/50 p-6 rounded-[2rem] border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span></p>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${strength.score >= i ? strength.color : 'bg-slate-300'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-8 py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || strength.label !== 'Strong'}
                            className="w-full bg-nexa-green text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center group active:scale-95 text-xs disabled:opacity-50"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'} 
                            {!isLoading && <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>
                </div>
            )}

            {/* SIGNUP VIEW */}
            {view === 'SIGNUP' && (
                <div className="flex-1">
                    <div className="mb-4 md:mb-0 lg:hidden flex justify-center">
                        <NexaLogo className="h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Sign Up</h2>
                        <p className="text-slate-500 font-medium text-base md:text-lg">Create your corporate account on the NexaAgri cloud.</p>
                    </div>

                    <form onSubmit={handleInitialSignup} className="space-y-5 md:space-y-8 mt-6 md:mt-10 pb-10">
                        {error && (
                            <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                <AlertCircle size={20} className="mr-3 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="e.g. Samuel Kiptoo" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Jurisdiction</label>
                                    <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none">
                                        {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Email Address</label>
                                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="office@company.com" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Password</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="Secure Password" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="Re-enter Password" />
                            </div>

                            <div className="px-6 space-y-4 bg-slate-100/50 p-6 rounded-[2rem] border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span></p>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${strength.score >= i ? strength.color : 'bg-slate-300'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${newPassword.length >= 8 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> 8+ Characters
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[A-Z]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Uppercase Let.
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[0-9]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Number (0-9)
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Special Char.
                                     </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-8 bg-white/40 backdrop-blur-sm rounded-2xl md:rounded-[3rem] border border-white shadow-inner space-y-5 md:space-y-8">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center px-2"><Building size={16} className="mr-3 text-nexa-blue" /> Business Identity</h4>
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-4">Company Name</label>
                                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border-none bg-white rounded-2xl px-6 py-3 md:py-4 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-blue/5 transition-all outline-none" placeholder="Global Trade Partners Ltd" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.4em] px-4">Vertical Allocation</label>
                                    <div className="relative">
                                        <div className="w-full bg-white rounded-2xl md:rounded-[2.5rem] px-6 md:px-10 py-4 md:py-6 text-sm cursor-pointer flex justify-between items-center shadow-xl shadow-slate-200/50 hover:ring-8 hover:ring-nexa-green/5 transition-all" onClick={() => setShowDropdown(true)}>
                                            <span className={`truncate font-black uppercase tracking-widest ${selectedType ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {selectedType || 'Select Agriculture Type'}
                                            </span>
                                            <ChevronDown className="text-slate-400 flex-shrink-0 ml-4" size={24} />
                                        </div>
                                        {showDropdown && (
                                            <div className="absolute z-20 left-0 w-full mt-4 bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-h-96 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                                                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                                    <div className="flex items-center bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4">
                                                        <Search size={20} className="text-slate-400 mr-4"/>
                                                        <input autoFocus className="w-full text-sm outline-none font-bold placeholder:font-medium" placeholder="Filter types..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="overflow-y-auto p-6 scrollbar-thin">
                                                    {filteredCategories.map((cat, idx) => (
                                                        <div key={idx} className="mb-8 last:mb-0">
                                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-6 py-2 mb-4 border-l-4 border-slate-100">
                                                                {cat.category}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {cat.types.map(t => (
                                                                    <div key={t} onClick={() => { setSelectedCategory(cat.category); setSelectedType(t); setShowDropdown(false); }} className="px-8 py-4 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-nexa-green rounded-[1.5rem] cursor-pointer transition-all">
                                                                        {t}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || strength.label !== 'Strong'}
                            className="w-full bg-nexa-green text-white py-5 md:py-7 rounded-2xl md:rounded-[3rem] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-[0_20px_40px_-10px_rgba(0,223,130,0.4)] hover:scale-[1.02] active:scale-95 text-xs disabled:opacity-50 disabled:grayscale flex items-center justify-center"
                        >
                            {isLoading ? (
                                <><RefreshCw className="animate-spin mr-3" size={18} /> Initializing Account...</>
                            ) : (
                                <><Sparkles className="mr-3" size={18} /> Sign Up</>
                            )}
                        </button>
                        
                        <div className="text-center pt-2">
                            <p className="text-sm text-slate-500 font-medium">
                                Already have an account? <button type="button" onClick={() => setView('LOGIN')} className="text-nexa-green font-black uppercase text-xs tracking-[0.2em] ml-4 hover:underline">Sign In</button>
                            </p>
                        </div>
                    </form>
                </div>
            )}

            {/* SIGNUP SUCCESS VIEW */}
            {view === 'SIGNUP_SUCCESS' && (
                <SignupSuccessScreen
                    name={name}
                    email={newEmail}
                    onContinue={() => setView('PAYMENT')}
                    onSignOut={() => { setView('LOGIN'); }}
                />
            )}

            {/* PAYMENT INSTRUCTIONS VIEW */}
            {view === 'PAYMENT' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl">
                        <LockIcon size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Account Activation</h2>
                    <p className="text-slate-500 font-medium mb-8 max-w-sm text-sm md:text-base">
                        Activate your hub for <span className="font-black text-slate-900">{payConfig.currency} {payConfig.amount}</span>. Choose your payment method.
                    </p>

                    {/* Country-aware Provider Toggle */}
                    <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 w-full max-w-sm gap-1">
                        {payConfig.methods.map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setSelectedActivationProvider(method)}
                                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                    selectedActivationProvider === method
                                        ? method === 'MTN' ? 'bg-[#ffcc00] text-[#003366] shadow-lg'
                                            : method === 'AIRTEL' ? 'bg-red-600 text-white shadow-lg'
                                            : method === 'MPESA' ? 'bg-green-600 text-white shadow-lg'
                                            : 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {method === 'MPESA' ? 'M-Pesa' : method}
                            </button>
                        ))}
                    </div>

                    {/* Payment Card */}
                    <div className="w-full max-w-sm">
                        {isMoMoProvider && momoInfo ? (
                            <div className={`w-full rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border text-left overflow-hidden relative transition-all duration-500 ${
                                selectedActivationProvider === 'MTN' ? 'bg-gradient-to-br from-[#ffcc00] to-[#e6b800] border-[#cc9900]/30 text-[#003366]'
                                : selectedActivationProvider === 'MPESA' ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-900/30 text-white'
                                : 'bg-gradient-to-br from-slate-900 to-black border-white/10 text-white'
                            }`}>
                                <div className="flex justify-between items-start mb-8">
                                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] opacity-60`}>Activation ID #9912</p>
                                    <Globe2 size={24} className="opacity-30" />
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">
                                            {selectedActivationProvider === 'MPESA' ? 'M-Pesa Recipient' : 'Mobile Money Recipient'}
                                        </p>
                                        <p className="text-xl md:text-2xl font-black tracking-tighter leading-none mb-2">{momoInfo.number}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{momoInfo.name}</p>
                                    </div>
                                    <div className={`flex justify-between items-end border-t pt-6 ${selectedActivationProvider === 'MTN' ? 'border-[#003366]/10' : 'border-white/10'}`}>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Amount</p>
                                            <p className="font-bold text-emerald-500 text-xs">{payConfig.currency} {payConfig.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Status</p>
                                            <p className="font-black uppercase text-xs animate-pulse">Awaiting Signal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Bank Transfer Card */
                            <div className="w-full rounded-2xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-white shadow-2xl text-left">
                                <div className="flex items-center space-x-3 mb-6">
                                    <Landmark size={28} className="text-emerald-500" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bank Transfer</p>
                                        <p className="font-black text-white">{payConfig.bankDetails?.bank || 'Contact Support'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-black/30 p-4 rounded-xl">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Name</p>
                                        <p className="font-bold text-white text-sm">{payConfig.bankDetails?.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Account / Ref</p>
                                        <p className="font-bold text-emerald-400 text-sm">{payConfig.bankDetails?.accountNumber}</p>
                                    </div>
                                    {payConfig.bankDetails?.note && (
                                        <p className="text-[10px] text-slate-400 italic border-t border-white/5 pt-3">{payConfig.bankDetails.note}</p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-6 border-t border-white/10 pt-4">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Amount</p>
                                        <p className="font-bold text-emerald-400 text-xs">{payConfig.currency} {payConfig.amount}</p>
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Pending</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setView('VERIFICATION')}
                        className="w-full mt-8 md:mt-10 bg-nexa-dark text-white py-5 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-95 text-[10px] md:text-xs max-w-sm"
                    >
                        Continue
                    </button>
                    <button onClick={() => setView('SIGNUP')} className="mt-5 md:mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Discard Request</button>
                </div>
            )}

            {/* VERIFICATION FORM VIEW */}
            {view === 'VERIFICATION' && (
                <div className="flex-1">
                    <button onClick={() => setView('PAYMENT')} className="mb-8 text-slate-400 flex items-center font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all"><X size={16} className="mr-2"/> Instructions</button>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Verification</h2>
                    <p className="text-slate-500 font-medium mb-10 text-lg">Send your activation details to our team.</p>

                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2 p-1.5 bg-slate-100 rounded-[1.5rem]" style={{gridTemplateColumns: `repeat(${payConfig.methods.length}, 1fr)`}}>
                                {payConfig.methods.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPayMethod(m)}
                                        className={`py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${payMethod === m ? 'bg-white text-nexa-dark shadow-md' : 'text-slate-400'}`}
                                    >
                                        {m === 'MPESA' ? 'M-Pesa' : m}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Transaction ID</label>
                                <input type="text" required value={txId} onChange={e => setTxId(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-5 font-black shadow-sm outline-none focus:ring-8 focus:ring-emerald-500/5 text-lg" placeholder="TX-882192" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Source Phone (Max 11 Chars)</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="tel" 
                                        required 
                                        maxLength={11}
                                        value={paymentPhone} 
                                        onChange={e => setPaymentPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} 
                                        className="w-full border-none bg-white rounded-2xl pl-14 pr-8 py-5 font-black shadow-sm outline-none focus:ring-8 focus:ring-emerald-500/5 text-lg" 
                                        placeholder="07XX XXX XXX" 
                                    />
                                </div>
                            </div>

                            {payMethod === 'BANK' && (
                                <div className="space-y-6 animate-in slide-in-from-top-4 duration-300 bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Select Bank</label>
                                        <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-4 font-bold shadow-sm outline-none">
                                            {payConfig.banks.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Account Name Used</label>
                                        <input type="text" required value={accountName} onChange={e => setAccountName(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-4 font-bold shadow-sm outline-none" placeholder="Account Holder Name" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50 text-xs"
                        >
                            {isLoading ? 'Submitting...' : 'Verify Activation'}
                        </button>
                    </form>
                </div>
            )}

            {/* AWAITING APPROVAL VIEW */}
            {view === 'AWAITING' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-8 shadow-2xl animate-pulse">
                        <ClipboardCheck size={52} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">In Review</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">Your account is currently in the review queue. We will notify you once our team activates your access.</p>
                    
                    <div className="p-10 bg-white rounded-[3rem] border border-blue-50 shadow-sm w-full relative">
                         <div className="flex items-center justify-center space-x-3 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3">
                             <RefreshCw size={14} className="animate-spin" /> <span>Account Review Active</span>
                         </div>
                         <p className="text-xs text-slate-400 font-medium tracking-tight">Average response time: 2-4 business hours.</p>
                    </div>

                    <button 
                        onClick={() => { setView('LOGIN'); setEmail(''); setPassword(''); }}
                        className="mt-14 text-slate-400 hover:text-nexa-green font-black uppercase text-xs tracking-[0.2em] transition-colors flex items-center"
                    >
                        <ArrowRight size={18} className="mr-3 rotate-180" /> Back to Sign In
                    </button>
                </div>
            )}

            {/* REJECTED VIEW */}
            {view === 'REJECTED' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in shake duration-500">
                    <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center text-red-600 mb-8 shadow-xl">
                        <ShieldAlert size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">Access Denied</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">Your sign up request was declined. Please check your verification details and try again.</p>
                    
                    <button 
                        onClick={() => {
                            if (email) resetUserStatus(email);
                            setView('SIGNUP');
                            setError('');
                        }}
                        className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95 text-xs"
                    >
                        Try Again
                    </button>
                    
                    <button onClick={() => setView('LOGIN')} className="mt-10 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Back to Sign In</button>
                </div>
            )}

            {/* LIMIT REACHED VIEW */}
            {view === 'LIMIT' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-8 shadow-2xl">
                        <Shield size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">Blocked</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">You have reached the maximum number of sign up attempts.</p>
                    
                    <div className="p-10 bg-red-50 rounded-[3rem] border border-red-100 shadow-sm w-full mb-12">
                         <p className="text-[11px] text-red-600 font-black uppercase tracking-[0.3em] mb-3">Account Blocked</p>
                         <p className="text-xs text-slate-600 font-medium leading-relaxed">Security protocols have restricted further attempts from this email. Please contact support for assistance.</p>
                    </div>

                    <button 
                        onClick={() => navigate('/app/help')}
                        className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl text-xs"
                    >
                        Contact Support
                    </button>
                    
                    <button onClick={() => setView('LOGIN')} className="mt-10 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Return Home</button>
                </div>
            )}

            {/* Attribution Footer */}
            <div className="pt-16 border-t border-slate-100 text-center mt-auto">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">
                    © 2026 Nexa Systems Ltd. All Rights Reserved.
                </p>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
        .animate-in.shake {
            animation: shake 0.4s ease-in-out;
        }
        .pl-18 { padding-left: 4.5rem; }
        .pr-18 { padding-right: 4.5rem; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, InventoryItem, Farm } from '../types';
import { ChevronRight, Check, Package, Users, Building, Flag, Phone, Mail, Hash, Globe, Scale, Landmark, ShieldCheck, UserCheck, AlertCircle, FileText, X, ArrowRight, Smartphone, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ── Shared input / card styles ──────────────────────────────────────────────
const inputCls = "w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/25 rounded-2xl px-5 py-3.5 font-bold text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all";
const labelCls = "block text-[9px] font-black text-white/40 uppercase tracking-[0.4em] px-1 mb-2";

export default function Onboarding() {
  const { user, completeOnboarding, addFarm, updateUser } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [stepError, setStepError] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [selectedActivationProvider, setSelectedActivationProvider] = useState<'MTN' | 'AIRTEL'>('MTN');

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && !('ontouchstart' in window);
  }, []);

  const mobileUrl = useMemo(() => {
    const base = 'https://www.nexaagri.com';
    const email = encodeURIComponent(user?.email || '');
    return `${base}/#/login?mobile=1&hint=${email}`;
  }, [user?.email]);

  const [companyDetails, setCompanyDetails] = useState({
      name: user?.companyName || '',
      address: '',
      email: user?.email || '',
      phone: '',
      regNumber: '',
      tin: '',
      directors: '',
      businessSize: 'Small (1-10 Employees)',
      ucdaNumber: ''
  });
  
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  
  const handleFinish = async () => {
    await updateUser({
        companyName: companyDetails.name,
        companyAddress: companyDetails.address,
        contactEmail: companyDetails.email,
        phone: companyDetails.phone,
        regNumber: companyDetails.regNumber,
        tin: companyDetails.tin,
        directors: companyDetails.directors,
        businessSize: companyDetails.businessSize,
        ucdaNumber: companyDetails.ucdaNumber,
        setupComplete: true
    });
    completeOnboarding();
  };

  const validateStep = (targetStep: number): boolean => {
    setStepError('');
    if (step === 1) {
      if (!companyDetails.name.trim()) { setStepError('Business name is required.'); return false; }
      if (!companyDetails.address.trim()) { setStepError('Operating address is required.'); return false; }
      if (!companyDetails.phone.trim()) { setStepError('Phone number is required.'); return false; }
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(companyDetails.phone.replace(/\s/g, ''))) { setStepError('Phone number must be 10-15 digits (e.g. +256700123456).'); return false; }
    }
    if (step === 2) {
      if (!companyDetails.regNumber.trim()) { setStepError('Business Registration Number (BRN) is required.'); return false; }
      if (!companyDetails.tin.trim()) { setStepError('Tax Identification Number (TIN) is required.'); return false; }
      if (!companyDetails.directors.trim()) { setStepError('At least one director name is required.'); return false; }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step + 1)) {
      setStep(step + 1);
    }
  };

  const handleAddFarm = () => {
    if (farmName) {
        addFarm({
            id: 'f-' + crypto.randomUUID().slice(0, 9),
            name: farmName,
            location: farmLocation || 'Main Hub',
            size: 'N/A',
            farmingType: 'CROP',
            staffIds: [],
            initialAssets: []
        });
        setFarmName('');
        setFarmLocation('');
    }
  };

  const STEPS = [
    { label: 'Corporate',  sub: 'Business profile'     },
    { label: 'Fiscal',     sub: 'Tax & registration'   },
    { label: 'Operating',  sub: 'Facilities & assets'  },
    { label: 'Activate',   sub: 'Subscription'         },
    { label: 'Complete',   sub: 'Launch hub'            },
  ];

  return (
    <div className="fixed inset-0 bg-[#0d0020] flex font-sans overflow-hidden">
      {/* ── Ambient background ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-violet-800/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-900/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)',backgroundSize:'80px 80px'}} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0d0020_100%)]" />
      </div>

      {/* ── Left sidebar (desktop) ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col justify-between p-10 relative z-10 border-r border-white/5">
        {/* Logo / brand */}
        <div>
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-[9px] font-black uppercase tracking-[0.3em] text-violet-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Setup Mode
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white mb-2 leading-tight">Corporate<br/>Hub Setup</h2>
          <p className="text-white/30 text-xs font-medium leading-relaxed mb-10">Configure your enterprise profile to unlock the full platform.</p>

          {/* Vertical step list */}
          <div className="space-y-1 relative">
            {/* Connector line */}
            <div className="absolute left-[17px] top-5 bottom-5 w-px bg-white/8" />
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-white/[0.07]' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-black transition-all duration-300 z-10 ${
                    done   ? 'bg-violet-500 text-white shadow-lg shadow-violet-900/50' :
                    active ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-900/50 scale-110' :
                             'bg-white/5 text-white/25 border border-white/8'
                  }`}>
                    {done ? <Check size={13} /> : n}
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-wider transition-colors ${active ? 'text-white' : done ? 'text-white/50' : 'text-white/25'}`}>{s.label}</p>
                    <p className={`text-[9px] font-medium transition-colors ${active ? 'text-violet-400' : 'text-white/15'}`}>{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest">
          <ShieldCheck size={12} className="text-violet-400/50" />
          Secured · Nexa Intelligence Ltd
        </div>
      </div>

      {/* ── Main form area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-[9px] font-black uppercase tracking-[0.3em] text-violet-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Setup
          </span>
          {/* Mobile step pills */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => {
              const n = i + 1;
              return (
                <div key={n} className={`rounded-full transition-all duration-500 ${step === n ? 'w-6 h-1.5 bg-violet-400' : step > n ? 'w-1.5 h-1.5 bg-violet-500/50' : 'w-1.5 h-1.5 bg-white/10'}`} />
              );
            })}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-12 xl:px-16 pb-6">
          <div className="max-w-2xl mx-auto">{/* max width for comfortable reading */}

          {/* ── STEP 1: Corporate Profile ─────────────────────── */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 pt-6 md:pt-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-3">Step 1 of 5</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">Corporate Profile</span>
                </h2>
                <p className="text-white/40 font-medium text-sm">Verify your legal business identity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Legal Business Entity Name</label>
                  <input className={inputCls} value={companyDetails.name} onChange={e => setCompanyDetails({...companyDetails, name: e.target.value})} placeholder="Global Agri Partners Ltd" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Primary Operating Address</label>
                  <input className={inputCls} value={companyDetails.address} onChange={e => setCompanyDetails({...companyDetails, address: e.target.value})} placeholder="Plots 14-16, Kampala Business Park" />
                </div>
                <div>
                  <label className={labelCls}>Official Contact Email</label>
                  <input className={inputCls} type="email" value={companyDetails.email} onChange={e => setCompanyDetails({...companyDetails, email: e.target.value})} placeholder="hq@company.com" />
                </div>
                <div>
                  <label className={labelCls}>Corporate Phone</label>
                  <input className={inputCls} value={companyDetails.phone} onChange={e => setCompanyDetails({...companyDetails, phone: e.target.value})} placeholder="+256 700 000000" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Fiscal Identity ───────────────────────── */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 pt-6 md:pt-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-3">Step 2 of 5</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">Fiscal Identity</span>
                </h2>
                <p className="text-white/40 font-medium text-sm">Statutory registration and tax identification.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business Registration (BRN)</label>
                  <input className={inputCls + " tracking-widest"} value={companyDetails.regNumber} onChange={e => setCompanyDetails({...companyDetails, regNumber: e.target.value})} placeholder="8002XXXX" />
                </div>
                <div>
                  <label className={labelCls}>Tax ID (TIN)</label>
                  <input className={inputCls + " tracking-widest"} value={companyDetails.tin} onChange={e => setCompanyDetails({...companyDetails, tin: e.target.value})} placeholder="101XXXXXXX" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Director / Owner Names</label>
                  <input className={inputCls} value={companyDetails.directors} onChange={e => setCompanyDetails({...companyDetails, directors: e.target.value})} placeholder="Full names separated by commas" />
                </div>

                {user?.businessType?.toLowerCase().includes('coffee export') && (
                  <div className="md:col-span-2 bg-amber-500/10 border border-amber-400/20 p-6 rounded-2xl animate-in zoom-in duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck size={16} className="text-amber-400" />
                      <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">UCDA Compliance Required</h4>
                    </div>
                    <label className={labelCls.replace('text-white/40', 'text-amber-400/70')}>UCDA Registration Number</label>
                    <input className={inputCls + " border-amber-400/20 focus:border-amber-400/50"} value={companyDetails.ucdaNumber} onChange={e => setCompanyDetails({...companyDetails, ucdaNumber: e.target.value})} placeholder="EXP/XXXX/2024" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Operating Framework ──────────────────── */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 pt-6 md:pt-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-3">Step 3 of 5</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">Operating Framework</span>
                </h2>
                <p className="text-white/40 font-medium text-sm">Define your initial operational assets.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Initial Production Unit Name</label>
                  <input className={inputCls} placeholder="e.g. Masaka Regional Hub" value={farmName} onChange={e => setFarmName(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Facility Location</label>
                  <input className={inputCls} placeholder="e.g. Bukakata, Masaka District" value={farmLocation} onChange={e => setFarmLocation(e.target.value)} />
                </div>
                <button
                  onClick={handleAddFarm}
                  className="w-full bg-white/[0.04] border-2 border-dashed border-violet-400/20 hover:border-violet-400/40 text-violet-400/60 hover:text-violet-400 font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl transition-all"
                >
                  + Initialize Facility Node
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Activation Payment ────────────────────── */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 pt-6 md:pt-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-3">Step 4 of 5</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">Account Activation</span>
                </h2>
                <p className="text-white/40 font-medium text-sm">Activate your hub for <span className="text-white/70 font-black">UGX 15,000/mo</span>. Choose your payment method.</p>
              </div>

              {/* Provider toggle */}
              <div className="flex p-1.5 bg-white/[0.04] border border-white/8 rounded-2xl max-w-xs gap-1.5">
                <button type="button" onClick={() => setSelectedActivationProvider('MTN')}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedActivationProvider === 'MTN' ? 'bg-[#ffcc00] text-[#003366] shadow-lg' : 'text-white/40 hover:text-white/60'}`}>
                  MTN MoMo
                </button>
                <button type="button" onClick={() => setSelectedActivationProvider('AIRTEL')}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedActivationProvider === 'AIRTEL' ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>
                  Airtel
                </button>
              </div>

              {/* Payment card */}
              <div className="max-w-md">
                <div className={`w-full rounded-2xl p-6 md:p-8 border text-left overflow-hidden relative transition-all duration-500 ${selectedActivationProvider === 'MTN' ? 'bg-gradient-to-br from-[#ffcc00] to-[#e6b800] border-[#cc9900]/30 text-[#003366]' : 'bg-gradient-to-br from-slate-900/80 to-black/80 border-white/10 text-white backdrop-blur-sm'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${selectedActivationProvider === 'MTN' ? 'text-[#003366]/60' : 'text-violet-400'}`}>Monthly Activation</p>
                    <Globe size={18} className="opacity-30" />
                  </div>
                  <div className="space-y-8">
                    {selectedActivationProvider === 'MTN' ? (
                      <div>
                        <p className="text-[10px] font-black text-[#003366]/60 uppercase tracking-widest mb-3">Mobile Money Recipient</p>
                        <p className="text-xl md:text-2xl font-black tracking-tighter">+256 768 638225</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-50">Nexa Intelligence Hub</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Mobile Money Recipient</p>
                        <p className="text-xl md:text-2xl font-black tracking-tighter">+256 758 762690</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-white/40">Nexa Intelligence Hub</p>
                      </div>
                    )}
                    <div className={`flex justify-between items-end border-t pt-6 ${selectedActivationProvider === 'MTN' ? 'border-[#003366]/10' : 'border-white/8'}`}>
                      <div>
                        <p className={`text-[8px] font-black uppercase tracking-widest ${selectedActivationProvider === 'MTN' ? 'opacity-40' : 'text-white/30'}`}>Amount</p>
                        <p className="font-black text-emerald-500 text-xs">UGX 15,000/mo</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[8px] font-black uppercase tracking-widest ${selectedActivationProvider === 'MTN' ? 'opacity-40' : 'text-white/30'}`}>Status</p>
                        <p className={`font-black uppercase text-xs animate-pulse ${selectedActivationProvider === 'MTN' ? 'text-[#003366]' : 'text-violet-300'}`}>Awaiting Payment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-wider">Send payment above, then proceed to complete setup.</p>
            </div>
          )}

          {/* ── STEP 5: Complete ─────────────────────────────── */}
          {step === 5 && (
            <div className="space-y-8 text-center animate-in zoom-in duration-500 pt-10 md:pt-16 flex flex-col items-center">
              {/* Check ring */}
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-xl" />
                <svg viewBox="0 0 96 96" className="w-full h-full relative" fill="none">
                  <circle cx="48" cy="48" r="43" stroke="white" strokeWidth="1.5" strokeOpacity="0.06" />
                  <circle cx="48" cy="48" r="43" stroke="url(#obGrad)" strokeWidth="1.5" strokeLinecap="round"
                    strokeDasharray="270" strokeDashoffset="0"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                  <defs>
                    <linearGradient id="obGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" stroke="url(#obChk)" />
                    <defs>
                      <linearGradient id="obChk" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Configuration Ready
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mt-4 mb-3">
                  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">Ready to Launch.</span>
                </h2>
                <p className="text-white/40 font-medium text-base max-w-sm mx-auto leading-relaxed">
                  Your corporate infrastructure for <span className="text-white/80 font-black">{companyDetails.name || 'your company'}</span> is ready for deployment.
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 text-left max-w-sm w-full mx-auto">
                <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Fiscal Summary</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Business Profile', ok: !!companyDetails.name },
                    { label: 'TIN Identified', ok: !!companyDetails.tin },
                    { label: 'Registry Linked', ok: !!companyDetails.regNumber },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs font-bold text-white/50">
                      <span>{item.label}</span>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${item.ok ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                        {item.ok ? <Check size={11} className="text-violet-400" /> : <span className="text-white/20 text-[8px]">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── QR Code (desktop only) ───────────────────────── */}
          {isDesktop && step === 1 && (
            <div className="mt-8 flex justify-start">
              <div className="bg-white/[0.04] border border-white/8 p-5 rounded-2xl text-center max-w-xs">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <QrCode size={13} className="text-violet-400" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Continue on Mobile</span>
                </div>
                <div className="bg-white p-3 rounded-xl inline-block">
                  <QRCodeSVG value={mobileUrl} size={120} level="M" bgColor="#ffffff" fgColor="#0a0a1a" />
                </div>
                <p className="text-[8px] font-bold text-white/30 mt-3 uppercase tracking-wider">Sign in on mobile to continue</p>
              </div>
            </div>
          )}
          {isDesktop && step > 1 && step < 4 && (
            <div className="mt-8">
              {!showQrCode ? (
                <button onClick={() => setShowQrCode(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/8 rounded-xl text-white/30 hover:text-violet-400 transition-colors text-[10px] font-black uppercase tracking-widest">
                  <Smartphone size={13} className="text-violet-400" />
                  Continue on Mobile
                </button>
              ) : (
                <div className="bg-white/[0.04] border border-white/8 p-5 rounded-2xl text-center max-w-xs animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Scan to Continue</span>
                    <button onClick={() => setShowQrCode(false)} className="text-white/30 hover:text-white/60"><X size={14} /></button>
                  </div>
                  <div className="bg-white p-3 rounded-xl inline-block">
                    <QRCodeSVG value={mobileUrl} size={120} level="M" bgColor="#ffffff" fgColor="#0a0a1a" />
                  </div>
                  <p className="text-[8px] font-bold text-emerald-400 mt-3">Setup resumes automatically after login</p>
                </div>
              )}
            </div>
          )}

          {/* ── Bottom nav ──────────────────────────────────── */}
          <div className="mt-10 mb-4 relative">
            {/* Error */}
            {stepError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={14} className="mr-2 shrink-0" />
                {stepError}
              </div>
            )}
            <div className="flex justify-between items-center gap-4">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-white/30 hover:text-white/60 font-black uppercase tracking-widest text-[10px] transition-colors">
                  ← Previous
                </button>
              ) : <div />}

              {step < totalSteps ? (
                <button onClick={handleNextStep} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-violet-900/50 hover:scale-[1.03] active:scale-95 transition-all">
                  Proceed <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleFinish} className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-violet-900/50 hover:scale-[1.03] active:scale-95 transition-all">
                  Launch Hub <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          </div>{/* /max-w-2xl */}
        </div>{/* /scrollable content */}
      </div>{/* /main form area */}
    </div>
  );
}


import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, InventoryItem, Farm } from '../types';
import { ChevronRight, Check, Package, Users, Building, Flag, Phone, Mail, Hash, Globe, Scale, Landmark, ShieldCheck, UserCheck, AlertCircle, FileText, X, ArrowRight, Smartphone, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
    // Point to /login so the user authenticates on mobile and gets auto-redirected
    // to the Corporate Profile Setup (Onboarding shows automatically if setupComplete = false)
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
    // Comprehensive update of extended user profile
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

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-16 px-4 md:px-12 relative">
      <div className="absolute left-12 right-12 top-5 h-0.5 bg-slate-100 dark:bg-slate-700 -z-10"></div>
      {[1, 2, 3, 4, 5].map(s => (
        <div key={s} className="flex flex-col items-center bg-white dark:bg-slate-900 z-10 px-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 shadow-sm ${
            step >= s 
            ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xl scale-110' 
            : 'bg-slate-50 text-slate-300 dark:bg-slate-800'
          }`}>
            {step > s ? <Check size={20} /> : s}
          </div>
          <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-4 ${step >= s ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
             {s === 1 && 'Corporate'}
             {s === 2 && 'Fiscal'}
             {s === 3 && 'Operating'}
             {s === 4 && 'Activate'}
             {s === 5 && 'Complete'}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] md:rounded-[4rem] shadow-2xl w-full max-w-5xl overflow-hidden transition-all border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row min-h-[700px]">
        
        {/* Branding Sidebar */}
        <div className="md:w-1/3 bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-12 opacity-10"><Building size={200} /></div>
            <div className="relative z-10">
                <ShieldCheck size={40} className="text-emerald-500 mb-8" />
                <h1 className="text-4xl font-black tracking-tighter leading-tight mb-4">Account Integrity Setup</h1>
                <p className="text-slate-400 font-medium leading-relaxed">Mandatory identity verification for agricultural enterprise nodes on the Nexa platform.</p>
            </div>
            <div className="relative z-10 pt-12 space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secured Layer Established</span>
                </div>
            </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col overflow-y-auto max-h-[90vh] scrollbar-thin">
            <StepIndicator />

            {/* STEP 1: Corporate Profile */}
            {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Corporate Profile</h2>
                        <p className="text-slate-500 font-medium">Verify your legal business identity.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Legal Business Entity Name</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.name} 
                                onChange={e => setCompanyDetails({...companyDetails, name: e.target.value})} 
                                placeholder="Global Agri Partners Ltd" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Primary Operating Address</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.address} 
                                onChange={e => setCompanyDetails({...companyDetails, address: e.target.value})} 
                                placeholder="Plots 14-16, Kampala Business Park" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Official Contact Email</label>
                             <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.email} 
                                onChange={e => setCompanyDetails({...companyDetails, email: e.target.value})} 
                                placeholder="hq@company.com" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Corporate Phone</label>
                             <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.phone} 
                                onChange={e => setCompanyDetails({...companyDetails, phone: e.target.value})} 
                                placeholder="+256 700..." 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Fiscal Identity */}
            {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Fiscal Identity</h2>
                        <p className="text-slate-500 font-medium">Statutory registration and tax identification.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Business Registration (BRN)</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner tracking-widest" 
                                value={companyDetails.regNumber} 
                                onChange={e => setCompanyDetails({...companyDetails, regNumber: e.target.value})} 
                                placeholder="8002XXXX" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Tax ID (TIN)</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner tracking-widest" 
                                value={companyDetails.tin} 
                                onChange={e => setCompanyDetails({...companyDetails, tin: e.target.value})} 
                                placeholder="101XXXXXXX" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Director / Owner Names</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.directors} 
                                onChange={e => setCompanyDetails({...companyDetails, directors: e.target.value})} 
                                placeholder="Full names separated by commas" 
                            />
                        </div>

                        {/* Uganda-Specific Validation Logic */}
                        {user?.businessType?.toLowerCase().includes('coffee export') && (
                            <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2rem] border border-amber-100 dark:border-amber-800 animate-in zoom-in duration-300">
                                <div className="flex items-center space-x-3 mb-6">
                                    <ShieldCheck className="text-amber-600" />
                                    <h4 className="text-[10px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest">UCDA Compliance required</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-[0.4em] px-4">UCDA Registration Number</label>
                                    <input 
                                        required
                                        className="w-full border-none bg-white dark:bg-slate-950 p-5 rounded-2xl dark:text-white font-black outline-none shadow-sm focus:ring-4 focus:ring-amber-500/10" 
                                        value={companyDetails.ucdaNumber} 
                                        onChange={e => setCompanyDetails({...companyDetails, ucdaNumber: e.target.value})} 
                                        placeholder="EXP/XXXX/2024" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 3: Operating Logic */}
            {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Operating Framework</h2>
                        <p className="text-slate-500 font-medium">Define your initial operational assets.</p>
                    </div>
                    <div className="space-y-8">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Initial Production Unit Name</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" placeholder="e.g. Masaka Regional Hub" value={farmName} onChange={e => setFarmName(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Facility Location</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" placeholder="e.g. Bukakata, Masaka District" value={farmLocation} onChange={e => setFarmLocation(e.target.value)} />
                         </div>
                         <button onClick={handleAddFarm} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl hover:bg-slate-100 transition-all">
                            + Initialize Faciltiy Node
                         </button>
                    </div>
                </div>
            )}
            
            {/* STEP 4: Account Activation Payment */}
            {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Landmark size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">Account Activation</h2>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">Activate your enterprise hub with a monthly subscription of <span className="font-black text-slate-900 dark:text-white">UGX 15,000</span>.</p>
                    </div>

                    {/* Provider Toggle */}
                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-sm mx-auto w-full">
                        <button 
                            type="button"
                            onClick={() => setSelectedActivationProvider('MTN')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedActivationProvider === 'MTN' ? 'bg-[#ffcc00] text-[#003366] shadow-lg' : 'text-slate-400'}`}
                        >
                            <span>MTN MoMo</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setSelectedActivationProvider('AIRTEL')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedActivationProvider === 'AIRTEL' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            <span>Airtel Money</span>
                        </button>
                    </div>

                    {/* Payment Card */}
                    <div className="max-w-md mx-auto w-full">
                        <div className={`w-full rounded-2xl p-6 md:p-8 shadow-2xl border text-left overflow-hidden relative transition-all duration-500 ${selectedActivationProvider === 'MTN' ? 'bg-gradient-to-br from-[#ffcc00] to-[#e6b800] border-[#cc9900]/30 text-[#003366]' : 'bg-gradient-to-br from-slate-900 to-black border-white/10 text-white'}`}>
                            <div className="flex justify-between items-start mb-8">
                                <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${selectedActivationProvider === 'MTN' ? 'text-[#003366]/60' : 'text-blue-400'}`}>Monthly Activation</p>
                                <Globe size={20} className={selectedActivationProvider === 'MTN' ? 'text-[#003366]/30' : 'text-blue-400 opacity-50'} />
                            </div>
                            
                            <div className="space-y-8 relative z-10">
                                {selectedActivationProvider === 'MTN' ? (
                                    <div>
                                        <p className="text-[10px] font-black text-[#003366]/60 uppercase tracking-widest mb-4">Mobile Money Recipient</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center shadow-xl shrink-0 overflow-hidden">
                                                <svg viewBox="0 0 60 60" className="w-10 h-10">
                                                    <rect width="60" height="60" fill="#003366" rx="8"/>
                                                    <rect x="8" y="25" width="44" height="22" rx="4" fill="#ffcc00"/>
                                                    <text x="30" y="41" textAnchor="middle" fill="#003366" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif">MoMo</text>
                                                    <text x="30" y="18" textAnchor="middle" fill="#ffcc00" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">MTN</text>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xl md:text-2xl font-black text-[#003366] tracking-tighter leading-none">+256 768 638225</p>
                                                <p className="text-[10px] font-bold text-[#003366]/50 uppercase tracking-widest mt-2">Nexa Intelligence Hub</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Mobile Money Recipient</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shrink-0 overflow-hidden p-1">
                                                <svg viewBox="0 0 60 60" className="w-10 h-10">
                                                    <rect width="60" height="60" fill="white" rx="8"/>
                                                    <path d="M15 28C15 28 20 18 30 18C38 18 42 28 42 28" fill="none" stroke="#ED1C24" strokeWidth="5" strokeLinecap="round"/>
                                                    <circle cx="18" cy="26" r="4" fill="#ED1C24"/>
                                                    <text x="30" y="44" textAnchor="middle" fill="#ED1C24" fontSize="10" fontWeight="900" fontFamily="Arial, sans-serif">airtel</text>
                                                    <text x="30" y="54" textAnchor="middle" fill="#F7941D" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">money</text>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none">+256 758 762690</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Nexa Intelligence Hub</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`flex justify-between items-end border-t pt-6 ${selectedActivationProvider === 'MTN' ? 'border-[#003366]/10' : 'border-white/5'}`}>
                                    <div>
                                        <p className={`text-[8px] font-black uppercase tracking-widest ${selectedActivationProvider === 'MTN' ? 'text-[#003366]/40' : 'text-slate-500'}`}>Amount</p>
                                        <p className="font-black text-emerald-600 uppercase text-sm">UGX 15,000/mo</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[8px] font-black uppercase tracking-widest ${selectedActivationProvider === 'MTN' ? 'text-[#003366]/40' : 'text-slate-500'}`}>Status</p>
                                        <p className={`font-black uppercase text-xs animate-pulse ${selectedActivationProvider === 'MTN' ? 'text-[#003366]' : 'text-white'}`}>Awaiting Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Send payment to the number above, then proceed to complete setup.</p>
                </div>
            )}
            
            {/* STEP 5: Activation */}
             {step === 5 && (
                <div className="space-y-8 text-center animate-in zoom-in duration-500 flex-1 flex flex-col justify-center">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-emerald-600 shadow-2xl border-4 border-white dark:border-slate-800">
                        <UserCheck size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Configuration Ready</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your corporate infrastructure for <span className="font-black text-slate-900 dark:text-white">{companyDetails.name}</span> is ready for deployment.
                    </p>
                    <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 text-left max-w-sm mx-auto w-full">
                         <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Fiscal Summary</h4>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                 <span>TIN Identified</span>
                                 <Check size={14} className="text-emerald-500"/>
                             </div>
                             <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                 <span>Registry Linked</span>
                                 <Check size={14} className="text-emerald-500"/>
                             </div>
                         </div>
                    </div>
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-6 shrink-0 relative">
                {/* QR Code for Desktop Users - Prominent on Corporate Profile (Step 1) */}
                {isDesktop && step === 1 && (
                  <div className="flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg text-center max-w-xs w-full">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <QrCode size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Continue on Mobile</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl inline-block shadow-inner border">
                        <QRCodeSVG 
                          value={mobileUrl}
                          size={140}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#0a0a1a"
                        />
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Sign in on mobile to continue setup</p>
                      <p className="text-[8px] font-bold text-emerald-500 mt-1">Use your email &amp; password — setup resumes automatically</p>
                    </div>
                  </div>
                )}

                {/* QR Code toggle for other steps */}
                {isDesktop && step > 1 && step < 4 && (
                  <div className="flex items-center justify-center">
                    {!showQrCode ? (
                      <button 
                        onClick={() => setShowQrCode(true)}
                        className="flex items-center space-x-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
                      >
                        <Smartphone size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-300">Continue on Mobile</span>
                      </button>
                    ) : (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg text-center animate-in zoom-in duration-300 max-w-xs w-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <QrCode size={14} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scan to Continue on Mobile</span>
                          </div>
                          <button onClick={() => setShowQrCode(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                        </div>
                        <div className="bg-white p-4 rounded-xl inline-block shadow-inner border">
                          <QRCodeSVG 
                            value={mobileUrl}
                            size={140}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#0a0a1a"
                          />
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Sign in on mobile to continue</p>
                        <p className="text-[8px] font-bold text-emerald-500 mt-1">Setup resumes automatically after login</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-10 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-colors text-[10px]">
                        Prev Stage
                    </button>
                ) : <div></div>}
                
                {stepError && (
                    <div className="absolute -top-16 left-0 right-0 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-2xl flex items-center font-bold border border-red-100 dark:border-red-800 animate-in slide-in-from-top-2">
                        <AlertCircle size={16} className="mr-2 shrink-0" />
                        {stepError}
                    </div>
                )}

                {step < totalSteps ? (
                    <button onClick={handleNextStep} className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center">
                        Proceed <ArrowRight size={16} className="ml-2" />
                    </button>
                ) : (
                    <button onClick={handleFinish} className="px-16 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all text-xs">
                        Inject Corporate Stack
                    </button>
                )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

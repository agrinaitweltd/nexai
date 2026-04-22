import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  ShieldCheck, 
  Globe2, 
  BarChart3, 
  Users, 
  ArrowRight,
  Menu,
  X,
  Ship,
  DollarSign,
  Tractor,
  Leaf,
  ClipboardCheck,
  Building2,
  Briefcase,
  Heart,
  Link2,
  Lightbulb,
  Database,
  LineChart,
  Cpu,
  Cloud,
  CheckCircle2,
  Mail,
  Linkedin,
  Sprout,
  Activity,
  FileText,
  TrendingUp,
  MapPin,
  Zap,
  Package,
  Lock
} from 'lucide-react';
import { NexaLogo } from '../components/NexaLogo';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useScrollProgress(ref: React.RefObject<HTMLDivElement>, steps: number) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / totalHeight));
      setProgress(raw);
      setStep(Math.min(steps - 1, Math.floor(raw * steps)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, steps]);
  return { step, progress };
}

const ROTATING_WORDS = ['Farms', 'Finance', 'Livestock', 'Crops'];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const heroAnim = useInView(0.1);
  const valuesAnim = useInView();
  const howAnim = useInView();
  const featuresAnim = useInView();
  const techAnim = useInView();
  const teamAnim = useInView();
  const statsAnim = useInView();

  const stats = [
    { label: "Active Export Hubs", value: "120+" },
    { label: "Countries Served", value: "18+" },
    { label: "Volume Tracked", value: "25k+ Tons" },
    { label: "Compliance Rate", value: "99.9%" }
  ];

  const features = [
    { icon: Tractor, title: "Farm & Livestock Management", desc: "Complete oversight of production units, animal health tracking, soil metrics, and labor allocations across all your farms." },
    { icon: Leaf, title: "Crop Lifecycle Tracking", desc: "Monitor every stage from planting to harvest with yield forecasting, quality grading, and real-time field insights." },
    { icon: Ship, title: "Export & Logistics", desc: "End-to-end shipment manifests, customs documentation, and global logistics tracking with built-in compliance automation." },
    { icon: Users, title: "Staff & Department Control", desc: "Manage personnel across multiple business units with granular role-based access, attendance tracking, and department budgets." },
    { icon: DollarSign, title: "Financial Intelligence", desc: "Integrated fiscal ledger for tracking production costs, purchase orders, requisition approvals, and real-time revenue analytics." },
    { icon: ClipboardCheck, title: "Compliance & Reporting", desc: "Automated handling of regulatory registrations, tax IDs, export certifications, and one-click statutory reports." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Visual insights across every operation — inventory levels, financial health, staff performance, and seasonal trend analysis." },
    { icon: ShieldCheck, title: "Document Vault", desc: "Securely store and manage business-critical documents, certificates, contracts, and compliance records with encrypted cloud storage." }
  ];

  const values = [
    { icon: Heart, title: "Empowering Farmers", desc: "Intelligent tools for every farmer", color: "text-emerald-600 bg-emerald-50" },
    { icon: ShieldCheck, title: "Enabling Trust", desc: "Transparent & verified data", color: "text-emerald-600 bg-emerald-50" },
    { icon: Link2, title: "Connected Ecosystem", desc: "Farm to market, linked", color: "text-emerald-600 bg-emerald-50" },
    { icon: Lightbulb, title: "Data-Driven Decisions", desc: "Insights that drive action", color: "text-emerald-600 bg-emerald-50" }
  ];

  const howItWorks = [
    { step: "01", title: "Create Your Account", desc: "Sign up on the Nexa platform with your business details — it only takes a few minutes.", badge: "Quick Start", badgeColor: "text-emerald-600" },
    { step: "02", title: "Subscribe for $4.99/mo", desc: "Activate your enterprise hub with a simple monthly subscription via card, MTN MoMo or Airtel Money.", badge: "Affordable", badgeColor: "text-blue-600" },
    { step: "03", title: "Configure Your Profile", desc: "Set up your farms, staff, inventory, and compliance details through guided onboarding.", badge: "Quick & Easy", badgeColor: "text-purple-600" },
    { step: "04", title: "Manage Operations Anywhere", desc: "Monitor, track, and manage your entire enterprise from anywhere — anytime, on any device.", badge: "Anywhere 24/7", badgeColor: "text-amber-600" }
  ];

  const techFeatures = [
    { icon: Database, title: "Data Intelligence", desc: "Turn raw agricultural information into simple insights that help farmers make better decisions for their animals and farms." },
    { icon: LineChart, title: "Advanced Analytics", desc: "Understand how operations are moving, selling, and balancing, and see trends for each unit at the farm level." },
    { icon: Cpu, title: "AI-Ready Architecture", desc: "Built so the system can learn from farm data and help detect health problems or productivity changes early." },
    { icon: Cloud, title: "Scalable Platform", desc: "A strong cloud system that can start small and grow easily as more farmers, produce, and data join the platform." }
  ];

  const scrollStoryRef = useRef<HTMLDivElement>(null);
  const { step: storyStep } = useScrollProgress(scrollStoryRef as React.RefObject<HTMLDivElement>, 4);

  const storyChapters = [
    {
      tag: 'Farm Operations',
      headline: 'Run every farm like a Fortune 500 company.',
      body: 'Track fields, manage livestock health, schedule labor, and monitor soil metrics — all from a single unified dashboard built for agricultural scale.',
      accent: 'from-emerald-500 to-teal-400',
      cards: [
        { icon: Tractor, title: 'Field Manager', stat: '14 Active Fields', sub: 'Real-time crop stage', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-400' },
        { icon: Activity, title: 'Livestock Health', stat: '98.4% Herd Health', sub: 'Automated monitoring', color: 'bg-teal-50 text-teal-600', dot: 'bg-teal-400' },
        { icon: Sprout, title: 'Crop Lifecycle', stat: '6 Harvest Stages', sub: 'Yield forecasting live', color: 'bg-green-50 text-green-600', dot: 'bg-green-400' },
        { icon: MapPin, title: 'Farm Mapping', stat: '340 Acres Tracked', sub: 'GPS-grade accuracy', color: 'bg-lime-50 text-lime-600', dot: 'bg-lime-400' },
      ]
    },
    {
      tag: 'Financial Intelligence',
      headline: 'Complete fiscal clarity, zero spreadsheets.',
      body: 'From purchase orders to profit margins — track every shilling, manage multi-currency ledgers, and unlock real-time revenue analytics across all your business units.',
      accent: 'from-blue-500 to-indigo-400',
      cards: [
        { icon: TrendingUp, title: 'Revenue Analytics', stat: 'UGX 48.2M / Mo', sub: '↑ 23% this quarter', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-400' },
        { icon: DollarSign, title: 'Cost Ledger', stat: '1,240 Transactions', sub: 'Auto-categorized', color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-400' },
        { icon: FileText, title: 'Purchase Orders', stat: '38 Open Orders', sub: 'Approval pipeline', color: 'bg-violet-50 text-violet-600', dot: 'bg-violet-400' },
        { icon: BarChart3, title: 'Budget Tracker', stat: '94% On Budget', sub: '6 departments synced', color: 'bg-sky-50 text-sky-600', dot: 'bg-sky-400' },
      ]
    },
    {
      tag: 'Export & Compliance',
      headline: 'Ship globally. Comply automatically.',
      body: 'Generate export manifests, manage customs documentation, and track international shipments in real-time — all with built-in compliance automation for 18+ markets.',
      accent: 'from-amber-500 to-orange-400',
      cards: [
        { icon: Ship, title: 'Shipment Tracker', stat: '12 Active Shipments', sub: '6 countries in transit', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-400' },
        { icon: ClipboardCheck, title: 'Compliance Suite', stat: '99.9% Pass Rate', sub: 'Auto-checked certs', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
        { icon: Globe2, title: 'Global Markets', stat: '18+ Countries', sub: 'Active trade routes', color: 'bg-yellow-50 text-yellow-600', dot: 'bg-yellow-400' },
        { icon: ShieldCheck, title: 'Document Vault', stat: '430 Secure Files', sub: 'Encrypted storage', color: 'bg-red-50 text-red-600', dot: 'bg-red-400' },
      ]
    },
    {
      tag: 'Total Command',
      headline: 'One platform. Infinite scale.',
      body: 'Nexa brings every piece of your operation into a single intelligent hub — farms, staff, inventory, finance, exports, and compliance — ready to grow with you.',
      accent: 'from-slate-400 to-slate-300',
      cards: [
        { icon: Users, title: 'Staff Control', stat: '86 Team Members', sub: 'Role-based access', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
        { icon: Package, title: 'Inventory Hub', stat: '2,840 SKUs Tracked', sub: 'Multi-warehouse sync', color: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' },
        { icon: Zap, title: 'AI Insights', stat: '48 Recommendations', sub: 'Updated daily', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-400' },
        { icon: Lock, title: 'Secure & Private', stat: 'SOC-2 Grade', sub: 'Enterprise encryption', color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-400' },
      ]
    },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div id="top" className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes wordIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes wordOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-20px) scale(0.95); } }
        @keyframes cardEnter { from { opacity: 0; transform: translateY(28px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardExit { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-20px) scale(0.96); } }
        @keyframes textSlideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.05); } }
        .anim-fade-up { animation: fadeUp 0.8s ease-out both; }
        .anim-fade-in { animation: fadeIn 0.6s ease-out both; }
        .anim-scale-in { animation: scaleIn 0.6s ease-out both; }
        .anim-slide-left { animation: slideLeft 0.8s ease-out both; }
        .anim-slide-right { animation: slideRight 0.8s ease-out both; }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-card-enter { animation: cardEnter 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
        .anim-text-slide { animation: textSlideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
        .anim-glow { animation: glowPulse 4s ease-in-out infinite; }
        .word-in { animation: wordIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .word-out { animation: wordOut 0.35s ease-in forwards; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }
        .d4 { animation-delay: 0.4s; }
        .d5 { animation-delay: 0.5s; }
        .d6 { animation-delay: 0.6s; }
        .cd1 { animation-delay: 0.05s; }
        .cd2 { animation-delay: 0.15s; }
        .cd3 { animation-delay: 0.25s; }
        .cd4 { animation-delay: 0.35s; }
        .story-progress-bar { transition: width 0.6s cubic-bezier(0.34,1.2,0.64,1); }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/96 backdrop-blur-xl border-b border-slate-100/80 py-3 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.12)]' : 'bg-transparent py-5 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between">
          <div className="flex items-center cursor-pointer group" onClick={scrollToTop}>
            <NexaLogo className="h-7 md:h-9 transition-transform group-hover:scale-105 duration-300" />
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 bg-slate-50/80 backdrop-blur-sm px-3 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <a href="#top" className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all duration-200 rounded-xl hover:bg-white hover:shadow-sm">Home</a>
              <a href="#features" className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all duration-200 rounded-xl hover:bg-white hover:shadow-sm">Features</a>
              <a href="#pricing" className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all duration-200 rounded-xl hover:bg-white hover:shadow-sm">Pricing</a>
              <a href="#audience" className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-all duration-200 rounded-xl hover:bg-white hover:shadow-sm">About</a>
            </div>
            <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-100">Sign In</Link>
                <Link 
                    to="/login" 
                    className="relative overflow-hidden bg-slate-950 text-white px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 active:translate-y-0 group"
                >
                    <span className="relative z-10 flex items-center">Get Started <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
            </div>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden relative w-10 h-10 flex items-center justify-center text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95 hover:shadow-md">
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}><X size={18} /></div>
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}><Menu size={18} /></div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-slate-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] animate-in slide-in-from-top-3 duration-300">
            <div className="px-5 py-4 space-y-1.5">
                <a href="#top" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-emerald-50 hover:text-emerald-700 group">
                  <span>Home</span>
                  <div className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><ArrowRight size={12} /></div>
                </a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all group">
                  <span>Features</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-all"><ArrowRight size={12} /></div>
                </a>
                <a href="#audience" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all group">
                  <span>About</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-all"><ArrowRight size={12} /></div>
                </a>
                <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all group">
                  <span>Pricing</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-all"><ArrowRight size={12} /></div>
                </a>
            </div>
            <div className="px-5 pb-6 pt-2 grid grid-cols-2 gap-3 border-t border-slate-100">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center w-full border-2 border-slate-200 bg-white text-slate-900 text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all hover:border-slate-300 hover:shadow-md">Sign In</Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-slate-950 text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-black">Get Started <ArrowRight size={12} /></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section ref={heroAnim.ref} className="relative pt-28 pb-16 md:pt-48 md:pb-32 px-5 md:px-12 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl anim-float" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl anim-float" style={{ animationDelay: '3s' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={heroAnim.inView ? '' : 'opacity-0'}>
              <div className={`inline-flex items-center space-x-2.5 bg-white px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100 shadow-sm mb-6 md:mb-8 ${heroAnim.inView ? 'anim-fade-up' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Modernizing Agricultural Management Globally</span>
              </div>
              
              <h1 className={`text-4xl md:text-7xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-[0.95] max-w-4xl mb-6 md:mb-8 ${heroAnim.inView ? 'anim-fade-up d1' : ''}`}>
                Manage Your{' '}
                <span
                  className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 ${wordVisible ? 'word-in' : 'word-out'}`}
                  style={{ minWidth: '8ch', display: 'inline-block' }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>,{' '}
                <br className="hidden md:block" />
                & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Agricultural Exports.</span>
              </h1>
              
              <p className={`text-slate-500 text-base md:text-xl font-medium leading-relaxed max-w-2xl mb-8 md:mb-10 ${heroAnim.inView ? 'anim-fade-up d2' : ''}`}>
                Nexa combines traditional agricultural knowledge with modern technology, helping farmers worldwide track crop health, movement, and productivity — while connecting farmers, professionals, and markets through trusted data.
              </p>
              
              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${heroAnim.inView ? 'anim-fade-up d3' : ''}`}>
                <Link 
                  to="/login" 
                  className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center group"
                >
                  Get Started <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">
                  Learn More
                </a>
              </div>
          </div>
        </div>
      </section>

      {/* ─── SCROLL STORYTELLING SECTION ─── */}
      <section
        ref={scrollStoryRef}
        className="relative bg-slate-950"
        style={{ height: '400vh' }}
        aria-label="Platform story"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          {/* Background glow */}
          <div
            key={`glow-${storyStep}`}
            className={`absolute inset-0 pointer-events-none transition-all duration-700`}
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] anim-glow
              ${storyStep === 0 ? 'bg-emerald-500/20' : storyStep === 1 ? 'bg-blue-500/20' : storyStep === 2 ? 'bg-amber-500/20' : 'bg-slate-400/15'}`}
            />
          </div>

          {/* Top progress bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 story-progress-bar"
              style={{ width: `${((storyStep + 1) / 4) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="absolute top-8 right-6 md:right-12 flex items-center gap-3 z-20">
            {storyChapters.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${i === storyStep ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/25'}`}
              />
            ))}
          </div>

          {/* Chapter tag */}
          <div className="absolute top-8 left-6 md:left-12 z-20">
            <div
              key={`tag-${storyStep}`}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] anim-fade-in
                ${storyStep === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  storyStep === 1 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  storyStep === 2 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-white/10 border-white/20 text-white/70'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse
                ${storyStep === 0 ? 'bg-emerald-400' : storyStep === 1 ? 'bg-blue-400' : storyStep === 2 ? 'bg-amber-400' : 'bg-white/70'}`}
              />
              {storyChapters[storyStep].tag}
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 h-full px-6 md:px-12 max-w-7xl mx-auto w-full pt-16">

            {/* Left: Text panel */}
            <div className="lg:w-2/5 w-full text-center lg:text-left">
              <div key={`text-${storyStep}`} className="space-y-5">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 anim-text-slide cd1">
                  {String(storyStep + 1).padStart(2, '0')} / 04
                </p>
                <h2 className={`text-3xl md:text-5xl lg:text-[3.2rem] font-black tracking-tighter leading-[0.95] text-white anim-text-slide cd2`}>
                  {storyChapters[storyStep].headline}
                </h2>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-md anim-text-slide cd3">
                  {storyChapters[storyStep].body}
                </p>
                <div className="pt-2 anim-text-slide cd4">
                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 bg-gradient-to-r text-white shadow-lg
                      ${storyStep === 0 ? 'from-emerald-600 to-emerald-500 shadow-emerald-500/20' :
                        storyStep === 1 ? 'from-blue-600 to-blue-500 shadow-blue-500/20' :
                        storyStep === 2 ? 'from-amber-600 to-amber-500 shadow-amber-500/20' :
                        'from-slate-700 to-slate-600 shadow-slate-500/20'}`}
                  >
                    Explore feature <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Cards grid */}
            <div className="lg:w-3/5 w-full">
              <div key={`cards-${storyStep}`} className="grid grid-cols-2 gap-3 md:gap-4">
                {storyChapters[storyStep].cards.map((card, i) => (
                  <div
                    key={`${storyStep}-${i}`}
                    className={`anim-card-enter cd${i + 1} bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl p-5 md:p-6 hover:bg-white/10 hover:border-white/15 transition-all duration-300 group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                        <card.icon size={20} />
                      </div>
                      <div className={`w-2 h-2 rounded-full ${card.dot} mt-1`} />
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">{card.title}</p>
                    <p className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none mb-1">{card.stat}</p>
                    <p className="text-[11px] font-medium text-slate-500">{card.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint (only step 0) */}
          {storyStep === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 anim-fade-in">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Scroll to explore</p>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section ref={valuesAnim.ref} className="py-14 md:py-20 px-5 md:px-12 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 ${valuesAnim.inView ? '' : 'opacity-0'}`}>
            {values.map((v, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-500 group ${valuesAnim.inView ? `anim-fade-up d${i+1}` : ''}`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <v.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{v.title}</h4>
                    <p className="text-slate-500 text-xs font-medium">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="pricing" ref={howAnim.ref} className="py-20 md:py-36 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${howAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100 mb-6 ${howAnim.inView ? 'anim-fade-up' : ''}`}>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>How It Works</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${howAnim.inView ? 'anim-fade-up d1' : ''}`}>Access Our Unified Platform in Four Steps</h3>
            <p className={`text-slate-400 font-medium max-w-xl mx-auto text-sm md:text-base ${howAnim.inView ? 'anim-fade-up d2' : ''}`}>A simple, powerful platform that transforms your daily agricultural operations conveniently on your mobile.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className={`relative bg-white p-7 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group ${howAnim.inView ? `anim-scale-in d${i+1}` : 'opacity-0'}`}>
                <div className="text-5xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors absolute top-4 right-6">{item.step}</div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {i === 0 && <Users size={20} />}
                    {i === 1 && <DollarSign size={20} />}
                    {i === 2 && <ClipboardCheck size={20} />}
                    {i === 3 && <Globe2 size={20} />}
                  </div>
                  <h4 className={`font-bold text-slate-900 mb-3 ${item.badgeColor}`}>{item.title}</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">{item.desc}</p>
                  <span className={`text-[10px] font-bold ${item.badgeColor} uppercase tracking-wider`}>{item.badge}</span>
                </div>
                {i < 3 && <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-200 text-2xl">&rsaquo;</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="audience" className="py-20 md:py-36 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="mb-14 md:mb-20 space-y-3 text-center">
              <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.6em]">Built For</h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">Global Sector Leaders.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Coffee & Commodity Exporters", desc: "Specialized tools for the global export sector including manifest automation and compliance.", icon: Globe2 },
                { title: "Agricultural Companies", desc: "Enterprise-grade infrastructure for large-scale operations and value-addition factories.", icon: Building2 },
                { title: "Commercial Farm Owners", desc: "Direct production management for large-scale crop and livestock enterprises worldwide.", icon: Tractor },
                { title: "Production Managers", desc: "Day-to-day operational tools for managing field staff and inventory workflows.", icon: Briefcase }
              ].map((item, i) => (
                  <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <item.icon size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" ref={featuresAnim.ref} className="py-20 md:py-36 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className={`mb-14 md:mb-20 space-y-4 ${featuresAnim.inView ? '' : 'opacity-0'}`}>
             <h2 className={`text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] ${featuresAnim.inView ? 'anim-fade-up' : ''}`}>Core Features</h2>
             <h3 className={`text-3xl md:text-6xl font-black tracking-tighter leading-none ${featuresAnim.inView ? 'anim-fade-up d1' : ''}`}>Total Command Over <br/>Your Assets.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className={`p-7 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:bg-white/10 group ${featuresAnim.inView ? `anim-fade-up d${Math.min(i+1, 6)}` : 'opacity-0'}`}>
                <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section ref={techAnim.ref} className="py-20 md:py-36 bg-white px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${techAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100 mb-6 ${techAnim.inView ? 'anim-fade-up' : ''}`}>
              <Cpu size={14} className="text-emerald-500" />
              <span>Our Technology</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${techAnim.inView ? 'anim-fade-up d1' : ''}`}>
              Built for <span className="text-emerald-600">Trust</span>, Scale & Intelligence
            </h3>
            <p className={`text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base ${techAnim.inView ? 'anim-fade-up d2' : ''}`}>
              Nexa's platform architecture handles the complexity of modern agriculture — from remote farms to institutional-scale data operations worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {techFeatures.map((tf, i) => (
                <div key={i} className={`flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-500 group ${techAnim.inView ? `anim-slide-right d${i+1}` : 'opacity-0'}`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <tf.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{tf.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{tf.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={`bg-slate-900 rounded-2xl overflow-hidden relative ${techAnim.inView ? 'anim-slide-left d2' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              {/* Browser chrome bar */}
              <div className="relative z-10 px-5 py-3 flex items-center space-x-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 ml-3 uppercase tracking-wider">nexaagri.com — Dashboard</span>
                <div className="ml-auto flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[7px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
              <div className="relative z-10">
                <img
                  src="/dashboard-preview.png"
                  alt="Nexa Dashboard Preview"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: '420px' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" ref={teamAnim.ref} className="py-20 md:py-36 bg-slate-900 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${teamAnim.inView ? '' : 'opacity-0'}`}>
            <h2 className={`text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] mb-4 ${teamAnim.inView ? 'anim-fade-up' : ''}`}>Why Nexa</h2>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 ${teamAnim.inView ? 'anim-fade-up d1' : ''}`}>Built on Purpose.</h3>
            <p className={`text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base ${teamAnim.inView ? 'anim-fade-up d2' : ''}`}>
              Nexa exists to close the gap between raw agricultural potential and global market access — giving every enterprise the tools to compete at the highest level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Our Mission', title: 'Digitize Every Farm', body: 'To bring enterprise-grade operational clarity to every agricultural business — from single farms to multi-national export hubs — through simple, powerful technology.', accent: 'bg-emerald-500' },
              { label: 'Our Vision', title: 'A Connected Food Economy', body: 'A world where the journey from farm to fork is fully transparent, traceable, and trusted — where farmers have equal access to global markets and institutional-grade infrastructure.', accent: 'bg-blue-500' },
              { label: 'Our Promise', title: 'Always Improving', body: 'We continuously evolve with the needs of our users — shipping features that actually move businesses forward. Your feedback shapes every release.', accent: 'bg-amber-500' }
            ].map((item, i) => (
              <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-500 ${teamAnim.inView ? `anim-fade-up d${i+1}` : 'opacity-0'}`}>
                <div className={`w-1 h-10 rounded-full ${item.accent} mb-6`} />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">{item.label}</p>
                <h4 className="text-xl font-black text-white tracking-tighter mb-4">{item.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className={`mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 ${teamAnim.inView ? 'anim-fade-up d4' : 'opacity-0'}`}>
            {[
              { metric: '$4.99', label: 'Per month, all-inclusive' },
              { metric: '18+', label: 'Countries served' },
              { metric: '99.9%', label: 'Platform uptime' },
              { metric: '24/7', label: 'Data availability' }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/20 transition-all">
                <p className="text-3xl font-black text-white tracking-tighter mb-1">{s.metric}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsAnim.ref} className="bg-emerald-50/50 py-14 md:py-20 px-5 md:px-12 border-y border-emerald-100/50">
          <div className="max-w-7xl mx-auto">
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 ${statsAnim.inView ? '' : 'opacity-0'}`}>
                    {stats.map((s, i) => (
                        <div key={i} className={`text-center md:text-left space-y-2 ${statsAnim.inView ? `anim-fade-up d${i+1}` : ''}`}>
                            <p className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter">{s.value}</p>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-5 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-5">Ready to Transform Your Operations?</h3>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto mb-8">Join hundreds of agricultural enterprises across the globe already using Nexa to streamline their operations.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login" 
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center group"
            >
              Start Free Trial <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">View Features</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 md:py-20 bg-slate-50 border-t border-slate-100 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-14 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-5">
                <NexaLogo className="h-8" />
                <p className="text-slate-500 text-base max-w-sm font-medium leading-relaxed">
                    The modern management architecture for agricultural exports, value addition, and commercial production — built for the global market.
                </p>
                <div className="flex items-center space-x-3">
                  <a href="#" className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><Linkedin size={16} /></a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><Mail size={16} /></a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><Globe2 size={16} /></a>
                </div>
            </div>
            <div className="space-y-5">
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Platform</h5>
                <ul className="space-y-3 text-sm font-medium text-slate-600">
                    <li><Link to="/login" className="hover:text-emerald-600 transition-colors">Sign In</Link></li>
                    <li><Link to="/login" className="hover:text-emerald-600 transition-colors">Create Account</Link></li>
                    <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                </ul>
            </div>
            <div className="space-y-5">
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Legal</h5>
                <ul className="space-y-3 text-sm font-medium text-slate-600">
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Support</Link></li>
                </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">&copy; 2026 Nexa Systems Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

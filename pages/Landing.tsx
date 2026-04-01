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
  Phone,
  MessageCircle,
  Smartphone,
  CheckCircle2,
  Linkedin,
  Mail
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

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { step: "02", title: "Pay UGX 15,000/mo", desc: "Activate your enterprise hub with a simple monthly subscription via MTN MoMo or Airtel Money.", badge: "Affordable", badgeColor: "text-blue-600" },
    { step: "03", title: "Configure Your Profile", desc: "Set up your farms, staff, inventory, and compliance details through guided onboarding.", badge: "Quick & Easy", badgeColor: "text-purple-600" },
    { step: "04", title: "Manage Operations Anywhere", desc: "Monitor, track, and manage your entire enterprise from anywhere — anytime, on any device.", badge: "Anywhere 24/7", badgeColor: "text-amber-600" }
  ];

  const techFeatures = [
    { icon: Database, title: "Data Intelligence", desc: "Turn raw agricultural information into simple insights that help farmers make better decisions for their animals and farms." },
    { icon: LineChart, title: "Advanced Analytics", desc: "Understand how operations are moving, selling, and balancing, and see trends for each unit at the farm level." },
    { icon: Cpu, title: "AI-Ready Architecture", desc: "Built so the system can learn from farm data and help detect health problems or productivity changes early." },
    { icon: Cloud, title: "Scalable Platform", desc: "A strong cloud system that can start small and grow easily as more farmers, produce, and data join the platform." }
  ];

  const teamMembers = [
    { name: "Oliver Amanya Alinaitwe", role: "Founder", education: "Currently studying Information Technologies & Business Administration", initials: "OA", color: "from-emerald-500 to-teal-600" }
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
        .anim-fade-up { animation: fadeUp 0.8s ease-out both; }
        .anim-fade-in { animation: fadeIn 0.6s ease-out both; }
        .anim-scale-in { animation: scaleIn 0.6s ease-out both; }
        .anim-slide-left { animation: slideLeft 0.8s ease-out both; }
        .anim-slide-right { animation: slideRight 0.8s ease-out both; }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }
        .d4 { animation-delay: 0.4s; }
        .d5 { animation-delay: 0.5s; }
        .d6 { animation-delay: 0.6s; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-5 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
            <NexaLogo className="h-7 md:h-9" />
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a href="#top" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">Home</a>
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#team" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">Team</a>
            <a href="#audience" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">About</a>
            <div className="flex items-center space-x-4 ml-6 border-l border-slate-200 pl-8">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-colors">Sign In</Link>
                <Link 
                    to="/login" 
                    className="bg-emerald-600 text-white px-7 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
                >
                    Get Started
                </Link>
            </div>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 text-slate-900 bg-slate-50 rounded-xl border border-slate-100">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-8 shadow-2xl">
            <div className="space-y-5">
                <a href="#top" onClick={() => setIsMenuOpen(false)} className="block text-lg font-black uppercase tracking-tight text-slate-900">Home</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-lg font-black uppercase tracking-tight text-slate-900">Features</a>
                <a href="#team" onClick={() => setIsMenuOpen(false)} className="block text-lg font-black uppercase tracking-tight text-slate-900">Team</a>
                <a href="#audience" onClick={() => setIsMenuOpen(false)} className="block text-lg font-black uppercase tracking-tight text-slate-900">About</a>
            </div>
            <div className="space-y-3 pt-5 border-t">
                <Link to="/login" className="block w-full text-center py-3.5 text-slate-500 font-black uppercase tracking-widest text-xs">Sign In</Link>
                <Link to="/login" className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Get Started</Link>
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
                Manage Your Farms, <br className="hidden md:block" />
                Crops & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Agricultural Exports.</span>
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
      <section ref={howAnim.ref} className="py-20 md:py-36 px-5 md:px-12 bg-white">
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
            <div className={`bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden ${techAnim.inView ? 'anim-slide-left d2' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-500 ml-3 uppercase tracking-wider">nexaagri.com — Dashboard</span>
                </div>
                
                {/* Dashboard Screenshot Mockup */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Leaf size={14} className="text-emerald-400" /></div>
                      <div>
                        <p className="text-[9px] font-black text-white uppercase tracking-wider">Operations Hub</p>
                        <p className="text-[7px] font-bold text-slate-500">Global Overview</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[7px] font-bold text-emerald-400 uppercase">Live</span>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { val: '842', label: 'Farms', color: 'text-emerald-400' },
                      { val: '15.4k', label: 'Animals', color: 'text-blue-400' },
                      { val: 'UGX 12M', label: 'Revenue', color: 'text-amber-400' },
                      { val: '99.9%', label: 'Uptime', color: 'text-purple-400' }
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-700/50 p-2.5 rounded-lg text-center">
                        <p className={`text-sm font-black tracking-tighter ${s.color}`}>{s.val}</p>
                        <p className="text-[6px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="bg-slate-750 rounded-lg p-3 mb-3 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Production Output</p>
                      <div className="flex space-x-2">
                        {['1W', '1M', '3M'].map((period, i) => (
                          <span key={i} className={`text-[6px] font-bold px-2 py-0.5 rounded ${i === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}>{period}</span>
                        ))}
                      </div>
                    </div>
                    {/* Sparkline Chart */}
                    <div className="flex items-end space-x-1 h-16">
                      {[40, 55, 35, 65, 50, 70, 45, 80, 60, 75, 85, 70, 90, 78, 95, 88].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(16,185,129,0.3), rgba(16,185,129,${0.4 + (h/200)}))` }} />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row - Inventory + Alerts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 p-2.5 rounded-lg">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-2">Top Inventory</p>
                      {['Arabica Coffee', 'Robusta Beans', 'Vanilla Pods'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1">
                          <span className="text-[7px] font-bold text-slate-300">{item}</span>
                          <div className="h-1.5 w-12 rounded-full bg-slate-600 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${90 - i * 20}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-700/50 p-2.5 rounded-lg">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-2">Recent Activity</p>
                      {['New farm added', 'Export cleared', 'Staff assigned'].map((item, i) => (
                        <div key={i} className="flex items-center space-x-2 py-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-blue-400' : 'bg-amber-400'}`} />
                          <span className="text-[7px] font-bold text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" ref={teamAnim.ref} className="py-20 md:py-36 bg-emerald-50/20 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${teamAnim.inView ? '' : 'opacity-0'}`}>
            <h2 className={`text-[10px] font-black text-emerald-600 uppercase tracking-[0.6em] mb-4 ${teamAnim.inView ? 'anim-fade-up' : ''}`}>Leadership</h2>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${teamAnim.inView ? 'anim-fade-up d1' : ''}`}>Our Team</h3>
            <p className={`text-slate-400 font-medium max-w-xl mx-auto text-sm md:text-base ${teamAnim.inView ? 'anim-fade-up d2' : ''}`}>
              Experienced leaders at the intersection of agriculture, technology, and finance.
            </p>
          </div>

          <div className="flex justify-center">
            {teamMembers.map((member, i) => (
              <div key={i} className={`bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group text-center max-w-sm w-full ${teamAnim.inView ? `anim-scale-in d${i+1}` : 'opacity-0'}`}>
                <div className={`h-1.5 bg-gradient-to-r ${member.color}`} />
                <div className="p-8 md:p-10">
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${member.color} mx-auto mb-5 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg group-hover:scale-110 transition-transform border-4 border-white`}>
                    {member.initials}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1 group-hover:text-emerald-600 transition-colors">{member.name}</h4>
                  <p className="text-emerald-600 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed mb-4">{member.education}</p>
                  <div className="flex items-center justify-center space-x-3">
                    <a href="#" className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><Linkedin size={16} /></a>
                    <a href="#" className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"><Mail size={16} /></a>
                  </div>
                </div>
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

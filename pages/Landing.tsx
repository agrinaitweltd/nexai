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
  Lock,
  ChevronUp,
  Star,
  Quote,
  ChevronDown,
  Check,
  Play,
  MessageCircle,
  Award,
  Smartphone,
  Wifi,
  Bot
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
      if (totalHeight <= 0) {
        setProgress(0);
        setStep(0);
        return;
      }
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / totalHeight));
      const safeRaw = Number.isFinite(raw) ? raw : 0;
      const nextStep = Math.min(steps - 1, Math.floor(safeRaw * steps));
      setProgress(safeRaw);
      setStep(Number.isFinite(nextStep) ? nextStep : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref, steps]);
  return { step, progress };
}

const ROTATING_WORDS = ['Farms', 'Finance', 'Livestock', 'Crops'];

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('industries');
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
  const industriesAnim = useInView();
  const aiAnim = useInView();
  const pricingAnim = useInView();
  const testimonialsAnim = useInView();
  const faqAnim = useInView();
  const contactAnim = useInView();

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

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });

  const industries = [
    { icon: Globe2, title: 'Coffee & Commodity Export', desc: 'Manifest automation, phyto-sanitary certs, and real-time shipment tracking for commodities traded globally.', color: 'from-amber-500/10 to-amber-400/5', accent: 'bg-amber-500', tag: 'Export' },
    { icon: Tractor, title: 'Commercial Farming', desc: 'Full crop cycle management — from seed procurement to harvest grading — across unlimited farm units.', color: 'from-emerald-500/10 to-emerald-400/5', accent: 'bg-emerald-500', tag: 'Farming' },
    { icon: Activity, title: 'Livestock Production', desc: 'Herd health monitoring, vaccination scheduling, weight tracking, and profitability per animal.', color: 'from-teal-500/10 to-teal-400/5', accent: 'bg-teal-500', tag: 'Livestock' },
    { icon: Building2, title: 'Agro-Processing', desc: 'Factory-floor inventory, raw material purchasing, value-addition tracking, and batch quality control.', color: 'from-blue-500/10 to-blue-400/5', accent: 'bg-blue-500', tag: 'Processing' },
    { icon: Ship, title: 'Logistics & Supply Chain', desc: 'Track trucks, containers, and consignments from origin farm to destination port with live updates.', color: 'from-violet-500/10 to-violet-400/5', accent: 'bg-violet-500', tag: 'Logistics' },
    { icon: ShieldCheck, title: 'Compliance & Certification', desc: 'Handle ISO, GLOBALGAP, and export certifications with automated reminders and document storage.', color: 'from-rose-500/10 to-rose-400/5', accent: 'bg-rose-500', tag: 'Compliance' },
  ];

  const testimonials = [
    { name: 'James Ochieng', role: 'CEO, Nile Coffee Exporters Ltd', quote: 'Nexa completely transformed how we track our shipments. What used to take our logistics team 3 hours daily is now automated. Our compliance rate hit 100% for the first time.', rating: 5, country: 'Uganda' },
    { name: 'Amara Diallo', role: 'Operations Director, Sahel Agro', quote: "We manage 14 farms across 3 countries. Nexa gives us one view of everything — staff, crops, finance — all live. It's like having a control room for the entire business.", rating: 5, country: 'Senegal' },
    { name: 'Priya Menon', role: 'Farm Manager, IndoAg Holdings', quote: 'The livestock health module alone paid for the subscription in the first week. We caught a disease outbreak early because of the automated alerts. Saved our entire herd.', rating: 5, country: 'India' },
    { name: 'Carlos Mendez', role: 'Export Compliance Officer', quote: 'Every document we need — phyto, certificates of origin, customs forms — is auto-generated and stored. Audit prep went from 2 weeks to half a day.', rating: 5, country: 'Colombia' },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$4.99',
      period: '/month',
      description: 'Everything a solo operator or small farm needs to digitize operations.',
      highlight: false,
      features: [
        '1 Farm / Business Unit',
        'Up to 5 Staff Accounts',
        'Crop & Livestock Tracking',
        'Basic Financial Ledger',
        'Document Vault (5 GB)',
        'Email Support',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      price: '$19.99',
      period: '/month',
      description: 'For growing operations needing multi-farm visibility and export tools.',
      highlight: true,
      features: [
        'Up to 5 Farm Units',
        'Up to 25 Staff Accounts',
        'Export & Logistics Module',
        'Full Finance & PO System',
        'Compliance & Certifications',
        'Document Vault (50 GB)',
        'NexaAI Assistant',
        'Priority Support',
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Unlimited scale for agro-enterprises, co-operatives, and export groups.',
      highlight: false,
      features: [
        'Unlimited Farm Units',
        'Unlimited Staff Accounts',
        'Dedicated Account Manager',
        'Custom API Integrations',
        'Advanced Analytics Suite',
        'Unlimited Document Vault',
        'White-label Options',
        'SLA-backed Uptime',
      ],
      cta: 'Contact Sales',
    },
  ];

  const faqs = [
    { q: 'Can I use Nexa on my mobile phone?', a: 'Yes — Nexa is fully responsive and works on any smartphone or tablet. We also support PWA installation so you can access it offline and add it to your home screen like a native app.' },
    { q: 'How does the subscription billing work?', a: 'We charge monthly. You can pay by card, MTN Mobile Money, or Airtel Money. There are no setup fees and you can cancel at any time. Your data is always exportable.' },
    { q: 'Can I manage multiple farms under one account?', a: "Yes. On Professional and Enterprise plans you can manage multiple farms, each with their own staff, crops, livestock, and finance — all under one login. Each farm's data stays isolated but you get a consolidated view." },
    { q: 'Is my data secure?', a: 'Nexa uses AES-256 encryption at rest and TLS 1.3 in transit. We are hosted on ISO 27001-certified infrastructure with automated daily backups. Role-based access ensures staff only see what they need.' },
    { q: 'Does Nexa work without internet?', a: 'Core data entry and viewing works offline on mobile. Changes sync automatically when connectivity is restored. This is essential for farms in remote areas.' },
    { q: 'How long does setup take?', a: 'Most teams complete guided onboarding in under 30 minutes. You can import existing data (farms, staff, inventory) via CSV or our structured import wizard.' },
  ];

  const scrollStoryRef = useRef<HTMLDivElement>(null);
  const { step: storyStep } = useScrollProgress(scrollStoryRef as React.RefObject<HTMLDivElement>, 4);

  const megaMenuTabs = [
    {
      key: 'industries',
      label: 'Industries',
      links: ['Aerospace and Defence', 'Energy Utilities and Resources', 'Construction and Engineering', 'Manufacturing', 'Service Industries', 'Telecommunications']
    },
    {
      key: 'products',
      label: 'Products',
      links: ['IFS Cloud', 'Enterprise Resource Planning', 'Enterprise Asset Management', 'Field Service Management', 'Enterprise Service Management']
    },
    {
      key: 'facts',
      label: 'Fast Facts',
      links: ['Why Nexa Platform', 'Deployment Models', 'Security and Privacy', 'Customer Impact', 'Roadmap Highlights']
    },
    {
      key: 'stories',
      label: 'Customer Stories',
      links: ['Exporters', 'Commercial Farms', 'Livestock Producers', 'Logistics Operators', 'Global Partners']
    },
    {
      key: 'sustainability',
      label: 'Sustainability',
      links: ['Farm to Market Transparency', 'Regenerative Practices', 'Carbon and Waste Tracking', 'Ethical Supply Chains', 'Community Programs']
    },
    {
      key: 'news',
      label: 'News and Updates',
      links: ['Product Releases', 'Platform Updates', 'Events', 'Press Kit', 'Nexa Insights']
    }
  ];

  const footerGroups = [
    {
      title: 'Industries',
      links: ['Aerospace and Defence', 'Energy Utilities and Resources', 'Construction and Engineering', 'Manufacturing', 'Service Industries', 'Telecommunications']
    },
    {
      title: 'Products',
      links: ['IFS Cloud', 'Enterprise Resource Planning', 'Enterprise Asset Management', 'Field Service Management', 'Enterprise Service Management']
    },
    {
      title: 'About',
      links: ['About Nexa', 'Careers at Nexa', 'News', 'Contact Us', 'Financial Information', 'Trust Center', 'Accessibility']
    },
    {
      title: 'Customers and Partners',
      links: ['Customer Stories', 'Find a Nexa Partner', 'Become a Partner']
    },
    {
      title: 'Legal and Privacy',
      links: ['Legal', 'Modern Slavery Act', 'Privacy', 'Cookie Settings', 'Report a Concern']
    }
  ];

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

  const safeStoryStep = Number.isFinite(storyStep) && storyStep >= 0 && storyStep < storyChapters.length ? storyStep : 0;
  const currentChapter = storyChapters[safeStoryStep];

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
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'shadow-[0_12px_38px_-20px_rgba(0,0,0,0.8)]' : ''}`}
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <nav className="bg-[#170038] border-b border-white/10">
          <div className="max-w-[1320px] mx-auto px-5 md:px-12 h-[86px] flex items-center justify-between gap-4">
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              <NexaLogo className="h-8 md:h-10" light />
            </div>

            <div className="hidden lg:flex items-center h-full">
              {megaMenuTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`relative h-full px-5 text-[13px] font-bold transition-colors ${activeMenuTab === tab.key ? 'text-white' : 'text-indigo-100/85 hover:text-white'}`}
                  onMouseEnter={() => {
                    setActiveMenuTab(tab.key);
                    setIsMegaMenuOpen(true);
                  }}
                >
                  {tab.label}
                  {activeMenuTab === tab.key && (
                    <span className="absolute left-3 right-3 bottom-0 h-[3px] bg-cyan-300 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <a href="#features" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-100/90 hover:text-white transition-colors">Features</a>
              <Link to="/login" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-100/90 hover:text-white transition-colors">Sign In</Link>
              <Link to="/login" className="px-5 py-3 rounded-xl bg-cyan-300 text-[#120030] text-[11px] font-black uppercase tracking-[0.18em] hover:bg-cyan-200 transition-colors">Get Started</Link>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-xl border border-white/20 transition-all active:scale-95">
              <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}><X size={18} /></div>
              <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}><Menu size={18} /></div>
            </button>
          </div>

          <div className="hidden lg:block h-2 bg-[#240054]">
            <div className="h-full w-[180px] bg-cyan-300 transition-all duration-300" />
          </div>
        </nav>

        {isMegaMenuOpen && (
          <div className="hidden lg:block bg-[#240054] border-b border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-12 grid grid-cols-12 gap-10">
              <div className="col-span-3">
                <NexaLogo className="h-10 mb-8" light />
                <p className="text-5xl font-black tracking-tight leading-[1.05] text-white/85 max-w-[280px]">
                  Industrial <span className="text-cyan-300">AI</span> that matters.
                </p>
              </div>

              <div className="col-span-9 grid grid-cols-5 gap-8">
                {footerGroups.map((group) => (
                  <div key={group.title} className="space-y-4">
                    <h4 className="text-indigo-100 text-[13px] font-semibold tracking-wide">{group.title}</h4>
                    <ul className="space-y-3">
                      {group.links.slice(0, 5).map((item) => (
                        <li key={item}>
                          <a href="#top" className="text-white font-semibold text-[17px] leading-tight hover:text-cyan-300 transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="lg:hidden bg-[#240054] border-t border-white/10 border-b border-white/10">
            <div className="px-5 py-5 space-y-2">
              {megaMenuTabs.map((tab) => (
                <div key={tab.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-left text-white text-[13px] font-bold"
                    onClick={() => setActiveMenuTab(activeMenuTab === tab.key ? '' : tab.key)}
                  >
                    <span>{tab.label}</span>
                    <ArrowRight size={14} className={`transition-transform ${activeMenuTab === tab.key ? 'rotate-90' : ''}`} />
                  </button>
                  {activeMenuTab === tab.key && (
                    <ul className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      {tab.links.slice(0, 4).map((item) => (
                        <li key={item}>
                          <a href="#top" onClick={() => setIsMenuOpen(false)} className="text-white/80 text-[12px] font-medium hover:text-cyan-300 transition-colors block">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white border border-white/30">Sign In</Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.16em] bg-cyan-300 text-[#120030]">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section ref={heroAnim.ref} className="relative pt-32 pb-16 md:pt-52 md:pb-32 px-5 md:px-12 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
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
            key={`glow-${safeStoryStep}`}
            className={`absolute inset-0 pointer-events-none transition-all duration-700`}
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] anim-glow
              ${safeStoryStep === 0 ? 'bg-emerald-500/20' : safeStoryStep === 1 ? 'bg-blue-500/20' : safeStoryStep === 2 ? 'bg-amber-500/20' : 'bg-slate-400/15'}`}
            />
          </div>

          {/* Top progress bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 story-progress-bar"
              style={{ width: `${((safeStoryStep + 1) / 4) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="absolute top-8 right-6 md:right-12 flex items-center gap-3 z-20">
            {storyChapters.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${i === safeStoryStep ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/25'}`}
              />
            ))}
          </div>

          {/* Chapter tag */}
          <div className="absolute top-8 left-6 md:left-12 z-20">
            <div
              key={`tag-${safeStoryStep}`}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] anim-fade-in
                ${safeStoryStep === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  safeStoryStep === 1 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  safeStoryStep === 2 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-white/10 border-white/20 text-white/70'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse
                ${safeStoryStep === 0 ? 'bg-emerald-400' : safeStoryStep === 1 ? 'bg-blue-400' : safeStoryStep === 2 ? 'bg-amber-400' : 'bg-white/70'}`}
              />
              {currentChapter.tag}
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 h-full px-6 md:px-12 max-w-7xl mx-auto w-full pt-16">

            {/* Left: Text panel */}
            <div className="lg:w-2/5 w-full text-center lg:text-left">
              <div key={`text-${safeStoryStep}`} className="space-y-5">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 anim-text-slide cd1">
                  {String(safeStoryStep + 1).padStart(2, '0')} / 04
                </p>
                <h2 className={`text-3xl md:text-5xl lg:text-[3.2rem] font-black tracking-tighter leading-[0.95] text-white anim-text-slide cd2`}>
                  {currentChapter.headline}
                </h2>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-md anim-text-slide cd3">
                  {currentChapter.body}
                </p>
                <div className="pt-2 anim-text-slide cd4">
                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 bg-gradient-to-r text-white shadow-lg
                      ${safeStoryStep === 0 ? 'from-emerald-600 to-emerald-500 shadow-emerald-500/20' :
                        safeStoryStep === 1 ? 'from-blue-600 to-blue-500 shadow-blue-500/20' :
                        safeStoryStep === 2 ? 'from-amber-600 to-amber-500 shadow-amber-500/20' :
                        'from-slate-700 to-slate-600 shadow-slate-500/20'}`}
                  >
                    Explore feature <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Cards grid */}
            <div className="lg:w-3/5 w-full">
              <div key={`cards-${safeStoryStep}`} className="grid grid-cols-2 gap-3 md:gap-4">
                {currentChapter.cards.map((card, i) => (
                  <div
                    key={`${safeStoryStep}-${i}`}
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
          {safeStoryStep === 0 && (
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

      {/* ─── TRUST STRIP ─── */}
      <section className="py-10 md:py-14 bg-slate-950 border-y border-white/5 px-5 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 text-center mb-8">Trusted by Agricultural Enterprises in 18+ Countries</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {['Nile Agro Group', 'Sahel Farms Ltd', 'Rift Valley Exports', 'IndoAg Holdings', 'Amazonia Green', 'PanAfrican Coffee'].map((name) => (
              <span key={name} className="text-white/25 font-black text-[13px] md:text-[15px] tracking-wide uppercase hover:text-white/60 transition-colors cursor-default">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" ref={industriesAnim.ref} className="py-20 md:py-36 bg-white px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 md:mb-20 ${industriesAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center gap-2 bg-[#170038]/5 px-4 py-2 rounded-full text-[10px] font-bold text-[#4d108a] border border-[#170038]/10 mb-6 ${industriesAnim.inView ? 'anim-fade-up' : ''}`}>
              <Globe2 size={13} />
              <span>Industries We Serve</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 max-w-3xl ${industriesAnim.inView ? 'anim-fade-up d1' : ''}`}>
              Purpose-built for every link in the agricultural chain.
            </h3>
            <p className={`text-slate-500 font-medium text-base md:text-lg max-w-2xl ${industriesAnim.inView ? 'anim-fade-up d2' : ''}`}>
              Whether you run a single farm or a multi-national export group, Nexa has been crafted specifically for your operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <div
                key={i}
                className={`relative group p-8 rounded-2xl border border-slate-100 bg-gradient-to-br ${ind.color} hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden ${industriesAnim.inView ? `anim-fade-up d${Math.min(i + 1, 6)}` : 'opacity-0'}`}
              >
                <span className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{ind.tag}</span>
                <div className={`w-12 h-12 rounded-xl ${ind.accent} bg-opacity-15 flex items-center justify-center mb-6`} style={{ background: '' }}>
                  <ind.icon size={24} className="text-slate-700" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{ind.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">{ind.desc}</p>
                <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 group-hover:text-emerald-600 transition-colors">
                  Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI SPOTLIGHT ─── */}
      <section id="nexa-ai" ref={aiAnim.ref} className="py-20 md:py-36 bg-[#170038] px-5 md:px-12 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className={aiAnim.inView ? 'anim-slide-right' : 'opacity-0'}>
              <div className="inline-flex items-center gap-2 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Bot size={13} />
                <span>NexaAI Assistant</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-6">
                Your farm's<br/><span className="text-cyan-300">AI brain.</span>
              </h3>
              <p className="text-indigo-100/70 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                NexaAI analyses your live farm data and surfaces actionable intelligence — from yield predictions to disease alerts, financial anomalies to compliance gaps. Ask it anything about your business, in plain language.
              </p>
              <ul className="space-y-3 mb-10">
                {['Predict crop yield weeks before harvest', 'Detect livestock health anomalies automatically', 'Surface overdue compliance tasks', 'Answer operational questions in natural language'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/80">
                    <div className="w-5 h-5 rounded-full bg-cyan-300/20 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-cyan-300" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-300 text-[#120030] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyan-200 transition-colors">
                Try NexaAI <ArrowRight size={13} />
              </Link>
            </div>
            <div className={`${aiAnim.inView ? 'anim-slide-left d2' : 'opacity-0'}`}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-300/20 flex items-center justify-center">
                    <Bot size={15} className="text-cyan-300" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/50">NexaAI</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                {[
                  { type: 'user', msg: "How is Farm Unit 3 performing this month?" },
                  { type: 'ai', msg: "Farm Unit 3 is currently 14% above target yield. Maize lot M-047 is 3 days ahead of harvest schedule. However, Section B livestock show mild heat stress indicators — I recommend checking water supply." },
                  { type: 'user', msg: "Are there any compliance deadlines this week?" },
                  { type: 'ai', msg: "Yes — your NAADS phyto-sanitary certificate for Shipment #SH-2241 expires in 5 days. I've drafted a renewal request. Also, staff contract renewals for 3 employees are due Friday." },
                ].map((item, i) => (
                  <div key={i} className={`flex gap-3 ${item.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black ${item.type === 'ai' ? 'bg-cyan-300/20 text-cyan-300' : 'bg-white/10 text-white/60'}`}>
                      {item.type === 'ai' ? 'AI' : 'You'}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-[12px] font-medium leading-relaxed max-w-[80%] ${item.type === 'ai' ? 'bg-white/8 text-white/85 rounded-tl-none' : 'bg-cyan-300/15 text-cyan-100 rounded-tr-none'}`}>
                      {item.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="plans" ref={pricingAnim.ref} className="py-20 md:py-36 bg-slate-50 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${pricingAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100 mb-6 ${pricingAnim.inView ? 'anim-fade-up' : ''}`}>
              <DollarSign size={13} className="text-emerald-500" />
              <span>Simple Pricing</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${pricingAnim.inView ? 'anim-fade-up d1' : ''}`}>One flat price. Everything included.</h3>
            <p className={`text-slate-500 font-medium text-base max-w-xl mx-auto ${pricingAnim.inView ? 'anim-fade-up d2' : ''}`}>No per-seat fees. No hidden charges. Cancel any time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-500 ${plan.highlight
                  ? 'bg-[#170038] border-[#170038] shadow-[0_24px_60px_-12px_rgba(23,0,56,0.4)] scale-[1.03]'
                  : 'bg-white border-slate-100 hover:shadow-xl hover:border-slate-200'
                } ${pricingAnim.inView ? `anim-fade-up d${i + 1}` : 'opacity-0'}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-300 text-[#120030] text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">Most Popular</span>
                )}
                <div className="mb-6">
                  <p className={`text-[10px] font-black uppercase tracking-[0.35em] mb-2 ${plan.highlight ? 'text-cyan-300' : 'text-slate-400'}`}>{plan.name}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                    <span className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-indigo-200/70' : 'text-slate-400'}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${plan.highlight ? 'text-indigo-100/70' : 'text-slate-500'}`}>{plan.description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-3 text-[13px] font-medium ${plan.highlight ? 'text-indigo-100/85' : 'text-slate-600'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-cyan-300/20' : 'bg-emerald-50'}`}>
                        <Check size={10} className={plan.highlight ? 'text-cyan-300' : 'text-emerald-600'} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`w-full text-center py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-colors ${plan.highlight
                    ? 'bg-cyan-300 text-[#120030] hover:bg-cyan-200'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" ref={testimonialsAnim.ref} className="py-20 md:py-36 bg-white px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${testimonialsAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full text-[10px] font-bold text-amber-700 border border-amber-100 mb-6 ${testimonialsAnim.inView ? 'anim-fade-up' : ''}`}>
              <Star size={13} className="text-amber-500" />
              <span>Customer Stories</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${testimonialsAnim.inView ? 'anim-fade-up d1' : ''}`}>Heard from the field.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`relative bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:border-emerald-100 transition-all duration-500 ${testimonialsAnim.inView ? `anim-fade-up d${i + 1}` : 'opacity-0'}`}
              >
                <Quote size={36} className="text-emerald-100 mb-4" />
                <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-[11px] font-medium mt-0.5">{t.role} · {t.country}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MOBILE APP CALLOUT ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-white max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
              <Smartphone size={12} />
              <span>Works Everywhere</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">Manage your farm from your pocket.</h3>
            <p className="text-white/80 text-base font-medium leading-relaxed">Nexa works beautifully on any device. Install it as a Progressive Web App for instant access, offline capability, and push notifications — no app store needed.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-[12px] font-bold">
                <Wifi size={13} /> Works Offline
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-[12px] font-bold">
                <Smartphone size={13} /> iOS & Android
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2.5 text-[12px] font-bold">
                <MessageCircle size={13} /> Push Alerts
              </div>
            </div>
          </div>
          <Link to="/login" className="shrink-0 bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-50 transition-colors shadow-xl flex items-center gap-3">
            Get Nexa Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" ref={faqAnim.ref} className="py-20 md:py-36 bg-white px-5 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 md:mb-20 ${faqAnim.inView ? '' : 'opacity-0'}`}>
            <div className={`inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-[10px] font-bold text-slate-600 mb-6 ${faqAnim.inView ? 'anim-fade-up' : ''}`}>
              <MessageCircle size={13} />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 ${faqAnim.inView ? 'anim-fade-up d1' : ''}`}>Everything you need to know.</h3>
          </div>
          <div className={`space-y-3 ${faqAnim.inView ? 'anim-fade-up d2' : 'opacity-0'}`}>
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden hover:border-emerald-100 transition-colors">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900 text-[15px] pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT / DEMO CTA ─── */}
      <section id="contact" ref={contactAnim.ref} className="py-20 md:py-36 bg-slate-950 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div className={contactAnim.inView ? 'anim-slide-right' : 'opacity-0'}>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Award size={13} />
                <span>Get in Touch</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-6">
                Ready to see<br/>Nexa in action?
              </h3>
              <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-lg">
                Book a free 30-minute guided demo with our team. We'll walk through your specific use case and show you exactly how Nexa can work for your business.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Check, text: 'Live walkthrough tailored to your industry' },
                  { icon: Check, text: 'No commitment — cancel or change anytime' },
                  { icon: Check, text: 'Set up your account in under 30 minutes' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-emerald-400" />
                    </div>
                    <p className="text-white/80 text-[14px] font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`bg-white/5 border border-white/10 rounded-2xl p-8 ${contactAnim.inView ? 'anim-slide-left d2' : 'opacity-0'}`}>
              <h4 className="text-white font-black text-xl mb-6">Book a Demo</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="James Ochieng"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="Nile Agro Ltd"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="james@nileagro.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">What are you looking to manage?</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 3 coffee farms, 200 acres, exporting to Europe..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 bg-cyan-300 text-[#120030] py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyan-200 transition-colors mt-2"
                >
                  Book My Demo <ArrowRight size={14} />
                </Link>
                <p className="text-center text-white/25 text-[10px] font-medium">No spam. We'll reach out within 1 business day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 px-5 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Now Accepting New Subscribers</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-5">Ready to Transform Your Operations?</h3>
          <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl mx-auto mb-8">Join hundreds of agricultural enterprises across the globe already using Nexa to streamline their operations.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#170038]/20 hover:bg-[#240054] transition-all active:scale-95 flex items-center group"
            >
              Start Free Trial <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#contact" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">Book a Demo</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-[#0d0028] px-5 md:px-12 py-16 md:py-24">
        <div className="absolute -bottom-24 left-[8%] w-[260px] h-[260px] bg-white/5 rounded-[38%] blur-[2px]" />
        <div className="absolute -bottom-14 left-[22%] w-[220px] h-[220px] bg-white/5 rounded-[38%] blur-[2px]" />
        <div className="absolute -bottom-20 left-[38%] w-[280px] h-[280px] bg-white/5 rounded-[38%] blur-[2px]" />
        <div className="absolute -bottom-24 right-[8%] w-[150px] h-[150px] bg-white/5 rounded-[38%] blur-[1px]" />

        <div className="relative z-10 max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 mb-12">
            <div className="lg:col-span-4 space-y-8">
              <NexaLogo className="h-12" light />
              <h3 className="text-white/90 text-5xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-md">
                Industrial <span className="text-cyan-300">AI</span> that matters.
              </h3>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-5">
                  <h5 className="text-[15px] font-semibold tracking-wide text-indigo-100">{group.title}</h5>
                  <ul className="space-y-2.5">
                    {group.links.map((item) => (
                      <li key={`${group.title}-${item}`}>
                        <a href="#top" className="text-white text-[22px] md:text-[20px] leading-tight font-semibold hover:text-cyan-300 transition-colors">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-indigo-100/70 text-[11px] font-semibold tracking-[0.14em] uppercase">Copyright 2026 Nexa Systems Ltd. All rights reserved.</p>
            <div className="flex items-center gap-5 text-indigo-100/80 text-[12px]">
              <a href="#top" className="hover:text-cyan-300 transition-colors">Cookie Settings</a>
              <a href="#top" className="hover:text-cyan-300 transition-colors">Privacy</a>
              <Link to="/login" className="hover:text-cyan-300 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="absolute right-5 md:right-12 bottom-6 md:bottom-10 w-16 h-16 rounded-full bg-[#4d108a] text-white flex items-center justify-center hover:bg-[#5f1aa6] transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp size={28} />
        </button>
      </footer>
    </div>
  );
}

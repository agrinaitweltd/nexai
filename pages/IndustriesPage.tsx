import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Globe2, Tractor, Activity, Building2, Ship, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';
import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

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

const INDUSTRIES = [
  {
    icon: Globe2,
    tag: 'Export',
    title: 'Coffee & Commodity Export',
    headline: 'From farm gate to global port — fully automated.',
    desc: 'Nexa handles your full export workflow: phyto-sanitary certificates, certificates of origin, customs declarations, and real-time shipment tracking across 18+ countries.',
    features: [
      'Automated manifest generation',
      'Phyto-sanitary certificate management',
      'Multi-currency invoicing',
      'Port-to-port shipment visibility',
      'Compliance deadline alerts',
    ],
    stat: { value: '120+', label: 'Active Export Hubs' },
    color: 'from-amber-500/15 to-orange-400/5',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-600',
    accentBorder: 'border-amber-200',
    badgeBg: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Tractor,
    tag: 'Farming',
    title: 'Commercial Farming',
    headline: 'Run every field like a Fortune 500 operation.',
    desc: 'From planting schedules to harvest grades, manage entire crop cycles across multiple farms with one platform. Track soil metrics, weather inputs, and yield forecasts in real time.',
    features: [
      'Multi-farm dashboard',
      'Crop lifecycle stage tracking',
      'Yield forecasting engine',
      'Soil and weather input logging',
      'Field-level GPS mapping',
    ],
    stat: { value: '340+', label: 'Acres Managed Daily' },
    color: 'from-emerald-500/15 to-teal-400/5',
    accentBg: 'bg-emerald-500',
    accentText: 'text-emerald-600',
    accentBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: Activity,
    tag: 'Livestock',
    title: 'Livestock Production',
    headline: 'Know the health of every animal, in real time.',
    desc: 'Automated herd health monitoring, vaccination scheduling, body weight tracking, and mortality reporting — giving you complete visibility over your livestock profitability.',
    features: [
      'Individual animal health records',
      'Vaccination & deworming schedules',
      'Feed cost tracking per head',
      'Mortality and culling analytics',
      'Automated vet alert system',
    ],
    stat: { value: '98.4%', label: 'Average Herd Health Rate' },
    color: 'from-teal-500/15 to-cyan-400/5',
    accentBg: 'bg-teal-500',
    accentText: 'text-teal-600',
    accentBorder: 'border-teal-200',
    badgeBg: 'bg-teal-50 text-teal-700',
  },
  {
    icon: Building2,
    tag: 'Processing',
    title: 'Agro-Processing',
    headline: 'Factory floor visibility, from raw input to finished product.',
    desc: 'Track raw material intake, batch processing, quality control results, and value-addition output — with full traceability linking your factory to the farms that supply it.',
    features: [
      'Raw material purchase orders',
      'Batch production tracking',
      'Quality grading records',
      'Finished goods inventory',
      'Farm-to-factory traceability',
    ],
    stat: { value: '2,840+', label: 'SKUs Tracked' },
    color: 'from-blue-500/15 to-indigo-400/5',
    accentBg: 'bg-blue-500',
    accentText: 'text-blue-600',
    accentBorder: 'border-blue-200',
    badgeBg: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Ship,
    tag: 'Logistics',
    title: 'Logistics & Supply Chain',
    headline: 'Track every truck, container, and consignment.',
    desc: 'Live logistics tracking from origin farm to destination port. Assign drivers, log waypoints, manage fleet costs, and give customers real-time visibility of their orders.',
    features: [
      'Driver and vehicle assignment',
      'Live consignment tracking',
      'Port and border crossing logs',
      'Fuel and fleet cost tracking',
      'Customer delivery notifications',
    ],
    stat: { value: '12+', label: 'Active Shipments Per Client' },
    color: 'from-violet-500/15 to-purple-400/5',
    accentBg: 'bg-violet-500',
    accentText: 'text-violet-600',
    accentBorder: 'border-violet-200',
    badgeBg: 'bg-violet-50 text-violet-700',
  },
  {
    icon: ShieldCheck,
    tag: 'Compliance',
    title: 'Compliance & Certification',
    headline: 'Stay audit-ready, every single day.',
    desc: 'Manage ISO, GLOBALGAP, USDA Organic, and local export certifications in one place. Automated reminders, document storage, and pre-built audit checklists keep your team compliant.',
    features: [
      'Certificate renewal reminders',
      'Regulatory document vault',
      'Pre-built audit checklists',
      'Inspector access portal',
      'Compliance gap reporting',
    ],
    stat: { value: '99.9%', label: 'Client Compliance Rate' },
    color: 'from-rose-500/15 to-red-400/5',
    accentBg: 'bg-rose-500',
    accentText: 'text-rose-600',
    accentBorder: 'border-rose-200',
    badgeBg: 'bg-rose-50 text-rose-700',
  },
];

export default function IndustriesPage() {
  const heroAnim = useInView(0.1);
  const gridAnim = useInView(0.05);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      {/* Breadcrumb */}
      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[
          { label: 'Industries', to: '/industries' },
          { label: 'All Sectors' },
        ]} />
      </div>

      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-32 px-5 md:px-12 bg-gradient-to-b from-[#170038] to-[#0a001e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.12),transparent_60%)]" />
        <div ref={heroAnim.ref} className="max-w-7xl mx-auto relative z-10">
          <div className={`max-w-3xl ${heroAnim.inView ? 'animate-[fadeUp_0.8s_ease-out_both]' : 'opacity-0'}`}
            style={{ animationName: heroAnim.inView ? 'fadeUp' : 'none' }}>
            <div className="inline-flex items-center gap-2 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Globe2 size={13} />
              <span>Industries We Serve</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6">
              Purpose-built for every link in the <span className="text-cyan-300">agricultural chain.</span>
            </h1>
            <p className="text-indigo-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-10">
              Whether you run a single commercial farm or a multi-national export group, Nexa delivers enterprise-grade operational tools built specifically for your sector.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-300 text-[#120030] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyan-200 transition-colors">
                Get Started <ArrowRight size={14} />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                View Platform <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#0a001e] border-b border-white/10 px-5 md:px-12 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '6', label: 'Industry Verticals' },
            { value: '18+', label: 'Countries Served' },
            { value: '120+', label: 'Export Hubs Active' },
            { value: '99.9%', label: 'Compliance Rate' },
          ].map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">{s.value}</p>
              <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industry detail cards */}
      <section ref={gridAnim.ref} className="py-20 md:py-32 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          {INDUSTRIES.map((ind, i) => (
            <div
              key={ind.tag}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 md:p-12 rounded-2xl border border-slate-100 bg-gradient-to-br ${ind.color} hover:shadow-xl transition-all duration-500 ${gridAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span className={`inline-block text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-5 ${ind.badgeBg}`}>{ind.tag}</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-3">{ind.title}</h2>
                <p className={`text-lg font-bold mb-4 ${ind.accentText}`}>{ind.headline}</p>
                <p className="text-slate-500 text-base font-medium leading-relaxed mb-6">{ind.desc}</p>
                <Link to="/login" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-colors ${ind.accentBg} hover:opacity-90`}>
                  Explore this sector <ArrowRight size={13} />
                </Link>
              </div>

              <div className={`bg-white rounded-2xl border ${ind.accentBorder} p-7 shadow-sm ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl ${ind.accentBg} bg-opacity-10 flex items-center justify-center mb-6`}>
                  <ind.icon size={28} className={ind.accentText} />
                </div>
                <div className="mb-6">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{ind.stat.value}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ind.stat.label}</p>
                </div>
                <ul className="space-y-3">
                  {ind.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ind.accentBg} bg-opacity-15`}>
                        <Check size={10} className={ind.accentText} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-5 md:px-12 bg-[#170038]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">
            Which sector are you in?
          </h3>
          <p className="text-indigo-100/70 text-base md:text-lg font-medium mb-8">
            Start with one module and expand as you grow. Every Nexa plan covers all six industry verticals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-cyan-300 text-[#120030] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-200 transition-all active:scale-95 flex items-center gap-3">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="px-8 py-5 text-indigo-100/70 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-all border border-white/20 rounded-2xl">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

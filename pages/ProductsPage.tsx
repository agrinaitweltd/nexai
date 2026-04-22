import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import {
  Tractor, Leaf, Ship, Users, DollarSign, ClipboardCheck,
  BarChart3, ShieldCheck, Bot, Database, LineChart, Cpu,
  Cloud, ArrowRight, Check, Zap, Package, Lock
} from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

function useInView(threshold = 0.12) {
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

const MODULES = [
  { icon: Tractor, title: 'Farm & Livestock Management', desc: 'Complete oversight of production units, animal health tracking, soil metrics, and labor allocations across all your farms.', color: 'bg-emerald-50 text-emerald-600', tag: 'Core' },
  { icon: Leaf, title: 'Crop Lifecycle Tracking', desc: 'Monitor every stage from planting to harvest with yield forecasting, quality grading, and real-time field insights.', color: 'bg-teal-50 text-teal-600', tag: 'Core' },
  { icon: Ship, title: 'Export & Logistics', desc: 'End-to-end shipment manifests, customs documentation, and global logistics tracking with built-in compliance automation.', color: 'bg-blue-50 text-blue-600', tag: 'Core' },
  { icon: Users, title: 'Staff & Department Control', desc: 'Manage personnel across multiple business units with granular role-based access, attendance tracking, and department budgets.', color: 'bg-violet-50 text-violet-600', tag: 'Core' },
  { icon: DollarSign, title: 'Financial Intelligence', desc: 'Integrated fiscal ledger for tracking production costs, purchase orders, requisition approvals, and real-time revenue analytics.', color: 'bg-indigo-50 text-indigo-600', tag: 'Finance' },
  { icon: ClipboardCheck, title: 'Compliance & Reporting', desc: 'Automated handling of regulatory registrations, tax IDs, export certifications, and one-click statutory reports.', color: 'bg-amber-50 text-amber-600', tag: 'Compliance' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual insights across every operation — inventory levels, financial health, staff performance, and seasonal trend analysis.', color: 'bg-cyan-50 text-cyan-600', tag: 'Insights' },
  { icon: ShieldCheck, title: 'Document Vault', desc: 'Securely store and manage business-critical documents, certificates, contracts, and compliance records with encrypted cloud storage.', color: 'bg-rose-50 text-rose-600', tag: 'Security' },
  { icon: Bot, title: 'NexaAI Assistant', desc: 'Your AI co-pilot for the farm. Ask questions in plain language, get yield predictions, compliance alerts, and anomaly detection.', color: 'bg-purple-50 text-purple-600', tag: 'AI' },
  { icon: Package, title: 'Inventory Management', desc: 'Multi-warehouse stock tracking, low-stock alerts, batch lot management, and supplier purchase orders in one system.', color: 'bg-lime-50 text-lime-600', tag: 'Operations' },
  { icon: Lock, title: 'Role-Based Access Control', desc: 'Define exactly who sees what across your organisation. Granular permissions ensure sensitive data stays protected.', color: 'bg-slate-100 text-slate-600', tag: 'Security' },
  { icon: Zap, title: 'Integrations & API', desc: 'Connect Nexa to accounting software, IoT sensors, mobile apps, and third-party logistics providers via our open API.', color: 'bg-orange-50 text-orange-600', tag: 'Platform' },
];

const TECH = [
  { icon: Database, title: 'Real-Time Data Engine', desc: 'Every action across your farms, exports, and finances is captured and surfaced instantly — no manual syncing required.' },
  { icon: LineChart, title: 'Predictive Analytics', desc: 'ML-powered forecasting for yield, revenue, and risk. Understand what will happen before it does.' },
  { icon: Cpu, title: 'AI-Ready Architecture', desc: 'Built with vector embeddings and LLM hooks so NexaAI can reason across your business data in natural language.' },
  { icon: Cloud, title: 'Enterprise Cloud Infrastructure', desc: 'ISO 27001-certified, AES-256 encrypted, 99.9% uptime SLA. Hosted on geo-redundant infrastructure.' },
];

export default function ProductsPage() {
  const heroAnim = useInView(0.05);
  const modulesAnim = useInView(0.05);
  const techAnim = useInView(0.1);
  const aiAnim = useInView(0.1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      {/* Hero */}
      <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-5 md:px-12 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_60%)]" />
        <div ref={heroAnim.ref} className="max-w-7xl mx-auto relative z-10">
          <div className={heroAnim.inView ? '' : 'opacity-0'} style={{ transition: 'opacity 0.8s ease-out' }}>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Zap size={13} />
              <span>The Nexa Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6 max-w-4xl">
              The complete agricultural<br />management <span className="text-emerald-400">platform.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-10">
              12 integrated modules. One login. Everything your farm, export operation, or agro-processing company needs to compete at the highest level.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors">
                Start Free Trial <ArrowRight size={14} />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section ref={modulesAnim.ref} className="py-20 md:py-32 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 ${modulesAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-3">Platform Modules</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 max-w-2xl">
              Total command over your entire operation.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((mod, i) => (
              <div
                key={mod.title}
                className={`p-7 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group ${modulesAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                    <mod.icon size={22} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{mod.tag}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{mod.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section ref={techAnim.ref} className="py-20 md:py-32 px-5 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 ${techAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-3">Under the Hood</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
              Built for trust, scale & intelligence.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TECH.map((t, i) => (
              <div
                key={t.title}
                className={`p-7 bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-500 ${techAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                  <t.icon size={22} />
                </div>
                <h3 className="font-black text-slate-900 mb-2 text-[16px] tracking-tight">{t.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NexaAI spotlight */}
      <section ref={aiAnim.ref} className="py-20 md:py-32 px-5 md:px-12 bg-[#170038] relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${aiAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Bot size={13} /> NexaAI Assistant
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-6">
                Your farm's<br /><span className="text-cyan-300">AI brain.</span>
              </h2>
              <p className="text-indigo-100/70 text-base font-medium leading-relaxed mb-8 max-w-lg">
                Ask NexaAI anything about your operations in plain language. It reads your live data and returns actionable intelligence — not generic advice.
              </p>
              <ul className="space-y-3 mb-10">
                {['Predict crop yield weeks before harvest', 'Detect livestock health anomalies automatically', 'Surface overdue compliance tasks', 'Answer questions about your finances in seconds'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/80">
                    <div className="w-5 h-5 rounded-full bg-cyan-300/20 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-cyan-300" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-300 text-[#120030] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyan-200 transition-colors">
                Try NexaAI Free <ArrowRight size={13} />
              </Link>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-300/20 flex items-center justify-center">
                  <Bot size={15} className="text-cyan-300" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white/50">NexaAI</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              {[
                { type: 'user', msg: 'How is Farm Unit 3 performing this month?' },
                { type: 'ai', msg: 'Farm Unit 3 is 14% above target yield. Maize lot M-047 is 3 days ahead of harvest schedule. However, Section B livestock show mild heat stress — I recommend checking water supply.' },
                { type: 'user', msg: 'Any compliance deadlines this week?' },
                { type: 'ai', msg: 'Yes — your phyto-sanitary certificate for Shipment #SH-2241 expires in 5 days. I\'ve drafted a renewal request. Also, 3 staff contracts are due for renewal on Friday.' },
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
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-5 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-5">Ready to see the full platform?</h3>
          <p className="text-slate-400 text-base md:text-lg font-medium mb-8">Start with any module and add more as your business grows. All plans include every core feature.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all active:scale-95 flex items-center gap-3">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">See Pricing</Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

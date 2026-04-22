import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import {
  Tractor, Leaf, Ship, Users, DollarSign, ClipboardCheck,
  BarChart3, Bot, ArrowRight, Check, Zap, Globe2,
} from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';
import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

const TABS: TabItem[] = [
  { key: 'overview',  label: 'Platform Overview' },
  { key: 'products',  label: 'By Product' },
  { key: 'features',  label: 'By Feature' },
  { key: 'ai',        label: 'NexaAI' },
];

const MODULES = [
  { icon: Tractor,        title: 'Farm Management',         desc: 'Multi-farm dashboards, crop lifecycle tracking, yield forecasting, and field-level inputs.' },
  { icon: Leaf,           title: 'Inventory & Warehouse',   desc: 'Live stock levels, lot tracking, expiry management, and automated reorder triggers.' },
  { icon: Ship,           title: 'Export & Logistics',      desc: 'Consignment management, customs documentation, driver tracking, and buyer portals.' },
  { icon: Users,          title: 'Clients & Staff',         desc: 'CRM for buyers and suppliers, staff payroll, attendance, and task assignment.' },
  { icon: DollarSign,     title: 'Finance & Accounts',      desc: 'Invoicing, payments, expense tracking, and profit/loss by farm or product line.' },
  { icon: ClipboardCheck, title: 'Compliance & Certs',      desc: 'Certificate vault, renewal reminders, audit checklists, and inspector portals.' },
  { icon: BarChart3,      title: 'Reports & Analytics',     desc: 'Pre-built and custom reports for every module, exportable to Excel or PDF.' },
  { icon: Bot,            title: 'NexaAI',                  desc: 'AI-powered yield predictions, anomaly detection, and natural language queries.' },
];

const PRODUCTS = [
  {
    name: 'Nexa Farm',
    tagline: 'Complete farm management, end to end.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
    points: ['Multi-farm crop tracking', 'Field GPS mapping', 'Yield forecasting', 'Season comparisons', 'Mobile-first field logging', 'Input cost per acre'],
  },
  {
    name: 'Nexa Trade',
    tagline: 'Export documentation and global shipping.',
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
    points: ['Phyto-sanitary automation', 'Certificate of origin workflow', 'Customs declarations', 'Port-to-port tracking', 'Buyer shipment portal', 'Multi-corridor compliance'],
  },
  {
    name: 'Nexa Finance',
    tagline: 'Agricultural accounts built for scale.',
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
    points: ['Farm-level P&L', 'Multi-currency invoicing', 'Expense categorisation', 'Supplier payments', 'Payroll and advances', 'Financial dashboards'],
  },
  {
    name: 'Nexa Comply',
    tagline: 'Regulatory certification, always current.',
    color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100',
    points: ['Certificate vault', 'Renewal deadline alerts', 'Pre-built audit checklists', 'Inspector read-only portal', 'ISO & GLOBALG.A.P. support', 'Non-conformance logging'],
  },
];

const FEATURES = [
  { icon: Zap,    title: 'Real-Time Sync',         desc: 'Every update — from the field or the office — reflects instantly across all users and devices.' },
  { icon: Globe2, title: 'Multi-Country Support',  desc: 'Handles 18+ export corridors with localised tax rules, currency, and regulatory frameworks.' },
  { icon: Bot,    title: 'AI Insights',            desc: 'Nexa AI surfaces anomalies, predicts yields, and answers operational questions in plain language.' },
  { icon: Users,  title: 'Role-Based Access',      desc: 'Granular permissions — from field workers to board-level executives — all configurable.' },
  { icon: BarChart3, title: 'Custom Reports',      desc: 'Build and schedule custom reports across any data set; export to Excel, PDF, or API.' },
  { icon: ClipboardCheck, title: 'Audit Trails',   desc: 'Every action is logged with timestamp and user attribution for full regulatory auditability.' },
];

export default function ProductsPage() {
  const activeKey = useActiveTab(TABS);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[{ label: 'Products', to: '/products' }, { label: TABS.find(t => t.key === activeKey)?.label || '' }]} />
      </div>

      <PageTabBar tabs={TABS} />

      {/* OVERVIEW TAB */}
      {activeKey === 'overview' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-indigo-500/10 to-blue-400/5">
            <div className="max-w-7xl mx-auto text-center max-w-3xl mx-auto">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-indigo-50 text-indigo-600">
                The Full Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Every module your agribusiness needs.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                One unified platform covering farm management, export, finance, compliance, logistics, and AI — no integrations required.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-[#170038] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all">
                Get Started Free <ArrowRight size={14} />
              </Link>
            </div>
          </section>
          <section className="py-16 md:py-20 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {MODULES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                      <Icon size={20} className="text-indigo-600" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base tracking-tight mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PRODUCTS TAB */}
      {activeKey === 'products' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-900 to-[#170038]">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-white/10 text-cyan-300">
                Product Lines
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-5">
                Built for every part of your business.
              </h1>
              <p className="text-indigo-200/70 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Start with the product your operation needs most. Add others as you grow — all on one subscription.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTS.map((p) => (
                <div key={p.name} className={`p-8 rounded-2xl border ${p.border} bg-white hover:shadow-xl transition-all`}>
                  <span className={`inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-4 ${p.bg} ${p.color}`}>
                    Product
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{p.name}</h2>
                  <p className={`text-sm font-bold mb-5 ${p.color}`}>{p.tagline}</p>
                  <ul className="space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${p.bg}`}>
                          <Check size={8} className={p.color} />
                        </div>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing" className={`mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] ${p.color} hover:opacity-70 transition-opacity`}>
                    View Pricing <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* FEATURES TAB */}
      {activeKey === 'features' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-teal-500/10 to-emerald-400/5">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-teal-50 text-teal-600">
                Platform Features
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                The infrastructure your operation deserves.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Enterprise-grade capabilities built into every plan from day one.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-7 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-teal-600" />
                  </div>
                  <h3 className="text-slate-900 font-black text-lg tracking-tight mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* AI TAB */}
      {activeKey === 'ai' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-950 to-[#170038]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-cyan-400/10 text-cyan-300">
                  Artificial Intelligence
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-4">
                  NexaAI
                </h1>
                <p className="text-xl font-bold text-cyan-300 mb-5">Your operational intelligence layer.</p>
                <p className="text-indigo-200/70 text-base font-medium leading-relaxed mb-8 max-w-lg">
                  NexaAI is embedded across every module — surfacing anomalies before they become problems, predicting yields from historical patterns, and letting you ask questions about your operation in plain language.
                </p>
                <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all">
                  Try NexaAI Free <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { q: 'What is my projected yield for the eastern fields this season?', a: 'Based on current growth data and historical patterns, your eastern fields are tracking 12% above last season. Estimated harvest: 4,200 bags.' },
                  { q: 'Which shipments are at risk of missing their customs window?', a: '3 shipments are flagged: KE-2041, KE-2039, and ET-1887. All have customs deadlines within 72 hours. Click to view details.' },
                  { q: 'Show me the top 5 cost overruns this month.', a: 'Identified 5 cost centres exceeding budget. Irrigation (Farm B) is highest at 34% over. Full breakdown is ready.' },
                ].map(({ q, a }) => (
                  <div key={q} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[12px] font-bold text-white/60 mb-2">You asked:</p>
                    <p className="text-white text-sm font-medium mb-3 italic">"{q}"</p>
                    <p className="text-[12px] font-bold text-cyan-400 mb-1">NexaAI:</p>
                    <p className="text-slate-300 text-sm font-medium">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 md:py-20 px-5 md:px-12 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4">
                Intelligence built into every decision.
              </h3>
              <p className="text-slate-400 text-base font-medium mb-8">
                NexaAI is available on all plans — no extra setup, no data science required.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all">
                Start Free Trial <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </>
      )}

      <LandingFooter />
    </div>
  );
}

import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Globe2, Tractor, Activity, Building2, Ship, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

const TABS: TabItem[] = [
  { key: 'coffee',      label: 'Coffee & Commodity Export' },
  { key: 'farming',    label: 'Commercial Farming' },
  { key: 'livestock',  label: 'Livestock Production' },
  { key: 'processing', label: 'Agro-Processing' },
  { key: 'logistics',  label: 'Logistics & Supply Chain' },
  { key: 'compliance', label: 'Compliance & Certification' },
];

interface TabData {
  icon: React.ElementType;
  colorFrom: string;
  textColor: string;
  bgLight: string;
  bgDark: string;
  tag: string;
  title: string;
  headline: string;
  desc: string;
  features: string[];
  steps: { n: string; title: string; desc: string }[];
  stat: { value: string; label: string };
}

const TAB_CONTENT: Record<string, TabData> = {
  coffee: {
    icon: Globe2,
    colorFrom: 'from-amber-500/15 to-orange-400/5',
    textColor: 'text-amber-600',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-600',
    tag: 'Export Operations',
    title: 'Coffee & Commodity Export',
    headline: 'From farm gate to global port — fully automated.',
    desc: 'Nexa manages your complete export workflow from origin verification through to destination customs clearance. Phyto-sanitary certificates, certificates of origin, packing lists, and real-time shipment tracking across 18+ export corridors.',
    features: [
      'Automated phyto-sanitary certificate generation',
      'Certificate of origin workflow',
      'Multi-currency invoicing and payments',
      'Port-to-port shipment tracking',
      'Customs declaration management',
      'Compliance deadline alerts',
      'Buyer portal with live shipment visibility',
      'Rejection and claims handling',
    ],
    steps: [
      { n: '01', title: 'Capture at Origin', desc: 'Log harvest lot data, quality grades, and farm certifications at the point of origin.' },
      { n: '02', title: 'Automate Documentation', desc: 'Nexa generates all required export docs from your operational data — zero manual entry.' },
      { n: '03', title: 'Track to Destination', desc: 'Monitor every shipment in real time, with automated alerts at every customs touchpoint.' },
    ],
    stat: { value: '120+', label: 'Active Export Hubs on Nexa' },
  },
  farming: {
    icon: Tractor,
    colorFrom: 'from-emerald-500/15 to-teal-400/5',
    textColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-600',
    tag: 'Crop Management',
    title: 'Commercial Farming',
    headline: 'Run every field like a world-class operation.',
    desc: 'Manage complete crop lifecycles across multiple farms from a single dashboard. Track planting schedules, growth stages, input costs, soil metrics, and harvest yield grades — all in real time, on any device.',
    features: [
      'Multi-farm unified dashboard',
      'Crop lifecycle stage tracking',
      'Yield forecasting engine',
      'Soil health and weather input logging',
      'Field-level GPS mapping',
      'Input cost and labour tracking',
      'Harvest quality grading',
      'Season-over-season comparison analytics',
    ],
    steps: [
      { n: '01', title: 'Set Up Farm Units', desc: 'Register your farms, fields, and crop plans. Assign staff and input budgets per unit.' },
      { n: '02', title: 'Log Daily Activities', desc: 'Capture planting, spraying, irrigation, and harvesting events from the field via mobile.' },
      { n: '03', title: 'Review & Forecast', desc: 'Use the analytics dashboard to review yield trends and forecast next season performance.' },
    ],
    stat: { value: '340+', label: 'Farms Managed on Platform' },
  },
  livestock: {
    icon: Activity,
    colorFrom: 'from-teal-500/15 to-cyan-400/5',
    textColor: 'text-teal-600',
    bgLight: 'bg-teal-50',
    bgDark: 'bg-teal-600',
    tag: 'Herd Management',
    title: 'Livestock Production',
    headline: 'Know the health of every animal, in real time.',
    desc: 'Automated herd health monitoring, vaccination scheduling, individual animal records, and profitability analytics — giving you complete operational visibility from breeding to sale.',
    features: [
      'Individual animal health records',
      'Vaccination and deworming schedules',
      'Breeding and pregnancy tracking',
      'Feed cost per head analysis',
      'Body weight tracking over time',
      'Mortality and culling records',
      'Vet alert and treatment logs',
      'Herd profitability reporting',
    ],
    steps: [
      { n: '01', title: 'Register Your Herd', desc: 'Tag each animal with a unique ID. Capture breed, sex, date of birth, and initial health status.' },
      { n: '02', title: 'Automate Health Schedules', desc: 'Nexa alerts you to upcoming vaccinations, deworming cycles, and vet check-up dates.' },
      { n: '03', title: 'Analyse Profitability', desc: 'See cost-per-head, feed conversion rates, and projected sale values across your full herd.' },
    ],
    stat: { value: '98.4%', label: 'Average Herd Health Rate' },
  },
  processing: {
    icon: Building2,
    colorFrom: 'from-blue-500/15 to-indigo-400/5',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-600',
    tag: 'Factory Operations',
    title: 'Agro-Processing',
    headline: 'Factory floor visibility, raw input to finished product.',
    desc: 'Track raw material intake from your supplying farms, manage batch processing runs, log quality control results, and maintain complete finished goods inventory — with full farm-to-shelf traceability.',
    features: [
      'Raw material purchase orders',
      'Supplier farm traceability links',
      'Batch production run tracking',
      'Quality grading and rejection logs',
      'Finished goods inventory management',
      'Production cost per SKU',
      'Expiry and lot management',
      'Customer dispatch and delivery',
    ],
    steps: [
      { n: '01', title: 'Intake Raw Materials', desc: 'Log incoming consignments from farms, link to supplier records, and record quality grades.' },
      { n: '02', title: 'Manage Production', desc: 'Create batch production orders, track inputs used, and capture quality results per batch.' },
      { n: '03', title: 'Dispatch Finished Goods', desc: 'Manage finished goods stock and dispatch to customers with full batch traceability.' },
    ],
    stat: { value: '2,840+', label: 'SKUs Tracked Across Platform' },
  },
  logistics: {
    icon: Ship,
    colorFrom: 'from-violet-500/15 to-purple-400/5',
    textColor: 'text-violet-600',
    bgLight: 'bg-violet-50',
    bgDark: 'bg-violet-600',
    tag: 'Supply Chain',
    title: 'Logistics & Supply Chain',
    headline: 'Track every truck, container, and consignment.',
    desc: 'Live logistics tracking from origin farm to destination port or buyer warehouse. Assign vehicles and drivers, log route waypoints, manage fleet running costs, and give buyers a real-time consignment portal.',
    features: [
      'Driver and vehicle assignment',
      'Live consignment status tracking',
      'Route and waypoint logging',
      'Port and border crossing records',
      'Fuel and fleet cost tracking',
      'Delivery confirmation signatures',
      'Customer shipment notifications',
      'Delay and exception alerts',
    ],
    steps: [
      { n: '01', title: 'Create Consignment', desc: 'Raise a consignment, assign driver and vehicle, and attach relevant export documents.' },
      { n: '02', title: 'Track Live', desc: 'Drivers update waypoints via mobile. You and your buyers see real-time shipment progress.' },
      { n: '03', title: 'Confirm Delivery', desc: 'Capture digital proof of delivery and automatically close the consignment record.' },
    ],
    stat: { value: '12+', label: 'Active Shipments Per Client Avg.' },
  },
  compliance: {
    icon: ShieldCheck,
    colorFrom: 'from-rose-500/15 to-red-400/5',
    textColor: 'text-rose-600',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-600',
    tag: 'Regulatory',
    title: 'Compliance & Certification',
    headline: 'Stay audit-ready, every single day.',
    desc: 'Manage ISO, GLOBALG.A.P., USDA Organic, and local export certifications in one centralised system. Automated renewal reminders, encrypted document storage, and pre-built audit checklists keep your operation compliant without the overhead.',
    features: [
      'Certificate renewal reminders',
      'Regulatory document vault',
      'Pre-built audit checklists',
      'Inspector access portal',
      'Compliance gap reporting',
      'Multi-standard support (ISO, GLOBALG.A.P., USDA)',
      'Staff training record tracking',
      'Non-conformance logging and resolution',
    ],
    steps: [
      { n: '01', title: 'Upload Certificates', desc: 'Store all your regulatory documents in the encrypted vault with expiry dates tracked.' },
      { n: '02', title: 'Get Ahead of Renewals', desc: 'Automated alerts at 90, 60, and 30 days before any certificate expires.' },
      { n: '03', title: 'Pass Audits Faster', desc: 'Provide inspectors a read-only portal. Generate audit reports in under 5 minutes.' },
    ],
    stat: { value: '99.9%', label: 'Client Compliance Rate' },
  },
};

export default function IndustriesPage() {
  const activeKey = useActiveTab(TABS);
  const content = TAB_CONTENT[activeKey] || TAB_CONTENT.coffee;
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <PageTabBar tabs={TABS} />

      {/* Hero */}
      <section className={`py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br ${content.colorFrom}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className={`inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 ${content.bgLight} ${content.textColor}`}>
              {content.tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-4">
              {content.title}
            </h1>
            <p className={`text-xl font-bold mb-5 ${content.textColor}`}>{content.headline}</p>
            <p className="text-slate-500 text-base font-medium leading-relaxed mb-8 max-w-lg">{content.desc}</p>
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-95 ${content.bgDark}`}
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xl">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${content.bgLight}`}>
              <Icon size={28} className={content.textColor} />
            </div>
            <div className="mb-6 pb-6 border-b border-slate-100">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{content.stat.value}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{content.stat.label}</p>
            </div>
            <ul className="space-y-3">
              {content.features.map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${content.bgLight}`}>
                    <Check size={10} className={content.textColor} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 px-5 md:px-12 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-12">Three steps to full control.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.steps.map((step) => (
              <div key={step.n} className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                <span className="text-5xl font-black text-white/10 block mb-4 tracking-tighter">{step.n}</span>
                <h3 className="text-white font-black text-lg tracking-tight mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-5 md:px-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4">
            Ready to modernise your {content.title.toLowerCase()} operations?
          </h3>
          <p className="text-slate-400 text-base font-medium mb-8">
            Join hundreds of enterprises already running on Nexa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all active:scale-95 flex items-center gap-3">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
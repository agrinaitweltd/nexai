import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight, Quote } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

const TABS: TabItem[] = [
  { key: 'all',    label: 'All Stories' },
  { key: 'africa', label: 'Africa' },
  { key: 'global', label: 'Global' },
];

interface Story {
  region: 'africa' | 'global';
  company: string;
  country: string;
  sector: string;
  name: string;
  role: string;
  quote: string;
  stat: { value: string; label: string };
  color: string;
  bg: string;
}

const STORIES: Story[] = [
  {
    region: 'africa',
    company: 'Nile Agro Holdings',
    country: 'Uganda',
    sector: 'Coffee Export',
    name: 'Mr. Patrick Ssemakula',
    role: 'Managing Director',
    quote: 'Before Nexa, our export documentation team was working 14-hour days during peak season. Now the same volume is handled automatically. We shipped 40% more this year with the same team size.',
    stat: { value: '+40%', label: 'Export Volume Growth' },
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    region: 'africa',
    company: 'West Africa Cocoa Cooperative',
    country: 'Ghana',
    sector: 'Smallholder Aggregation',
    name: 'Ms. Abena Frimpong',
    role: 'Operations Director',
    quote: 'Our cooperative aggregates from 1,200 smallholder farms. Keeping track manually was impossible. Nexa gave us visibility we never had — yield per farm, quality grades, and traceability all in one screen.',
    stat: { value: '1,200+', label: 'Farms Connected' },
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    region: 'global',
    company: 'Deccan Farms Ltd.',
    country: 'India',
    sector: 'Commercial Farming',
    name: 'Mr. Vikram Nair',
    role: 'CEO',
    quote: 'We manage 18,000 acres across three states. The old system required a 12-person data entry team. With Nexa, we cut that to 3 people and our data quality is night and day better.',
    stat: { value: '18,000', label: 'Acres Managed' },
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    region: 'global',
    company: 'Andina Fresh S.A.',
    country: 'Colombia',
    sector: 'Agro-Processing & Export',
    name: 'Ms. Valentina Ríos',
    role: 'Supply Chain Manager',
    quote: "Nexa's compliance module alone paid for itself in the first quarter. We had a GLOBALG.A.P. audit with 6 weeks' notice and passed first time. The inspector said our documentation was the best they had seen.",
    stat: { value: '100%', label: 'First-Time Audit Pass Rate' },
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
];

function StoryCard({ s }: { s: Story }) {
  return (
    <div className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
          <span className={`font-black text-lg ${s.color}`}>{s.company[0]}</span>
        </div>
        <div>
          <p className="font-black text-slate-900 text-sm">{s.company}</p>
          <p className="text-slate-400 text-[11px] font-medium">{s.country} · {s.sector}</p>
        </div>
      </div>
      <div className={`mb-5 pb-5 border-b border-slate-100`}>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.stat.value}</p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.stat.label}</p>
      </div>
      <div className="relative flex-1 mb-6">
        <Quote size={20} className={`absolute -top-1 -left-1 ${s.color} opacity-30`} />
        <p className="text-slate-600 text-sm font-medium leading-relaxed pl-5 italic">
          {s.quote}
        </p>
      </div>
      <div>
        <p className="font-black text-slate-800 text-sm">{s.name}</p>
        <p className={`text-[11px] font-bold uppercase tracking-widest ${s.color}`}>{s.role}</p>
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const activeKey = useActiveTab(TABS);
  const filtered = activeKey === 'all' ? STORIES : STORIES.filter(s => s.region === activeKey);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <PageTabBar tabs={TABS} />

      <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-900 to-[#170038]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-white/10 text-cyan-300">
            Customer Stories
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-5">
            Operations transformed, in their own words.
          </h1>
          <p className="text-indigo-200/70 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            From East African coffee exporters to South American agro-processors — real results from real operations.
          </p>
        </div>
      </section>

      <section className="py-16 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => <StoryCard key={s.company} s={s} />)}
        </div>
        {filtered.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-12">
            <p className="text-slate-400 font-medium">No stories found for this region yet. Check back soon.</p>
          </div>
        )}
      </section>

      <section className="py-16 md:py-20 px-5 md:px-12 bg-gradient-to-br from-emerald-500/10 to-teal-400/5 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4">
            Ready to write your own success story?
          </h3>
          <p className="text-slate-400 text-base font-medium mb-8">
            Join 400+ enterprises already transforming their operations on Nexa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all flex items-center gap-3">
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

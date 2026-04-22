import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight, Leaf, Globe2, Users, BarChart3, Briefcase, Newspaper } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';
import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

const TABS: TabItem[] = [
  { key: 'story',        label: 'Our Story' },
  { key: 'leadership',   label: 'Leadership' },
  { key: 'sustainability', label: 'Sustainability' },
  { key: 'careers',      label: 'Careers' },
  { key: 'news',         label: 'News' },
  { key: 'financial',    label: 'Financial Information' },
];

const LEADERS = [
  { name: 'Dr. Amara Osei',    role: 'Chief Executive Officer',       region: 'Accra, Ghana',        bio: 'Former Director of Agricultural Innovation at the African Development Bank. 20 years building agri-tech across Sub-Saharan Africa.' },
  { name: 'Priya Sharma',      role: 'Chief Technology Officer',      region: 'Nairobi, Kenya',       bio: 'Ex-engineering lead at Palantir. Architected data platforms for some of the world\'s largest commodity traders before joining Nexa.' },
  { name: 'James Ochieng',     role: 'Chief Operating Officer',       region: 'Kampala, Uganda',      bio: 'Former VP Operations at East Africa Breweries. Scaled operations teams across 12 countries in East and Central Africa.' },
  { name: 'Carlos Mendez',     role: 'Chief Financial Officer',       region: 'São Paulo, Brazil',    bio: 'Previously CFO at AgroGlobal, where he managed financial operations across 9 Latin American markets and secured $220M in growth funding.' },
  { name: 'Dr. Fatima Al-Rashid', role: 'Chief Product Officer',     region: 'Dubai, UAE',           bio: 'Built product at SAP Agri and advised the UN Food & Agriculture Organization on digital transformation roadmaps.' },
  { name: 'Sipho Dlamini',     role: 'VP Sales & Partnerships',       region: 'Johannesburg, South Africa', bio: '15 years closing enterprise deals with African governments and agribusiness conglomerates across the continent.' },
];

const SUSTAINABILITY = [
  { icon: Leaf, title: 'Regenerative Agriculture Support', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Nexa helps farms track soil carbon, water usage, and input reduction — giving farmers the data they need to transition to regenerative practices and access premium green markets.' },
  { icon: Globe2, title: 'Climate-Resilient Operations', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Our weather integration and yield modelling tools help farmers adapt to shifting climate patterns, reduce crop loss, and optimise resource use in water-stressed environments.' },
  { icon: Users, title: 'Smallholder Inclusion', color: 'text-violet-600', bg: 'bg-violet-50', desc: "Nexa's cooperative tools connect smallholder farmers to aggregation networks, giving them access to the same export infrastructure as large commercial operations." },
];

const NEWS = [
  { date: 'March 2026', tag: 'Press Release', title: 'Nexa secures $42M Series B to expand operations across East Africa and Latin America', excerpt: 'The funding round was led by Leapfrog Investments and African Development Partners, with participation from existing investors.' },
  { date: 'January 2026', tag: 'Product Update', title: 'NexaAI launches natural language operational queries — ask your farm any question', excerpt: 'Clients can now query live operational data in plain language. NexaAI understands context across all modules and generates actionable reports.' },
  { date: 'November 2025', tag: 'Partnership', title: 'Nexa and the African Export-Import Bank partner to streamline cross-border agri-trade documentation', excerpt: 'The partnership enables automatic pre-population of Afreximbank-approved trade documents for shipments across 22 member states.' },
];

const OPEN_ROLES = [
  { title: 'Senior Full-Stack Engineer', location: 'Nairobi / Remote', team: 'Engineering' },
  { title: 'Product Manager — Export & Trade', location: 'Accra / Remote', team: 'Product' },
  { title: 'Enterprise Account Executive', location: 'São Paulo / Remote', team: 'Sales' },
  { title: 'Agricultural Data Analyst', location: 'Kampala / Remote', team: 'Data' },
];

export default function AboutPage() {
  const activeKey = useActiveTab(TABS);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[{ label: 'About', to: '/about' }, { label: TABS.find(t => t.key === activeKey)?.label || '' }]} />
      </div>

      <PageTabBar tabs={TABS} />

      {/* OUR STORY */}
      {activeKey === 'story' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-[#170038]/5 to-indigo-400/5">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-indigo-50 text-indigo-600">Our Story</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-6">
                Built by people who have worked the land.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                Nexa was founded in 2021 by a team of agronomists, logistics operators, and enterprise software engineers who grew frustrated watching Africa's most productive farming operations run on spreadsheets and WhatsApp groups. We believed agribusiness deserved the same operational sophistication as any Fortune 500 company — and that the tools to deliver it should be built for African realities first.
              </p>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                Starting in Uganda's coffee belt, we spent 18 months embedded with export houses before writing a single line of code. The result is a platform shaped entirely by operational reality — not assumptions made in a boardroom thousands of miles away.
              </p>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Today, Nexa operates across 14 countries, serves over 400 enterprises, and manages more than $2.1B in annual agri-trade flows.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-slate-950">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '2021', label: 'Founded' },
                { value: '14', label: 'Countries' },
                { value: '400+', label: 'Enterprise Clients' },
                { value: '$2.1B+', label: 'Annual Trade Flows' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">{value}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* LEADERSHIP */}
      {activeKey === 'leadership' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-900 to-[#170038]">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-white/10 text-cyan-300">Leadership</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-5">
                A global team with deep agricultural roots.
              </h1>
              <p className="text-indigo-200/70 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Our leadership team has operated in agriculture, logistics, and enterprise technology across four continents.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEADERS.map((l) => (
                <div key={l.name} className="p-7 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#170038] to-indigo-500 flex items-center justify-center mb-4">
                    <span className="text-white font-black text-xl">{l.name[0]}</span>
                  </div>
                  <h3 className="text-slate-900 font-black text-lg tracking-tight mb-0.5">{l.name}</h3>
                  <p className="text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-1">{l.role}</p>
                  <p className="text-slate-400 text-[11px] font-medium mb-3">{l.region}</p>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{l.bio}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* SUSTAINABILITY */}
      {activeKey === 'sustainability' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-emerald-500/10 to-teal-400/5">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-emerald-50 text-emerald-600">Sustainability</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Technology for a planet-positive food system.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Every feature we build considers its impact on farmers, communities, and the environment.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUSTAINABILITY.map(({ icon: Icon, title, color, bg, desc }) => (
                <div key={title} className="p-7 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${bg}`}>
                    <Icon size={22} className={color} />
                  </div>
                  <h3 className="text-slate-900 font-black text-lg tracking-tight mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CAREERS */}
      {activeKey === 'careers' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-violet-500/10 to-purple-400/5">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-violet-50 text-violet-600">Careers</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Build the future of African agribusiness.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
                We're a fully remote-first team with offices in Nairobi, Accra, and São Paulo. We offer competitive salaries, equity, and genuinely meaningful work.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-5xl mx-auto space-y-4">
              {OPEN_ROLES.map((r) => (
                <div key={r.title} className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                  <div>
                    <p className="font-black text-slate-900 text-base">{r.title}</p>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">{r.location} · {r.team}</p>
                  </div>
                  <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-600 hover:text-violet-800 transition-colors">
                    Apply <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* NEWS */}
      {activeKey === 'news' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-blue-500/10 to-indigo-400/5">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-blue-50 text-blue-600">News</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Latest from Nexa.
              </h1>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-5xl mx-auto space-y-6">
              {NEWS.map((n) => (
                <div key={n.title} className="p-7 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{n.tag}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{n.date}</span>
                  </div>
                  <h3 className="text-slate-900 font-black text-xl tracking-tight mb-2 leading-snug">{n.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{n.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* FINANCIAL */}
      {activeKey === 'financial' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-900 to-[#170038]">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-white/10 text-cyan-300">Financial Information</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-5">
                Transparent by design.
              </h1>
              <p className="text-indigo-200/70 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Nexa is a private company. We publish selected financial metrics to maintain trust with our clients, partners, and future investors.
              </p>
            </div>
          </section>
          <section className="py-16 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              {[
                { value: '$42M', label: 'Series B (2026)' },
                { value: '$2.1B+', label: 'Annual GMV Facilitated' },
                { value: '3.2×', label: 'YoY Revenue Growth (2025)' },
                { value: '$68M+', label: 'Total Raised to Date' },
              ].map(({ value, label }) => (
                <div key={label} className="p-6 rounded-2xl border border-slate-100 text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-slate-400 text-sm font-medium">
                For investor relations, media enquiries, or ESG reporting requests, contact <span className="text-indigo-600 font-bold">ir@nexaagri.com</span>
              </p>
            </div>
          </section>
        </>
      )}

      <LandingFooter />
    </div>
  );
}

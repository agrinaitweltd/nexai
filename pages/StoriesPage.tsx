import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Star, Quote, ArrowRight, Globe2, Users, BarChart3, TrendingUp } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';

function useInView(threshold = 0.1) {
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

const TESTIMONIALS = [
  {
    name: 'James Ochieng',
    role: 'Operations Manager',
    company: 'Nile Agro Exports Ltd',
    country: 'Uganda',
    quote: 'Before Nexa, reconciling our export documentation used to take three full days per shipment. Now it takes under two hours. The phyto-sanitary automation alone justified the subscription in the first month.',
    stars: 5,
    metric: { value: '90%', label: 'Reduction in documentation time' },
    avatar: 'JO',
    accentColor: 'bg-amber-500',
    borderColor: 'border-amber-100',
  },
  {
    name: 'Priya Sharma',
    role: 'Director of Agriculture',
    company: 'Deccan Farms Ltd',
    country: 'India',
    quote: 'We manage 14 farm units across three states. Nexa gave us a single dashboard to see everything — yields, staff, costs, compliance — in real time. NexaAI flagged a water stress issue in our western unit before our agronomist noticed it on the ground.',
    stars: 5,
    metric: { value: '14', label: 'Farm units consolidated in one view' },
    avatar: 'PS',
    accentColor: 'bg-emerald-500',
    borderColor: 'border-emerald-100',
  },
  {
    name: 'Amara Diallo',
    role: 'Finance Controller',
    company: 'West Africa Cocoa Group',
    country: 'Ghana',
    quote: 'Our auditors spent three weeks reviewing our books last year. This year with Nexa\'s automatic ledger and one-click statutory reports, the audit was done in four days. The compliance module is exceptional.',
    stars: 5,
    metric: { value: '75%', label: 'Reduction in audit preparation time' },
    avatar: 'AD',
    accentColor: 'bg-blue-500',
    borderColor: 'border-blue-100',
  },
  {
    name: 'Carlos Mendez',
    role: 'CEO',
    company: 'Andina Fresh Exports',
    country: 'Peru',
    quote: 'We integrated Nexa across our entire supply chain — farms, processing, logistics, and finance. The visibility we now have is extraordinary. Our European buyers ask about our real-time traceability as a competitive advantage.',
    stars: 5,
    metric: { value: '340%', label: 'ROI in first 12 months' },
    avatar: 'CM',
    accentColor: 'bg-violet-500',
    borderColor: 'border-violet-100',
  },
];

const TRUST_COMPANIES = [
  'Nile Agro Exports', 'Deccan Farms Ltd', 'West Africa Cocoa Group',
  'Andina Fresh Exports', 'Kenyan Tea Board', 'East Africa Growers', 'Savanna Commodities',
];

const STATS = [
  { icon: Users, value: '500+', label: 'Enterprises on Nexa' },
  { icon: Globe2, value: '18+', label: 'Countries Served' },
  { icon: BarChart3, value: '4.9/5', label: 'Average Satisfaction Score' },
  { icon: TrendingUp, value: '94%', label: 'Year-2 Retention Rate' },
];

export default function StoriesPage() {
  const heroAnim = useInView(0.05);
  const storiesAnim = useInView(0.05);
  const statsAnim = useInView(0.1);
  const trustAnim = useInView(0.1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      {/* Breadcrumb */}
      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[
          { label: 'Customer Stories' },
        ]} />
      </div>

      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-28 px-5 md:px-12 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_55%)]" />
        <div ref={heroAnim.ref} className="max-w-7xl mx-auto relative z-10">
          <div className={`max-w-3xl ${heroAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Star size={13} className="fill-amber-400" />
              <span>Customer Stories</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6">
              Heard from<br /><span className="text-emerald-400">the field.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              From small family farms to large-scale export houses, see how teams around the world are transforming their operations with Nexa.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section ref={statsAnim.ref} className="bg-[#0a001e] border-b border-white/10 px-5 md:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center md:text-left ${statsAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transition: 'all 0.6s ease-out', transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <s.icon size={16} className="text-emerald-400 shrink-0" />
                <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{s.value}</p>
              </div>
              <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial cards */}
      <section ref={storiesAnim.ref} className="py-20 md:py-32 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start p-8 md:p-10 rounded-2xl border ${t.borderColor} hover:shadow-2xl transition-all duration-500 ${storiesAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Author info */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${t.accentColor} text-white font-black text-lg flex items-center justify-center`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-[16px]">{t.name}</p>
                    <p className="text-slate-500 text-[12px] font-medium">{t.role}</p>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-[13px]">{t.company}</p>
                  <p className="text-slate-400 text-[12px] font-medium flex items-center gap-1.5 mt-0.5">
                    <Globe2 size={11} /> {t.country}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className={`inline-block p-4 rounded-xl border ${t.borderColor} bg-slate-50`}>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{t.metric.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.metric.label}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="lg:col-span-2 relative">
                <Quote size={40} className="text-slate-100 mb-4" />
                <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section ref={trustAnim.ref} className="py-14 px-5 md:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8">Trusted by leading agricultural enterprises</p>
          <div className={`flex flex-wrap justify-center items-center gap-x-8 gap-y-4 ${trustAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
            {TRUST_COMPANIES.map((name) => (
              <span key={name} className="text-[13px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 px-5 md:px-12 bg-[#170038]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">
            Your story starts here.
          </h3>
          <p className="text-indigo-100/70 text-base md:text-lg font-medium mb-8">
            Join hundreds of enterprises that already run smarter with Nexa. No commitment required.
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

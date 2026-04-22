import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import {
  Heart, Lightbulb, ShieldCheck, Globe2, Leaf, TrendingUp,
  Users, ArrowRight, CheckCircle
} from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import PageBreadcrumb from '../components/PageBreadcrumb';

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

const TIMELINE = [
  { year: '2021', event: 'Nexa founded by a team of agronomists and software engineers in Kampala, Uganda.' },
  { year: '2022', event: 'First enterprise client — a 1,200-acre coffee cooperative managing exports to three continents.' },
  { year: '2023', event: 'NexaAI module launched after 18 months of fine-tuning on agricultural domain data.' },
  { year: '2024', event: 'Expanded to 18 countries across East, West, and Central Africa plus Southeast Asia.' },
  { year: '2025', event: 'Passed 500+ active enterprises. ISO 27001 certification awarded.' },
  { year: '2026', event: 'Rolling out the next generation platform with real-time IoT sensor integration.' },
];

const VALUES = [
  { icon: Globe2, title: 'Global by Design', desc: 'Agriculture is a global industry. Nexa is built for farmers in Kenya, India, Brazil, and everywhere in between — with multilingual support and multi-currency finance.' },
  { icon: Leaf, title: 'Sustainability First', desc: 'We help farmers track soil health, reduce waste through better inventory management, and report on environmental metrics required by export markets.' },
  { icon: TrendingUp, title: 'Growth Over Perfection', desc: 'We ship fast and improve constantly. Our users\' feedback drives every product decision. Iteration, not perfection, is how we serve agriculture.' },
  { icon: ShieldCheck, title: 'Data Sovereignty', desc: 'Your data belongs to you. Always. We will never sell, share, or use your operational data for anything outside the platform. Full stop.' },
];

const STATS = [
  { value: '500+', label: 'Enterprises Onboarded' },
  { value: '18+', label: 'Countries Active' },
  { value: '$240M+', label: 'Commodity Value Tracked' },
  { value: '99.9%', label: 'Uptime Delivered' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Business', desc: 'Register your operation, add your farms, departments, and team members. Takes under 10 minutes.' },
  { step: '02', title: 'Configure Your Modules', desc: 'Activate only the modules you need. Crop tracking, livestock, exports, finance — switch them on as you grow.' },
  { step: '03', title: 'Capture Daily Operations', desc: 'Log harvests, dispatch shipments, approve purchase orders, and track staff activities from any device.' },
  { step: '04', title: 'Analyse & Optimise', desc: 'Use the analytics dashboard and NexaAI to spot trends, forecast results, and make smarter decisions faster.' },
];

export default function AboutPage() {
  const heroAnim = useInView(0.05);
  const missionAnim = useInView(0.1);
  const timelineAnim = useInView(0.05);
  const valuesAnim = useInView(0.05);
  const howAnim = useInView(0.05);
  const statsAnim = useInView(0.1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      {/* Breadcrumb */}
      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[
          { label: 'Company', to: '/about' },
          { label: 'Our Story' },
        ]} />
      </div>

      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-32 px-5 md:px-12 bg-gradient-to-b from-[#170038] to-[#0a001e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12),transparent_60%)]" />
        <div ref={heroAnim.ref} className="max-w-7xl mx-auto relative z-10">
          <div className={`max-w-3xl ${heroAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Heart size={13} />
              <span>Our Story</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6">
              Built to <span className="text-emerald-400">modernise agriculture</span> globally.
            </h1>
            <p className="text-indigo-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Nexa was born out of frustration. Too many farmers were running their operations on Excel, WhatsApp, and paper — losing money, missing compliance deadlines, and unable to scale. We set out to change that.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsAnim.ref} className="bg-[#0a001e] border-b border-white/10 px-5 md:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center md:text-left ${statsAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transition: 'all 0.6s ease-out', transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">{s.value}</p>
              <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Promise */}
      <section ref={missionAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 ${missionAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 max-w-2xl">
              Mission, vision, and what we promise you.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, color: 'bg-rose-50 text-rose-600', label: 'Our Mission', heading: 'Make precision agriculture accessible to every farmer.', body: 'We believe that enterprise-grade operational tools should not be exclusive to billion-dollar corporations. Nexa puts the same technology in the hands of smallholder farmers and global exporters alike.' },
              { icon: Lightbulb, color: 'bg-amber-50 text-amber-600', label: 'Our Vision', heading: 'A world where data-driven farming is the norm.', body: 'We envision a future where every harvest decision, every shipment, every compliance requirement is backed by accurate, real-time intelligence — not guesswork and spreadsheets.' },
              { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', label: 'Our Promise', heading: 'We grow when you grow.', body: 'Our pricing, our support, and our roadmap are all shaped by our users. We succeed only when you succeed — which is why we invest more in customer outcomes than in marketing.' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-500 ${missionAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">{item.label}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3 leading-snug">{item.heading}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-14 ${timelineAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-3">Our Journey</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">From day one to today.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-slate-200 md:left-1/2" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} ${timelineAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transition: 'all 0.6s ease-out', transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    {i + 1}
                  </div>
                  <div className={`md:w-[calc(50%-40px)] pl-0 md:px-10 ${i % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'}`}>
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <p className="text-emerald-600 font-black text-[11px] uppercase tracking-widest mb-2">{item.year}</p>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-14 ${valuesAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-3">Core Values</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 max-w-xl">The beliefs that guide every decision.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((val, i) => (
              <div
                key={val.title}
                className={`p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all duration-500 ${valuesAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
                  <val.icon size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">{val.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-[#170038] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.1),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center mb-14 ${howAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <p className="text-[10px] font-black text-cyan-300/70 uppercase tracking-[0.5em] mb-3">Getting Started</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Up and running in minutes.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className={`p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 ${howAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-5xl font-black text-white/10 block mb-4 tracking-tighter">{step.step}</span>
                <h3 className="text-white font-black text-lg tracking-tight mb-3">{step.title}</h3>
                <p className="text-indigo-100/60 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 px-5 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-5">Join the movement.</h3>
          <p className="text-slate-400 text-base md:text-lg font-medium mb-8">
            Hundreds of farms, export groups, and agro-processors are already running on Nexa. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-[#170038] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all active:scale-95 flex items-center gap-3">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/stories" className="px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-600 transition-all">Read Customer Stories</Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

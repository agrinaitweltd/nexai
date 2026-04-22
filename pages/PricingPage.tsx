import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Check, ArrowRight, ChevronDown, DollarSign, ShieldCheck, Zap } from 'lucide-react';
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

const PLANS = [
  {
    name: 'Starter',
    price: '$4.99',
    period: '/month',
    description: 'Everything a solo operator or small farm needs to digitize daily operations.',
    highlight: false,
    features: [
      '1 Farm / Business Unit',
      'Up to 5 Staff Accounts',
      'Crop & Livestock Tracking',
      'Basic Financial Ledger',
      'Purchase Order Workflow',
      'Document Vault (5 GB)',
      'Email Support',
    ],
    notIncluded: ['Export & Logistics Module', 'NexaAI Assistant', 'Advanced Analytics', 'API Access'],
    cta: 'Get Started Free',
  },
  {
    name: 'Professional',
    price: '$19.99',
    period: '/month',
    description: 'For growing operations needing multi-farm visibility, export tools, and AI.',
    highlight: true,
    features: [
      'Up to 5 Farm Units',
      'Up to 25 Staff Accounts',
      'Export & Logistics Module',
      'Full Finance & PO System',
      'Compliance & Certifications',
      'Advanced Analytics Dashboard',
      'Document Vault (50 GB)',
      'NexaAI Assistant',
      'Mobile Push Notifications',
      'Priority Support (24hr SLA)',
    ],
    notIncluded: [],
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
      'On-premise Deployment Option',
      'SLA-backed 99.9% Uptime',
      'Custom Training & Onboarding',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
  },
];

const FAQS = [
  { q: 'Is there a free trial?', a: 'Yes — the Professional plan comes with a 14-day free trial, no credit card required. You can explore every feature before committing.' },
  { q: 'Can I change plans later?', a: 'Absolutely. You can upgrade or downgrade at any time from your account settings. Upgrades take effect immediately; downgrades apply at the next billing cycle.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, MTN Mobile Money, Airtel Money, and bank transfers for Enterprise plans. All payments are processed securely.' },
  { q: 'Is my data safe if I cancel?', a: 'Yes. You have 90 days after cancellation to export all your data in standard formats (CSV, PDF). We will never delete data without giving you ample notice.' },
  { q: 'Do you charge per user?', a: 'No per-seat fees. Each plan includes a set number of staff accounts. The Professional plan covers up to 25 users — enough for most multi-farm operations.' },
  { q: 'Can I get a demo before subscribing?', a: 'Yes — visit our Stories page or reach out via email and we\'ll arrange a personalised 30-minute walkthrough of the platform for your specific use case.' },
];

export default function PricingPage() {
  const heroAnim = useInView(0.05);
  const plansAnim = useInView(0.05);
  const faqAnim = useInView(0.1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <LandingHeader />

      {/* Breadcrumb */}
      <div className="pt-[86px]">
        <PageBreadcrumb crumbs={[
          { label: 'Pricing' },
        ]} />
      </div>

      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-20 px-5 md:px-12 bg-slate-50 border-b border-slate-100">
        <div ref={heroAnim.ref} className="max-w-3xl mx-auto text-center">
          <div className={`${heroAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out' }}>
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-100 mb-8">
              <DollarSign size={13} className="text-emerald-500" />
              <span>Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-6">
              One flat price.<br /><span className="text-emerald-600">Everything included.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              No per-seat fees. No hidden charges. No long-term contracts. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section ref={plansAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-500 ${plan.highlight
                  ? 'bg-[#170038] border-[#170038] shadow-[0_32px_72px_-12px_rgba(23,0,56,0.45)] scale-[1.03]'
                  : 'bg-white border-slate-100 hover:shadow-xl'
                } ${plansAnim.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-300 text-[#120030] text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <p className={`text-[10px] font-black uppercase tracking-[0.35em] mb-3 ${plan.highlight ? 'text-cyan-300' : 'text-slate-400'}`}>{plan.name}</p>
                  <div className="flex items-end gap-1.5 mb-3">
                    <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-indigo-200/70' : 'text-slate-400'}`}>{plan.period}</span>}
                  </div>
                  <p className={`text-sm font-medium leading-relaxed ${plan.highlight ? 'text-indigo-100/70' : 'text-slate-500'}`}>{plan.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-3 text-[13px] font-medium ${plan.highlight ? 'text-indigo-100/85' : 'text-slate-700'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-cyan-300/20' : 'bg-emerald-50'}`}>
                        <Check size={10} className={plan.highlight ? 'text-cyan-300' : 'text-emerald-600'} />
                      </div>
                      {feat}
                    </li>
                  ))}
                  {plan.notIncluded.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-[13px] font-medium text-slate-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-slate-50">
                        <span className="text-slate-300 text-[10px]">–</span>
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

          {/* Trust note */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Secure & Encrypted', desc: 'AES-256 encryption at rest. TLS 1.3 in transit. ISO 27001-certified hosting.' },
              { icon: Zap, title: '99.9% Uptime SLA', desc: 'Geo-redundant infrastructure ensures your data is always available, even on remote farms.' },
              { icon: DollarSign, title: 'Cancel Anytime', desc: 'No lock-in contracts. Cancel from your account dashboard in under 60 seconds.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm mb-1">{item.title}</p>
                  <p className="text-slate-500 text-[12px] font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqAnim.ref} className="py-20 md:py-28 px-5 md:px-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 ${faqAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.7s ease-out' }}>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">Pricing FAQs</h2>
          </div>
          <div className={`space-y-3 ${faqAnim.inView ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out 0.2s' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-emerald-200 transition-colors">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900 text-[15px] pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
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

      {/* CTA */}
      <section className="py-20 md:py-24 px-5 md:px-12 bg-[#170038]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">Ready to get started?</h3>
          <p className="text-indigo-100/70 text-base md:text-lg font-medium mb-8">
            Join hundreds of agricultural enterprises already running on Nexa. Try the Professional plan free for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="bg-cyan-300 text-[#120030] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-200 transition-all active:scale-95 flex items-center gap-3">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/stories" className="px-8 py-5 text-indigo-100/70 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-all border border-white/20 rounded-2xl">
              Read Customer Stories
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

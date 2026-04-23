import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

import PageTabBar, { useActiveTab, TabItem } from '../components/PageTabBar';

const TABS: TabItem[] = [
  { key: 'plans', label: 'Compare Plans' },
  { key: 'faq',   label: 'FAQ' },
];

const PLANS = [
  {
    name: 'Starter', price: '$4.99', period: '/mo', tag: null, billingNote: 'or $7.99/mo billed monthly',
    desc: 'For single-farm operations getting started with digital management.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
    features: [
      '1 farm unit', 'Up to 5 users', 'Crop & livestock tracking',
      'Basic inventory management', 'Standard reports', 'Email support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Growth', price: '$799', period: '/month', tag: 'Most Popular',
    desc: 'For multi-farm operations and export businesses scaling across borders.',
    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-400',
    features: [
      'Up to 10 farm units', 'Up to 25 users', 'Full export & logistics module',
      'Finance & payroll', 'Custom reports & analytics', 'Compliance & certification vault',
      'API access', 'Priority support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', tag: null,
    desc: 'For large agribusiness groups, cooperatives, and government agencies.',
    color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200',
    features: [
      'Unlimited farms', 'Unlimited users', 'All modules included',
      'NexaAI full access', 'Dedicated account manager', 'Custom integrations',
      'SLA-backed uptime', 'On-site onboarding available',
    ],
    cta: 'Contact Sales',
  },
];

const FAQS = [
  { q: 'Is there a free trial?', a: 'Yes — all plans come with a 14-day free trial, no credit card required. You get access to all features in your chosen plan tier during the trial period.' },
  { q: 'Can I add more farms or users mid-subscription?', a: 'Yes. You can upgrade your plan or purchase add-on farm units and user seats at any time from your billing dashboard. Changes take effect immediately.' },
  { q: 'Do you offer discounts for cooperatives or NGOs?', a: 'We offer a 30% discount for registered cooperatives, smallholder networks, and non-profit agricultural organisations. Contact our sales team with your registration details.' },
  { q: 'Is my data backed up and secure?', a: 'All data is encrypted at rest and in transit. We maintain daily backups with 30-day retention, and our infrastructure is hosted on ISO 27001-certified cloud providers.' },
  { q: 'What payment methods do you accept?', a: 'We accept credit and debit cards (Visa, Mastercard), bank transfer, and M-Pesa for East African clients. Annual billing earns a 15% discount.' },
  { q: 'Can I export my data if I leave?', a: 'Absolutely. You can export all your operational data as CSV or JSON at any time, including after cancellation for up to 90 days.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="font-black text-slate-900 text-base pr-8">{q}</span>
        <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-slate-500 text-sm font-medium leading-relaxed">{a}</p>}
    </div>
  );
}

export default function PricingPage() {
  const activeKey = useActiveTab(TABS);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />

      <PageTabBar tabs={TABS} />

      {/* PLANS TAB */}
      {activeKey === 'plans' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-indigo-500/10 to-blue-400/5">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-indigo-50 text-indigo-600">Pricing</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Transparent pricing. No surprises.
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                All plans include a 14-day free trial. Annual billing saves 15%.
              </p>
            </div>
          </section>
          <section className="py-12 px-5 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`relative p-8 rounded-2xl border-2 ${plan.border} flex flex-col ${plan.name === 'Growth' ? 'shadow-2xl shadow-indigo-100 scale-[1.02]' : ''}`}>
                  {plan.tag && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-4 py-1.5 rounded-full">
                      {plan.tag}
                    </span>
                  )}
                  <div className="mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${plan.bg} ${plan.color} mb-3 inline-block`}>{plan.name}</span>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                      <span className="text-slate-400 text-sm font-medium pb-1">{plan.period}</span>
                    </div>
                    {(plan as any).billingNote && (
                      <p className="text-[11px] text-slate-400 font-medium mb-2">{(plan as any).billingNote}</p>
                    )}
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{plan.desc}</p>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[13px] font-medium text-slate-600">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.bg}`}>
                          <Check size={8} className={plan.color} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.name === 'Enterprise' ? '/about?tab=story' : '/login'}
                    className={`w-full text-center py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${plan.name === 'Growth' ? 'bg-[#170038] text-white hover:bg-[#240054]' : `${plan.bg} ${plan.color} hover:opacity-80`}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* FAQ TAB */}
      {activeKey === 'faq' && (
        <>
          <section className="py-16 md:py-24 px-5 md:px-12 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] px-3 py-1.5 rounded-full mb-5 bg-slate-100 text-slate-600">FAQ</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-5">
                Common questions, answered.
              </h1>
            </div>
          </section>
          <section className="py-8 px-5 md:px-12 pb-24 bg-white">
            <div className="max-w-3xl mx-auto">
              {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
            <div className="max-w-3xl mx-auto mt-12 text-center">
              <p className="text-slate-400 text-sm font-medium mb-4">Still have questions?</p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-[#170038] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#240054] transition-all">
                Talk to Us <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </>
      )}

      <LandingFooter />
    </div>
  );
}

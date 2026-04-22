import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ChevronUp, Globe2, Mail, Linkedin } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const FOOTER_GROUPS = [
  {
    title: 'Industries',
    links: [
      { label: 'Coffee & Commodity Export', to: '/industries' },
      { label: 'Commercial Farming', to: '/industries' },
      { label: 'Livestock Production', to: '/industries' },
      { label: 'Agro-Processing', to: '/industries' },
      { label: 'Logistics & Supply Chain', to: '/industries' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Farm Management', to: '/products' },
      { label: 'Export & Logistics', to: '/products' },
      { label: 'Financial Intelligence', to: '/products' },
      { label: 'NexaAI Assistant', to: '/products' },
      { label: 'Document Vault', to: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Nexa', to: '/about' },
      { label: 'Customer Stories', to: '/stories' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Sign In', to: '/login' },
      { label: 'Get Started', to: '/login' },
    ],
  },
  {
    title: 'Legal & Privacy',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Cookie Settings', to: '/' },
      { label: 'Modern Slavery Act', to: '/' },
      { label: 'Accessibility', to: '/' },
    ],
  },
];

export default function LandingFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative py-14 md:py-20 bg-[#1a003d] border-t border-white/10 px-5 md:px-12 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -bottom-24 left-[8%] w-[260px] h-[260px] bg-white/5 rounded-[38%] blur-[2px]" />
      <div className="absolute -bottom-14 left-[22%] w-[220px] h-[220px] bg-white/5 rounded-[38%] blur-[2px]" />
      <div className="absolute -bottom-20 left-[38%] w-[280px] h-[280px] bg-white/5 rounded-[38%] blur-[2px]" />
      <div className="absolute -bottom-24 right-[8%] w-[150px] h-[150px] bg-white/5 rounded-[38%] blur-[1px]" />

      <div className="relative z-10 max-w-[1320px] mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 mb-12">
          {/* Brand block */}
          <div className="lg:col-span-4 space-y-6">
            <NexaLogo className="h-12" light />
            <h3 className="text-white/90 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-md">
              Industrial <span className="text-cyan-300">AI</span> that matters.
            </h3>
            <p className="text-indigo-100/60 text-sm font-medium leading-relaxed max-w-sm">
              The modern management architecture for agricultural exports, value addition, and commercial production — built for the global market.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-cyan-300 hover:border-cyan-300/30 transition-all"><Linkedin size={15} /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-cyan-300 hover:border-cyan-300/30 transition-all"><Mail size={15} /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-cyan-300 hover:border-cyan-300/30 transition-all"><Globe2 size={15} /></a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="space-y-4">
                <h5 className="text-[13px] font-semibold tracking-wide text-indigo-100">{group.title}</h5>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-white/75 text-[13px] font-medium leading-tight hover:text-cyan-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-indigo-100/50 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Copyright 2026 Nexa Systems Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-indigo-100/60 text-[12px]">
            <Link to="/" className="hover:text-cyan-300 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-cyan-300 transition-colors">Terms</Link>
            <Link to="/login" className="hover:text-cyan-300 transition-colors">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="absolute right-5 md:right-12 bottom-6 md:bottom-10 w-14 h-14 rounded-full bg-[#4d108a] text-white flex items-center justify-center hover:bg-[#5f1aa6] transition-colors"
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </button>
    </footer>
  );
}

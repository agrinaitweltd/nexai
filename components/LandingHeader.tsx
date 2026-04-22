import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

interface DropdownLink { label: string; to: string; }
interface DropdownColumn { heading: string; links: DropdownLink[]; }
interface FeaturedCard { title: string; cta: string; to: string; gradient: string; }
interface NavLink {
  label: string;
  to: string;
  megaMenu?: {
    columns: DropdownColumn[];
    featured: FeaturedCard;
  };
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Industries',
    to: '/industries',
    megaMenu: {
      columns: [
        {
          heading: 'By Sector',
          links: [
            { label: 'Coffee & Commodity Export', to: '/industries?tab=coffee' },
            { label: 'Commercial Farming', to: '/industries?tab=farming' },
            { label: 'Livestock Production', to: '/industries?tab=livestock' },
          ],
        },
        {
          heading: 'By Scale',
          links: [
            { label: 'Smallholder Farmers', to: '/industries?tab=farming' },
            { label: 'Commercial Enterprises', to: '/industries?tab=farming' },
            { label: 'Export Groups & Co-ops', to: '/industries?tab=coffee' },
          ],
        },
        {
          heading: 'By Function',
          links: [
            { label: 'Agro-Processing', to: '/industries?tab=processing' },
            { label: 'Logistics & Supply Chain', to: '/industries?tab=logistics' },
            { label: 'Compliance & Certification', to: '/industries?tab=compliance' },
          ],
        },
      ],
      featured: {
        title: "How Nile Agro cut export time by 90%",
        cta: 'Read the story',
        to: '/stories',
        gradient: 'from-[#2d006e] via-[#4a0090] to-[#170038]',
      },
    },
  },
  {
    label: 'Products',
    to: '/products',
    megaMenu: {
      columns: [
        {
          heading: 'By Product',
          links: [
            { label: 'Nexa Cloud Platform', to: '/products?tab=overview' },
            { label: 'Farm & Livestock Suite', to: '/products?tab=products' },
            { label: 'Export & Logistics Module', to: '/products?tab=products' },
            { label: 'Finance & Purchase Orders', to: '/products?tab=products' },
          ],
        },
        {
          heading: 'By Feature',
          links: [
            { label: 'Financial Intelligence', to: '/products?tab=features' },
            { label: 'Compliance & Reporting', to: '/products?tab=features' },
            { label: 'Analytics Dashboard', to: '/products?tab=features' },
            { label: 'Document Vault', to: '/products?tab=features' },
          ],
        },
        {
          heading: 'Artificial Intelligence (AI)',
          links: [
            { label: 'NexaAI Assistant', to: '/products?tab=ai' },
            { label: 'Predictive Yield Analytics', to: '/products?tab=ai' },
            { label: 'Livestock Health Detection', to: '/products?tab=ai' },
            { label: 'Compliance Automation', to: '/products?tab=ai' },
          ],
        },
      ],
      featured: {
        title: "What's New in Nexa Cloud",
        cta: 'Learn more',
        to: '/products',
        gradient: 'from-[#0d3060] via-[#1a0060] to-[#120030]',
      },
    },
  },
  { label: 'Pricing', to: '/pricing' },
  {
    label: 'About',
    to: '/about',
    megaMenu: {
      columns: [
        {
          heading: 'Company',
          links: [
            { label: 'Our Story', to: '/about?tab=story' },
            { label: 'Leadership', to: '/about?tab=leadership' },
            { label: 'Sustainability', to: '/about?tab=sustainability' },
            { label: 'Careers', to: '/about?tab=careers' },
            { label: 'News', to: '/about?tab=news' },
            { label: 'Financial Information', to: '/about?tab=financial' },
          ],
        },
        {
          heading: 'Community',
          links: [
            { label: 'Customer Stories', to: '/stories' },
            { label: 'Partner Network', to: '/about' },
            { label: 'Events', to: '/about' },
          ],
        },
      ],
      featured: {
        title: 'Modernising agriculture across 18+ countries',
        cta: 'Our mission',
        to: '/about',
        gradient: 'from-[#1a3a00] via-[#0a2800] to-[#001a08]',
      },
    },
  },
  { label: 'Stories', to: '/stories' },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileKey, setOpenMobileKey] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenMobileKey(null);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const showDropdown = (key: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setActiveDropdown(key);
  };

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const activeLink = NAV_LINKS.find((l) => l.label === activeDropdown);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'shadow-[0_12px_38px_-20px_rgba(0,0,0,0.8)]' : ''
      }`}
      onMouseLeave={scheduleHide}
    >
      {/* Main nav bar */}
      <nav className="bg-[#170038] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-5 md:px-12 h-[86px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" onMouseEnter={() => setActiveDropdown(null)}>
            <NexaLogo className="h-8 md:h-10" light />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.megaMenu ? showDropdown(link.label) : setActiveDropdown(null)}
              >
                <Link
                  to={link.to}
                  className={`relative h-full flex items-center gap-1 px-5 text-[13px] font-semibold transition-colors ${
                    isActive(link.to) ? 'text-white' : 'text-indigo-100/75 hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.megaMenu && (
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-violet-400' : ''}`}
                    />
                  )}
                  {isActive(link.to) && (
                    <span className="absolute left-3 right-3 bottom-0 h-[3px] bg-cyan-300 rounded-full" />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div
            className="hidden lg:flex items-center gap-3 shrink-0"
            onMouseEnter={() => setActiveDropdown(null)}
          >
            <Link
              to="/login"
              className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-100/90 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-5 py-3 rounded-xl bg-cyan-300 text-[#120030] text-[11px] font-black uppercase tracking-[0.18em] hover:bg-cyan-200 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-xl border border-white/20 transition-all active:scale-95"
          >
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}><X size={18} /></div>
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}><Menu size={18} /></div>
          </button>
        </div>
      </nav>

      {/* ── Desktop mega-menu panel ── */}
      {activeLink?.megaMenu && (
        <div
          className="hidden lg:block bg-[#150030] border-b border-white/10"
          onMouseEnter={() => showDropdown(activeLink.label)}
          onMouseLeave={scheduleHide}
        >
          <div className="max-w-[1320px] mx-auto px-5 md:px-12 py-10">
            <div className="flex gap-8">
              {/* Columns */}
              <div className="flex-1 grid gap-x-8"
                style={{ gridTemplateColumns: `repeat(${activeLink.megaMenu.columns.length}, minmax(0,1fr))` }}
              >
                {activeLink.megaMenu.columns.map((col) => (
                  <div key={col.heading}>
                    {/* Column heading */}
                    <h4 className="text-[14px] font-bold text-violet-400 tracking-wide mb-2">
                      {col.heading}
                    </h4>
                    <div className="border-t border-white/20 mb-4" />
                    {/* Links */}
                    <ul className="space-y-0.5">
                      {col.links.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.to}
                            className="block py-2 text-[18px] font-semibold text-white/90 hover:text-cyan-300 transition-colors leading-snug"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured card */}
              <div className="w-[260px] shrink-0 flex flex-col rounded-xl overflow-hidden">
                {/* Image area — abstract gradient pattern */}
                <div className={`h-[160px] bg-gradient-to-br ${activeLink.megaMenu.featured.gradient} relative overflow-hidden`}>
                  {/* Decorative orbs mimicking the abstract image */}
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-violet-500/40 blur-xl" />
                  <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-cyan-400/30 blur-lg" />
                  <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-fuchsia-500/50 blur-md" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(180,100,255,0.25),transparent_70%)]" />
                  {/* Ring accent */}
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-violet-400/30" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-cyan-400/20" />
                </div>

                {/* White callout card */}
                <div className="bg-white p-5 flex-1">
                  <p className="text-[#170038] font-bold text-[14px] leading-snug mb-3">
                    {activeLink.megaMenu.featured.title}
                  </p>
                  <Link
                    to={activeLink.megaMenu.featured.to}
                    className="inline-flex items-center gap-1.5 text-[#170038] font-black text-[12px] uppercase tracking-[0.15em] hover:text-violet-700 transition-colors group"
                  >
                    {activeLink.megaMenu.featured.cta}
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#120030] border-b border-white/10 max-h-[calc(100dvh-86px)] overflow-y-auto">
          {/* CTA buttons at the top */}
          <div className="px-4 pt-4 pb-3 grid grid-cols-2 gap-2 border-b border-white/10">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center rounded-2xl py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-white border border-white/25 active:scale-95 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center rounded-2xl py-3.5 text-[11px] font-black uppercase tracking-[0.16em] bg-cyan-300 text-[#120030] hover:bg-cyan-200 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Nav items */}
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <div className={`flex items-center rounded-2xl transition-colors ${
                  isActive(link.to) ? 'bg-white/8' : 'hover:bg-white/5'
                }`}>
                  {/* Label navigates to the page */}
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex-1 px-4 py-4 text-[14px] font-semibold transition-colors ${
                      isActive(link.to) ? 'text-white' : 'text-white/75'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {/* Chevron to expand sub-links */}
                  {link.megaMenu ? (
                    <button
                      type="button"
                      onClick={() => setOpenMobileKey(openMobileKey === link.label ? null : link.label)}
                      className={`px-4 py-4 transition-colors ${openMobileKey === link.label ? 'text-cyan-300' : 'text-white/30 hover:text-white/70'}`}
                      aria-label={`Expand ${link.label}`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${openMobileKey === link.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <span className="px-4 py-4 text-white/20">
                      <ArrowRight size={14} />
                    </span>
                  )}
                </div>

                {/* Sub-link grid */}
                {link.megaMenu && openMobileKey === link.label && (
                  <div className="mt-1 mb-2 rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
                    {link.megaMenu.columns.map((col, ci) => (
                      <div key={col.heading} className={`px-4 pt-3 pb-2 ${ci < link.megaMenu!.columns.length - 1 ? 'border-b border-white/8' : ''}`}>
                        <p className="text-[9px] font-black uppercase tracking-[0.45em] text-violet-400 mb-2.5">
                          {col.heading}
                        </p>
                        <div className="grid grid-cols-2 gap-x-3">
                          {col.links.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.to}
                              onClick={() => setIsMenuOpen(false)}
                              className="py-2.5 text-[13px] font-medium text-white/60 hover:text-cyan-300 active:text-cyan-200 transition-colors leading-tight"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-4" />
        </div>
      )}
    </header>
  );
}


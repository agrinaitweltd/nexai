import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

interface DropdownLink { label: string; to: string; }
interface NavLink {
  label: string;
  to: string;
  dropdown?: { heading: string; links: DropdownLink[] };
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Industries',
    to: '/industries',
    dropdown: {
      heading: 'Industries',
      links: [
        { label: 'Coffee & Commodity Export', to: '/industries' },
        { label: 'Commercial Farming', to: '/industries' },
        { label: 'Livestock Production', to: '/industries' },
        { label: 'Agro-Processing', to: '/industries' },
        { label: 'Logistics & Supply Chain', to: '/industries' },
        { label: 'Compliance & Certification', to: '/industries' },
      ],
    },
  },
  {
    label: 'Products',
    to: '/products',
    dropdown: {
      heading: 'Platform',
      links: [
        { label: 'Farm & Livestock Management', to: '/products' },
        { label: 'Export & Logistics', to: '/products' },
        { label: 'Financial Intelligence', to: '/products' },
        { label: 'Compliance & Reporting', to: '/products' },
        { label: 'NexaAI Assistant', to: '/products' },
        { label: 'Analytics Dashboard', to: '/products' },
      ],
    },
  },
  { label: 'Pricing', to: '/pricing' },
  {
    label: 'About',
    to: '/about',
    dropdown: {
      heading: 'Company',
      links: [
        { label: 'Our Story', to: '/about' },
        { label: 'Leadership', to: '/about' },
        { label: 'Sustainability', to: '/about' },
        { label: 'Careers', to: '/about' },
        { label: 'News', to: '/about' },
        { label: 'Financial Information', to: '/about' },
      ],
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
    hideTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

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
                key={link.to}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.dropdown ? showDropdown(link.label) : setActiveDropdown(null)}
              >
                <Link
                  to={link.to}
                  className={`relative h-full flex items-center gap-1 px-5 text-[13px] font-semibold transition-colors ${
                    isActive(link.to) ? 'text-white' : 'text-indigo-100/75 hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-cyan-300' : ''}`}
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

      {/* Desktop dropdown panel */}
      {activeDropdown && (() => {
        const active = NAV_LINKS.find((l) => l.label === activeDropdown);
        if (!active?.dropdown) return null;
        return (
          <div
            className="hidden lg:block bg-[#1a003d] border-b border-white/10"
            onMouseEnter={() => showDropdown(activeDropdown)}
            onMouseLeave={scheduleHide}
          >
            <div className="max-w-[1320px] mx-auto px-5 md:px-12 py-10">
              <h4 className="text-[15px] font-bold text-violet-400 mb-3 tracking-wide">
                {active.dropdown.heading}
              </h4>
              <div className="border-t border-white/15 mb-6" />
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-1">
                {active.dropdown.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="block py-2.5 text-[22px] font-semibold text-white hover:text-cyan-300 transition-colors leading-tight"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#240054] border-b border-white/10 max-h-[calc(100vh-86px)] overflow-y-auto">
          <div className="px-5 py-4 space-y-1.5">
            {NAV_LINKS.map((link) => (
              <div key={link.to}>
                <button
                  type="button"
                  className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                    isActive(link.to) ? 'bg-cyan-300/15 text-cyan-300' : 'text-white/80 hover:bg-white/5'
                  }`}
                  onClick={() => {
                    if (link.dropdown) {
                      setOpenMobileKey(openMobileKey === link.label ? null : link.label);
                    } else {
                      setIsMenuOpen(false);
                      window.location.hash = link.to;
                    }
                  }}
                >
                  <Link
                    to={link.to}
                    onClick={(e: React.MouseEvent) => { if (link.dropdown) e.preventDefault(); else setIsMenuOpen(false); }}
                    className="flex-1 text-left"
                  >
                    {link.label}
                  </Link>
                  {link.dropdown
                    ? <ChevronDown size={14} className={`transition-transform ${openMobileKey === link.label ? 'rotate-180 text-cyan-300' : ''}`} />
                    : <ArrowRight size={13} />
                  }
                </button>

                {link.dropdown && openMobileKey === link.label && (
                  <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 pb-2">
                    {link.dropdown.links.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2.5 text-[14px] font-medium text-white/70 hover:text-cyan-300 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3 border-t border-white/10">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white border border-white/30"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.16em] bg-cyan-300 text-[#120030]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

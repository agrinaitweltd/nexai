import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { Menu, X, ArrowRight } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Industries', to: '/industries' },
  { label: 'Products', to: '/products' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Stories', to: '/stories' },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'shadow-[0_12px_38px_-20px_rgba(0,0,0,0.8)]' : ''
      }`}
    >
      <nav className="bg-[#170038] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-5 md:px-12 h-[86px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <NexaLogo className="h-8 md:h-10" light />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative h-full flex items-center px-5 text-[13px] font-semibold transition-colors ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-indigo-100/75 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute left-3 right-3 bottom-0 h-[3px] bg-cyan-300 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
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

        {/* Active indicator strip */}
        <div className="hidden lg:block h-[3px] bg-[#240054]" />
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#240054] border-b border-white/10">
          <div className="px-5 py-4 space-y-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                  isActive(link.to)
                    ? 'bg-cyan-300/15 text-cyan-300'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight size={13} />
              </Link>
            ))}
          </div>
          <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3 border-t border-white/10">
            <Link
              to="/login"
              className="flex items-center justify-center rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white border border-white/30"
            >
              Sign In
            </Link>
            <Link
              to="/login"
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

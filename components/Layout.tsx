import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate, Outlet } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Warehouse, Ship, DollarSign, LogOut,
  Menu, Bell, X, Cat, Users, Briefcase, Settings, HelpCircle, FileStack, MessageSquare, BarChart3, Search, Clock, ShieldAlert, ChevronRight, Wallet, CheckCircle2, User as UserIcon, Tractor, FlaskConical, Palette, Bot,
  Wifi, WifiOff, Command
} from 'lucide-react';
import { NexaLogo } from './NexaLogo';
import { getSavedAuth, isSessionPinVerified, setSessionPinVerified, MobileUnlockPrompt, clearSavedAuth } from './MobileAuth';

export default function Layout() {
  const { user, logout, notifications, markNotificationRead, markAllNotificationsRead, theme, requisitions, balance, formatCurrency, messages } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Lock screen: show on every page load/refresh if savedAuth exists ──
  const [savedMobileAuth] = useState(() => getSavedAuth());
  const [showLockScreen, setShowLockScreen] = useState(() => {
    const saved = getSavedAuth();
    return !!saved && !isSessionPinVerified();
  });

  const handleLockSuccess = async (email: string) => {
    setSessionPinVerified();
    setShowLockScreen(false);
  };

  const handleLockFallback = () => {
    // Let them through via password — just hide and let Supabase session handle it
    setSessionPinVerified();
    setShowLockScreen(false);
  };

  const handleLockDifferentAccount = () => {
    clearSavedAuth();
    setShowLockScreen(false);
    logout();
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPageEntering, setIsPageEntering] = useState(false);
  const mainContentRef = useRef<HTMLElement | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMsgs = messages.filter(m => !m.read && m.type === 'INBOX').length;
  const pendingReqs = (requisitions || []).filter((r: any) => r.status === 'PENDING').length;

  // Online / offline status
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Search bar
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50); }, [searchOpen]);
  
  const isLivestock = user?.sector === 'LIVESTOCK' || user?.businessType?.toLowerCase().includes('livestock');
  const isAdmin = user?.role === 'ADMIN';

  const hasPermission = (perm: string) => {
    if (isAdmin) return true;
    return user?.permissions?.includes(perm as any) || false;
  };

  // Preset Theme Colors Mapping
  const themeColors: Record<string, string> = {
      emerald: 'bg-emerald-600 shadow-emerald-600/30 text-emerald-600',
      blue: 'bg-blue-600 shadow-blue-600/30 text-blue-600',
      indigo: 'bg-indigo-600 shadow-indigo-600/30 text-indigo-600',
      rose: 'bg-rose-600 shadow-rose-600/30 text-rose-600',
      amber: 'bg-amber-600 shadow-amber-600/30 text-amber-600',
      slate: 'bg-slate-700 shadow-slate-700/30 text-slate-700'
  };

  const activeThemeColor = user?.dashboardTheme || 'emerald';
  const activeBgClass = themeColors[activeThemeColor].split(' ')[0];
  const activeShadowClass = themeColors[activeThemeColor].split(' ')[1];
  const activeTextClass = themeColors[activeThemeColor].split(' ')[2];

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) => {
    const isActive = location.pathname === to || (to !== '/app' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group ${
          isActive
            ? 'bg-[#1a5cad] text-white shadow-lg shadow-blue-900/40'
            : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 transition-colors'} />
          <span className="text-[13px] font-semibold tracking-[-0.01em]">{label}</span>
        </div>
        {badge ? (
          <span className="min-w-[20px] h-5 px-1.5 text-[10px] font-black rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
            {badge > 99 ? '99+' : badge}
          </span>
        ) : null}
      </Link>
    );
  };

  const handleNotificationClick = (note: any) => {
      markNotificationRead(note.id);
      if (note.link) navigate(note.link);
      setShowNotifications(false);
  };

  useEffect(() => {
    setIsPageEntering(true);
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const timer = window.setTimeout(() => {
      setIsPageEntering(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`flex h-screen bg-[#0b1526] overflow-hidden transition-colors dark ${theme}`}>
      {/* Passcode / Face ID lock screen — shown on every browser refresh */}
      {showLockScreen && savedMobileAuth && (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[500] flex flex-col items-center justify-center p-6">
          <div className="mb-8"><NexaLogo className="h-10" /></div>
          <div className="w-full max-w-sm">
            <MobileUnlockPrompt
              savedAuth={savedMobileAuth}
              onSuccess={handleLockSuccess}
              onFallback={handleLockFallback}
              onDifferentAccount={handleLockDifferentAccount}
            />
          </div>
        </div>
      )}
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d1c30] shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r border-white/[0.06] flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="hidden md:flex w-8 h-8 items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.07]"
            >
              <Menu size={18} />
            </button>
            <NexaLogo className="h-8" />
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 p-1.5 hover:text-white hover:bg-white/[0.07] rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-3 space-y-0.5 overflow-y-auto flex-1 scrollbar-hide">
          <NavItem to="/app" icon={LayoutDashboard} label="Dashboard" />
          {(isAdmin || hasPermission('LOG_HARVEST')) && (
            <NavItem to="/app/farms" icon={Tractor} label="Crops & Farms" />
          )}
          <NavItem to="/app/animals" icon={Cat} label="Livestock & Animals" />
          <NavItem to="/app/inventory" icon={Warehouse} label="Inventory Module" />
          <NavItem to="/app/exports" icon={Ship} label="Mission Control" />
          <NavItem to="/app/vault" icon={FileStack} label="Vault & Documents" />
          <NavItem to="/app/communication" icon={MessageSquare} label="Messaging & Alerts" badge={unreadMsgs} />
          <NavItem to="/app/staff" icon={Users} label="Staff & Teams" />
          <NavItem to="/app/finance" icon={DollarSign} label="Finance & Audit" badge={pendingReqs} />
          <NavItem to="/app/reports" icon={BarChart3} label="Reports Module" />
          <NavItem to="/app/agro-ai" icon={Bot} label="NexaAI Assistant" />
          <NavItem to="/app/clients" icon={Briefcase} label="Clients" />
          <NavItem to="/app/purchase-orders" icon={Wallet} label="Purchase Orders" />

          <div className="pt-2 mt-2 border-t border-white/[0.06]">
            <NavItem to="/app/settings" icon={Settings} label="Settings" />
            <NavItem to="/app/help" icon={HelpCircle} label="Help & Support" />
          </div>
        </nav>

        {/* User + Signout */}
        <div className="border-t border-white/[0.06] p-3 space-y-1">
          <Link to="/app/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/[0.07] hover:text-white transition-all group">
            <div className="w-7 h-7 rounded-full bg-[#1a5cad] flex items-center justify-center text-white text-[11px] font-black shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold truncate">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/[0.08] rounded-xl transition-all text-[13px] font-semibold"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-[#0d1c30] py-3 md:py-4 flex items-center z-40 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center px-4 md:px-6 flex-1 min-w-0 gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 shrink-0 active:scale-95 transition-all">
              <Menu size={20} />
            </button>
            {/* Search bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] rounded-xl px-3 py-2 transition-all min-w-0 max-w-xs w-full"
            >
              <Search size={14} className="text-slate-500 shrink-0" />
              <span className="text-[12px] text-slate-500 flex-1 text-left">Search...</span>
              <div className="flex items-center gap-0.5 shrink-0">
                <Command size={10} className="text-slate-600" />
                <span className="text-[10px] text-slate-600 font-bold">K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center pr-4 md:pr-6 gap-2 shrink-0">
            {/* Online / Offline */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance</span>
                <span className="text-sm font-bold text-white">{formatCurrency(balance)}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/[0.07] hover:text-white transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-500 rounded-full border-2 border-[#0d1c30] text-white text-[9px] font-black flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0d1c30] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="p-4 border-b border-white/[0.06] flex justify-between items-center">
                     <h3 className="font-bold text-white text-sm">Notifications</h3>
                     <button onClick={markAllNotificationsRead} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Clear all</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                     {notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 italic text-sm">No new alerts</div>
                     ) : (
                        notifications.slice().reverse().map(note => (
                            <div
                                key={note.id}
                                onClick={() => handleNotificationClick(note)}
                                className={`p-4 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.05] transition-all ${!note.read ? 'bg-blue-500/[0.06]' : ''}`}
                            >
                                <p className={`text-sm leading-tight ${!note.read ? 'font-bold text-white' : 'text-slate-400'}`}>{note.message}</p>
                                <p className="text-[9px] text-slate-600 mt-1.5 font-bold uppercase tracking-wider">{new Date(note.date).toLocaleString()}</p>
                            </div>
                        ))
                     )}
                   </div>
                </div>
              )}
            </div>

            <Link to="/app/profile" className="hidden md:flex w-10 h-10 rounded-xl border border-white/10 items-center justify-center text-slate-400 hover:bg-white/[0.07] hover:text-white transition-all">
                <UserIcon size={20} />
            </Link>
            {/* Mobile search button */}
            <button onClick={() => setSearchOpen(true)} className="md:hidden w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Search size={18} />
            </button>
          </div>
        </header>

        <main ref={mainContentRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 transition-colors scrollbar-thin bg-[#0b1526]">
          <div className={`max-w-7xl mx-auto min-h-full route-page-shell ${isPageEntering ? 'route-page-enter' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global search modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0d1c30] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pages, features..."
                  className="flex-1 bg-transparent text-white text-[14px] outline-none placeholder:text-slate-500"
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-3 space-y-0.5">
                {[
                  { label: 'Dashboard', to: '/app' },
                  { label: 'Finance & Audit', to: '/app/finance' },
                  { label: 'Inventory Module', to: '/app/inventory' },
                  { label: 'Staff & Teams', to: '/app/staff' },
                  { label: 'Mission Control', to: '/app/exports' },
                  { label: 'Crops & Farms', to: '/app/farms' },
                  { label: 'Livestock & Animals', to: '/app/animals' },
                  { label: 'Clients', to: '/app/clients' },
                  { label: 'Reports Module', to: '/app/reports' },
                  { label: 'NexaAI Assistant', to: '/app/agro-ai' },
                  { label: 'Vault & Documents', to: '/app/vault' },
                  { label: 'Settings', to: '/app/settings' },
                ]
                  .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/[0.07] hover:text-white transition-all text-[13px] font-semibold"
                    >
                      <Search size={12} className="text-slate-600" />
                      {item.label}
                    </Link>
                  ))
                }
              </div>
              <div className="px-4 py-2.5 border-t border-white/[0.06]">
                <p className="text-[10px] text-slate-600">Press <kbd className="bg-white/10 px-1 py-0.5 rounded text-[9px]">Esc</kbd> to close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
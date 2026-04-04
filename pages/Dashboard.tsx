
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { NexaLogo } from '../components/NexaLogo';
import { 
    TrendingUp, Package, AlertCircle, Tractor, FileStack, MessageSquare,
    Activity, DollarSign, Settings, Plus, X, ArrowUp, ArrowDown, CheckSquare, Wallet, ChevronRight, ChevronLeft, Check, Ban, BarChart3, Globe, Zap, ArrowRight, ShieldCheck, Warehouse, Briefcase,
    Sprout, FileText, Users, CloudRain, Wind, Sun, PieChart as PieChartIcon, ListChecks, History, CheckCircle2, Ship, Smartphone, UserPlus, Palette, ArrowUpRight, Clock, Search
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { DashboardWidget, WidgetType, DashboardTheme } from '../types';

// --- ENHANCED WIDGET COMPONENTS ---

const FinancialStatsWidget = () => {
  const { transactions, formatCurrency, balance } = useApp();
  const revenue = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  const chartData = transactions.length > 0 ? [
      { name: 'Income', value: revenue },
      { name: 'Expense', value: expenses }
  ] : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={80}/></div>
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
            <Wallet size={16} className="mr-2 text-emerald-500"/> Financial Standing
        </h3>
        
        <div className="space-y-4 md:space-y-6 relative z-10">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Available Capital</p>
                <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter truncate">{formatCurrency(balance)}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl md:rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center text-emerald-600 mb-1">
                        <ArrowUpRight size={12} className="mr-1" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Inflow</span>
                    </div>
                    <p className="text-sm md:text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(revenue)}</p>
                </div>
                <div className="p-3 md:p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl md:rounded-2xl border border-rose-100 dark:border-rose-800/50">
                    <div className="flex items-center text-rose-600 mb-1">
                        <ArrowDown size={12} className="mr-1" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Outflow</span>
                    </div>
                    <p className="text-sm md:text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(expenses)}</p>
                </div>
             </div>
        </div>

        {transactions.length > 0 && (
            <div className="h-20 md:h-24 w-full mt-4 md:mt-6 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -30 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={70} style={{fontSize: '8px', fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" barSize={10} radius={[0, 10, 10, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}
    </div>
  );
};

const StockDistributionWidget = () => {
  const { inventory } = useApp();
  
  const stockData = inventory.map(item => ({
    name: item.productName,
    value: item.quantity
  })).slice(0, 5);

  const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f43f5e', '#f59e0b'];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-all relative overflow-hidden group">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em]">
          <Warehouse size={16} className="mr-2 text-blue-500"/> Stock Distribution
      </h3>
      
      {inventory.length > 0 ? (
        <div className="flex items-center h-40 md:h-48">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stockData}
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {stockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5 md:space-y-2">
            {stockData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-40 md:h-48 flex items-center justify-center text-slate-300 italic text-xs border-2 border-dashed rounded-2xl md:rounded-3xl">
          No Inventory Data
        </div>
      )}
    </div>
  );
};

const QuickActionsWidget = () => {
    const navigate = useNavigate();
    const actions = [
        { label: 'Register Unit', icon: Sprout, path: '/app/farms', color: 'bg-emerald-600' },
        { label: 'Corporate Vault', icon: FileStack, path: '/app/vault', color: 'bg-blue-600' },
        { label: 'Launch Mission', icon: Ship, path: '/app/exports', color: 'bg-indigo-600' },
        { label: 'Team Portal', icon: MessageSquare, path: '/app/communication', color: 'bg-rose-600' },
    ];

    return (
        <div className="bg-slate-900 dark:bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl h-full transition-all flex flex-col justify-between border border-white/5 dark:border-slate-100">
             <h3 className="font-bold text-white dark:text-slate-900 mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80">
                <Settings size={16} className="mr-2" /> Action Dashboard
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {actions.map((act, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(act.path)}
                        className="bg-white/10 dark:bg-slate-50 hover:scale-105 dark:hover:bg-slate-100 p-3 md:p-5 rounded-xl md:rounded-[2rem] flex flex-col items-center justify-center space-y-2 md:space-y-3 transition-all active:scale-95 group shadow-sm"
                    >
                        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white ${act.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                            <act.icon size={18} />
                        </div>
                        <span className="text-[8px] md:text-[9px] font-black text-white dark:text-slate-800 uppercase tracking-widest text-center leading-tight">{act.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const RecentActivityWidget = () => {
    const { exports, harvests, notifications } = useApp();
    
    // Mix and match recent events
    const activities = [
        ...exports.map(e => ({ title: `Mission Launched: ${e.shipmentNumber}`, time: e.date, icon: Ship, color: 'text-indigo-500' })),
        ...harvests.map(h => ({ title: `Yield Logged: ${h.cropName}`, time: h.date, icon: Sprout, color: 'text-emerald-500' })),
    ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em]">
                <Activity size={16} className="mr-2 text-amber-500"/> Activity Stream
            </h3>
            <div className="space-y-3 md:space-y-5">
                {activities.length === 0 ? (
                    <div className="py-8 md:py-12 text-center text-slate-300 italic text-xs uppercase font-bold tracking-widest">No Recent Activity</div>
                ) : activities.map((act, i) => (
                    <div key={i} className="flex items-start space-x-3 md:space-x-4">
                        <div className={`mt-0.5 p-1.5 md:p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${act.color} shrink-0`}>
                            <act.icon size={13} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-xs font-bold text-slate-800 dark:text-white truncate">{act.title}</p>
                            <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(act.time).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LivestockSummaryWidget = () => {
    const { animals } = useApp();
    const byType = animals.reduce((acc: Record<string, number>, a) => {
        acc[a.type] = (acc[a.type] || 0) + a.quantity;
        return acc;
    }, {});
    const entries = Object.entries(byType).slice(0, 6);
    const total = animals.reduce((s, a) => s + a.quantity, 0);
    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Users size={80}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
                <Briefcase size={16} className="mr-2 text-amber-500"/> Livestock Register
            </h3>
            {animals.length === 0 ? (
                <div className="py-10 text-center text-slate-300 italic text-xs border-2 border-dashed rounded-2xl font-bold uppercase tracking-widest">No Animals Registered</div>
            ) : (
                <>
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-2xl mb-4 flex items-center justify-between relative z-10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Total Heads</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{total.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2.5 relative z-10">
                        {entries.map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{type}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{width: `${Math.min((count/total)*100, 100)}%`}} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white w-8 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const MissionsTrackerWidget = () => {
    const { exports, formatCurrency } = useApp();
    const active = exports.filter(e => e.status !== 'PAID' && e.status !== 'DELIVERED');
    const statusColor: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300',
        PENDING_APPROVAL: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        IN_TRANSIT: 'bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300',
        PAYMENT_PENDING: 'bg-rose-100 text-rose-700 dark:bg-rose-800/30 dark:text-rose-300',
    };
    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Ship size={80}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
                <Globe size={16} className="mr-2 text-indigo-500"/> Active Missions
            </h3>
            {active.length === 0 ? (
                <div className="py-10 text-center text-slate-300 italic text-xs border-2 border-dashed rounded-2xl font-bold uppercase tracking-widest">No Active Missions</div>
            ) : (
                <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {active.slice(0, 6).map(m => (
                        <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-1.5">
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate pr-2">{m.shipmentNumber}</p>
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${statusColor[m.status] || 'bg-slate-100 text-slate-600'}`}>{m.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold truncate">{m.productName} → {m.buyerName}</p>
                            <p className="text-[9px] font-black text-emerald-600 mt-1">{formatCurrency(m.totalValue)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StaffOverviewWidget = () => {
    const { staff } = useApp();
    const active = staff.filter(s => s.status === 'ACTIVE');
    const byRole = active.reduce((acc: Record<string, number>, s) => {
        const key = s.role || 'General';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const roleEntries = Object.entries(byRole).slice(0, 5);
    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Users size={80}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
                <Users size={16} className="mr-2 text-blue-500"/> Workforce Overview
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Active</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{active.length}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{staff.length}</p>
                </div>
            </div>
            {roleEntries.length > 0 && (
                <div className="space-y-2 relative z-10">
                    {roleEntries.map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{role}</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white ml-2">{count}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TransactionFeedWidget = () => {
    const { transactions, formatCurrency } = useApp();
    const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
    const typeStyle: Record<string, { color: string; label: string }> = {
        INCOME:          { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', label: '+' },
        EXPENSE:         { color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20', label: '-' },
        TRANSFER:        { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', label: '↔' },
        INITIAL_CAPITAL: { color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20', label: '★' },
    };
    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={80}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
                <History size={16} className="mr-2 text-rose-500"/> Transaction Feed
            </h3>
            {recent.length === 0 ? (
                <div className="py-10 text-center text-slate-300 italic text-xs border-2 border-dashed rounded-2xl font-bold uppercase tracking-widest">No Transactions</div>
            ) : (
                <div className="space-y-2 relative z-10">
                    {recent.map(t => {
                        const style = typeStyle[t.type] || { color: 'text-slate-500 bg-slate-50', label: '?' };
                        return (
                            <div key={t.id} className="flex items-center space-x-3">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${style.color}`}>{style.label}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-slate-800 dark:text-white truncate">{t.description}</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[10px] font-black shrink-0 ${t.type === 'EXPENSE' ? 'text-rose-600' : 'text-emerald-600'}`}>{formatCurrency(t.amount)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const AVAILABLE_WIDGETS: { type: WidgetType, title: string, defaultTitle: string, desc: string }[] = [
    { type: 'FINANCIAL_STATS', title: 'Financials', defaultTitle: 'Financial Overview', desc: 'Cash flow tracking' },
    { type: 'PRODUCTION_OVERVIEW', title: 'Stock Distribution', defaultTitle: 'Stock Health', desc: 'Inventory visualization' },
    { type: 'RECENT_ACTIVITY', title: 'Activity Logs', defaultTitle: 'Recent Activity', desc: 'Sync of all operations' },
    { type: 'QUICK_ACTIONS', title: 'Toolbox', defaultTitle: 'Quick Actions', desc: 'Workflow navigation' },
    { type: 'ACTIVATION_REQUESTS', title: 'Pending Audits', defaultTitle: 'Activation Pipeline', desc: 'Account verification audit' },
    { type: 'LIVESTOCK_SUMMARY', title: 'Livestock', defaultTitle: 'Livestock Register', desc: 'Heads count by species' },
    { type: 'MISSIONS_TRACKER', title: 'Missions', defaultTitle: 'Active Missions', desc: 'Live export & domestic missions' },
    { type: 'STAFF_OVERVIEW', title: 'Workforce', defaultTitle: 'Workforce Overview', desc: 'Headcount & role breakdown' },
    { type: 'TRANSACTION_FEED', title: 'Ledger Feed', defaultTitle: 'Transaction Feed', desc: 'Latest financial movements' },
];

const THEME_OPTIONS: { id: DashboardTheme, color: string }[] = [
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'indigo', color: 'bg-indigo-500' },
    { id: 'rose', color: 'bg-rose-500' },
    { id: 'amber', color: 'bg-amber-500' },
    { id: 'slate', color: 'bg-slate-700' },
];

export default function Dashboard() {
    // ...existing code...
    // (all state, handlers, and widget logic remain unchanged)

    const { user, loading } = useApp();
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-bold text-slate-500">Loading dashboard...</div>;
    }
    if (!user) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-bold text-rose-500">User not found. Please log in.</div>;
    }

    // --- MODERNIZED LAYOUT ---
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 py-8 px-6 space-y-8 shadow-xl z-20">
                <div className="flex items-center mb-8">
                    <NexaLogo className="h-10 mr-2" />
                    <span className="font-black text-xl tracking-tight text-emerald-600">NEXA</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Menu</div>
                    <ul className="space-y-1">
                        <li><a href="/app/dashboard" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-700 dark:text-white bg-emerald-50 dark:bg-emerald-900/10"><BarChart3 size={16} className="mr-2 text-emerald-500" /> Dashboard</a></li>
                        <li><a href="/app/farms" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><Sprout size={16} className="mr-2 text-green-500" /> Tasks</a></li>
                        <li><a href="/app/calendar" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><Calendar size={16} className="mr-2 text-blue-500" /> Calendar</a></li>
                        <li><a href="/app/analytics" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><PieChartIcon size={16} className="mr-2 text-indigo-500" /> Analytics</a></li>
                        <li><a href="/app/staff" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><Users size={16} className="mr-2 text-amber-500" /> Team</a></li>
                    </ul>
                    <div className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">General</div>
                    <ul className="space-y-1">
                        <li><a href="/app/settings" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><Settings size={16} className="mr-2 text-slate-500" /> Settings</a></li>
                        <li><a href="/app/help" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><AlertCircle size={16} className="mr-2 text-rose-500" /> Help</a></li>
                        <li><a href="/logout" className="flex items-center px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} className="mr-2 text-slate-400" /> Logout</a></li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <div className="bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl p-4 flex flex-col items-center text-white shadow-lg">
                        <p className="font-bold text-xs mb-2">Download our Mobile App</p>
                        <a href="#" className="bg-white text-emerald-600 font-black px-4 py-2 rounded-xl text-xs shadow hover:bg-emerald-50 transition">Download</a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="flex items-center justify-between px-4 md:px-10 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><BarChart3 size={20} /></button>
                        <form className="relative">
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none" />
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </form>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                            <img src={user.avatarUrl || '/avatar.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500" />
                            <div className="min-w-0">
                                <p className="font-black text-xs text-slate-900 dark:text-white truncate">{user.name || 'User'}</p>
                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Widgets Grid */}
                <main className="flex-1 p-4 md:p-10 space-y-8 bg-slate-50 dark:bg-slate-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <FinancialStatsWidget />
                        <StockDistributionWidget />
                        <QuickActionsWidget />
                        <RecentActivityWidget />
                        <LivestockSummaryWidget />
                        <MissionsTrackerWidget />
                        <StaffOverviewWidget />
                        <TransactionFeedWidget />
                        <ActivationRequestsWidget />
                    </div>
                </main>
            </div>
        </div>
    );
}

const ActivationRequestsWidget = () => {
    const { pendingSignups, approveSignup, rejectSignup } = useApp();
    if (!pendingSignups) return null;
    
    return (
        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl border-2 border-emerald-500/20 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:scale-110 transition-transform"><UserPlus size={80}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 md:mb-6 flex items-center text-[10px] md:text-xs uppercase tracking-[0.2em] relative z-10">
                <ShieldCheck size={16} className="mr-2 text-emerald-500"/> Verification Queue
            </h3>
            <div className="space-y-3 md:space-y-4 relative z-10 max-h-60 md:max-h-80 overflow-y-auto pr-1 md:pr-2 scrollbar-thin">
                {pendingSignups.length === 0 ? (
                    <div className="py-12 text-center">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-30" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Queue Clear</p>
                    </div>
                ) : (
                    pendingSignups.map(req => (
                        <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0 pr-2">
                                    <p className="font-black text-sm text-slate-900 dark:text-white truncate">{req.userName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{req.userEmail}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <button onClick={() => approveSignup(req.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center transition-all shadow-md active:scale-95">Verify</button>
                                <button onClick={() => rejectSignup(req.id)} className="px-4 bg-white dark:bg-slate-700 border text-red-500 rounded-xl hover:bg-red-50 transition-colors"><Ban size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

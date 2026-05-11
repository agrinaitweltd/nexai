import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import {
    TrendingUp, TrendingDown, Users, Warehouse, DollarSign, Activity,
    Tractor, ArrowRight, CheckCircle2, Clock, AlertTriangle, Package,
    BarChart3, Zap, ShieldCheck, FileText, MessageSquare
} from 'lucide-react';

const StatCard = ({ label, value, sub, icon: Icon, color, trend }: {
    label: string; value: string | number; sub?: string; icon: any; color: string; trend?: 'up' | 'down' | null;
}) => (
    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 hover:border-white/10 transition-all hover:bg-[#162238] min-w-0 overflow-hidden">
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate pr-2">{label}</span>
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon size={16} />
            </div>
        </div>
        <p className="text-2xl md:text-3xl font-black text-white tracking-tight break-words leading-tight">{value}</p>
        {sub && (
            <div className="flex items-center gap-1 min-w-0">
                {trend === 'up' && <TrendingUp size={11} className="text-emerald-400" />}
                {trend === 'down' && <TrendingDown size={11} className="text-red-400" />}
                <p className={`text-[11px] font-semibold truncate ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>{sub}</p>
            </div>
        )}
    </div>
);

export default function Dashboard() {
    const { user, loading, farms, staff, transactions, inventory, messages, balance, formatCurrency } = useApp();

    const metrics = useMemo(() => {
        const activeFarms = farms.filter(f => f.status === 'ACTIVE' || f.farmingType).length;
        const activeStaff = staff.filter(s => s.status === 'ACTIVE').length;
        const totalRevenue = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + (t.amount || 0), 0);
        const totalExpenses = transactions.filter(t => t.type === 'DEBIT').reduce((s, t) => s + (t.amount || 0), 0);
        const lowStockItems = inventory.filter(i => (i.quantity || 0) < 10).length;
        const unreadMsgs = messages.filter(m => !m.read && m.type === 'INBOX').length;
        const recentTx = transactions.slice().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 6);
        return { activeFarms, activeStaff, totalRevenue, totalExpenses, lowStockItems, unreadMsgs, recentTx };
    }, [farms, staff, transactions, inventory, messages]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#4da6ff] border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }
    if (!user) {
        return <div className="flex items-center justify-center h-64 text-rose-400 font-bold">User not found. Please log in.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Operations Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1 break-words">{user.companyName} &mdash; {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Account Balance" value={formatCurrency(balance)} icon={DollarSign} color="bg-blue-500/20 text-blue-400" sub="Current balance" />
                <StatCard label="Active Farms" value={metrics.activeFarms} icon={Tractor} color="bg-emerald-500/20 text-emerald-400" sub={`${farms.length} total registered`} />
                <StatCard label="Active Staff" value={metrics.activeStaff} icon={Users} color="bg-violet-500/20 text-violet-400" sub={`of ${staff.length} total`} />
                <StatCard label="Inventory Alerts" value={metrics.lowStockItems} icon={Package} color="bg-amber-500/20 text-amber-400" sub="Items below 10 units" trend={metrics.lowStockItems > 0 ? 'down' : null} />
            </div>

            {/* Second row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon={TrendingUp} color="bg-emerald-500/20 text-emerald-400" sub="All time credits" trend="up" />
                <StatCard label="Total Expenses" value={formatCurrency(metrics.totalExpenses)} icon={TrendingDown} color="bg-red-500/20 text-red-400" sub="All time debits" />
                <StatCard label="Transactions" value={transactions.length} icon={BarChart3} color="bg-cyan-500/20 text-cyan-400" sub="Total records" />
                <StatCard label="Unread Messages" value={metrics.unreadMsgs} icon={MessageSquare} color="bg-pink-500/20 text-pink-400" sub="Inbox messages" trend={metrics.unreadMsgs > 0 ? 'down' : null} />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                            <Activity size={15} className="text-cyan-400" /> Recent Transactions
                        </h3>
                        <Link to="/app/finance" className="text-[11px] font-semibold text-[#4da6ff] hover:text-white transition-colors flex items-center gap-1">
                            View all <ArrowRight size={11} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {metrics.recentTx.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText size={28} className="mx-auto text-slate-700 mb-2" />
                                <p className="text-slate-500 text-sm">No transactions yet</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/[0.04]">
                                        <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Description</th>
                                        <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Type</th>
                                        <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.recentTx.map((tx, i) => (
                                        <tr key={tx.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-300 truncate max-w-[200px]">{tx.description || 'Transaction'}</td>
                                            <td className="px-5 py-3.5 text-[12px] text-slate-500">{tx.date ? new Date(tx.date).toLocaleDateString('en-GB') : '—'}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    tx.type === 'CREDIT' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                                                }`}>{tx.type || 'N/A'}</span>
                                            </td>
                                            <td className={`px-5 py-3.5 text-[13px] font-black text-right ${tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount || 0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                    {/* Quick Actions */}
                    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5">
                        <h3 className="text-[13px] font-bold text-white mb-4 flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" /> Quick Actions
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Add Inventory', to: '/app/inventory', color: 'text-cyan-400', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20' },
                                { label: 'Log Transaction', to: '/app/finance', color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20' },
                                { label: 'Staff Overview', to: '/app/staff', color: 'text-violet-400', bg: 'bg-violet-500/10 hover:bg-violet-500/20' },
                                { label: 'View Reports', to: '/app/reports', color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20' },
                                { label: 'Ask NexaAI', to: '/app/agro-ai', color: 'text-pink-400', bg: 'bg-pink-500/10 hover:bg-pink-500/20' },
                            ].map(a => (
                                <Link key={a.to} to={a.to} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${a.bg} transition-all group`}>
                                    <span className={`text-[12px] font-semibold ${a.color} truncate pr-2`}>{a.label}</span>
                                    <ArrowRight size={12} className={`${a.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Staff Status */}
                    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5">
                        <h3 className="text-[13px] font-bold text-white mb-4 flex items-center gap-2">
                            <Users size={14} className="text-violet-400" /> Team Overview
                        </h3>
                        {staff.length === 0 ? (
                            <p className="text-slate-500 text-[12px]">No staff registered yet.</p>
                        ) : (
                            <div className="space-y-2.5">
                                {staff.slice(0, 4).map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#1a5cad] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                                {s.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[12px] font-semibold text-white leading-tight truncate">{s.name}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{s.role || 'Staff'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                            s.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-500'
                                        }`}>{s.status || 'N/A'}</span>
                                    </div>
                                ))}
                                {staff.length > 4 && (
                                    <Link to="/app/staff" className="text-[11px] text-[#4da6ff] hover:text-white transition-colors font-semibold flex items-center gap-1 pt-1">
                                        +{staff.length - 4} more <ArrowRight size={10} />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* System Health */}
                    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5">
                        <h3 className="text-[13px] font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" /> System Health
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Data Sync', value: 99, color: 'bg-emerald-500' },
                                { label: 'Uptime', value: 100, color: 'bg-emerald-500' },
                                { label: 'AI Availability', value: 95, color: 'bg-cyan-500' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[11px] text-slate-500 font-semibold">{s.label}</span>
                                        <span className="text-[11px] text-white font-bold">{s.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


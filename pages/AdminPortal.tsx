import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { NexaLogo } from '../components/NexaLogo';
import {
    Users, ShieldCheck, CheckCircle2, XCircle, Smartphone, Search, LogOut,
    RefreshCw, Trash2, Activity, Wallet, UserPlus, X, Shield, SendHorizontal,
    Package, FileText, BarChart3, Clock, MapPin, Key, AlertTriangle, CreditCard,
    Fingerprint, LayoutDashboard, ChevronRight,
    Bell, Menu, Building2, Globe, MessageSquare, Megaphone, UserCheck
} from 'lucide-react';
import { User, PendingSignup, Sector } from '../types';

type View = 'OVERVIEW' | 'REQUESTS' | 'USERS' | 'ANALYTICS' | 'SECURITY';

const ADMIN_MEMORY_CODE = 'oliver';

interface NavData { pending: number; totalUsers: number; }

const NAV_ITEMS: { id: View; label: string; icon: any; badgeFn?: (d: NavData) => number }[] = [
    { id: 'OVERVIEW',  label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'REQUESTS',  label: 'Audit Queue',     icon: ShieldCheck, badgeFn: d => d.pending },
    { id: 'USERS',     label: 'User Management', icon: Users,       badgeFn: d => d.totalUsers },
    { id: 'ANALYTICS', label: 'Analytics',       icon: BarChart3 },
    { id: 'SECURITY',  label: 'Security Logs',   icon: Shield },
];

const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
        <span className="ml-auto min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-red-500 text-white flex items-center justify-center">
            {count > 99 ? '99+' : count}
        </span>
    ) : null;

const KpiCard = ({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string | number; sub?: string; icon: any; accent: string;
}) => (
    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 hover:border-white/10 transition-colors">
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">{label}</span>
            <div className={`w-8 h-8 rounded-xl ${accent} flex items-center justify-center`}>
                <Icon size={14} />
            </div>
        </div>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
    </div>
);

export default function AdminPortal() {
    const {
        user, logout, pendingSignups, approveSignup, rejectSignup,
        getAllUsers, deleteUser, register, requestPasswordReset,
        transactions, farms, staff, inventory,
        exports: exportOrders, messages, announcements
    } = useApp();

    const [activeView, setActiveView] = useState<View>('OVERVIEW');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [isProvisioning, setIsProvisioning] = useState(false);
    const [provisionForm, setProvisionForm] = useState({
        name: '', email: '', companyName: '',
        businessType: 'General Agriculture', sector: 'GENERAL' as Sector,
        role: 'ADMIN' as 'ADMIN' | 'STAFF'
    });
    const [securityPromptOpen, setSecurityPromptOpen] = useState(false);
    const [securityPromptLabel, setSecurityPromptLabel] = useState('');
    const [securityPromptPositions, setSecurityPromptPositions] = useState<number[]>([]);
    const [securityPromptInput, setSecurityPromptInput] = useState('');
    const [securityPromptError, setSecurityPromptError] = useState('');

    const expectedSecurityAnswerRef = useRef('');
    const sensitiveActionRef = useRef<(() => Promise<void>) | null>(null);

    const randomSecurityPositions = useCallback((): number[] => {
        const pool = [1, 2, 3, 4, 5, 6];
        const picked: number[] = [];
        while (picked.length < 3 && pool.length) {
            const idx = Math.floor(Math.random() * pool.length);
            picked.push(pool[idx]);
            pool.splice(idx, 1);
        }
        return picked;
    }, []);

    const openSensitiveActionPrompt = useCallback((label: string, action: () => Promise<void>) => {
        const positions = randomSecurityPositions();
        expectedSecurityAnswerRef.current = positions.map(pos => ADMIN_MEMORY_CODE[pos - 1]).join('').toLowerCase();
        sensitiveActionRef.current = action;
        setSecurityPromptLabel(label);
        setSecurityPromptPositions(positions);
        setSecurityPromptInput('');
        setSecurityPromptError('');
        setSecurityPromptOpen(true);
    }, [randomSecurityPositions]);

    const closeSensitiveActionPrompt = useCallback(() => {
        setSecurityPromptOpen(false);
        setSecurityPromptInput('');
        setSecurityPromptError('');
        expectedSecurityAnswerRef.current = '';
        sensitiveActionRef.current = null;
    }, []);

    const submitSensitiveActionPrompt = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const normalized = securityPromptInput.replace(/\s+/g, '').toLowerCase();
        if (normalized !== expectedSecurityAnswerRef.current) {
            setSecurityPromptError('Memory check failed. Try again.');
            return;
        }
        const action = sensitiveActionRef.current;
        closeSensitiveActionPrompt();
        if (action) await action();
    }, [closeSensitiveActionPrompt, securityPromptInput]);

    const securityPromptPositionsText = useMemo(
        () => securityPromptPositions.join(', '),
        [securityPromptPositions]
    );

    const refreshUsers = useCallback(async () => {
        const next = await getAllUsers();
        setUsers(next);
    }, [getAllUsers]);

    useEffect(() => { refreshUsers(); }, [pendingSignups, refreshUsers]);

    const handleApprove = async (id: string) => {
        openSensitiveActionPrompt('Approve Request', async () => {
            setProcessingId(id);
            await approveSignup(id);
            await refreshUsers();
            setProcessingId(null);
        });
    };

    const handleReject = async (id: string) => {
        openSensitiveActionPrompt('Reject Request', async () => {
            setProcessingId(id);
            await rejectSignup(id);
            await refreshUsers();
            setProcessingId(null);
        });
    };

    const handleDeleteUser = async (id: string) => {
        openSensitiveActionPrompt('Delete User', async () => {
            setProcessingId(id);
            try {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
            } finally {
                setProcessingId(null);
            }
        });
    };

    const handleProvision = async (e: React.FormEvent) => {
        e.preventDefault();
        openSensitiveActionPrompt('Create User', async () => {
            setIsProvisioning(true);
            try {
                const tempPassword = `Nx!${Math.random().toString(36).slice(-8)}A1`;
                const res = await register({ ...provisionForm, password: tempPassword, activationStatus: 'ACTIVE', setupComplete: false });
                if (res.success) {
                    await requestPasswordReset(provisionForm.email);
                    setShowProvisionModal(false);
                    setProvisionForm({ name: '', email: '', companyName: '', businessType: 'General Agriculture', sector: 'GENERAL', role: 'ADMIN' });
                    await refreshUsers();
                    setActiveView('USERS');
                    alert('User created and password reset link sent.');
                } else {
                    alert(res.message);
                }
            } finally {
                setIsProvisioning(false);
            }
        });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = pendingSignups.filter(r =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navData: NavData = { pending: pendingSignups.length, totalUsers: users.length };
    const activeUsers = users.filter(u => u.activationStatus === 'ACTIVE').length;

    const VIEW_TITLE: Record<View, { title: string; sub: string }> = {
        OVERVIEW:  { title: 'Dashboard Overview',  sub: 'Platform health & key metrics at a glance' },
        REQUESTS:  { title: 'Audit Queue',          sub: 'Review and approve pending registration requests' },
        USERS:     { title: 'User Management',      sub: 'Manage all registered organisations on the platform' },
        ANALYTICS: { title: 'Analytics',            sub: 'Platform usage statistics and trends' },
        SECURITY:  { title: 'Security Logs',        sub: 'Login history, locations and password changes' },
    };

    return (
        <div className="flex h-screen bg-[#0b1526] text-slate-300 font-sans overflow-hidden">
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} shrink-0 bg-[#0d1c30] border-r border-white/[0.06] flex flex-col transition-all duration-300 z-40`}>
                <div className="h-16 flex items-center gap-3 px-4 border-b border-white/[0.06] shrink-0">
                    <button onClick={() => setSidebarOpen(v => !v)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                        <Menu size={16} />
                    </button>
                    {sidebarOpen && <NexaLogo className="h-7" light />}
                </div>

                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                    <div className="px-3 space-y-1">
                        {NAV_ITEMS.map(({ id, label, icon: Icon, badgeFn }) => {
                            const active = activeView === id;
                            const badge = badgeFn ? badgeFn(navData) : 0;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveView(id)}
                                    title={!sidebarOpen ? label : undefined}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                                        active
                                            ? 'bg-[#1a6fc4]/25 text-[#4da6ff] border border-[#1a6fc4]/40'
                                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                    }`}
                                >
                                    <Icon size={16} className={`shrink-0 ${active ? 'text-[#4da6ff]' : ''}`} />
                                    {sidebarOpen && (
                                        <>
                                            <span className="flex-1 text-left text-[13px] truncate">{label}</span>
                                            <Badge count={badge} />
                                        </>
                                    )}
                                    {!sidebarOpen && badge > 0 && (
                                        <span className="absolute left-7 top-1 w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {sidebarOpen && (
                        <div className="mt-6 px-3">
                            <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Actions</p>
                            <button
                                onClick={() => setShowProvisionModal(true)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                            >
                                <UserPlus size={15} className="shrink-0" />
                                Provision User
                            </button>
                        </div>
                    )}
                </nav>

                <div className={`border-t border-white/[0.06] p-3 shrink-0 ${sidebarOpen ? '' : 'flex justify-center'}`}>
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-white truncate">{user?.name || 'Super Admin'}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <button onClick={logout} title="Sign out" className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={logout} title="Sign out" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut size={15} />
                        </button>
                    )}
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-[#0d1c30] border-b border-white/[0.06] flex items-center justify-between px-6 shrink-0">
                    <div>
                        <h1 className="text-[15px] font-bold text-white">{VIEW_TITLE[activeView].title}</h1>
                        <p className="text-[11px] text-slate-500">{VIEW_TITLE[activeView].sub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                className="w-48 lg:w-64 bg-[#0b1526] border border-white/[0.06] rounded-xl pl-8 pr-4 py-2 text-[12px] text-white placeholder:text-slate-600 outline-none focus:border-white/20 transition-all"
                                placeholder="Search…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <button className="w-9 h-9 rounded-xl bg-[#0b1526] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                <Bell size={15} />
                            </button>
                            {pendingSignups.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white font-bold flex items-center justify-center">
                                    {pendingSignups.length}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <span className="text-[12px] font-medium text-slate-300 hidden sm:block">{user?.name || 'Admin'}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    {activeView === 'OVERVIEW' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <KpiCard label="Total Users"  value={users.length}         sub={`${activeUsers} active`}                icon={Users}      accent="bg-blue-500/20 text-blue-400" />
                                <KpiCard label="Audit Queue"  value={pendingSignups.length} sub="Pending approvals"                      icon={ShieldCheck} accent="bg-amber-500/20 text-amber-400" />
                                <KpiCard label="Total Farms"  value={farms.length}          sub={`${inventory.length} inventory items`}  icon={Building2}  accent="bg-emerald-500/20 text-emerald-400" />
                                <KpiCard label="Exports"      value={exportOrders.length}   sub={`${staff.length} staff total`}          icon={Package}    accent="bg-purple-500/20 text-purple-400" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                                        <h3 className="text-[13px] font-bold text-white">Recent Registrations</h3>
                                        <button onClick={() => setActiveView('REQUESTS')} className="text-[11px] text-[#4da6ff] hover:underline flex items-center gap-1">View all <ChevronRight size={11} /></button>
                                    </div>
                                    <div className="divide-y divide-white/[0.04]">
                                        {pendingSignups.length === 0 ? (
                                            <div className="px-5 py-10 text-center">
                                                <CheckCircle2 size={28} className="mx-auto text-emerald-500/30 mb-2" />
                                                <p className="text-[12px] text-slate-600 font-medium">All requests processed</p>
                                            </div>
                                        ) : pendingSignups.slice(0, 5).map(req => (
                                            <div key={req.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                                                    {req.userName.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-semibold text-white truncate">{req.userName}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{req.userEmail}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${req.transactionId ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        {req.transactionId ? 'TX ✓' : 'No TX'}
                                                    </span>
                                                    <p className="text-[10px] text-slate-600 mt-1">{new Date(req.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => handleApprove(req.id)} disabled={processingId === req.id} className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-40">
                                                        <CheckCircle2 size={12} />
                                                    </button>
                                                    <button onClick={() => handleReject(req.id)} disabled={processingId === req.id} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-40">
                                                        <XCircle size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5">
                                        <p className="text-[11px] font-semibold text-slate-500 mb-3">User Status</p>
                                        <div className="space-y-2.5">
                                            {[
                                                { label: 'Active',           count: users.filter(u => u.activationStatus === 'ACTIVE').length,    color: 'bg-emerald-500' },
                                                { label: 'Pending',          count: users.filter(u => u.activationStatus === 'PENDING').length,   color: 'bg-amber-500' },
                                                { label: 'Rejected',         count: users.filter(u => u.activationStatus === 'REJECTED').length,  color: 'bg-red-500' },
                                                { label: 'Setup Incomplete', count: users.filter(u => !u.setupComplete).length,                   color: 'bg-slate-500' },
                                            ].map(row => (
                                                <div key={row.label} className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${row.color} shrink-0`} />
                                                    <span className="text-[12px] text-slate-400 flex-1">{row.label}</span>
                                                    <span className="text-[13px] font-bold text-white">{row.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5">
                                        <p className="text-[11px] font-semibold text-slate-500 mb-3">Platform Activity</p>
                                        <div className="space-y-2.5">
                                            {[
                                                { label: 'Messages',   count: messages.length,      icon: MessageSquare, color: 'text-blue-400' },
                                                { label: 'Broadcasts', count: announcements.length, icon: Megaphone,     color: 'text-amber-400' },
                                                { label: 'Farms',      count: farms.length,         icon: Globe,         color: 'text-green-400' },
                                                { label: 'Staff',      count: staff.length,         icon: Users,         color: 'text-indigo-400' },
                                            ].map(row => (
                                                <div key={row.label} className="flex items-center gap-3">
                                                    <row.icon size={13} className={`${row.color} shrink-0`} />
                                                    <span className="text-[12px] text-slate-400 flex-1">{row.label}</span>
                                                    <span className="text-[13px] font-bold text-white">{row.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'REQUESTS' && (
                        <div className="space-y-4">
                            <p className="text-[13px] text-slate-400">{filteredRequests.length} pending request{filteredRequests.length !== 1 ? 's' : ''}</p>
                            {filteredRequests.length === 0 ? (
                                <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl py-24 text-center">
                                    <CheckCircle2 size={40} className="mx-auto text-emerald-500/30 mb-3" />
                                    <p className="text-[13px] font-semibold text-slate-500">No pending audit requests</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {filteredRequests.map(req => (
                                        <div key={req.id} className="bg-[#131f35] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all">
                                            <div className="flex items-start justify-between mb-4 gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a6fc4]/30 to-indigo-500/20 border border-[#1a6fc4]/30 flex items-center justify-center text-[#4da6ff] font-bold text-base shrink-0">
                                                        {req.userName.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white text-[14px] truncate">{req.userName}</p>
                                                        <p className="text-[11px] text-slate-500 font-mono truncate">{req.userEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 shrink-0">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                                        req.paymentMethod === 'MTN'    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        req.paymentMethod === 'AIRTEL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        req.paymentMethod === 'MPESA'  ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        req.paymentMethod === 'BANK'   ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-slate-700/50 text-slate-400 border-slate-600'
                                                    }`}>
                                                        {req.paymentMethod === 'MTN' ? 'MTN MoMo' : req.paymentMethod === 'AIRTEL' ? 'Airtel' : req.paymentMethod === 'MPESA' ? 'M-Pesa' : req.paymentMethod === 'BANK' ? 'Bank Transfer' : req.paymentMethod}
                                                    </span>
                                                    {req.country && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{req.country}</span>}
                                                </div>
                                            </div>

                                            <div className={`mb-4 p-3.5 rounded-xl border ${req.transactionId ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Fingerprint size={11} className={req.transactionId ? 'text-emerald-400' : 'text-amber-400'} />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaction ID / Reference</span>
                                                </div>
                                                {req.transactionId ? (
                                                    <p className="font-mono text-[13px] font-bold text-emerald-300 break-all">{req.transactionId}</p>
                                                ) : (
                                                    <p className="text-[12px] text-amber-400/70 italic">No transaction ID — payment unverified</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                                {[
                                                    { icon: Smartphone, label: 'Phone',     value: req.paymentPhone || '—' },
                                                    { icon: CreditCard, label: 'Method',    value: req.paymentMethod || '—' },
                                                    { icon: Clock,      label: 'Date',      value: new Date(req.date).toLocaleDateString() },
                                                    { icon: ShieldCheck,label: 'TX Status', value: req.transactionId ? 'Provided' : 'Pending' },
                                                ].map(item => (
                                                    <div key={item.label} className="bg-[#0b1526] rounded-xl p-3 border border-white/[0.04]">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <item.icon size={9} className="text-slate-600" />
                                                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{item.label}</p>
                                                        </div>
                                                        <p className={`text-[11px] font-bold truncate ${item.label === 'TX Status' ? (req.transactionId ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-300'}`}>{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {req.paymentMethod === 'BANK' && (req.bankName || req.accountName) && (
                                                <div className="flex gap-2 mb-4">
                                                    {req.bankName && <div className="flex-1 bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">Bank</p><p className="text-[11px] font-bold text-blue-300 truncate">{req.bankName}</p></div>}
                                                    {req.accountName && <div className="flex-1 bg-blue-500/5 border border-blue-500/15 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">Account</p><p className="text-[11px] font-bold text-blue-300 truncate">{req.accountName}</p></div>}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-4 border-t border-white/[0.05]">
                                                <button onClick={() => handleApprove(req.id)} disabled={processingId === req.id} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                                    {processingId === req.id ? <><RefreshCw size={12} className="animate-spin" /> Processing…</> : <><CheckCircle2 size={13} /> Approve Access</>}
                                                </button>
                                                <button onClick={() => handleReject(req.id)} disabled={processingId === req.id} className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 disabled:opacity-50 text-slate-500 hover:text-red-400 text-[12px] font-bold flex items-center gap-2 border border-white/[0.06] transition-all">
                                                    <XCircle size={13} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeView === 'USERS' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <KpiCard label="Total Users"    value={users.length}                                           icon={Users}       accent="bg-blue-500/20 text-blue-400" />
                                <KpiCard label="Active"         value={activeUsers}                                             icon={UserCheck}   accent="bg-emerald-500/20 text-emerald-400" />
                                <KpiCard label="Pending"        value={users.filter(u => u.activationStatus === 'PENDING').length} icon={Clock}    accent="bg-amber-500/20 text-amber-400" />
                                <KpiCard label="Setup Complete" value={users.filter(u => u.setupComplete).length}               icon={CheckCircle2} accent="bg-indigo-500/20 text-indigo-400" />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[13px] text-slate-400">{filteredUsers.length} organisations</p>
                                <button onClick={() => setShowProvisionModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20">
                                    <UserPlus size={13} /> Add User
                                </button>
                            </div>
                            <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[640px]">
                                        <thead>
                                            <tr className="bg-[#0b1526] border-b border-white/[0.06]">
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organisation</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Setup</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {filteredUsers.length === 0 ? (
                                                <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-600 text-[12px]">No users match your search</td></tr>
                                            ) : filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{u.name.charAt(0)}</div>
                                                            <div className="min-w-0">
                                                                <p className="text-[13px] font-semibold text-white truncate">{u.name}</p>
                                                                <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4"><p className="text-[12px] font-medium text-slate-300 truncate max-w-[140px]">{u.companyName || '—'}</p><p className="text-[10px] text-slate-600 uppercase tracking-wider">{u.sector}</p></td>
                                                    <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${u.setupComplete ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{u.setupComplete ? 'Complete' : 'Incomplete'}</span></td>
                                                    <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : u.activationStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{u.activationStatus}</span></td>
                                                    <td className="px-5 py-4"><p className="text-[11px] text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</p></td>
                                                    <td className="px-5 py-4 text-right"><button onClick={() => handleDeleteUser(u.id)} disabled={processingId === u.id} className="w-8 h-8 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all disabled:opacity-40 ml-auto"><Trash2 size={13} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'ANALYTICS' && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <KpiCard label="Active Users"  value={activeUsers}            sub={`of ${users.length} total`}       icon={UserCheck}     accent="bg-emerald-500/20 text-emerald-400" />
                                <KpiCard label="Messages"      value={messages.length}        sub={`${announcements.length} broadcasts`} icon={MessageSquare} accent="bg-blue-500/20 text-blue-400" />
                                <KpiCard label="Export Orders" value={exportOrders.length}    icon={Package}                             accent="bg-amber-500/20 text-amber-400" />
                                <KpiCard label="Monthly Fee"   value="$4.99"                  sub="per org / month"                    icon={Wallet}        accent="bg-purple-500/20 text-purple-400" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/[0.06]"><h3 className="text-[13px] font-bold text-white">User Payment Status</h3></div>
                                    <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                                        {users.length === 0 ? <p className="px-5 py-10 text-center text-[12px] text-slate-600">No users registered</p> : users.map((u, i) => {
                                            const days = Math.floor((Date.now() - new Date(u.createdAt || Date.now()).getTime()) / 86400000);
                                            const paid = days < 30;
                                            return (
                                                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{u.name.charAt(0)}</div>
                                                    <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-white truncate">{u.name}</p><p className="text-[10px] text-slate-500 truncate">{u.companyName || u.email}</p></div>
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{paid ? 'Paid' : 'Due'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/[0.06]"><h3 className="text-[13px] font-bold text-white">Recent Activity</h3></div>
                                    <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
                                        {(() => {
                                            const items = [
                                                ...messages.slice(0,5).map(m => ({ type: 'msg', text: m.subject, by: m.senderName, date: m.date })),
                                                ...announcements.slice(0,5).map(a => ({ type: 'bcast', text: a.title, by: a.author, date: a.date })),
                                                ...users.slice(0,5).map(u => ({ type: 'user', text: `Joined: ${u.name}`, by: u.companyName || '—', date: u.createdAt || new Date().toISOString() })),
                                            ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,15);
                                            if (!items.length) return <p className="px-5 py-10 text-center text-[12px] text-slate-600">No recent activity</p>;
                                            return items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]">
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'msg' ? 'bg-blue-400' : item.type === 'bcast' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                                    <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-white truncate">{item.text}</p><p className="text-[10px] text-slate-500">{item.by}</p></div>
                                                    <p className="text-[10px] text-slate-600 shrink-0">{new Date(item.date).toLocaleDateString()}</p>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'SECURITY' && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <KpiCard label="Active Today"     value={users.filter(u => u.lastLoginAt && (Date.now() - new Date(u.lastLoginAt).getTime()) < 86400000).length}            icon={Activity}      accent="bg-emerald-500/20 text-emerald-400" />
                                <KpiCard label="Unique Locations" value={new Set(users.map(u => u.lastLoginLocation).filter(Boolean)).size}                                                  icon={MapPin}        accent="bg-blue-500/20 text-blue-400" />
                                <KpiCard label="Never Logged In"  value={users.filter(u => !u.lastLoginAt).length}                                                                           icon={Key}           accent="bg-amber-500/20 text-amber-400" />
                                <KpiCard label="Inactive 30d+"    value={users.filter(u => u.lastLoginAt && (Date.now() - new Date(u.lastLoginAt).getTime()) > 30*86400000).length}          icon={AlertTriangle} accent="bg-red-500/20 text-red-400" />
                            </div>
                            <div className="bg-[#131f35] border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Shield size={14} className="text-amber-400" /><h3 className="text-[13px] font-bold text-white">Security Audit Log</h3></div>
                                    <span className="text-[11px] text-slate-500">{users.length} accounts</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[720px]">
                                        <thead>
                                            <tr className="bg-[#0b1526] border-b border-white/[0.06]">
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password Changed</th>
                                                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {users.length === 0 ? (
                                                <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-600 text-[12px]">No users registered</td></tr>
                                            ) : users.map(u => {
                                                const dSince = u.lastLoginAt ? Math.floor((Date.now() - new Date(u.lastLoginAt).getTime()) / 86400000) : null;
                                                const stale = dSince !== null && dSince >= 30;
                                                const recent = dSince !== null && dSince < 7;
                                                return (
                                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{u.name.charAt(0)}</div>
                                                                <div><p className="text-[12px] font-semibold text-white">{u.name}</p><p className="text-[10px] text-slate-500">{u.email}</p></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {u.lastLoginAt ? <div><p className={`text-[12px] font-semibold ${recent ? 'text-emerald-400' : stale ? 'text-red-400' : 'text-slate-300'}`}>{new Date(u.lastLoginAt).toLocaleDateString()} {new Date(u.lastLoginAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p><p className="text-[10px] text-slate-500">{dSince === 0 ? 'Today' : dSince === 1 ? 'Yesterday' : `${dSince}d ago`}</p></div> : <span className="text-[11px] text-slate-600 italic">Never</span>}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {u.lastLoginLocation ? <div className="flex items-center gap-1.5"><MapPin size={11} className="text-blue-400 shrink-0" /><span className="text-[11px] text-blue-300 truncate max-w-[180px]">{u.lastLoginLocation}</span></div> : <span className="text-[11px] text-slate-600 italic">No data</span>}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {u.lastPasswordChangedAt ? <div><p className="text-[12px] font-semibold text-violet-300">{new Date(u.lastPasswordChangedAt).toLocaleDateString()}</p><p className="text-[10px] text-slate-500">{Math.floor((Date.now() - new Date(u.lastPasswordChangedAt).getTime()) / 86400000)}d ago</p></div> : <span className="text-[11px] text-slate-600 italic">Not recorded</span>}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border w-fit ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : u.activationStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{u.activationStatus}</span>
                                                                {stale && <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-red-500/10 text-red-400 border-red-500/20 w-fit">Inactive</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {showProvisionModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#131f35] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center"><UserPlus size={16} className="text-emerald-400" /></div>
                                <div><h3 className="text-[15px] font-bold text-white">Provision New User</h3><p className="text-[11px] text-slate-500">Create an account with immediate access</p></div>
                            </div>
                            <button onClick={() => setShowProvisionModal(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"><X size={15} /></button>
                        </div>
                        <form onSubmit={handleProvision} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Full Name',      key: 'name',        type: 'text',     placeholder: 'Jane Smith' },
                                    { label: 'Email Address',  key: 'email',       type: 'email',    placeholder: 'jane@company.com' },
                                    { label: 'Company Name',   key: 'companyName', type: 'text',     placeholder: 'Agri Partners Ltd' },
                                ].map(f => (
                                    <div key={f.key} className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{f.label}</label>
                                        <input required type={f.type} placeholder={f.placeholder} value={(provisionForm as any)[f.key]} onChange={e => setProvisionForm(p => ({...p, [f.key]: e.target.value}))} className="w-full bg-[#0b1526] border border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1a6fc4]/60 transition-all" />
                                    </div>
                                ))}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Business Sector</label>
                                    <select className="w-full bg-[#0b1526] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1a6fc4]/60 transition-all" value={provisionForm.sector} onChange={e => setProvisionForm(p => ({...p, sector: e.target.value as Sector}))}>
                                        <option value="GENERAL">General Agriculture</option>
                                        <option value="EXPORT">Export Hub</option>
                                        <option value="FARMING">Primary Production</option>
                                        <option value="LIVESTOCK">Livestock</option>
                                        <option value="PROCESSING">Value Addition</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</label>
                                    <select className="w-full bg-[#0b1526] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1a6fc4]/60 transition-all" value={provisionForm.role} onChange={e => setProvisionForm(p => ({...p, role: e.target.value as any}))}>
                                        <option value="ADMIN">Admin</option>
                                        <option value="STAFF">Staff</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
                                <button type="button" onClick={() => setShowProvisionModal(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                                <button type="submit" disabled={isProvisioning} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                                    {isProvisioning ? <><RefreshCw size={12} className="animate-spin" /> Creating…</> : <><SendHorizontal size={12} /> Create User</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {securityPromptOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[210] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#131f35] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                            <div>
                                <h3 className="text-[14px] font-bold text-white">Confirm {securityPromptLabel}</h3>
                                <p className="text-[11px] text-slate-500">Security memory check required</p>
                            </div>
                            <button onClick={closeSensitiveActionPrompt} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                <X size={14} />
                            </button>
                        </div>

                        <form onSubmit={submitSensitiveActionPrompt} className="p-5 space-y-4">
                            <div className="bg-[#0b1526] border border-white/[0.06] rounded-xl p-3">
                                <p className="text-[11px] text-slate-400">Enter characters at positions:</p>
                                <p className="text-[13px] font-bold text-[#4da6ff]">{securityPromptPositionsText}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Memory Characters</label>
                                <input
                                    required
                                    autoFocus
                                    value={securityPromptInput}
                                    onChange={e => {
                                        setSecurityPromptInput(e.target.value);
                                        if (securityPromptError) setSecurityPromptError('');
                                    }}
                                    placeholder="Example: oie"
                                    className="w-full bg-[#0b1526] border border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#1a6fc4]/60 transition-all"
                                />
                                {securityPromptError && <p className="text-[11px] text-red-400">{securityPromptError}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={closeSensitiveActionPrompt} className="px-4 py-2.5 rounded-xl text-[12px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#1a6fc4] hover:bg-[#2a7fd4] text-white text-[12px] font-bold transition-all">
                                    Confirm Action
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

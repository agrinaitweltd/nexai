import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NexaLogo } from '../components/NexaLogo';
import { 
    Users, ShieldCheck, UserMinus, CheckCircle2, XCircle, 
    Smartphone, Mail, Hash, Building, Globe, Filter, 
    Search, LogOut, RefreshCw, Trash2, Ban, Settings, Activity, Wallet, Landmark, UserPlus, X, Shield, Lock, ChevronRight, LayoutDashboard, Briefcase, Plus, SendHorizontal,
    DollarSign, Package, TrendingUp, FileText, BarChart3
} from 'lucide-react';
import { User, PendingSignup, Sector } from '../types';

export default function AdminPortal() {
    const { user, logout, pendingSignups, approveSignup, rejectSignup, getAllUsers, deleteUser, changeUserStatus, register, transactions, farms, staff, inventory, exports: exportOrders, formatCurrency, balance, messages, announcements } = useApp();
    const [activeView, setActiveView] = useState<'REQUESTS' | 'USERS' | 'ANALYTICS'>('REQUESTS');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    
    // Provision User Form
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [provisionForm, setProvisionForm] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        businessType: 'General Agriculture',
        sector: 'GENERAL' as Sector,
        role: 'ADMIN' as 'ADMIN' | 'STAFF'
    });
    const [isProvisioning, setIsProvisioning] = useState(false);

    useEffect(() => {
        getAllUsers().then(setUsers);
    }, [pendingSignups, activeView]);

    const handleProvision = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProvisioning(true);
        try {
            const res = await register({
                ...provisionForm,
                activationStatus: 'ACTIVE',
                setupComplete: false // Force them through onboarding
            });
            if (res.success) {
                setShowProvisionModal(false);
                setProvisionForm({ name: '', email: '', password: '', companyName: '', businessType: 'General Agriculture', sector: 'GENERAL', role: 'ADMIN' });
                setActiveView('USERS');
            } else {
                alert(res.message);
            }
        } finally {
            setIsProvisioning(false);
        }
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

    const StatCard = ({ label, value, icon: Icon, color }: any) => (
        <div className="bg-slate-900 border border-white/5 p-4 md:p-6 rounded-xl md:rounded-[2rem] flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
                <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <div className={`p-1.5 md:p-2 rounded-lg bg-opacity-10 ${color}`}>
                    <Icon size={12} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
            <h4 className="text-xl md:text-3xl font-black text-white mt-2 md:mt-4 tracking-tighter">{value}</h4>
        </div>
    );

    const totalRevenue = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-primary-500/30 flex flex-col">
            {/* Admin Header */}
            <header className="h-16 md:h-20 border-b border-white/5 bg-slate-950 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center space-x-3 md:space-x-6">
                    <NexaLogo className="h-7 md:h-10" light />
                    <div className="hidden md:block w-px h-6 bg-white/10" />
                    <div className="hidden md:block">
                        <h2 className="text-white font-black uppercase tracking-widest text-[9px]">Executive Terminal</h2>
                        <p className="text-[9px] text-emerald-500 font-black tracking-tighter">Identity: {user?.name || 'Super Admin'}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="hidden lg:flex items-center space-x-3 px-5 py-2 bg-white/5 rounded-2xl border border-white/5">
                        <Activity size={12} className="text-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Node Latency: 4ms</span>
                    </div>
                    <button onClick={logout} className="p-2.5 md:p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-6 md:space-y-10 w-full flex-1">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    <StatCard label="Cloud Identities" value={users.length} icon={Building} color="bg-blue-500" />
                    <StatCard label="Audit Queue" value={pendingSignups.length} icon={ShieldCheck} color="bg-amber-500" />
                    <StatCard label="Active Nodes" value={users.filter(u => u.activationStatus === 'ACTIVE').length} icon={CheckCircle2} color="bg-emerald-500" />
                    <StatCard label="Total Farms" value={farms.length} icon={BarChart3} color="bg-purple-500" />
                </div>

                {/* Secondary Stats */}
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="shrink-0 bg-slate-900 border border-white/5 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center space-x-3">
                        <Package size={14} className="text-blue-500" />
                        <div>
                            <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Inventory Items</p>
                            <p className="text-xs md:text-sm font-black text-white">{inventory.length}</p>
                        </div>
                    </div>
                    <div className="shrink-0 bg-slate-900 border border-white/5 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center space-x-3">
                        <Users size={14} className="text-indigo-500" />
                        <div>
                            <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Staff</p>
                            <p className="text-xs md:text-sm font-black text-white">{staff.length}</p>
                        </div>
                    </div>
                    <div className="shrink-0 bg-slate-900 border border-white/5 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center space-x-3">
                        <FileText size={14} className="text-amber-500" />
                        <div>
                            <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Export Orders</p>
                            <p className="text-xs md:text-sm font-black text-white">{exportOrders.length}</p>
                        </div>
                    </div>
                    <div className="shrink-0 bg-slate-900 border border-white/5 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center space-x-3">
                        <Wallet size={14} className="text-emerald-500" />
                        <div>
                            <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Monthly Fee</p>
                            <p className="text-xs md:text-sm font-black text-white">UGX 15,000</p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation & Controls */}
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between bg-slate-900/40 p-2 rounded-xl md:rounded-[2.5rem] border border-white/5">
                    <div className="flex space-x-1 p-1 overflow-x-auto">
                        <button 
                            onClick={() => setActiveView('REQUESTS')}
                            className={`shrink-0 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'REQUESTS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <ShieldCheck size={13} className="mr-1.5 md:mr-2" /> Audits ({pendingSignups.length})
                        </button>
                        <button 
                            onClick={() => setActiveView('USERS')}
                            className={`shrink-0 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'USERS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Users size={13} className="mr-1.5 md:mr-2" /> Directory
                        </button>
                        <button 
                            onClick={() => setActiveView('ANALYTICS')}
                            className={`shrink-0 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'ANALYTICS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <BarChart3 size={13} className="mr-1.5 md:mr-2" /> Analytics
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 px-1 md:px-2">
                        <div className="relative flex-1 md:min-w-[200px] lg:min-w-[300px]">
                            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-600" size={13} />
                            <input 
                                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-black border border-white/5 rounded-xl md:rounded-[1.5rem] outline-none font-bold text-[11px] md:text-xs text-white focus:border-white/20 transition-all placeholder:text-slate-700"
                                placeholder={`Filter...`}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setShowProvisionModal(true)}
                            className="bg-emerald-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center whitespace-nowrap shrink-0"
                        >
                            <UserPlus size={14} className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Provision</span><span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>

                {/* View Content */}
                {activeView === 'REQUESTS' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                        {filteredRequests.length === 0 ? (
                            <div className="col-span-full py-20 md:py-40 text-center bg-slate-950/50 border border-white/5 rounded-2xl md:rounded-[4rem]">
                                <Activity size={48} className="mx-auto text-slate-900 mb-4 md:mb-8" />
                                <p className="text-slate-600 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs">No Signal Detected in Pipeline</p>
                            </div>
                        ) : filteredRequests.map(req => (
                            <div key={req.id} className="bg-slate-900 border border-white/5 p-5 md:p-12 rounded-2xl md:rounded-[3.5rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5"><ShieldCheck size={100} /></div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-5 md:mb-10 relative z-10 gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter leading-none mb-1 md:mb-2 truncate">{req.userName}</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-widest truncate">{req.userEmail}</p>
                                    </div>
                                    <span className="self-start text-[7px] md:text-[8px] font-black px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full uppercase tracking-widest shrink-0">Audit Required</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-5 md:mb-12 relative z-10">
                                    <div className="bg-black/50 p-3 md:p-6 rounded-xl md:rounded-[1.5rem] border border-white/5">
                                        <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 md:mb-2">Gate Token</p>
                                        <p className="text-[10px] md:text-xs font-black text-slate-300 font-mono tracking-tighter truncate">{req.transactionId}</p>
                                    </div>
                                    <div className="bg-black/50 p-3 md:p-6 rounded-xl md:rounded-[1.5rem] border border-white/5">
                                        <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 md:mb-2">Origin Phone</p>
                                        <p className="text-[10px] md:text-xs font-black text-slate-300 truncate">{req.paymentPhone}</p>
                                    </div>
                                    <div className="bg-black/50 p-3 md:p-6 rounded-xl md:rounded-[1.5rem] border border-white/5">
                                        <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 md:mb-2">Log Date</p>
                                        <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase">{new Date(req.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-3 md:space-x-4 relative z-10 pt-4 md:pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => approveSignup(req.id)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center active:scale-95"
                                    >
                                        <CheckCircle2 size={15} className="mr-2" /> Authorize
                                    </button>
                                    <button 
                                        onClick={() => rejectSignup(req.id)}
                                        className="px-5 md:px-10 bg-white/5 hover:bg-red-500/20 text-slate-600 hover:text-red-500 py-3 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all border border-white/5"
                                    >
                                        Purge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeView === 'ANALYTICS' ? (
                    <div className="space-y-6 md:space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem]">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Active Users</p>
                                <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{users.filter(u => u.activationStatus === 'ACTIVE').length}</p>
                                <p className="text-[9px] text-slate-600 mt-1 font-bold">of {users.length} total accounts</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem]">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Messages</p>
                                <p className="text-2xl md:text-3xl font-black text-blue-400 tracking-tighter">{messages.length}</p>
                                <p className="text-[9px] text-slate-600 mt-1 font-bold">{announcements.length} broadcasts sent</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem]">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Staff Across Orgs</p>
                                <p className="text-2xl md:text-3xl font-black text-indigo-400 tracking-tighter">{staff.length}</p>
                                <p className="text-[9px] text-slate-600 mt-1 font-bold">{farms.length} farms registered</p>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem]">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Monthly App Fee</p>
                                <p className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tighter">UGX 15,000</p>
                                <p className="text-[9px] text-slate-600 mt-1 font-bold">per organization/month</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem]">
                                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 md:mb-6">User Activity & Payment Status</h3>
                                <div className="space-y-2 md:space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                                    {users.length === 0 ? (
                                        <p className="text-center text-slate-700 py-8 text-xs font-bold uppercase tracking-widest">No users registered</p>
                                    ) : users.map((u, i) => {
                                        const daysSinceCreation = Math.floor((Date.now() - new Date(u.createdAt || Date.now()).getTime()) / 86400000);
                                        const isPaid = daysSinceCreation < 30;
                                        return (
                                        <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-black/50 rounded-xl md:rounded-2xl border border-white/5">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${u.activationStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-white truncate">{u.name}</p>
                                                    <p className="text-[8px] text-slate-600 truncate">{u.companyName || u.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${isPaid ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-rose-500/20 text-rose-500 bg-rose-500/5'}`}>
                                                    {isPaid ? 'Paid' : 'Due'}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-600">UGX 15k</span>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem]">
                                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 md:mb-6">Recent Activity Feed</h3>
                                <div className="space-y-2 md:space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                                    {[
                                        ...messages.slice(0, 5).map(m => ({ type: 'message', text: `Message: ${m.subject}`, by: m.senderName, date: m.date })),
                                        ...announcements.slice(0, 5).map(a => ({ type: 'broadcast', text: `Broadcast: ${a.title}`, by: a.author, date: a.date })),
                                        ...users.slice(0, 5).map(u => ({ type: 'user', text: `User joined: ${u.name}`, by: u.companyName || 'New org', date: u.createdAt || new Date().toISOString() })),
                                    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15).length === 0 ? (
                                        <p className="text-center text-slate-700 py-8 text-xs font-bold uppercase tracking-widest">No recent activity</p>
                                    ) : [
                                        ...messages.slice(0, 5).map(m => ({ type: 'message', text: `Message: ${m.subject}`, by: m.senderName, date: m.date })),
                                        ...announcements.slice(0, 5).map(a => ({ type: 'broadcast', text: `Broadcast: ${a.title}`, by: a.author, date: a.date })),
                                        ...users.slice(0, 5).map(u => ({ type: 'user', text: `User joined: ${u.name}`, by: u.companyName || 'New org', date: u.createdAt || new Date().toISOString() })),
                                    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'message' ? 'bg-blue-500' : item.type === 'broadcast' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] md:text-xs font-bold text-white truncate">{item.text}</p>
                                                    <p className="text-[8px] text-slate-600">{item.by} - {new Date(item.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-white/5 rounded-2xl md:rounded-[4rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-black border-b border-white/5">
                                    <tr>
                                        <th className="px-4 md:px-10 py-4 md:py-8 text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Entity</th>
                                        <th className="px-4 md:px-10 py-4 md:py-8 text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Sector</th>
                                        <th className="px-4 md:px-10 py-4 md:py-8 text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                                        <th className="px-4 md:px-10 py-4 md:py-8 text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">Health</th>
                                        <th className="px-4 md:px-10 py-4 md:py-8 text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 md:px-10 py-16 md:py-32 text-center text-slate-700 font-bold uppercase tracking-widest text-[10px] md:text-xs">No registered nodes matched the query</td></tr>
                                    ) : filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 md:px-10 py-4 md:py-8">
                                                <div className="flex items-center space-x-3 md:space-x-5">
                                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-black rounded-xl md:rounded-2xl border border-white/10 flex items-center justify-center text-emerald-500 font-black text-sm md:text-xl group-hover:scale-110 transition-transform shrink-0">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-white text-xs md:text-base tracking-tight truncate">{u.name}</p>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-600 truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-10 py-4 md:py-8">
                                                <p className="font-black text-slate-300 text-[10px] md:text-xs tracking-tighter uppercase truncate">{u.companyName || 'Corporate Node'}</p>
                                                <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">{u.businessType || u.sector}</p>
                                            </td>
                                            <td className="px-4 md:px-10 py-4 md:py-8">
                                                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-4 py-1 md:py-1.5 rounded-full border ${u.setupComplete ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'}`}>
                                                    {u.setupComplete ? 'Synced' : 'Incomplete'}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-10 py-4 md:py-8">
                                                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{u.activationStatus}</span>
                                            </td>
                                            <td className="px-4 md:px-10 py-4 md:py-8 text-right">
                                                <button onClick={() => deleteUser(u.id)} className="p-2 md:p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Purge Node"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* PROVISION MODAL */}
            {showProvisionModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-3 md:p-4 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl md:rounded-[4rem] w-full max-w-4xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 md:p-12 border-b border-white/5 flex justify-between items-start gap-3">
                            <div>
                                <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-4">
                                    <Shield size={20} className="text-emerald-500 shrink-0" />
                                    <h3 className="text-lg md:text-3xl font-black text-white tracking-tighter leading-none uppercase">Provision Node</h3>
                                </div>
                                <p className="text-slate-500 font-medium text-xs md:text-lg">Administrative injection of organizational identities.</p>
                            </div>
                            <button onClick={() => setShowProvisionModal(false)} className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:rotate-90 transition-all shrink-0"><X size={18}/></button>
                        </div>

                        <form onSubmit={handleProvision} className="p-5 md:p-12 space-y-6 md:space-y-12 overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Administrator Name</label>
                                    <input required className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all" placeholder="Full Name" value={provisionForm.name} onChange={e => setProvisionForm({...provisionForm, name: e.target.value})} />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Work Email</label>
                                    <input required type="email" className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all" placeholder="email@address.ug" value={provisionForm.email} onChange={e => setProvisionForm({...provisionForm, email: e.target.value})} />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Company Name</label>
                                    <input required className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all" placeholder="Company Name" value={provisionForm.companyName} onChange={e => setProvisionForm({...provisionForm, companyName: e.target.value})} />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Security Key</label>
                                    <input required type="password" className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all tracking-widest" placeholder="Set Password" value={provisionForm.password} onChange={e => setProvisionForm({...provisionForm, password: e.target.value})} />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Business Vertical</label>
                                    <select className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest text-[10px] md:text-[11px]" value={provisionForm.sector} onChange={e => setProvisionForm({...provisionForm, sector: e.target.value as Sector})}>
                                        <option value="GENERAL">General Agriculture</option>
                                        <option value="EXPORT">Export Hub</option>
                                        <option value="FARMING">Primary Production</option>
                                        <option value="LIVESTOCK">Livestock Control</option>
                                        <option value="PROCESSING">Value Addition</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-4">Authorization Role</label>
                                    <select className="w-full bg-black border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-[1.5rem] text-white font-black text-sm outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest text-[10px] md:text-[11px]" value={provisionForm.role} onChange={e => setProvisionForm({...provisionForm, role: e.target.value as any})}>
                                        <option value="ADMIN">Corporate Admin</option>
                                        <option value="STAFF">Standard Staff Node</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-5 md:pt-10 border-t border-white/5 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-6">
                                <button type="button" onClick={() => setShowProvisionModal(false)} className="px-8 py-3 md:py-5 text-slate-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:text-white transition-colors text-center">Discard</button>
                                <button 
                                    type="submit" 
                                    disabled={isProvisioning}
                                    className="bg-emerald-600 text-white px-10 md:px-20 py-4 md:py-6 rounded-xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isProvisioning ? <><RefreshCw size={16} className="mr-2 animate-spin" /> Provisioning...</> : <><SendHorizontal size={16} className="mr-2" /> Authorize</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="p-4 md:p-8 text-center text-slate-800 text-[8px] md:text-[9px] font-black uppercase tracking-widest md:tracking-[0.6em] shrink-0 border-t border-white/5">
                Executive Command Hub • Layers of Authority • Built for UG-Central • © 2026
            </footer>
        </div>
    );
}
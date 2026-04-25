import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Clock, Activity, Users, Zap } from 'lucide-react';

export default function Dashboard() {
    const { user, loading, farms, staff, transactions } = useApp();

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-xl font-bold text-slate-400">Loading dashboard...</div>;
    }
    if (!user) {
        return <div className="flex items-center justify-center h-64 text-xl font-bold text-rose-500">User not found. Please log in.</div>;
    }

    // Calculate metrics
    const activeFarms = farms.filter(f => f.farmingType === 'CROP').length;
    const activeStaff = staff.filter(s => s.status === 'ACTIVE').length;
    const avgTaskTime = transactions.length > 0 ? Math.round(transactions.reduce((s, t) => s + (t.amount || 0), 0) / transactions.length) : 0;
    const efficiencyScore = Math.min(100, 72 + Math.floor(Math.random() * 20));

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">Operations Dashboard</h1>
                    <p className="text-sm text-slate-500 font-semibold">{user.companyName || 'Agricultural Operations'}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent text-sm font-medium text-slate-600 outline-none placeholder-slate-400 w-32" />
                    </div>
                    <button className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                        <Bell size={18} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Live Assets Map Section */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
                        <div className="relative h-80 bg-gradient-to-br from-emerald-100 via-emerald-50 to-cyan-50">
                            {/* Mock map with asset points */}
                            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
                                {/* Grid pattern background */}
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3"/>
                                    </pattern>
                                </defs>
                                <rect width="800" height="300" fill="url(#grid)" />
                                
                                {/* Stylized farm/asset locations */}
                                <circle cx="150" cy="80" r="24" fill="#fb7a5f" opacity="0.8" />
                                <circle cx="350" cy="120" r="20" fill="#fb7a5f" opacity="0.6" />
                                <circle cx="600" cy="160" r="22" fill="#fb7a5f" opacity="0.7" />
                                <circle cx="450" cy="240" r="18" fill="#fb7a5f" opacity="0.5" />
                                <circle cx="250" cy="200" r="20" fill="#fb7a5f" opacity="0.7" />
                            </svg>
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-white/50">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">LIVE</p>
                                <p className="text-2xl font-black text-slate-900">{activeFarms} <span className="text-sm text-slate-400">Active Units</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - KPI Cards */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Avg Task Time */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md border border-slate-700">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">AVG. TASK TIME</p>
                                <p className="text-4xl font-black">{avgTaskTime}<span className="text-lg text-slate-400 ml-1">min</span></p>
                            </div>
                            <Clock size={24} className="text-cyan-400" />
                        </div>
                        <div className="h-12 bg-slate-700/50 rounded-lg overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{width: '65%'}} />
                        </div>
                    </div>

                    {/* Efficiency Score */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">EFFICIENCY</p>
                                <p className="text-4xl font-black text-slate-900">{efficiencyScore}<span className="text-lg text-slate-400 ml-1">%</span></p>
                            </div>
                            <Zap size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-xs text-emerald-600 font-bold">↑ 4.2% from last week</p>
                    </div>
                </div>
            </div>

            {/* Network Pulse & Staff Manifest */}
            <div className="grid grid-cols-12 gap-6">
                {/* Network Pulse */}
                <div className="col-span-12 md:col-span-4">
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 h-full">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                            <Activity size={20} className="mr-2 text-amber-500" /> NETWORK PULSE
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">ON SCHEDULE</p>
                                    <p className="text-lg font-black text-slate-900">88%</p>
                                </div>
                                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '88%'}} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">IDLE CAPACITY</p>
                                    <p className="text-lg font-black text-slate-900">12%</p>
                                </div>
                                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{width: '12%'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff Manifest Table */}
                <div className="col-span-12 md:col-span-8">
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 flex items-center">
                                <Users size={20} className="mr-2 text-blue-500" /> TEAM MANIFEST
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase">Real-time activity</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">STAFF ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">NAME</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">ROLE</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">STATUS</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">EFFICIENCY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staff.slice(0, 4).map((s, i) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-600">#{s.id?.slice(0, 6) || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.name}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{s.role || 'General'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                    s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                                    s.status === 'INACTIVE' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {s.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-slate-900">{75 + Math.floor(Math.random() * 20)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {staff.length === 0 && (
                            <div className="px-6 py-12 text-center">
                                <Users size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No staff members registered</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

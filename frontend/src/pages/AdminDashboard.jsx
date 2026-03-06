import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, Filter, User, Calendar,
    ChevronRight, MoreVertical, LogOut, CheckCircle2,
    Clock, Archive, RefreshCw, AlertCircle, FileText,
    Mail, Phone, MessageSquare, Zap, BarChart3, LayoutGrid,
    Shield, Briefcase, Activity, Landmark
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('assessments'); // 'assessments', 'leads', or 'reports'
    const [assessments, setAssessments] = useState([]);
    const [leads, setLeads] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin-login');
                return;
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const headers = { Authorization: `Basic ${token}` };

            const [assessmentsRes, leadsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/insurance-assessment`, { headers }),
                axios.get(`${apiUrl}/api/contact`, { headers })
            ]);

            setAssessments(assessmentsRes.data);
            setLeads(leadsRes.data);

            updateFiltered(activeTab, assessmentsRes.data, leadsRes.data, searchTerm);
        } catch (err) {
            setError('Failed to fetch data. Session may have expired.');
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin-login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    // Reset selected state when changing tabs to prevent ID mismatch
    useEffect(() => {
        setSelected(null);
    }, [activeTab]);

    const updateFiltered = (tab, allAssessments, allLeads, term) => {
        if (tab === 'reports') return;
        let source = tab === 'assessments' ? allAssessments : allLeads;
        const results = source.filter(item => {
            if (tab === 'assessments') {
                return (
                    `${item.primaryApplicant?.firstName} ${item.primaryApplicant?.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
                    item.contact?.email?.toLowerCase().includes(term.toLowerCase())
                );
            } else {
                return (
                    item.name?.toLowerCase().includes(term.toLowerCase()) ||
                    item.email?.toLowerCase().includes(term.toLowerCase()) ||
                    (item.serviceType && item.serviceType.toLowerCase().includes(term.toLowerCase()))
                );
            }
        });
        setFiltered(results);
    };

    useEffect(() => {
        updateFiltered(activeTab, assessments, leads, searchTerm);
    }, [searchTerm, activeTab, assessments, leads]);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const endpoint = activeTab === 'assessments' ? 'insurance-assessment' : 'contact';

            await axios.patch(`${apiUrl}/api/${endpoint}/${id}`, { status }, {
                headers: { Authorization: `Basic ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
    };

    const exportToCSV = () => {
        let headers, rows, filename;

        if (activeTab === 'assessments') {
            headers = ['Date', 'Client Name', 'Email', 'Phone', 'Product Count', 'Status'];
            rows = filtered.map(a => [
                new Date(a.createdAt).toLocaleDateString(),
                `${a.primaryApplicant.firstName} ${a.primaryApplicant.lastName}`,
                a.contact.email,
                a.contact.telephone,
                a.products.length,
                a.status
            ]);
            filename = `insurance_assessments_${new Date().toISOString().split('T')[0]}.csv`;
        } else {
            headers = ['Date', 'Name', 'Email', 'Phone', 'Service', 'Status'];
            rows = filtered.map(l => [
                new Date(l.createdAt).toLocaleDateString(),
                l.name,
                l.email,
                l.phone,
                l.serviceType,
                l.status || 'New'
            ]);
            filename = `contact_leads_${new Date().toISOString().split('T')[0]}.csv`;
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Reports Statistics Calculation
    const getReportStats = () => {
        const all = [...assessments, ...leads];
        const statusDist = all.reduce((acc, item) => {
            const s = item.status || 'New';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});

        const serviceDist = leads.reduce((acc, item) => {
            const s = item.serviceType || 'General';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});

        const dateDist = all.reduce((acc, item) => {
            const d = new Date(item.createdAt).toLocaleDateString();
            acc[d] = (acc[d] || 0) + 1;
            return acc;
        }, {});

        return { statusDist, serviceDist, dateDist };
    };

    const ReportsView = () => {
        const stats = getReportStats();
        return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Status Distribution */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Activity size={18} className="text-primary" /> Lifecycle Split
                        </h4>
                        <div className="space-y-6">
                            {Object.entries(stats.statusDist).map(([status, count]) => (
                                <div key={status} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'New' ? 'text-primary' : status === 'Reviewed' ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {status}
                                        </span>
                                        <span className="font-black text-slate-900">{count}</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / (assessments.length + leads.length)) * 100}%` }}
                                            className={`h-full rounded-full ${status === 'New' ? 'bg-primary' : status === 'Reviewed' ? 'bg-amber-400' : 'bg-slate-300'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Type Breakdown */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Zap size={18} className="text-emerald-500" /> Service Demand
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(stats.serviceDist).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([service, count]) => (
                                <div key={service} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight truncate max-w-[150px]">{service}</span>
                                    <span className="bg-white px-3 py-1 rounded-lg font-black text-slate-900 shadow-sm">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Volume */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <BarChart3 size={18} className="text-primary" /> Recent Velocity
                        </h4>
                        <div className="flex items-end justify-between h-40 gap-2">
                            {Object.entries(stats.dateDist).slice(-7).map(([date, count]) => (
                                <div key={date} className="flex-grow flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(count / Math.max(...Object.values(stats.dateDist))) * 100}%` }}
                                        className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {count}
                                        </div>
                                    </motion.div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase rotate-45 mt-2 origin-left">{date.split('/')[0]}/{date.split('/')[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Unified Lead Quality Section */}
                <div className="bg-slate-900 text-white p-12 lg:p-16 rounded-[4rem] relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Intelligence Core</span>
                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">Conversion Intelligence</h3>
                            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">
                                Tracking total submission velocity across all digital channels. Use these metrics to optimize marketing spend and advisor allocation.
                            </p>
                            <div className="flex gap-4">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Avg daily leads</span>
                                    <span className="text-3xl font-black">{((assessments.length + leads.length) / Math.max(Object.keys(stats.dateDist).length, 1)).toFixed(1)}</span>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Insurance Ratio</span>
                                    <span className="text-3xl font-black text-primary">{((assessments.length / (assessments.length + leads.length || 1)) * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-64 bg-white/5 rounded-[3rem] border border-white/10 p-8 flex items-center justify-center">
                            <Activity size={120} className="text-primary opacity-20 absolute" />
                            <div className="text-center relative">
                                <h4 className="text-6xl font-black tracking-tighter">{assessments.length + leads.length}</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Total Insights Captured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] font-display flex transition-all">
            {/* Sidebar */}
            <aside className="w-20 lg:w-72 bg-slate-900 text-white flex flex-col pt-32 pb-8 fixed h-full z-20 shadow-2xl">
                <div className="px-8 mb-16 hidden lg:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Admin Portal</h2>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">MKWise Financial</p>
                </div>

                <nav className="flex-grow space-y-2 px-6">
                    <button
                        onClick={() => setActiveTab('assessments')}
                        className={`w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all ${activeTab === 'assessments' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <FileText size={20} /> <span className="hidden lg:block font-black uppercase text-[10px] tracking-widest">Insurance Leads</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all ${activeTab === 'leads' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <MessageSquare size={20} /> <span className="hidden lg:block font-black uppercase text-[10px] tracking-widest">Website Inquiries</span>
                    </button>

                    <div className="pt-10 mb-4 border-t border-slate-800 hidden lg:block">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-2">Analytics</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <BarChart3 size={20} /> <span className="hidden lg:block font-black uppercase text-[10px] tracking-widest">Live Reports</span>
                    </button>
                </nav>

                <div className="px-6 border-t border-slate-800 pt-8 mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 text-rose-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden lg:block font-black uppercase text-[10px] tracking-widest">Logout System</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-20 lg:ml-72 p-6 pt-32 lg:p-12 lg:pt-32">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">MKWise Intelligence</span>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                {activeTab === 'assessments' ? 'Insurance Vault' : activeTab === 'leads' ? 'Website Stream' : 'Reporting Core'}
                            </h1>
                            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
                                {activeTab === 'assessments'
                                    ? 'Detailed pre-assessment data from insurance applicants.'
                                    : activeTab === 'leads'
                                        ? 'Public contact inquiries, calendar bookings, and "Get Started" questionnaires.'
                                        : 'Real-time performance metrics and lead distribution analytics.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={fetchData} className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"><RefreshCw size={24} className={loading ? 'animate-spin' : ''} /></button>
                            {activeTab !== 'reports' && (
                                <button onClick={exportToCSV} className="flex items-center gap-3 bg-slate-900 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 active:scale-95 group">
                                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
                                </button>
                            )}
                        </div>
                    </header>

                    {activeTab === 'reports' ? (
                        <ReportsView />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                                {[
                                    { label: 'Total Volume', value: assessments.length + leads.length, icon: <LayoutGrid size={22} />, color: 'bg-slate-50 text-slate-900' },
                                    { label: 'Insurance Data', value: assessments.length, icon: <FileText size={22} />, color: 'bg-blue-50 text-primary' },
                                    { label: 'Website Leads', value: leads.length, icon: <MessageSquare size={22} />, color: 'bg-emerald-50 text-emerald-600' },
                                    { label: 'New Action', value: assessments.filter(a => a.status === 'New').length + leads.filter(l => (l.status || 'New') === 'New').length, icon: <Zap size={22} />, color: 'bg-amber-50 text-amber-600' },
                                ].map((stat, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                                            </div>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${stat.color}`}>{stat.icon}</div>
                                        </div>
                                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform ${stat.color}`} />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">
                                <div className="p-8 lg:p-10 border-b border-slate-50 flex items-center justify-between flex-wrap gap-8 bg-slate-50/20">
                                    <div className="relative max-w-xl w-full">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                        <input placeholder={`Filter ${activeTab} by name, email or service...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-8 h-16 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold placeholder:text-slate-300 transition-all shadow-inner" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Queue: {activeTab === 'assessments' ? 'Insurance' : 'Website'}
                                        </span>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="p-32 text-center">
                                        <RefreshCw size={48} className="animate-spin text-primary/20 mx-auto mb-6" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Syncing Active Data...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-32 text-center text-rose-500">
                                        <AlertCircle size={48} className="mx-auto mb-6 opacity-30" />
                                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">Sync Error</h4>
                                        <p className="text-slate-500 font-medium">{error}</p>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="p-32 text-center">
                                        <Archive size={48} className="text-slate-100 mx-auto mb-6" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching records found</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[#fcfdfe] border-b border-slate-50">
                                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Entity</th>
                                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service / Type</th>
                                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Specs</th>
                                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">View</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                <AnimatePresence mode="popLayout">
                                                    {filtered.map((item) => (
                                                        <motion.tr key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-primary/[0.01] transition-colors group relative">
                                                            <td className="px-10 py-8">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                                                                        {activeTab === 'assessments' ? <Briefcase size={20} /> : <User size={20} />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-slate-900 tracking-tight text-base truncate max-w-[200px]">{activeTab === 'assessments' ? `${item.primaryApplicant?.firstName} ${item.primaryApplicant?.lastName}` : item.name}</p>
                                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] flex items-center gap-1.5 mt-1 transition-colors group-hover:text-primary leading-none"><Mail size={12} /> {activeTab === 'assessments' ? item.contact?.email : item.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                {activeTab === 'assessments' ? (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {item.products?.slice(0, 1).map((p, idx) => (
                                                                            <span key={idx} className="px-3 py-1.5 bg-blue-50 text-primary text-[8px] font-black uppercase rounded-lg tracking-widest border border-blue-100">{p.type}</span>
                                                                        ))}
                                                                        {item.products?.length > 1 && <span className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-lg tracking-widest">+{item.products.length - 1} More</span>}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg tracking-widest w-fit">{item.serviceType || 'General'}</span>
                                                                        {item.metadata?.isBooking && <span className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1 mt-1"><Calendar size={10} /> Appointment Booked</span>}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-black text-slate-700">{activeTab === 'assessments' ? item.contact?.telephone : item.phone}</p>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {new Date(item.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <div className="flex justify-center">
                                                                    <div className="relative group">
                                                                        <select
                                                                            value={item.status || 'New'}
                                                                            onChange={(e) => updateStatus(item._id, e.target.value)}
                                                                            className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all outline-none appearance-none text-center cursor-pointer min-w-[120px] ${item.status === 'Reviewed' ? 'bg-amber-50 border-amber-200 text-amber-600' : item.status === 'Archived' ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-blue-50 border-primary/20 text-primary'}`}
                                                                        >
                                                                            <option value="New">New</option>
                                                                            <option value="Reviewed">Reviewed</option>
                                                                            <option value="Archived">Archived</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelected(selected === item._id ? null : item._id);
                                                                    }}
                                                                    className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center ${selected === item._id ? 'bg-slate-900 text-white shadow-2xl rotate-90 scale-110' : 'bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent shadow-sm'}`}
                                                                >
                                                                    <ChevronRight size={24} />
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-[-60px_0_120px_rgba(0,0,0,0.12)] z-50 overflow-y-auto p-12 lg:p-16 pt-32 lg:pt-40 border-l border-slate-50"
                    >
                        <button onClick={() => setSelected(null)} className="absolute top-12 left-12 p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all shadow-sm"><ChevronRight size={24} className="rotate-180" /></button>

                        {activeTab === 'assessments' ? (
                            assessments.filter(a => a._id === selected).map(item => (
                                <div key={item._id} className="space-y-12 pb-24">
                                    <header>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Active Record</span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: #{item._id.slice(-6)}</span>
                                        </div>
                                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">{item.primaryApplicant?.firstName} {item.primaryApplicant?.lastName}</h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 flex items-center gap-2"><User size={12} /> {item.primaryApplicant?.gender}</span>
                                            <span className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 flex items-center gap-2"><Calendar size={12} /> Born: {new Date(item.primaryApplicant?.dob).toLocaleDateString()}</span>
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${item.primaryApplicant?.smokingStatus?.toLowerCase().includes('non') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{item.primaryApplicant?.smokingStatus}</span>
                                        </div>
                                    </header>

                                    <div className="grid grid-cols-1 gap-12">
                                        <section className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Mail size={16} className="text-primary" /> Core Contact Access</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-1 group hover:border-primary/20 transition-all">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Email</span>
                                                    <span className="font-bold text-slate-900 text-lg truncate group-hover:text-primary transition-colors">{item.contact?.email}</span>
                                                </div>
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-1 group hover:border-primary/20 transition-all">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Direct Line</span>
                                                    <span className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.contact?.telephone}</span>
                                                </div>
                                                <div className="col-span-2 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Physical Residency</span>
                                                    <span className="font-bold text-slate-900 uppercase leading-relaxed text-sm">{item.contact?.address}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Shield size={16} className="text-primary" /> Target Coverages</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.products?.map((p, i) => (
                                                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <span className="px-3 py-1 bg-blue-50 text-primary text-[8px] font-black uppercase rounded-lg tracking-widest border border-blue-100">Product 0{i + 1}</span>
                                                                <Landmark size={14} className="text-slate-200" />
                                                            </div>
                                                            <p className="font-black text-slate-900 uppercase text-sm tracking-tight mb-1">{p.type}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">£{p.amount} Cover</p>
                                                        </div>
                                                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[8px] font-black uppercase text-slate-400 tracking-widest">
                                                            <span>Term: {p.duration}Y</span>
                                                            <span>Basis: {p.basis}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Activity size={16} className="text-primary" /> Actuarial Profile</h3>
                                            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                                <div className="relative z-10 space-y-8">
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Job Sector</p><p className="font-black uppercase tracking-tight text-lg group-hover:text-primary transition-colors">{item.healthBasics?.job}</p></div>
                                                        <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Physique Specs</p><p className="font-black uppercase tracking-tight text-lg">{item.healthBasics?.height} / {item.healthBasics?.weight}</p></div>
                                                    </div>
                                                    <div className="space-y-4 pt-8 border-t border-white/5">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Medical Flag Indicators</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {[
                                                                ...(item.healthBasics?.familyMedicalHistory || []),
                                                                ...(item.mentalHealth?.last5Years || []),
                                                                ...(item.physicalMedicalHistory?.everHadChronic || [])
                                                            ].map(f => (
                                                                <span key={f} className="px-3 py-1.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-colors">{f}</span>
                                                            ))}
                                                            {[...(item.healthBasics?.familyMedicalHistory || []), ...(item.mentalHealth?.last5Years || []), ...(item.physicalMedicalHistory?.everHadChronic || [])].length === 0 && <span className="text-[10px] opacity-30 italic font-medium">Clear health history declared.</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"><Landmark size={120} /></div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="pt-12 border-t border-slate-50 text-center">
                                        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">MKWise Intelligence System • Digital Archive</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            leads.filter(l => l._id === selected).map(item => (
                                <div key={item._id} className="space-y-12 pb-24">
                                    <header>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">New Inquiry</span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: #{item._id.slice(-6)}</span>
                                        </div>
                                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">{item.name}</h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-emerald-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100 flex items-center gap-2 transition-all hover:bg-emerald-100"><Landmark size={12} /> {item.serviceType || 'Standard Service'}</span>
                                            {item.metadata?.isBooking && (
                                                <span className="px-4 py-2 bg-rose-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-600 border border-rose-100 flex items-center gap-2"><Calendar size={12} /> Appointment Confirmed</span>
                                            )}
                                        </div>
                                    </header>

                                    <div className="grid grid-cols-1 gap-12">
                                        {/* Booking Details Section (NEW) */}
                                        {item.metadata?.isBooking && (
                                            <section className="space-y-6">
                                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Calendar size={16} className="text-rose-500" /> Booked Consultation</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-6 bg-rose-50/30 rounded-3xl border border-rose-100 flex flex-col gap-2">
                                                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Scheduled Date</span>
                                                        <span className="font-black text-slate-900 text-xl">{item.metadata.bookingDate}</span>
                                                    </div>
                                                    <div className="p-6 bg-rose-50/30 rounded-3xl border border-rose-100 flex flex-col gap-2">
                                                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Prefered Time</span>
                                                        <span className="font-black text-slate-900 text-xl">{item.metadata.bookingTime}</span>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        <section className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Briefcase size={16} className="text-primary" /> Contact Access</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2 group hover:border-primary/20 transition-all">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Direct Line</span>
                                                    <span className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.phone}</span>
                                                </div>
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2 group hover:border-primary/20 transition-all">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                                    <span className="font-bold text-slate-900 text-lg truncate group-hover:text-primary transition-colors">{item.email}</span>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Get Started Flow Data (NEW) */}
                                        {item.metadata && Object.keys(item.metadata).length > (item.metadata.isBooking ? 3 : 0) && (
                                            <section className="space-y-6">
                                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><Activity size={16} className="text-primary" /> Multi-Step Intelligence</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(item.metadata).filter(([k]) => !['isBooking', 'bookingDate', 'bookingTime'].includes(k)).map(([key, value]) => (
                                                        <div key={key} className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col gap-1 transition-all hover:border-slate-300">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                            <span className="font-bold text-slate-900 text-xs w-full break-words">{String(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        <section className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3"><MessageSquare size={16} className="text-primary" /> Direct Message</h3>
                                            <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] text-slate-700 font-medium leading-relaxed text-lg min-h-[150px]">
                                                {item.message || <span className="text-slate-300 italic">No supplemental message provided.</span>}
                                            </div>
                                        </section>

                                        <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stream Timestamp</span>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{new Date(item.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-full h-full bg-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

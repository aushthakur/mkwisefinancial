import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/insurance-assessment/login`, { email, password });

            if (response.data.success) {
                // Store basic auth in localStorage for subsequent requests
                const authCode = btoa(`${email}:${password}`);
                localStorage.setItem('adminToken', authCode);
                localStorage.setItem('adminEmail', email);
                navigate('/admin');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-6 py-20 font-display">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Advisor Portal</h1>
                    <p className="text-slate-500 font-medium">Please sign in to access client assessments.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 italic">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-primary outline-none font-medium transition-all" placeholder="admin@mkwisefinancial.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-primary outline-none font-medium transition-all" placeholder="••••••••" />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase py-2">
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}

                        <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                            {loading ? 'Authenticating...' : <>Access Dashboard <ChevronRight size={16} /></>}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

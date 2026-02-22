import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Phone, Mail, User, ShieldCheck, Home } from 'lucide-react';
import axios from 'axios';

const mortgageServices = [
    'First Time Buyer', 'Remortgaging', 'Buy to Let', 'Shared Ownership', 'Bad Credit Mortgages', 'High Net Worth'
];

const protectionServices = [
    'Life Insurance', 'Critical Illness Cover', 'Income Protection', 'Mortgage Protection', 'Buildings & Contents'
];

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const stepVariants = {
    initial: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, transition: { duration: 0.2 } })
};

const GetStartedModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState({ category: '', service: '', name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const changeStep = (newStep) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, category }));
        changeStep(2);
    };

    const handleServiceSelect = (service) => {
        setFormData(prev => ({ ...prev, service }));
        changeStep(3);
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/contact', {
                ...formData,
                message: `Multi-step Lead: Interested in ${formData.service} (${formData.category})`
            });
            changeStep(4);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden font-display"
            >
                {/* Progress Bar */}
                {step < 4 && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                        <motion.div
                            className="h-full bg-primary"
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-10 p-2"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12 overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">What do you need<br />help with?</h2>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Select your category</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => handleCategorySelect('Mortgages')}
                                        className="group flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Home size={24} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900">Mortgage Services</p>
                                                <p className="text-xs text-slate-400 font-medium">Buying, remortgaging, or BTL</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-primary" size={20} />
                                    </button>

                                    <button
                                        onClick={() => handleCategorySelect('Protection')}
                                        className="group flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900">Protection Advice</p>
                                                <p className="text-xs text-slate-400 font-medium">Life, critical illness, or income</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-primary" size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => changeStep(1)}
                                    className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:-translate-x-1 transition-transform"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>

                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">Tell us a bit more</h2>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Select a specific service</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {(formData.category === 'Mortgages' ? mortgageServices : protectionServices).map((service) => (
                                        <button
                                            key={service}
                                            onClick={() => handleServiceSelect(service)}
                                            className="w-full p-4 text-left text-sm font-bold text-slate-600 border border-slate-100 rounded-xl hover:border-primary hover:text-primary hover:bg-blue-50/20 transition-all flex justify-between items-center"
                                        >
                                            {service}
                                            <ChevronRight size={14} className="text-slate-300" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => changeStep(2)}
                                    className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:-translate-x-1 transition-transform"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>

                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl font-black text-slate-900 leading-tight">Final Step</h2>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Where should we reach you?</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text" name="name" placeholder="Your Full Name"
                                            value={formData.name} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="email" name="email" placeholder="Email Address"
                                            value={formData.email} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="tel" name="phone" placeholder="Phone Number"
                                            value={formData.phone} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-slate-900"
                                        />
                                    </div>

                                    <button
                                        disabled={loading} type="submit"
                                        className="w-full bg-primary hover:bg-blue-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                                    >
                                        {loading ? 'Submitting...' : 'Finish & Get Details'}
                                        {!loading && <ChevronRight size={18} />}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                                className="text-center py-12 space-y-8"
                            >
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={56} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-4xl font-black text-slate-900">Success!</h2>
                                    <p className="text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                                        Our expert advisors have received your enquiry for <strong>{formData.service}</strong>. We'll be in touch shortly.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-12 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                                >
                                    Close
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default GetStartedModal;

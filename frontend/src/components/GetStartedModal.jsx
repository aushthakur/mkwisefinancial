import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft, CheckCircle2,
    Phone, Mail, User, ShieldCheck, Home,
    Building2, PiggyBank, PoundSterling, Clock,
    Users, Briefcase, Heart, Search, Sparkles
} from 'lucide-react';
import axios from 'axios';

const intentOptions = ['Buy a Property', 'Remortgage/Refinance', 'Invest In Property'];
const primaryUseOptions = ['Live there', 'Rent it out'];
const simpleYesNo = ['Yes', 'No'];
const depositOptions = ['Yes', 'No', 'Saving For One'];
const callTimeOptions = ['9:00 - 12:00 pm', '12:00 - 3:00 pm', '3:00 - 6:00 pm', 'After 6:00 pm'];
const timelineOptions = ['ASAP', '1 to 3 months', '4 to 6 months', '7 to 12 months', '12 months plus'];
const maritalStatusOptions = ['Married', 'Divorced', 'Separated', 'Widow', 'Widower', 'Co-Habiting', 'Civil Partner'];
const employmentTypeOptions = ['Limited Company', 'Partnership', 'LLP', 'Individual'];
const sourceOptions = ['Social Media', 'Friend', 'Internet', 'Others'];

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            type: 'spring',
            stiffness: 300,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        filter: 'blur(5px)',
        transition: { duration: 0.3 }
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 30 }
    }
};

const GetStartedModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        intent: '', primaryUse: '', purchasedBefore: '', depositReady: '',
        mortgageAmount: '', propertyValue: '', rentalPotential: '0',
        callTime: '', timeline: '', maritalStatus: '', dependents: '',
        income: '', employmentType: '', name: '', email: '',
        phone: '', termsAccepted: false, source: ''
    });

    if (!isOpen) return null;

    const changeStep = (newStep) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    const handleOptionSelect = (field, value, nextStep) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (nextStep) changeStep(nextStep);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const detailedMessage = `
--- Get Started Multi-Step Lead ---
Intent: ${formData.intent}
Primary Use: ${formData.primaryUse}
Purchased Before: ${formData.purchasedBefore}
Deposit Ready: ${formData.depositReady}
Mortgage Amount: £${formData.mortgageAmount}
Property Value: £${formData.propertyValue}
Rental Potential: ${formData.rentalPotential !== '0' ? `£${formData.rentalPotential}` : 'N/A'}
Preferred Call Time: ${formData.callTime}
Timeline: ${formData.timeline}
Marital Status: ${formData.maritalStatus}
Dependents: ${formData.dependents}
Annual Income: £${formData.income}
Employment Type: ${formData.employmentType}
Source: ${formData.source || 'Not specified'}
            `.trim();

            await axios.post(`${apiUrl}/api/contact`, {
                name: formData.name, email: formData.email,
                phone: formData.phone, serviceType: formData.intent,
                message: detailedMessage,
                ...formData // Send individual fields for CRM mapping
            });
            changeStep(13);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const progress = (step / 12) * 100;

    const renderHeader = (title, subtitle, showBack = true, backTo = step - 1) => (
        <div className="space-y-4 mb-8">
            {showBack && (
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => changeStep(backTo)}
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-blue-700 transition-colors group"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to previous
                </motion.button>
            )}
            <div className="space-y-2">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight"
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"
                    >
                        <Sparkles size={12} className="text-primary" />
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );

    const renderOptionButton = (label, onClick, isSelected = false) => (
        <motion.button
            key={label}
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full p-5 text-left border-2 rounded-2xl transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${isSelected
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-md'
                }`}
        >
            <span className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                {label}
            </span>
            <div className={`p-1 rounded-full transition-all ${isSelected ? 'bg-primary text-white scale-110' : 'bg-slate-50 text-slate-300 group-hover:text-primary group-hover:scale-110'}`}>
                <ChevronRight size={16} />
            </div>
            {isSelected && (
                <motion.div
                    layoutId="active-bg"
                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </motion.button>
    );

    const renderSteps = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Which of the following best describes your intent? *", "Start your journey", false)}
                        <div className="grid gap-3">
                            {intentOptions.map(opt => renderOptionButton(opt, () => handleOptionSelect('intent', opt, 2), formData.intent === opt))}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Primary use of the property? *", "Usage details")}
                        <div className="grid gap-3">
                            {primaryUseOptions.map(opt => renderOptionButton(opt, () => handleOptionSelect('primaryUse', opt, 3), formData.primaryUse === opt))}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Have you purchased property before? *", "Experience")}
                        <div className="grid gap-3">
                            {simpleYesNo.map(opt => renderOptionButton(opt, () => handleOptionSelect('purchasedBefore', opt, 4), formData.purchasedBefore === opt))}
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Do you have deposit funds set aside? *", "Financial readiness")}
                        <div className="grid gap-3">
                            {depositOptions.map(opt => renderOptionButton(opt, () => handleOptionSelect('depositReady', opt, 5), formData.depositReady === opt))}
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        {renderHeader("Mortgage amount needed?", "Loan details")}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">£</div>
                            <input
                                autoFocus type="number" name="mortgageAmount" value={formData.mortgageAmount} onChange={handleInputChange}
                                className="w-full pl-12 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-black text-2xl text-slate-900 placeholder:text-slate-300"
                                placeholder="0"
                            />
                        </motion.div>
                        <button
                            disabled={!formData.mortgageAmount}
                            onClick={() => changeStep(6)}
                            className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            Next Step
                            <ChevronRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6">
                        {renderHeader("Estimated property value? *", "Valuation")}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">£</div>
                            <input
                                autoFocus type="number" name="propertyValue" value={formData.propertyValue} onChange={handleInputChange}
                                className="w-full pl-12 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-black text-2xl text-slate-900 placeholder:text-slate-300"
                                placeholder="0"
                            />
                        </motion.div>
                        <button
                            disabled={!formData.propertyValue}
                            onClick={() => (formData.primaryUse === 'Rent it out' || formData.intent === 'Invest In Property') ? changeStep(7) : changeStep(8)}
                            className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10"
                        >
                            Next Step
                        </button>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-6">
                        {renderHeader("Estimated rental potential?", "BTL Analysis")}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">£</div>
                            <input
                                autoFocus type="number" name="rentalPotential" value={formData.rentalPotential} onChange={handleInputChange}
                                className="w-full pl-12 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none font-black text-2xl text-slate-900"
                            />
                        </motion.div>
                        <button onClick={() => changeStep(8)} className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10">
                            Continue
                        </button>
                    </div>
                );
            case 8:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Preferred time for a call? *", "Scheduling", true, (formData.primaryUse === 'Rent it out' || formData.intent === 'Invest In Property' ? 7 : 6))}
                        <div className="grid gap-2">
                            {callTimeOptions.map(opt => renderOptionButton(opt, () => handleOptionSelect('callTime', opt, 9), formData.callTime === opt))}
                        </div>
                    </motion.div>
                );
            case 9:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("Next step timeline? *", "Project speed")}
                        <div className="grid gap-2">
                            {timelineOptions.map(opt => renderOptionButton(opt, () => handleOptionSelect('timeline', opt, 10), formData.timeline === opt))}
                        </div>
                    </motion.div>
                );
            case 10:
                return (
                    <div className="space-y-6">
                        {renderHeader("Basic personal details *", "Information")}
                        <div className="grid gap-4">
                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-700 appearance-none">
                                <option value="">Select Marital Status</option>
                                {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <input type="number" name="dependents" value={formData.dependents} onChange={handleInputChange} placeholder="Number Of Dependents" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-900" />
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold">£</span>
                                <input type="number" name="income" value={formData.income} onChange={handleInputChange} placeholder="Annual Gross Income" className="w-full pl-10 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-900" />
                            </div>
                            <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-700 appearance-none">
                                <option value="">Select Employment Type</option>
                                {employmentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <button disabled={!formData.maritalStatus || !formData.dependents || !formData.income || !formData.employmentType} onClick={() => changeStep(11)} className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30">
                            Continue
                        </button>
                    </div>
                );
            case 11:
                return (
                    <div className="space-y-6">
                        {renderHeader("Where can we reach you?", "Contact information")}
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input required type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900" />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900" />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900" />
                            </div>
                            <label className="flex items-start gap-4 cursor-pointer group p-2">
                                <div className="relative flex items-center mt-1">
                                    <input required type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                                </div>
                                <span className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                    I agree to the <span className="text-primary font-bold underline underline-offset-4">terms & conditions</span>. I agree to receive communications regrading my enquiry.
                                </span>
                            </label>
                        </div>
                        <button disabled={!formData.name || !formData.phone || !formData.email || !formData.termsAccepted} onClick={() => changeStep(12)} className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 flex items-center justify-center gap-3">
                            Confirm Details
                            <ChevronRight size={20} />
                        </button>
                    </div>
                );
            case 12:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {renderHeader("How did you hear about us?", "Optional details")}
                        <div className="grid gap-2">
                            {sourceOptions.map(opt => renderOptionButton(opt, () => {
                                setFormData(prev => ({ ...prev, source: opt }));
                                handleSubmit();
                            }, formData.source === opt))}
                            <button onClick={handleSubmit} className="text-slate-400 font-black hover:text-primary transition-colors py-4 uppercase tracking-widest text-xs">
                                Skip this step
                            </button>
                        </div>
                    </motion.div>
                );
            case 13:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-8">
                        <div className="relative inline-block">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.2, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-emerald-400 rounded-full"
                            />
                            <div className="relative w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                <CheckCircle2 size={56} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Success!</h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-[320px] mx-auto text-lg">
                                Our expert advisors for <strong>{formData.intent}</strong> have received your request. We'll be in touch shortly.
                            </p>
                        </div>
                        <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl">
                            Finish & Close
                        </button>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                layout
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white/95 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20 backdrop-blur-md"
            >
                {/* Custom Gradient Progress Bar */}
                {step < 13 && (
                    <div className="h-2 w-full bg-slate-100/50 absolute top-0 left-0">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-primary to-emerald-400"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        />
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-all z-10 p-2 hover:bg-slate-100 rounded-full"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={{
                                initial: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0, scale: 0.98 }),
                                animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
                                exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0, scale: 0.98, transition: { duration: 0.3 } })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {renderSteps()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                            </div>
                            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] animate-pulse">Processing Lead</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default GetStartedModal;

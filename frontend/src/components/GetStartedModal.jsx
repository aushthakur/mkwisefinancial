import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft, CheckCircle2,
    Phone, Mail, User, ShieldCheck, Home,
    Building2, PiggyBank, PoundSterling, Clock,
    Users, Briefcase, Heart, Search
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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        intent: '',
        primaryUse: '',
        purchasedBefore: '',
        depositReady: '',
        mortgageAmount: '',
        propertyValue: '',
        rentalPotential: '0',
        callTime: '',
        timeline: '',
        maritalStatus: '',
        dependents: '',
        income: '',
        employmentType: '',
        name: '',
        email: '',
        phone: '',
        termsAccepted: false,
        source: ''
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

            // Format detailed message for backend
            const detailedMessage = `
--- Get Started Multi-Step Lead ---
Intent: ${formData.intent}
Primary Use: ${formData.primaryUse}
Purchased Before: ${formData.purchasedBefore}
Deposit Ready: ${formData.depositReady}
Mortgage Amount: £${formData.mortgageAmount}
Property Value: £${formData.propertyValue}
Rental Potential: ${formData.rentalPotential !== '0' ? `£${formData.rentalPotential}` : 'N/A (Owner Occupied)'}
Preferred Call Time: ${formData.callTime}
Timeline: ${formData.timeline}
Marital Status: ${formData.maritalStatus}
Dependents: ${formData.dependents}
Annual Income: £${formData.income}
Employment Type: ${formData.employmentType}
Source: ${formData.source || 'Not specified'}
T&C Accepted: ${formData.termsAccepted ? 'Yes' : 'No'}
            `.trim();

            await axios.post(`${apiUrl}/api/contact`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                serviceType: formData.intent,
                message: detailedMessage
            });
            changeStep(13); // Success step
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const progress = (step / 12) * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Which of the following best describes your intent? *</h2>
                        </div>
                        <div className="grid gap-3">
                            {intentOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('intent', opt, 2)}
                                    className="p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all font-bold text-slate-700 flex justify-between items-center group"
                                >
                                    {opt}
                                    <ChevronRight className="text-slate-300 group-hover:text-primary" size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(1)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">What will be the primary use of the property? *</h2>
                        </div>
                        <div className="grid gap-3">
                            {primaryUseOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('primaryUse', opt, 3)}
                                    className="p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all font-bold text-slate-700 flex justify-between items-center group"
                                >
                                    {opt}
                                    <ChevronRight className="text-slate-300 group-hover:text-primary" size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(2)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Have you purchased property before? *</h2>
                        </div>
                        <div className="grid gap-3">
                            {simpleYesNo.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('purchasedBefore', opt, 4)}
                                    className="p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all font-bold text-slate-700 flex justify-between items-center group"
                                >
                                    {opt}
                                    <ChevronRight className="text-slate-300 group-hover:text-primary" size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(3)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Do you currently have funds set aside for a deposit? *</h2>
                        </div>
                        <div className="grid gap-3">
                            {depositOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('depositReady', opt, 5)}
                                    className="p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-primary hover:bg-blue-50/30 transition-all font-bold text-slate-700 flex justify-between items-center group"
                                >
                                    {opt}
                                    <ChevronRight className="text-slate-300 group-hover:text-primary" size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(4)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">How much mortgage amount you are looking for?</h2>
                            <p className="text-sm text-slate-500 font-bold">Put 0 if you are unsure *</p>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                            <input
                                autoFocus
                                type="number"
                                name="mortgageAmount"
                                value={formData.mortgageAmount}
                                onChange={handleInputChange}
                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                placeholder="e.g. 250000"
                            />
                        </div>
                        <button
                            disabled={!formData.mortgageAmount}
                            onClick={() => changeStep(6)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(5)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">What is the (estimated) property value? *</h2>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                            <input
                                autoFocus
                                type="number"
                                name="propertyValue"
                                value={formData.propertyValue}
                                onChange={handleInputChange}
                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                placeholder="e.g. 300000"
                            />
                        </div>
                        <button
                            disabled={!formData.propertyValue}
                            onClick={() => {
                                // If BTL or Investment, ask for rental potential. Otherwise skip to Step 8.
                                if (formData.primaryUse === 'Rent it out' || formData.intent === 'Invest In Property') {
                                    changeStep(7);
                                } else {
                                    changeStep(8);
                                }
                            }}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(6)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Estimated rental potential (BTL only).</h2>
                            <p className="text-sm text-slate-500 font-bold">If it's to "live in" put 0</p>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                            <input
                                autoFocus
                                type="number"
                                name="rentalPotential"
                                value={formData.rentalPotential}
                                onChange={handleInputChange}
                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                            />
                        </div>
                        <button
                            onClick={() => changeStep(8)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 8:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(formData.primaryUse === 'Rent it out' || formData.intent === 'Invest In Property' ? 7 : 6)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">What is your preferred time for a call? *</h2>
                        </div>
                        <div className="grid gap-2">
                            {callTimeOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('callTime', opt, 9)}
                                    className={`p-4 text-left border rounded-xl font-bold transition-all ${formData.callTime === opt ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 9:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(8)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">How quickly do you intend to take the next step? *</h2>
                        </div>
                        <div className="grid gap-2">
                            {timelineOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect('timeline', opt, 10)}
                                    className={`p-4 text-left border rounded-xl font-bold transition-all ${formData.timeline === opt ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 10:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(9)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Please provide some basic Personal details *</h2>
                        </div>
                        <div className="space-y-4">
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-700"
                            >
                                <option value="">Select Marital Status</option>
                                {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <input
                                type="number"
                                name="dependents"
                                value={formData.dependents}
                                onChange={handleInputChange}
                                placeholder="Number Of Dependents"
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-700"
                            />
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
                                <input
                                    type="number"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    placeholder="Annual Gross Income (Approximate)"
                                    className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-700"
                                />
                            </div>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-700"
                            >
                                <option value="">Select Employment Type</option>
                                {employmentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <button
                            disabled={!formData.maritalStatus || !formData.dependents || !formData.income || !formData.employmentType}
                            onClick={() => changeStep(11)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 11:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(10)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Contact Details</h2>
                        </div>
                        <div className="space-y-4">
                            <input
                                required
                                type="text" name="name" placeholder="Please Enter Your Full Name *"
                                value={formData.name} onChange={handleInputChange}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-900"
                            />
                            <input
                                required
                                type="tel" name="phone" placeholder="Please Provide Us Your Phone Number *"
                                value={formData.phone} onChange={handleInputChange}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-900"
                            />
                            <input
                                required
                                type="email" name="email" placeholder="Please Provide Us Your Email Id *"
                                value={formData.email} onChange={handleInputChange}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-primary outline-none font-bold text-slate-900"
                            />
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    required
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="mt-1.5 w-5 h-5 rounded border-2 border-slate-200 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                    I agree to <span className="text-primary underline">terms & conditions</span> provided by the company. By providing my phone number, I agree to receive text messages from the business.
                                </span>
                            </label>
                        </div>
                        <button
                            disabled={!formData.name || !formData.phone || !formData.email || !formData.termsAccepted}
                            onClick={() => changeStep(12)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 12:
                return (
                    <div className="space-y-6">
                        <button onClick={() => changeStep(11)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">How did you hear about us? (optional)</h2>
                        </div>
                        <div className="grid gap-2">
                            {sourceOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, source: opt }));
                                        handleSubmit();
                                    }}
                                    className={`p-4 text-left border rounded-xl font-bold transition-all ${formData.source === opt ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                            <button
                                onClick={() => handleSubmit()}
                                className="text-slate-400 font-bold hover:text-primary transition-colors py-2"
                            >
                                Skip this step
                            </button>
                        </div>
                    </div>
                );
            case 13:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={48} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900">Success!</h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                                Our expert advisors have received your enquiry for <strong>{formData.intent}</strong>. We'll be in touch shortly.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest"
                        >
                            Close
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
                {step < 13 && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                        <motion.div
                            className="h-full bg-primary"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 p-2"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-black text-primary uppercase tracking-widest">Processing...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default GetStartedModal;

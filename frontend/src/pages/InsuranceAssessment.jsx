import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Users, Phone, Mail, MapPin, Activity,
    Heart, Brain, Shield, Info, ClipboardCheck,
    Plus, Trash2, ChevronRight, ChevronLeft,
    CheckCircle2, AlertCircle, Clock, Baby,
    Stethoscope, Thermometer, Briefcase, GraduationCap,
    Wine, Pill, Zap, Car, Plane, Globe, ArrowRight, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { getApiUrl } from '../config';

const PAGE_VARIANTS = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const TRANSITION = { duration: 0.4, ease: [0.23, 1, 0.32, 1] };

const InsuranceAssessment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        primaryApplicant: { firstName: '', lastName: '', gender: '', dob: '', smokingStatus: '' },
        hasSecondApplicant: false,
        secondApplicant: { firstName: '', lastName: '', gender: '', dob: '', smokingStatus: '' },
        products: [{ type: 'Life Cover', amount: '', duration: '', basis: 'Level', forWhom: 'Individual', waiverOfPremium: false }],
        contact: { address: '', telephone: '', alternativeTelephone: '', email: '' },
        healthBasics: { height: '', weight: '', job: '', smokingHistory: '', familyMedicalHistory: [] },
        mentalHealth: { last5Years: [], everHad: [], suicidalThoughts: '', selfHarm: '' },
        physicalMedicalHistory: { everHadSerious: [], everHadChronic: [], last5YearsConditions: [], last5YearsMinor: [], last3YearsEvents: [], last3MonthsSymptoms: [] },
        lifestyle: {
            alcohol: { pintsBeer: 0, glassesWine: 0, measuresSpirits: 0 },
            alcoholDrugIssues: [], highRiskActivities: [], drivingTravelIssues: [],
            internationalTravel: 'No', existingInsurance: 'No'
        },
        occupationDetails: []
    });

    const handlePrimaryChange = (e) => setFormData({ ...formData, primaryApplicant: { ...formData.primaryApplicant, [e.target.name]: e.target.value } });
    const handleSecondaryChange = (e) => setFormData({ ...formData, secondApplicant: { ...formData.secondApplicant, [e.target.name]: e.target.value } });
    const handleContactChange = (e) => setFormData({ ...formData, contact: { ...formData.contact, [e.target.name]: e.target.value } });
    const handleHealthBasicsChange = (e) => setFormData({ ...formData, healthBasics: { ...formData.healthBasics, [e.target.name]: e.target.value } });

    const toggleMultiSelect = (section, field, value) => {
        const current = [...formData[section][field]];
        const index = current.indexOf(value);
        if (index > -1) current.splice(index, 1);
        else current.push(value);
        setFormData({ ...formData, [section]: { ...formData[section], [field]: current } });
    };

    const addProduct = () => {
        setFormData({ ...formData, products: [...formData.products, { type: 'Life Cover', amount: '', duration: '', basis: 'Level', forWhom: 'Individual', waiverOfPremium: false }] });
    };

    const removeProduct = (index) => {
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData({ ...formData, products: newProducts });
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index][field] = value;
        setFormData({ ...formData, products: newProducts });
    };

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(s => s + 1);
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(s => s - 1);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const submitData = { ...formData };
            if (!submitData.hasSecondApplicant) {
                delete submitData.secondApplicant;
            }

            const apiUrl = getApiUrl();
            await axios.post(`${apiUrl}/api/insurance-assessment`, submitData);
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            const message = err.response?.data?.error || 'Submission failed. Please check all required fields and try again.';
            setError(message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const Label = ({ children, required }) => (
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
            {children} {required && <span className="text-primary">*</span>}
        </label>
    );

    const Input = (props) => (
        <input
            {...props}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-medium transition-all placeholder:text-slate-300"
        />
    );

    const Select = (props) => (
        <div className="relative">
            <select
                {...props}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-medium transition-all appearance-none cursor-pointer"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={16} className="rotate-90" />
            </div>
        </div>
    );

    if (submitted) {
        return (
            <div className="pt-40 pb-24 min-h-screen bg-[#f8f9fb] flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-white p-16 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] text-center border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Successfully Filed</h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
                        Your pre-assessment questionnaire has been processed. A specialist advisor will review your health profile and contact you within 24 hours.
                    </p>
                    <button onClick={() => window.location.href = '/'} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 group flex items-center justify-center gap-3">
                        Return to Homepage <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    const StepProgress = () => (
        <div className="max-w-3xl mx-auto mb-20 px-6">
            <div className="flex justify-between items-center mb-6 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10" />
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="flex flex-col items-center gap-3 group relative">
                        <div
                            onClick={() => i < step && setStep(i)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all border-2 cursor-pointer ${step === i ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-110' :
                                step > i ? 'bg-slate-900 border-slate-900 text-white' :
                                    'bg-white border-slate-100 text-slate-300'
                                }`}
                        >
                            {step > i ? <CheckCircle2 size={18} /> : i}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] absolute -bottom-6 whitespace-nowrap hidden lg:block ${step >= i ? 'text-slate-900' : 'text-slate-300'}`}>
                            {['Profiles', 'Contact', 'Physique', 'Mental', 'Medical', 'Lifestyle', 'Hazards'][i - 1]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="pt-32 lg:pt-40 pb-24 bg-[#f8f9fb] min-h-screen font-display selection:bg-primary/10">
            <Helmet>
                <title>Client Pre-Assessment Portal | MKWise Financial</title>
                <meta name="description" content="Official advisor portal for insurance pre-consultation assessments." />
            </Helmet>

            <div className="max-w-5xl mx-auto px-6">
                <header className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-2 px-6 rounded-full bg-white text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm border border-slate-100"
                    >
                        Official Advisor Portal
                    </motion.span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-[1.1]">
                        Insurance <br className="lg:hidden" /> <span className="text-primary">Questionnaire</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        High-precision client data collection for tailored protection strategies.
                    </p>
                </header>

                <StepProgress />

                <motion.div
                    layout
                    className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden relative"
                >
                    <div className="h-2 w-full bg-slate-50 relative">
                        <motion.div
                            className="h-full bg-primary"
                            animate={{ width: `${(step / 7) * 100}%` }}
                            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        />
                    </div>

                    <div className="p-10 md:p-20">
                        <AnimatePresence mode="wait">
                            {/* SECTION 1: Personal & Product */}
                            {step === 1 && (
                                <motion.div key="step1" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-16">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shadow-sm">
                                                    <User size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Primary Applicant</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label required>First Name</Label>
                                                    <Input placeholder="Enter first name" name="firstName" value={formData.primaryApplicant.firstName} onChange={handlePrimaryChange} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label required>Surname</Label>
                                                    <Input placeholder="Enter surname" name="lastName" value={formData.primaryApplicant.lastName} onChange={handlePrimaryChange} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label required>Gender</Label>
                                                    <Select name="gender" value={formData.primaryApplicant.gender} onChange={handlePrimaryChange}>
                                                        <option value="">Select Gender</option>
                                                        <option>Male</option><option>Female</option><option>Other</option>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label required>Date of Birth</Label>
                                                    <Input type="date" name="dob" value={formData.primaryApplicant.dob} onChange={handlePrimaryChange} />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label required>Smoking Status</Label>
                                                    <Select name="smokingStatus" value={formData.primaryApplicant.smokingStatus} onChange={handlePrimaryChange}>
                                                        <option value="">Choose profile...</option>
                                                        <option>Non-smoker</option><option>Ex-smoker</option><option>Occasional</option><option>Regular</option><option>Vaping/E-cig</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Users size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Second Applicant</h3>
                                            </div>
                                            <div className="flex p-1.5 bg-slate-50 rounded-2xl gap-2">
                                                <button onClick={() => setFormData({ ...formData, hasSecondApplicant: true })} className={`flex-1 py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${formData.hasSecondApplicant ? 'bg-white text-primary shadow-lg shadow-primary/5' : 'text-slate-400 hover:text-slate-600'}`}>Yes</button>
                                                <button onClick={() => setFormData({ ...formData, hasSecondApplicant: false })} className={`flex-1 py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${!formData.hasSecondApplicant ? 'bg-white text-primary shadow-lg shadow-primary/5' : 'text-slate-400 hover:text-slate-600'}`}>No</button>
                                            </div>

                                            <AnimatePresence>
                                                {formData.hasSecondApplicant && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                            <Input placeholder="First Name" name="firstName" value={formData.secondApplicant.firstName} onChange={handleSecondaryChange} />
                                                            <Input placeholder="Surname" name="lastName" value={formData.secondApplicant.lastName} onChange={handleSecondaryChange} />
                                                            <Select name="gender" value={formData.secondApplicant.gender} onChange={handleSecondaryChange}>
                                                                <option value="">Select Gender</option>
                                                                <option>Male</option><option>Female</option><option>Other</option>
                                                            </Select>
                                                            <Input type="date" name="dob" value={formData.secondApplicant.dob} onChange={handleSecondaryChange} />
                                                            <div className="md:col-span-2">
                                                                <Select name="smokingStatus" value={formData.secondApplicant.smokingStatus} onChange={handleSecondaryChange}>
                                                                    <option value="">Smoking Status</option>
                                                                    <option>Non-smoker</option><option>Ex-smoker</option><option>Occasional</option><option>Regular</option><option>Vaping/E-cig</option>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="space-y-10 pt-16 border-t border-slate-100">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Shield size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Target Coverage</h3>
                                            </div>
                                            <button onClick={addProduct} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-primary transition-all shadow-lg flex items-center gap-2">
                                                <Plus size={14} /> Add Product
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8">
                                            {formData.products.map((p, i) => (
                                                <motion.div layout id={`product-${i}`} key={i} className="group relative p-10 bg-[#fbfcfd] rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                    {i > 0 && (
                                                        <button onClick={() => removeProduct(i)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    )}
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                                                        <div className="md:col-span-4 space-y-2">
                                                            <Label>Policy Type</Label>
                                                            <Select value={p.type} onChange={(e) => handleProductChange(i, 'type', e.target.value)}>
                                                                <option>Life Cover</option><option>Critical Illness Cover</option><option>Income Protection</option><option>Mortgage Protection</option>
                                                            </Select>
                                                        </div>
                                                        <div className="md:col-span-4 space-y-2">
                                                            <Label>Cover Sum (GBP)</Label>
                                                            <div className="relative group">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">£</div>
                                                                <input type="number" placeholder="0.00" value={p.amount} onChange={(e) => handleProductChange(i, 'amount', e.target.value)} className="w-full pl-10 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-black text-slate-900" />
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-4 space-y-2">
                                                            <Label>Term (Years)</Label>
                                                            <div className="relative">
                                                                <input type="number" placeholder="25" value={p.duration} onChange={(e) => handleProductChange(i, 'duration', e.target.value)} className="w-full p-4 pr-12 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-black text-slate-900" />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] font-black uppercase">YRS</span>
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-4 space-y-2">
                                                            <Label>Payment Basis</Label>
                                                            <Select value={p.basis} onChange={(e) => handleProductChange(i, 'basis', e.target.value)}>
                                                                <option>Level</option><option>Decreasing</option><option>Increasing</option>
                                                            </Select>
                                                        </div>
                                                        <div className="md:col-span-4 space-y-2">
                                                            <Label>Applicant Scope</Label>
                                                            <Select value={p.forWhom} onChange={(e) => handleProductChange(i, 'forWhom', e.target.value)}>
                                                                <option>Individual</option><option>Joint</option><option>Family</option>
                                                            </Select>
                                                        </div>
                                                        <div className="md:col-span-4 pb-4">
                                                            <label className="flex items-center gap-4 cursor-pointer">
                                                                <div
                                                                    onClick={() => handleProductChange(i, 'waiverOfPremium', !p.waiverOfPremium)}
                                                                    className={`w-14 h-8 rounded-full p-1 transition-all ${p.waiverOfPremium ? 'bg-primary' : 'bg-slate-200'}`}
                                                                >
                                                                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all transform ${p.waiverOfPremium ? 'translate-x-6' : 'translate-x-0'}`} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waiver of Premium</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 2: Contact */}
                            {step === 2 && (
                                <motion.div key="step2" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-[2rem] flex items-center justify-center shadow-sm"><MapPin size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Location & Reach</h3>
                                            <p className="text-slate-500 font-medium">Verified contact details for formal advisory.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-10 max-w-3xl">
                                        <div className="space-y-3">
                                            <Label required>Permanent Residence</Label>
                                            <textarea name="address" value={formData.contact.address} onChange={handleContactChange} rows="3" className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none font-medium resize-none transition-all placeholder:text-slate-300 shadow-inner overflow-hidden" placeholder="Full legal address including postcode..." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <Label required>Direct Dial Phone</Label>
                                                <Input name="telephone" value={formData.contact.telephone} onChange={handleContactChange} placeholder="+44 7000 000000" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label>Alternative Phone</Label>
                                                <Input name="alternativeTelephone" value={formData.contact.alternativeTelephone} onChange={handleContactChange} placeholder="Work or Home line" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label required>Encrypted Email Address</Label>
                                            <Input type="email" name="email" value={formData.contact.email} onChange={handleContactChange} placeholder="client@legal.com" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 3: Physical & Health Basics */}
                            {step === 3 && (
                                <motion.div key="step3" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-sm"><Activity size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Biometric Profile</h3>
                                            <p className="text-slate-500 font-medium">Physical indicators for risk modeling.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                        <div className="lg:col-span-7 space-y-10">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <Label required>Exact Height</Label>
                                                    <Input placeholder="e.g. 182cm" name="height" value={formData.healthBasics.height} onChange={handleHealthBasicsChange} />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label required>Exact Weight</Label>
                                                    <Input placeholder="e.g. 78kg" name="weight" value={formData.healthBasics.weight} onChange={handleHealthBasicsChange} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label required>Primary Occupation</Label>
                                                <Input placeholder="Current professional role..." name="job" value={formData.healthBasics.job} onChange={handleHealthBasicsChange} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label required>Nicotine/Vape History</Label>
                                                <Select name="smokingHistory" value={formData.healthBasics.smokingHistory} onChange={handleHealthBasicsChange}>
                                                    <option value="">Select current habits...</option>
                                                    <option>Non-smoker</option><option>Ex-smoker</option><option>Smokes occasionally</option><option>Regular smoker</option><option>Uses e-cigarettes / vaping</option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-5 space-y-6 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100">
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                                <Heart className="text-rose-500" size={18} /> Family History
                                            </label>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Select any conditions diagnosed in parents or siblings before age 65.</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['Heart Disease', 'Stroke', 'Diabetes', 'Cancer', 'Multiple Sclerosis', 'Neuro Disorders'].map(condition => (
                                                    <button
                                                        key={condition}
                                                        onClick={() => toggleMultiSelect('healthBasics', 'familyMedicalHistory', condition)}
                                                        className={`p-4 text-left border rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all ${formData.healthBasics.familyMedicalHistory.includes(condition)
                                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {condition}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 4: Mental Health */}
                            {step === 4 && (
                                <motion.div key="step4" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center shadow-sm"><Brain size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Psychological Wellness</h3>
                                            <p className="text-slate-500 font-medium">Mandatory disclosure for mental health coverage.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <Label>In the last 5 years, have you experienced any of the following?</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Depression', 'Anxiety', 'Grief', 'Stress', 'Panic attacks'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('mentalHealth', 'last5Years', m)} className={`px-6 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${formData.mentalHealth.last5Years.includes(m) ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{m}</button>
                                                ))}
                                                <button onClick={() => setFormData({ ...formData, mentalHealth: { ...formData.mentalHealth, last5Years: [] } })} className={`px-6 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${formData.mentalHealth.last5Years.length === 0 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-slate-100 text-slate-400'}`}>None Applied</button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <Label>Lifetime diagnostic history (Schizophrenia, Bipolar, etc.)</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Eating disorder', 'Bipolar disorder', 'Schizophrenia', 'Obsessive Compulsive'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('mentalHealth', 'everHad', m)} className={`px-6 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${formData.mentalHealth.everHad.includes(m) ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{m}</button>
                                                ))}
                                                <button onClick={() => setFormData({ ...formData, mentalHealth: { ...formData.mentalHealth, everHad: [] } })} className={`px-6 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${formData.mentalHealth.everHad.length === 0 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-slate-100 text-slate-400'}`}>No History</button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-slate-100">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-relaxed">Incidents of suicidal ideation or attempts?</label>
                                                <div className="flex gap-4">
                                                    {['Yes', 'No'].map(o => (
                                                        <button key={o} onClick={() => setFormData({ ...formData, mentalHealth: { ...formData.mentalHealth, suicidalThoughts: o } })} className={`flex-1 py-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.mentalHealth.suicidalThoughts === o ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{o}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-relaxed">Incident(s) of self-harming behavior?</label>
                                                <div className="flex gap-4">
                                                    {['Yes', 'No'].map(o => (
                                                        <button key={o} onClick={() => setFormData({ ...formData, mentalHealth: { ...formData.mentalHealth, selfHarm: o } })} className={`flex-1 py-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.mentalHealth.selfHarm === o ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{o}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 5: Medical History (Physical) */}
                            {step === 5 && (
                                <motion.div key="step5" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-sm"><Stethoscope size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Full Medical Archive</h3>
                                            <p className="text-slate-500 font-medium">Historical health data for actuarial review.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <Label>Have you ever been diagnosed with major conditions (Cancer, Stroke, etc.)?</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Cancer', 'Heart attack', 'Stroke', 'Aneurysm', 'Organ failure'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('physicalMedicalHistory', 'everHadSerious', m)} className={`px-6 py-4 rounded-2xl border font-black uppercase text-[9px] tracking-widest transition-all ${formData.physicalMedicalHistory.everHadSerious.includes(m) ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/10' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <Label>Have you ever been diagnosed with chronic conditions (MS, Epilepsy, etc.)?</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Multiple sclerosis', 'Epilepsy', 'HIV', 'Hepatitis', 'Lupus'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('physicalMedicalHistory', 'everHadChronic', m)} className={`px-6 py-4 rounded-2xl border font-black uppercase text-[9px] tracking-widest transition-all ${formData.physicalMedicalHistory.everHadChronic.includes(m) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/10' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <Label>Managed conditions in the last 5 years (Diabetes, BP, Asthma, etc.)</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Raised blood pressure', 'Diabetes', 'Anemia', 'Asthma', 'Long COVID', 'IBS', 'Thyroid'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('physicalMedicalHistory', (['Raised blood pressure', 'Diabetes', 'Anemia'].includes(m) ? 'last5YearsConditions' : 'last5YearsMinor'), m)} className={`px-6 py-4 rounded-2xl border font-black uppercase text-[9px] tracking-widest transition-all ${(formData.physicalMedicalHistory.last5YearsConditions.includes(m) || formData.physicalMedicalHistory.last5YearsMinor.includes(m)) ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-10 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50 space-y-6">
                                            <label className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3">
                                                <AlertCircle size={20} /> High-Risk Symptoms (Last 3 Months)
                                            </label>
                                            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest leading-relaxed">Warning: Immediate disclosure required if any symptoms are current.</p>
                                            <div className="flex flex-wrap gap-3">
                                                {['Breast changes', 'Bowel bleeding', 'Chronic cough', 'Seizures', 'Changing moles', 'Unexplained fatigue'].map(m => (
                                                    <button key={m} onClick={() => toggleMultiSelect('physicalMedicalHistory', 'last3MonthsSymptoms', m)} className={`px-6 py-4 rounded-2xl border font-black uppercase text-[9px] tracking-widest transition-all ${formData.physicalMedicalHistory.last3MonthsSymptoms.includes(m) ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-white border-rose-100/50 text-rose-500 hover:bg-rose-100'}`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 6: Lifestyle & Habits */}
                            {step === 6 && (
                                <motion.div key="step6" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center shadow-sm"><Wine size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Lifestyle Profile</h3>
                                            <p className="text-slate-500 font-medium">Personal habits and recreation risk disclosure.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-16">
                                        <div className="space-y-8">
                                            <Label>Weekly Alcohol Units (Standard Estimates)</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-4 group">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pints of Lager</span>
                                                    <input type="number" value={formData.lifestyle.alcohol.pintsBeer} onChange={(e) => setFormData({ ...formData, lifestyle: { ...formData.lifestyle, alcohol: { ...formData.lifestyle.alcohol, pintsBeer: e.target.value } } })} className="w-24 bg-white border border-slate-200 rounded-2xl p-4 text-center font-black text-xl text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" />
                                                </div>
                                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-4 group">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Wine Glasses</span>
                                                    <input type="number" value={formData.lifestyle.alcohol.glassesWine} onChange={(e) => setFormData({ ...formData, lifestyle: { ...formData.lifestyle, alcohol: { ...formData.lifestyle.alcohol, glassesWine: e.target.value } } })} className="w-24 bg-white border border-slate-200 rounded-2xl p-4 text-center font-black text-xl text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" />
                                                </div>
                                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-4 group">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Single Measures</span>
                                                    <input type="number" value={formData.lifestyle.alcohol.measuresSpirits} onChange={(e) => setFormData({ ...formData, lifestyle: { ...formData.lifestyle, alcohol: { ...formData.lifestyle.alcohol, measuresSpirits: e.target.value } } })} className="w-24 bg-white border border-slate-200 rounded-2xl p-4 text-center font-black text-xl text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-6">
                                                <Label>Historical Substance/Alcohol Related Support</Label>
                                                <div className="space-y-3">
                                                    {['Advised to decrease intake', 'Referral to specialist group', 'Substance use (Last 10yrs)'].map(item => (
                                                        <button key={item} onClick={() => toggleMultiSelect('lifestyle', 'alcoholDrugIssues', item)} className={`w-full p-5 text-left border rounded-2xl flex items-center justify-between group transition-all ${formData.lifestyle.alcoholDrugIssues.includes(item) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/10' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.lifestyle.alcoholDrugIssues.includes(item) ? 'border-white' : 'border-slate-200 group-hover:border-slate-300'}`}>{formData.lifestyle.alcoholDrugIssues.includes(item) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <Label>High-Risk/Extreme Recreation</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Martial arts', 'Motorsports', 'Climbing', 'Aviation', 'Sailing', 'Diving', 'Active Duty'].map(act => (
                                                        <button key={act} onClick={() => toggleMultiSelect('lifestyle', 'highRiskActivities', act)} className={`p-4 text-[9px] font-black uppercase tracking-widest border rounded-2xl transition-all ${formData.lifestyle.highRiskActivities.includes(act) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{act}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16 border-t border-slate-100">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3"><Globe className="text-primary" size={20} /><Label>International Exposure</Label></div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Lived or worked outside the UK/EU in the last 24 months?</p>
                                                <div className="flex p-1 bg-slate-50 rounded-2xl gap-2">
                                                    {['Yes', 'No'].map(o => (
                                                        <button key={o} onClick={() => setFormData({ ...formData, lifestyle: { ...formData.lifestyle, internationalTravel: o } })} className={`flex-1 py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${formData.lifestyle.internationalTravel === o ? 'bg-white text-primary shadow-lg shadow-primary/5' : 'text-slate-400 hover:text-slate-600'}`}>{o}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3"><Shield className="text-primary" size={20} /><Label>Concurrent Insurance</Label></div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Existing active policies or concurrent applications?</p>
                                                <div className="flex p-1 bg-slate-50 rounded-2xl gap-2">
                                                    {['Yes', 'No'].map(o => (
                                                        <button key={o} onClick={() => setFormData({ ...formData, lifestyle: { ...formData.lifestyle, existingInsurance: o } })} className={`flex-1 py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${formData.lifestyle.existingInsurance === o ? 'bg-white text-primary shadow-lg shadow-primary/5' : 'text-slate-400 hover:text-slate-600'}`}>{o}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECTION 7: Occupation Details */}
                            {step === 7 && (
                                <motion.div key="step7" {...PAGE_VARIANTS} transition={TRANSITION} className="space-y-12">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-lg"><Briefcase size={32} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Hazardous Environment</h3>
                                            <p className="text-slate-500 font-medium">Risk factors related to your professional duties.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            'Altitudes > 12m (40ft)',
                                            'Hazardous Flying',
                                            'Heavy Civil Labour',
                                            'Heavy Industrial Machinery',
                                            'Deep Sea/Diving Duties',
                                            'Merchant Marine / Fishing',
                                            'Gas/Oil Production',
                                            'Military Armed Forces',
                                            'Mining/Tunnelling'
                                        ].map(item => (
                                            <div
                                                key={item}
                                                onClick={() => {
                                                    const current = [...formData.occupationDetails];
                                                    const index = current.indexOf(item);
                                                    if (index > -1) current.splice(index, 1);
                                                    else current.push(item);
                                                    setFormData({ ...formData, occupationDetails: current });
                                                }}
                                                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${formData.occupationDetails.includes(item)
                                                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:border-primary/20'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.occupationDetails.includes(item) ? 'border-white bg-white/20' : 'border-slate-200'}`}>
                                                    {formData.occupationDetails.includes(item) && <CheckCircle2 size={16} />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tight leading-snug">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-16 mt-16 border-t border-slate-100 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                                            <ClipboardCheck size={32} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Final Declaration</h4>
                                        <p className="text-slate-400 font-medium leading-relaxed max-w-lg mx-auto text-sm">
                                            I declare that the information provided is full, accurate and complete. I understand that failure to disclose known factors may void future claims.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-[#fcfdfe] px-10 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100">
                        <div className="flex-1">
                            {step > 1 ? (
                                <button onClick={prevStep} className="group text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 hover:text-slate-900 transition-all">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Previous Stage
                                </button>
                            ) : <div />}
                        </div>

                        <div className="flex-[2] flex flex-col items-center">
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-6 flex items-center gap-3 bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl border border-rose-100 max-w-lg">
                                        <AlertCircle size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {step < 7 ? (
                                <button
                                    onClick={nextStep}
                                    className="w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 active:scale-95 group"
                                >
                                    Proceed to Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="w-full md:w-auto bg-primary text-white px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting Data...' : <>Finalize Submission <CheckCircle2 size={18} /></>}
                                </button>
                            )}
                            <p className="mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure 256-bit Encryption Active</p>
                        </div>

                        <div className="flex-1 lg:text-right hidden md:block">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Portal Version 4.2.0</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InsuranceAssessment;

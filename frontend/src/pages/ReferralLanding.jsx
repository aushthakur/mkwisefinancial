import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowRight, ArrowLeft, MessageSquare, Phone, CheckCircle, Home, Shield, Landmark, User, DollarSign, Calendar, FileText } from 'lucide-react';
import logo from '../assets/logo.png';
import { Helmet } from 'react-helmet-async';
import { getApiUrl } from '../config';

const ReferralLanding = () => {
    const { code } = useParams();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // Multi-step questionnaire state
    const [step, setStep] = useState(1); // 1: Service Select, 2: Dynamic Questions, 3: Personal Contact Info
    const [primaryService, setPrimaryService] = useState('');
    
    const [questionnaire, setQuestionnaire] = useState({
        // Mortgage specific fields
        mortgageType: 'First Time Buyer',
        propertyValue: '',
        loanAmount: '',
        depositAmount: '',
        employmentStatus: 'Employed',
        
        // Protection specific fields
        protectionType: 'Life Insurance',
        coverAmount: '',
        policyTerm: '25 Years',
        smokingStatus: 'Non-Smoker',
        
        // General / Other fields
        timeframe: 'As soon as possible',
        additionalNotes: ''
    });

    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        preferredTime: 'Morning (9am - 12pm)'
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const fetchReferral = async () => {
            try {
                const apiUrl = getApiUrl();
                const response = await axios.get(`${apiUrl}/api/referrals/${code}`);
                setReferralData(response.data);
                
                if (response.data.clientName && response.data.clientName !== 'General Client' && response.data.clientName !== 'Valued Client') {
                    setContactForm(prev => ({
                        ...prev,
                        name: response.data.clientName,
                        phone: response.data.clientPhone || ''
                    }));
                }
            } catch (err) {
                console.error('Error fetching referral:', err);
                // Fallback to dynamic template so link never errors out
                const formattedName = code
                    ? code.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    : 'MKWise Partner';
                setReferralData({
                    referrerName: formattedName,
                    referralCode: code,
                    clientName: 'Valued Client'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchReferral();
    }, [code]);

    const handleServiceSelect = (service) => {
        setPrimaryService(service);
        setStep(2);
    };

    const handleQuestionnaireChange = (e) => {
        setQuestionnaire({ ...questionnaire, [e.target.name]: e.target.value });
    };

    const handleContactChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        // Format direct message for advisor
        let detailedMsg = `Primary Interest: ${primaryService}\n`;
        if (primaryService === 'Mortgages') {
            detailedMsg += `Mortgage Sub-Type: ${questionnaire.mortgageType}\nEstimated Property Value: £${questionnaire.propertyValue || 'N/A'}\nDesired Loan: £${questionnaire.loanAmount || 'N/A'}\nDeposit: £${questionnaire.depositAmount || 'N/A'}\nEmployment: ${questionnaire.employmentStatus}\nTimeframe: ${questionnaire.timeframe}\n`;
        } else if (primaryService === 'Protection & Insurance') {
            detailedMsg += `Protection Cover Type: ${questionnaire.protectionType}\nCover Amount: £${questionnaire.coverAmount || 'N/A'}\nTerm: ${questionnaire.policyTerm}\nSmoking Status: ${questionnaire.smokingStatus}\n`;
        }
        if (questionnaire.additionalNotes) {
            detailedMsg += `Notes: ${questionnaire.additionalNotes}\n`;
        }
        detailedMsg += `Preferred Contact Window: ${contactForm.preferredTime}`;

        const payload = {
            name: contactForm.name,
            email: contactForm.email,
            phone: contactForm.phone,
            message: detailedMsg,
            serviceType: `${primaryService} (Referred by ${referralData?.referrerName || code})`,
            referralCode: code,
            metadata: {
                primaryService,
                ...questionnaire,
                preferredContactTime: contactForm.preferredTime,
                referrer: referralData?.referrerName || code
            }
        };

        try {
            const apiUrl = getApiUrl();
            await axios.post(`${apiUrl}/api/contact`, payload);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Submit error:', err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to submit inquiry. Please check your connection and try again.';
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Consultation Portal...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
            <Helmet>
                <title>Personal Invitation from {referralData?.referrerName || 'MKWise Financial'}</title>
                <meta name="description" content={`Get bespoke mortgage and protection advice tailored to your needs. Recommended by ${referralData?.referrerName}.`} />
            </Helmet>

            {/* Header */}
            <nav className="p-4 sm:p-6 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm">
                 <Link to="/">
                     <img src={logo} alt="MKWise Financial" className="h-8 sm:h-10 w-auto" />
                 </Link>
                 <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest border border-blue-100">
                     <ShieldCheck size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">VIP Referral Code:</span> <span className="font-mono text-slate-900">{code}</span>
                 </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-3 sm:p-6 lg:p-12">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl overflow-hidden border border-slate-100">
                    
                    {/* Left: Highlight Sidebar */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-900 p-6 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="inline-block py-1 sm:py-1.5 px-3 sm:px-4 bg-white/10 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-8 border border-white/20">
                                Exclusive Partner Referral
                            </span>
                            
                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
                                {referralData?.referrerName ? (
                                    <>Recommended by <span className="text-blue-200 underline decoration-blue-400 decoration-wavy underline-offset-4 sm:underline-offset-8">{referralData.referrerName}</span></>
                                ) : (
                                    'Tailored Financial Consultation'
                                )}
                            </h1>
                            
                            <p className="text-blue-100 text-xs sm:text-base leading-relaxed mb-6 sm:mb-10 font-medium">
                                Complete our quick 60-second assessment to unlock market-leading rates and personal guidance from a qualified UK financial advisor.
                            </p>

                            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-200 flex-shrink-0">
                                        <Home size={18} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm">Whole of Market Access</h4>
                                        <p className="text-blue-200 text-[11px] sm:text-xs">Comparing 100+ UK lenders</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-200 flex-shrink-0">
                                        <Shield size={18} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm">Comprehensive Cover</h4>
                                        <p className="text-blue-200 text-[11px] sm:text-xs">Life, Illness & Income protection</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 text-[11px] sm:text-xs text-blue-300">
                            🔒 100% Confidential • FCA Regulated Advisory
                        </div>

                        {/* Background Glow */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                    </div>

                    {/* Right: Interactive Multi-Step Form */}
                    <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
                        {!submitted ? (
                            <>
                                {/* Step Indicator */}
                                <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {[1, 2, 3].map((s) => (
                                            <div
                                                key={s}
                                                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                                                    step === s
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                                        : step > s
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {step > s ? '✓' : s}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Step {step} of 3
                                    </span>
                                </div>

                                {/* STEP 1: Select Primary Service */}
                                {step === 1 && (
                                    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2 tracking-tight">
                                                What primary service do you require?
                                            </h2>
                                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                                Select an option below to tailor your inquiry questions.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                                {
                                                    id: 'Mortgages',
                                                    title: 'Mortgages & Home Loans',
                                                    desc: 'First Time Buyer, Remortgage, Buy to Let, Shared Ownership',
                                                    icon: <Home className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                                },
                                                {
                                                    id: 'Protection & Insurance',
                                                    title: 'Personal & Family Protection',
                                                    desc: 'Life Cover, Critical Illness, Income Protection, Building Insurance',
                                                    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                                                },
                                                {
                                                    id: 'Commercial & Financial Planning',
                                                    title: 'Commercial & General Inquiry',
                                                    desc: 'Commercial Mortgages, Equity Release & Financial Planning',
                                                    icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                                }
                                            ].map(item => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleServiceSelect(item.id)}
                                                    className="p-4 sm:p-6 text-left border-2 border-slate-100 hover:border-blue-600 rounded-2xl sm:rounded-3xl transition-all group hover:shadow-xl bg-slate-50/50 hover:bg-white flex items-start gap-3 sm:gap-5 cursor-pointer"
                                                >
                                                    <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform flex-shrink-0">
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-lg group-hover:text-blue-600 transition-colors">
                                                                {item.title}
                                                            </h3>
                                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                        </div>
                                                        <p className="text-slate-500 text-[11px] sm:text-xs font-medium leading-normal">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Service-Specific Relevant Questions */}
                                {step === 2 && (
                                    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                                    {primaryService}
                                                </span>
                                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 mb-0.5 tracking-tight">
                                                    Details about your requirement
                                                </h2>
                                                <p className="text-slate-500 text-[11px] sm:text-xs font-medium">
                                                    Help us prepare the most accurate options before we call.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-50"
                                            >
                                                <ArrowLeft size={14} /> Change
                                            </button>
                                        </div>

                                        {primaryService === 'Mortgages' && (
                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Mortgage Category</label>
                                                    <select
                                                        name="mortgageType"
                                                        value={questionnaire.mortgageType}
                                                        onChange={handleQuestionnaireChange}
                                                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="First Time Buyer">First Time Buyer</option>
                                                        <option value="Remortgage">Remortgaging Existing Property</option>
                                                        <option value="Buy to Let">Buy to Let Investment</option>
                                                        <option value="Shared Ownership">Shared Ownership</option>
                                                        <option value="Bad Credit / Adverse">Bad Credit / Complex Income</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Property Value (£)</label>
                                                        <input
                                                            type="number"
                                                            name="propertyValue"
                                                            placeholder="e.g. 350000"
                                                            value={questionnaire.propertyValue}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Loan Amount Required (£)</label>
                                                        <input
                                                            type="number"
                                                            name="loanAmount"
                                                            placeholder="e.g. 280000"
                                                            value={questionnaire.loanAmount}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Deposit Available (£)</label>
                                                        <input
                                                            type="number"
                                                            name="depositAmount"
                                                            placeholder="e.g. 70000"
                                                            value={questionnaire.depositAmount}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Employment Type</label>
                                                        <select
                                                            name="employmentStatus"
                                                            value={questionnaire.employmentStatus}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            <option value="Employed">Employed (PAYE)</option>
                                                            <option value="Self-Employed">Self-Employed / Company Director</option>
                                                            <option value="Contractor">Contractor / CIS Worker</option>
                                                            <option value="Retired">Retired</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {primaryService === 'Protection & Insurance' && (
                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Protection Type Required</label>
                                                    <select
                                                        name="protectionType"
                                                        value={questionnaire.protectionType}
                                                        onChange={handleQuestionnaireChange}
                                                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="Life Insurance">Life Insurance</option>
                                                        <option value="Critical Illness Cover">Critical Illness Cover</option>
                                                        <option value="Income Protection">Income Protection</option>
                                                        <option value="Mortgage Protection">Mortgage Protection</option>
                                                        <option value="Buildings & Contents">Buildings & Contents Insurance</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Target Cover Amount (£)</label>
                                                        <input
                                                            type="number"
                                                            name="coverAmount"
                                                            placeholder="e.g. 250000"
                                                            value={questionnaire.coverAmount}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Smoking Status</label>
                                                        <select
                                                            name="smokingStatus"
                                                            value={questionnaire.smokingStatus}
                                                            onChange={handleQuestionnaireChange}
                                                            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            <option value="Non-Smoker">Non-Smoker</option>
                                                            <option value="Smoker">Smoker / Vaper</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {primaryService === 'Commercial & Financial Planning' && (
                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Timeframe for Advice</label>
                                                    <select
                                                        name="timeframe"
                                                        value={questionnaire.timeframe}
                                                        onChange={handleQuestionnaireChange}
                                                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="As soon as possible">Immediate / As soon as possible</option>
                                                        <option value="Within 1 month">Within 1 Month</option>
                                                        <option value="Looking for quotes">Just gathering quotes</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Brief Overview of Inquiry</label>
                                                    <textarea
                                                        name="additionalNotes"
                                                        rows="3"
                                                        placeholder="Share any specific details or requirements..."
                                                        value={questionnaire.additionalNotes}
                                                        onChange={handleQuestionnaireChange}
                                                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group"
                                        >
                                            Next: Contact Details <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* STEP 3: Personal & Contact Information */}
                                {step === 3 && (
                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-0.5 tracking-tight">
                                                    Where should we send your quote?
                                                </h2>
                                                <p className="text-slate-500 text-[11px] sm:text-xs font-medium">
                                                    Your lead will be registered directly under referral code <strong className="text-blue-600 font-mono">{code}</strong>.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-50"
                                            >
                                                <ArrowLeft size={14} /> Back
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Full Name *</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={contactForm.name}
                                                onChange={handleContactChange}
                                                placeholder="e.g. Sarah Jenkins"
                                                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Email Address *</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={contactForm.email}
                                                    onChange={handleContactChange}
                                                    placeholder="sarah@example.com"
                                                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Phone Number *</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={contactForm.phone}
                                                    onChange={handleContactChange}
                                                    placeholder="07123 456789"
                                                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Best Time to Call</label>
                                            <select
                                                name="preferredTime"
                                                value={contactForm.preferredTime}
                                                onChange={handleContactChange}
                                                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                                                <option value="Afternoon (12pm - 5pm)">Afternoon (12pm - 5pm)</option>
                                                <option value="Evening (5pm - 8pm)">Evening (5pm - 8pm)</option>
                                            </select>
                                        </div>

                                        {submitError && (
                                            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold">
                                                {submitError}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group disabled:opacity-50"
                                        >
                                            {submitting ? 'Registering Lead & Syncing GHL...' : (
                                                <>
                                                    Submit Confidential Inquiry <CheckCircle size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            /* SUCCESS SCREEN */
                            <div className="text-center py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeIn">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle size={36} className="sm:w-11 sm:h-11" />
                                </div>

                                <div>
                                    <span className="px-3 sm:px-4 py-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-widest rounded-full border border-emerald-200">
                                        Referral Tagged: {code}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3 sm:mt-4 mb-2">Inquiry Confirmed!</h2>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-md mx-auto text-xs sm:text-sm px-2">
                                        Thank you, <strong>{contactForm.name}</strong>. Your consultation request has been registered in our admin system and synced with GoHighLevel under tag <span className="font-mono text-slate-900 font-bold">{code}</span>.
                                    </p>
                                </div>

                                <div className="p-4 sm:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Primary Service:</span>
                                        <strong className="text-slate-900">{primaryService}</strong>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Contact Line:</span>
                                        <strong className="text-slate-900">{contactForm.phone}</strong>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Preferred Window:</span>
                                        <strong className="text-slate-900">{contactForm.preferredTime}</strong>
                                    </div>
                                </div>

                                <div className="pt-2 sm:pt-4">
                                    <Link to="/" className="inline-block w-full sm:w-auto px-8 sm:px-10 py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl">
                                        Return to MKWise Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReferralLanding;

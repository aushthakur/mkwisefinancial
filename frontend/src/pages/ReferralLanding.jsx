import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowRight, MessageSquare, Phone, CheckCircle, Smartphone } from 'lucide-react';
import logo from '../assets/logo.png';
import { Helmet } from 'react-helmet-async';
import { getApiUrl } from '../config';

const ReferralLanding = () => {
    const { code } = useParams();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchReferral = async () => {
            try {
                const apiUrl = getApiUrl();
                const response = await axios.get(`${apiUrl}/api/referrals/${code}`);
                setReferralData(response.data);
                setContactForm(prev => ({
                    ...prev,
                    name: response.data.clientName,
                    phone: response.data.clientPhone,
                    message: `Referred by ${response.data.referrerName}. I'm interested in mortgage/protection advice.`
                }));
            } catch (err) {
                console.error('Error fetching referral:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchReferral();
    }, [code]);

    const handleChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const apiUrl = getApiUrl();
            await axios.post(`${apiUrl}/api/contact`, {
                ...contactForm,
                serviceType: 'Referral Inquiry',
                referralCode: code
            });
            // Update referral status in background or via another endpoint if needed
            setSubmitted(true);
        } catch (err) {
            alert('Failed to send inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Referral Link</h1>
            <p className="text-gray-600 mb-8">This link may have expired or is incorrect.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Go to Homepage</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Helmet>
                <title>You've been referred to MKWise Financial</title>
                <meta name="description" content={`${referralData?.referrerName} has recommended MKWise Financial for your mortgage and protection needs.`} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content="You've been referred to MKWise Financial" />
                <meta property="og:description" content={`${referralData?.referrerName} has recommended MKWise Financial for your mortgage and protection needs.`} />
                <meta property="og:image" content={`${window.location.origin}/og-referral-landing.png`} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={window.location.href} />
                <meta property="twitter:title" content="You've been referred to MKWise Financial" />
                <meta property="twitter:description" content={`${referralData?.referrerName} has recommended MKWise Financial for your mortgage and protection needs.`} />
                <meta property="twitter:image" content={`${window.location.origin}/og-referral-landing.png`} />
            </Helmet>

            <nav className="p-6 bg-white border-b border-gray-100 flex justify-center sm:justify-between items-center">
                 <img src={logo} alt="MKWise" className="h-10 w-auto" />
                 <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                     <ShieldCheck size={16} /> Secure Referral Portal
                 </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    
                    {/* Left: Info Section */}
                    <div className="bg-blue-600 p-8 sm:p-12 text-white flex flex-col">
                        <div className="mb-auto">
                            <span className="inline-block py-1 px-3 bg-white/20 rounded text-[10px] font-bold uppercase tracking-widest mb-6">Personal Invitation</span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
                                Hello {referralData.clientName}, you've been invited.
                            </h1>
                            <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-12">
                                <strong>{referralData.referrerName}</strong> has recommended MKWise Financial to help you find the best mortgage and protection solutions.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-2xl"><MessageSquare className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="font-bold text-lg">Expert Advice</h3>
                                        <p className="text-blue-200 text-sm">Qualified advisors ready to guide you.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-2xl"><Smartphone className="w-6 h-6" /></div>
                                    <div>
                                        <h3 className="font-bold text-lg">Seamless Process</h3>
                                        <p className="text-blue-200 text-sm">Direct access to the whole of the market.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/10">
                            <p className="text-xs text-blue-300 font-medium">Your data is handled securely under our strict privacy protocols.</p>
                        </div>
                    </div>

                    {/* Right: Form Section */}
                    <div className="p-8 sm:p-12 bg-white">
                        {!submitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Call Back</h2>
                                <p className="text-gray-500 text-sm mb-8 font-medium">Confirm your details and our team will be in touch.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={contactForm.name}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-gray-900"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={contactForm.email}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-gray-900"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={contactForm.phone}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-gray-900"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">How can we help?</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={contactForm.message}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-gray-900 resize-none"
                                        />
                                    </div>
                                    
                                    <button
                                        disabled={submitting}
                                        className="w-full bg-blue-600 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group"
                                    >
                                        {submitting ? 'Sending Request...' : (
                                            <>
                                                Book Consultation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12 space-y-8">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <CheckCircle size={48} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Request Sent!</h2>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        Thank you, {contactForm.name}. A senior advisor from MKWise Financial will be in touch on <strong>{contactForm.phone}</strong> shortly.
                                    </p>
                                </div>
                                <Link to="/" className="inline-block px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                                    Back to Home
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReferralLanding;

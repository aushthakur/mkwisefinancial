import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Mapping to backend expected fields (if different)
        const submissionData = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            serviceType: 'Inquiry from Site'
        };

        try {
            const response = await axios.post('http://localhost:5000/api/contact', submissionData);

            if (response.status === 201) {
                setStatus({ type: 'success', message: 'Thank you! Your request for a call back has been received.' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus({ type: 'error', message: 'Connection to advisor failed. Please check your internet or try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] font-display flex flex-col">
            <Helmet>
                <title>Contact Mkwise Financial | Expert Mortgage & Protection Advice</title>
                <meta name="description" content="Speak to a qualified Mkwise Financial advisor today. Free, no-obligation mortgage and protection advice tailored to your goals." />
            </Helmet>
            {/* Minimal Header */}
            <nav className="px-6 py-6 flex justify-between items-center bg-white border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Mkwise Financial Logo" className="h-10 w-auto" />
                </Link>
                <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </nav>

            <main className="flex-grow flex flex-col items-center pt-20 pb-32 px-6">
                <div className="max-w-3xl w-full text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-sm bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        Mortgage & Protection Advisory
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                        Speak to an adviser today.
                    </h1>
                    <p className="text-slate-500 text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
                        Free, no-obligation mortgage and protection advice tailored to your financial goals. Let us help you find the right path forward.
                    </p>
                </div>

                <div className="max-w-2xl w-full bg-white rounded-md shadow-xl border border-gray-100 p-8 lg:p-12">
                    {status.message && (
                        <div className={`mb-8 p-4 rounded-md flex items-center space-x-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.type === 'success' && <CheckCircle size={20} />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#f8f9fb] border border-gray-100 rounded-sm px-4 py-3 text-slate-900 focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#f8f9fb] border border-gray-100 rounded-sm px-4 py-3 text-slate-900 focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#f8f9fb] border border-gray-100 rounded-sm px-4 py-3 text-slate-900 focus:ring-1 focus:ring-primary transition-all outline-none"
                                placeholder="john.doe@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#f8f9fb] border border-gray-100 rounded-sm px-4 py-3 text-slate-900 focus:ring-1 focus:ring-primary transition-all outline-none"
                                placeholder="+44 0000 000000"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">How can we help?</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full bg-[#f8f9fb] border border-gray-100 rounded-sm px-4 py-3 text-slate-900 focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                                placeholder="Tell us about your mortgage or protection requirements..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-md font-bold text-sm tracking-wide hover:bg-blue-800 transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50 cursor-pointer active:scale-95 touch-manipulation"
                        >
                            {loading ? 'Sending...' : (
                                <>
                                    Request a Call Back <span className="material-icons text-sm">play_arrow</span>
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-6 text-[10px] text-slate-400 leading-relaxed text-center">
                        By submitting this form, you agree to our privacy policy and consent to being contacted regarding your enquiry.
                    </p>
                </div>

                {/* Service Icons Footer */}
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-3">
                        <span className="material-icons text-slate-400">verified_user</span>
                        <span className="text-sm font-bold text-slate-600">FCA Regulated</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <span className="material-icons text-slate-400">schedule</span>
                        <span className="text-sm font-bold text-slate-600">Rapid Response</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <span className="material-icons text-slate-400">payments</span>
                        <span className="text-sm font-bold text-slate-600">No Upfront Fees</span>
                    </div>
                </div>

                {/* Sub-footer Legal */}
                <div className="max-w-3xl w-full mt-24 text-center">
                    <div className="flex justify-center gap-6 mb-8 flex-wrap">
                        <Link to="/contact" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/contact" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Cookie Policy</Link>
                        <Link to="/contact" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Terms of Business</Link>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-8">
                        Mkwise Financial is authorised and regulated by the Financial Conduct Authority (FCA). Our registration can be verified on the Financial Services Register under reference number [Placeholder].
                    </p>
                    <div className="bg-slate-50 border border-gray-100 rounded p-6">
                        <p className="text-[10px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Important Risk Warning</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed uppercase">
                            Your home may be repossessed if you do not keep up repayments on your mortgage or any other debt secured on it.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;

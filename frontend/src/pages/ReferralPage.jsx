import React, { useState } from 'react';
import axios from 'axios';
import { Share2, Copy, CheckCircle, ArrowRight, UserPlus, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ReferralPage = () => {
    const [formData, setFormData] = useState({
        referrerName: '',
        referrerPhone: '',
        clientName: '',
        clientPhone: ''
    });
    const [generatedLink, setGeneratedLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/referrals`, formData);
            const link = `${window.location.origin}/referral/${response.data.referralCode}`;
            setGeneratedLink(link);
        } catch (error) {
            console.error('Error generating referral:', error);
            alert('Failed to generate referral link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Refer a Friend | MKWise Financial</title>
                <meta name="description" content="Generate a unique referral link to help your friends and family get expert mortgage and protection advice." />
            </Helmet>

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                        <Share2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Partnership Referral</h1>
                    <p className="text-lg text-gray-600">Generate a secure referral link for your clients or friends.</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 sm:p-12">
                        {!generatedLink ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Referrer Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserPlus className="w-5 h-5 text-blue-500" />
                                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Your Details</h2>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="referrerName"
                                                value={formData.referrerName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                                placeholder="e.g. John Smith"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                name="referrerPhone"
                                                value={formData.referrerPhone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                                placeholder="e.g. 07123 456789"
                                            />
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-green-500" />
                                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Client Details</h2>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Client's Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="clientName"
                                                value={formData.clientName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                                placeholder="e.g. Sarah Jones"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Client's Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                name="clientPhone"
                                                value={formData.clientPhone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                                placeholder="e.g. 07987 654321"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Generating...' : (
                                        <>
                                            Generate Secure Referral Link
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-8 py-4">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Link Generated!</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Copy the link below and share it with <strong>{formData.clientName}</strong>.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                                    <input
                                        readOnly
                                        type="text"
                                        value={generatedLink}
                                        className="flex-1 bg-transparent px-4 py-3 text-sm font-medium text-gray-600 outline-none w-full"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {copied ? <><CheckCircle className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setGeneratedLink('')}
                                    className="text-blue-600 font-bold text-sm hover:underline"
                                >
                                    Generate another referral
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 text-xs px-6 leading-relaxed">
                    <p>By generating this link, you confirm that you have permission to share these details and that the client is expecting a contact from MKWise Financial. Referral codes are tracked for quality and audit purposes.</p>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useModals } from '../context/ModalContext';

const ServiceDetail = ({ title, description, benefits, detailContent, image, serviceType }) => {
    const { openGetStarted } = useModals();
    return (
        <div className="font-display">
            <Helmet>
                <title>{title} | Mkwise Financial</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${title} | Mkwise Financial`} />
                <meta property="og:description" content={description} />
            </Helmet>
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-sm bg-primary/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary/30">
                            {serviceType}
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl">
                            {description}
                        </p>
                        <button
                            onClick={openGetStarted}
                            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded font-semibold transition-all inline-flex items-center gap-2"
                        >
                            Get Expert Advice <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">How we help you with {title}</h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-[1.8]">
                                {detailContent.map((paragraph, index) => (
                                    <p key={index} className="mb-6">{paragraph}</p>
                                ))}
                            </div>

                            <div className="mt-16 bg-[#f8f9fb] p-8 lg:p-12 rounded-xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8">Key Benefits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="text-primary shrink-0" size={20} />
                                            <span className="text-slate-700 font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar CTA */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 bg-slate-900 rounded-2xl p-8 text-white">
                                <h3 className="text-xl font-bold mb-4">Start Your Application</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    Our advisors are ready to search over 150 lenders to find the perfect deal for your circumstances.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <span className="material-icons text-primary">phone</span>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Call our experts</p>
                                            <p className="text-white font-bold">0800 123 4567</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={openGetStarted}
                                        className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-center block transition-all"
                                    >
                                        Request a Call Back
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Why Choose Us?</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="material-icons text-primary text-sm">check_circle</span>
                                            Whole of market access
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="material-icons text-primary text-sm">check_circle</span>
                                            FCA Regulated advisors
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="material-icons text-primary text-sm">check_circle</span>
                                            No upfront broker fees
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-24 bg-[#f8f9fb] border-y border-gray-100 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <span className="material-icons text-primary/20 text-8xl block mb-6 leading-none select-none">format_quote</span>
                    <p className="text-2xl font-bold text-slate-900 leading-relaxed italic mb-8">
                        "We found exactly what we needed. The advice was clear, professional, and ultimately saved us thousands over the term of our deal."
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900">Mark Thompson</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Recent Client</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Risk Warning */}
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-red-50/50 border border-red-100 p-8 rounded-lg text-center">
                        <p className="text-xs font-bold text-red-900 uppercase tracking-widest mb-2">Important Risk Warning</p>
                        <p className="text-sm text-red-700 font-medium uppercase leading-relaxed">
                            Your home may be repossessed if you do not keep up repayments on your mortgage or any other debt secured on it.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceDetail;

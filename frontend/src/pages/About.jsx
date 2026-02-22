import React from 'react';
import { Target, Users, Heart, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <div className="font-inter">
            <Helmet>
                <title>About Mkwise Financial | Expert Mortgage & Protection Advice</title>
                <meta name="description" content="Learn about Mkwise Financial, our mission, values, and why clients trust us for mortgage and protection advice in the UK." />
            </Helmet>
            {/* Header */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6">About Mkwise Financial</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed text-center">
                        We are a dedicated team of mortgage and protection specialists based in the UK, committed to providing transparent, expert advice to help you secure your financial future.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-white" aria-labelledby="our-values">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 id="our-values" className="sr-only">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">To make home ownership accessible and stress-free for everyone with tailored financial advice.</p>
                        </div>

                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Personal Approach</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Every client is unique. We take the time to understand your goals and provide personalized solutions.</p>
                        </div>

                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Integrity First</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Honest, transparent advice is at the core of everything we do. No hidden fees or surprises.</p>
                        </div>

                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Expertise</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Our advisors are fully qualified and stay up-to-date with the latest market trends and products.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/History */}
            <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 mb-16 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10 lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                    <div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-8">Why Choose Us?</h2>
                        <div className="space-y-6">
                            {[
                                "Access to 1000s of mortgage deals across the UK market.",
                                "Fast-track processing for a smooth application journey.",
                                "Dedicated case manager to handle all the paperwork.",
                                "Comprehensive protection review to secure your family's future."
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle size={14} className="text-white" />
                                    </div>
                                    <p className="text-slate-300 italic">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 lg:mt-0 text-center uppercase font-black text-8xl opacity-10 leading-none select-none">
                        INTEGRITY EXPERTISE TRUST
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Ready to find your perfect mortgage?</h2>
                    <p className="text-slate-500 mb-10 font-medium">Our advisors are waiting to help you secure the best deal for your circumstances.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/contact" className="bg-primary hover:bg-blue-800 text-white px-10 py-4 rounded-sm font-bold transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs">
                            Get Free Advice
                        </Link>
                        <Link to="/contact" className="border border-slate-200 text-slate-600 px-10 py-4 rounded-sm font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

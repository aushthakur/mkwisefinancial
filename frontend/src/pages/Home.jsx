import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useModals } from '../context/ModalContext';

const Home = () => {
    const { openGetStarted, openLetsTalk } = useModals();

    return (
        <div className="font-display bg-white min-h-screen">
            <Helmet>
                <title>Mkwise Financial | Expert Mortgage & Protection Advice</title>
                <meta name="description" content="Expert UK mortgage and protection advice. From first-time buyers to remortgaging and life insurance, Mkwise Financial finds you the best deals." />
            </Helmet>
            {/* Hero Section */}
            <header className="relative pt-32 pb-48 overflow-hidden bg-slate-900">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
                    >
                        <source src="/videos/hero-bg.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-400/20">
                            FCA Regulated Advisory
                        </span>
                        <h1 className="text-5xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-10 tracking-tight">
                            Expert Mortgage & <br />
                            <span className="text-blue-400">Protection Advice</span> <br />
                            Tailored to You
                        </h1>
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl font-medium">
                            Navigating the UK market to find your perfect home loan and total financial security. We search the whole of market to find the best rates for your unique circumstances.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={openGetStarted}
                                className="bg-primary hover:bg-blue-700 text-white px-10 py-5 rounded-sm font-bold transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
                            >
                                Get Free Advice
                            </button>
                            <button
                                onClick={openLetsTalk}
                                className="border border-white/30 text-white px-10 py-5 rounded-sm font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                            >
                                Let's Talk
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Trust Row */}
            <section className="bg-white border-y border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">FCA Regulated</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Advisors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <span className="material-icons text-2xl" aria-hidden="true">account_balance</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">150+ UK Lenders</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Extensive Panel Access</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <span className="material-icons text-2xl" aria-hidden="true">public</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">Whole of Market</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Unbiased Selection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Our Specialisms</h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto mb-10"></div>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                            Whether you're stepping onto the ladder or protecting what matters most, we have the expertise to guide you.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: 'First-Time Buyers', icon: 'key', desc: 'Navigate your first purchase with confidence. We explain the process and find the best high-LTV rates.' },
                            { title: 'Remortgaging', icon: 'sync', desc: 'Lower your monthly payments or release equity. We\'ll compare your current deal against the whole market.' },
                            { title: 'Life Protection', icon: 'shield', desc: 'Protect your family and your home. Expert advice on life insurance, critical illness, and income protection.' }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white p-10 border border-gray-100 rounded-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                            >
                                <div className="mb-8 inline-block p-4 bg-primary/5 rounded-sm group-hover:bg-primary transition-colors">
                                    <span className={`material-icons text-primary group-hover:text-white text-3xl`}>{card.icon}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{card.title}</h3>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                                <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group-hover:gap-4 transition-all" to="/mortgages">
                                    Learn more <span className="material-icons text-sm">east</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4-Step Process */}
            <section className="py-32 bg-[#f8f9fb]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-4">
                        <div className="max-w-xl text-left">
                            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">How We Work</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">A straightforward, transparent journey from our first conversation to your completion day.</p>
                        </div>
                        <div className="hidden md:block h-px flex-1 bg-primary/10 mx-16 mb-6"></div>
                        <span className="text-primary font-black text-8xl opacity-10">01-04</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
                        {[
                            { num: '01', title: 'Initial Chat', desc: 'A free, no-obligation discussion about your goals and financial situation.' },
                            { num: '02', title: 'Market Search', desc: 'We scan over 150 lenders to find the specific products that fit your criteria.' },
                            { num: '03', title: 'Application', desc: 'We handle the paperwork and liaise with lenders and solicitors on your behalf.' },
                            { num: '04', title: 'Completion', desc: 'Welcome to your new home. We stay with you until the keys are in your hand.' }
                        ].map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="text-5xl font-black text-primary/10 mb-6 group-hover:text-primary transition-colors">{step.num}</div>
                                <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">{step.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 overflow-hidden bg-white dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-16">Trusted by Families Across the UK</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-xl relative border border-primary/5">
                            <div className="flex gap-1 text-yellow-400 mb-6">
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                            </div>
                            <p className="text-lg italic text-slate-700 dark:text-slate-300 mb-8">
                                "As first-time buyers, we were lost. Mkwise Financial made everything so simple. They found us a rate we couldn't find anywhere else."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                    <img alt="David Richardson" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Q5gKu5NkIFQ1BBvYIxlDxi427w_CYjDSeMh8QMmEZqhzQ16nYZp4eryJUExLp2V1j9XdrDNCoVfZxBA6iYQ6Hp2CyZzJ-a3_d0pVxc2ecU6XyzbNiBZuBfmNVyQ72riA3-nV0Cxoq2YBPNJZOEULqw960jb-h-aw6mENTDknmig-jiN2phrQaj2Vv8Ycfb8RZSsR6oP5F6GWOhsYQM12DREP757H_jt4XdUjs0Jg8LwM7_AICs5XypVnwnVS8KN8SxBXk4JFQgU" />
                                </div>
                                <div>
                                    <p className="font-bold">David Richardson</p>
                                    <p className="text-sm text-slate-500">London Homeowner</p>
                                </div>
                            </div>
                            <span className="material-icons absolute top-10 right-10 text-primary/10 text-6xl text-[inherit]">format_quote</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-xl relative border border-primary/5">
                            <div className="flex gap-1 text-yellow-400 mb-6">
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                                <span className="material-icons text-[inherit]">star</span>
                            </div>
                            <p className="text-lg italic text-slate-700 dark:text-slate-300 mb-8">
                                "Excellent service regarding our life protection policies. Professional, patient and truly understood our family's needs."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                    <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD1-MvVsButea2sdet4RN3yiqiZWNnDNkjbeUClgc79gJCiILBfWHQlnZ0CXsYQJXx_EOp4LIXkKbQITwSbgKimKKUU12bBAXLa9qRkCVSCQsP1wAyH_4KJc10xgsgE_Z7fpEV6ql4rfJy3kWghym4V6C1QEeMUbjK1mP1BhdVSo-Etf7LY2i1mpfVcNpVWw4stvhU9Q_Uy8-9u58A_YzPAgosQa6h9-TzXfN87-MuwKjv5IO2rhyUrW9-9qz8O0EqX26Iu-rBVq0" />
                                </div>
                                <div>
                                    <p className="font-bold">Sarah Jenkins</p>
                                    <p className="text-sm text-slate-500">Protection Client</p>
                                </div>
                            </div>
                            <span className="material-icons absolute top-10 right-10 text-primary/10 text-6xl text-[inherit]">format_quote</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

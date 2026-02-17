import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Heart, Activity, Wallet, Home, Umbrella, Briefcase, Info } from 'lucide-react';

const protectionSolutions = [
    {
        title: 'Life Insurance',
        description: 'Life insurance provides a financial safety net for your loved ones in the event of your death. It can clear the mortgage, replace lost income, and cover funeral costs, ensuring your family can remain in their home without financial hardship.',
        icon: <Heart size={24} />,
        path: '/protection/life-insurance',
        whatItCovers: ['Lump sum death benefit', 'Term or Whole of Life', 'Joint or single policies'],
        whoItsFor: ['Homeowners with dependents', 'Young families', 'Business owners']
    },
    {
        title: 'Critical Illness',
        description: 'A lump sum payment if you are diagnosed with a specified serious illness. This tax-free amount helps cover mortgage payments while you recover, medical treatment, or any necessary home adaptations.',
        icon: <Activity size={24} />,
        path: '/protection/critical-illness',
        whatItCovers: ['Cancer, Stroke, Heart Attack', 'Many more serious conditions', 'Children\'s cover often included'],
        whoItsFor: ['Anyone with a mortgage', 'Self-employed individuals', 'Families without large savings']
    }
];

const ProtectionOverview = () => {
    return (
        <div className="font-display bg-white min-h-screen">
            {/* Hero Section */}
            <header className="relative py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 text-left">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">FCA Regulated Advisory</span>
                        </div>
                        <h1 className="text-5xl lg:text-[5rem] font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
                            Secure Your <br />
                            <span className="text-primary">Financial Resilience</span>
                        </h1>
                        <p className="text-slate-500 text-xl leading-relaxed mb-12 max-w-xl font-medium">
                            We provide expert, independent protection advice tailored to your mortgage and lifestyle. Our goal is to ensure that whatever happens, your home and loved ones remain secure.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/contact" className="bg-primary text-white px-10 py-5 rounded-sm font-bold hover:bg-blue-800 transition-all shadow-2xl shadow-blue-500/30 uppercase tracking-widest text-xs">
                                Get Free Expert Advice
                            </Link>
                            <button className="border border-slate-200 text-slate-600 px-10 py-5 rounded-sm font-bold hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                                Our Providers
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="aspect-[4/5] bg-slate-50 rounded-sm overflow-hidden border border-gray-100 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000"
                                alt="Protection"
                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        {/* Floating Micro-UI */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-sm shadow-2xl border border-gray-100 hidden lg:block">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 rounded-full">
                                    <Shield size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Life Protection</p>
                                    <p className="font-bold text-slate-900">Total Family Security</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Links Nav */}
            <nav className="border-y border-gray-100 bg-white sticky top-[120px] z-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-8 no-scrollbar py-4">
                        {['Life Insurance', 'Critical Illness', 'Income Protection', 'Mortgage Protection', 'Buildings & Contents'].map((item) => (
                            <a key={item} href="#" className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Detailed Services */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
                    {protectionSolutions.map((solution, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col lg:flex-row gap-16 items-start ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="lg:w-1/2">
                                <div className="w-10 h-10 bg-blue-50 text-primary rounded-sm flex items-center justify-center mb-8">
                                    {solution.icon}
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">{solution.title}</h2>
                                <p className="text-slate-500 leading-[1.8] mb-10 text-sm italic">
                                    {solution.description}
                                </p>

                                <div className="grid grid-cols-2 gap-10 mb-10 text-left">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-primary/20 pb-2">What it covers</h4>
                                        <ul className="space-y-3">
                                            {solution.whatItCovers.map(item => (
                                                <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-primary/20 pb-2">Who it's for</h4>
                                        <ul className="space-y-3">
                                            {solution.whoItsFor.map(item => (
                                                <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <Link to={solution.path} className="bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-blue-800 transition-all text-[10px] uppercase tracking-widest">
                                    Get Free Advice <span className="material-icons text-[10px] ml-1">chevron_right</span>
                                </Link>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                <div className="aspect-[16/10] bg-slate-100 rounded-sm overflow-hidden border border-gray-100">
                                    <img
                                        src={index === 0 ? "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000" : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"}
                                        alt={solution.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Provider Footer Banner */}
            <section className="py-16 bg-[#f8f9fb] border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="material-icons text-primary/30">verified</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Working with UK's Leading Providers</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        <p className="font-black text-xl text-slate-700">AVIVA</p>
                        <p className="font-black text-xl text-slate-700">Legal & General</p>
                        <p className="font-black text-xl text-slate-700">Vitality</p>
                        <p className="font-black text-xl text-slate-700">Royal London</p>
                        <p className="font-black text-xl text-slate-700">AIG</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProtectionOverview;

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useModals } from '../context/ModalContext';
import { Key, RotateCcw, Building2, Users, AlertCircle, TrendingUp, Handshake, Landmark, Coins } from 'lucide-react';

const mortgageSolutions = [
    {
        title: 'First Time Buyer',
        description: 'Step onto the property ladder with confidence. We offer expert guidance on schemes and competitive rates for new homeowners.',
        icon: <Key size={24} />,
        path: '/mortgages/first-time-buyer'
    },
    {
        title: 'Remortgaging',
        description: 'Switch your deal to save money or release equity from your home. We analyze the market to find your optimal path.',
        icon: <RotateCcw size={24} />,
        path: '/mortgages/remortgaging'
    },
    {
        title: 'Buy-to-Let',
        description: 'Tailored solutions for property investors. Whether you\'re a first-time landlord or expanding a portfolio.',
        icon: <Building2 size={24} />,
        path: '/mortgages/buy-to-let'
    },
    {
        title: 'Shared Ownership',
        description: 'Specialist advice for partial ownership schemes, helping you buy a share of a home and pay rent on the rest.',
        icon: <Users size={24} />,
        path: '/mortgages/shared-ownership'
    },
    {
        title: 'Bad Credit Mortgages',
        description: 'Expert navigation for complex credit histories. We work with specialist lenders who look beyond the credit score.',
        icon: <AlertCircle size={24} />,
        path: '/mortgages/bad-credit'
    },
    {
        title: 'High Net Worth',
        description: 'Bespoke solutions for larger loans and complex income structures. Personalized and highly professional service.',
        icon: <Landmark size={24} />,
        path: '/mortgages/high-net-worth'
    },
    {
        title: 'Interest-Only',
        description: 'Guidance on interest-only products and repayment strategies for qualifying borrowers.',
        icon: <TrendingUp size={24} />,
        path: '/contact'
    },
    {
        title: 'Commercial',
        description: 'Financing for business premises and commercial investments. Specialized lending for professional growth.',
        icon: <Building2 size={24} />,
        path: '/contact'
    },
    {
        title: 'Equity Release',
        description: 'Unlock the value in your home for later-life planning. Specialist advice for those aged 55 and over.',
        icon: <Coins size={24} />,
        path: '/contact'
    }
];

const MortgageOverview = () => {
    const { openGetStarted } = useModals();
    return (
        <div className="font-display bg-white min-h-screen">
            <Helmet>
                <title>Mortgage Solutions | Mkwise Financial Advice</title>
                <meta name="description" content="Discover unbiased, whole-of-market mortgage solutions. From first-time buyers to equity release, Mkwise Financial finds you the best deals." />
            </Helmet>
            <header className="py-32 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/10">
                        FCA Regulated Advisory
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mt-6 mb-10 tracking-tight">
                        Mortgage Solutions <br />
                        <span className="text-primary italic">Expertly Tailored.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Mkwise Financial provides professional, whole-of-market advice to help you secure the best mortgage terms in the UK market.
                    </p>
                </div>
            </header>

            <section className="pb-32 bg-[#f8f9fb]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mortgageSolutions.map((solution, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.6 }}
                                className="bg-white p-12 rounded-sm border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-primary rounded-sm flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    {solution.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{solution.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-10 flex-grow font-medium">
                                    {solution.description}
                                </p>
                                <button
                                    onClick={openGetStarted}
                                    className="w-full py-4 border border-gray-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all rounded-sm flex items-center justify-center gap-2"
                                >
                                    Speak to an Adviser <span className="material-icons text-sm">east</span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Action Banner */}
            <section className="bg-primary py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-white text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">Ready to start your journey?</h2>
                        <p className="text-blue-100 opacity-80">Get a free, no-obligation initial consultation today.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <div className="bg-white text-primary px-8 py-3 rounded-sm font-bold flex items-center gap-3">
                            <span className="material-icons">phone</span>
                            Call +44-7725839574
                        </div>
                        <button
                            onClick={openGetStarted}
                            className="border border-white/30 text-white px-8 py-3 rounded-sm font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                        >
                            Request Callback
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MortgageOverview;

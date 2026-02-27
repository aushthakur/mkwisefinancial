import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, CheckCircle, Info } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="pt-32 pb-24 bg-white min-h-screen font-display">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Legal Framework
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 font-medium">Last updated: February 2026</p>
                </motion.div>

                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Scale className="text-primary" size={24} />
                            1. Our Advisory Service
                        </h2>
                        <p>
                            Mkwise Financial provides professional mortgage and protection advice. We are an Appointed Representative of Connect IFA Ltd, which is authorised and regulated by the Financial Conduct Authority (FCA).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <CheckCircle className="text-primary" size={24} />
                            2. Scope of Advice
                        </h2>
                        <p>
                            We offer advice based on a comprehensive panel of lenders and insurers. While we cover a significant portion of the market, our services do not constitute "whole of market" coverage as we work within our network's approved panel.
                        </p>
                    </section>

                    <section className="bg-amber-50 p-8 rounded-2xl border border-amber-100 italic">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                            <Info className="text-amber-600" size={20} />
                            Mortgage Risk Warning
                        </h2>
                        <p className="text-slate-900 font-black">
                            YOUR HOME MAY BE REPOSSESSED IF YOU DO NOT KEEP UP REPAYMENTS ON YOUR MORTGAGE OR ANY OTHER DEBT SECURED ON IT.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Gavel className="text-primary" size={24} />
                            3. Fees and Charges
                        </h2>
                        <p>
                            We will provide you with a Key Facts Illustration (KFI) or European Standardised Information Sheet (ESIS) which details the costs associated with any mortgage or protection product we recommend. Any fees payable to Mkwise Financial for our services will be discussed and agreed upon before we proceed with an application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Governing Law</h2>
                        <p>
                            These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of England and Wales.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

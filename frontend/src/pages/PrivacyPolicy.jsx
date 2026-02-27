import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
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
                        Legal Information
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium">Last updated: February 2026</p>
                </motion.div>

                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Shield className="text-primary" size={24} />
                            1. Introduction
                        </h2>
                        <p>
                            At Mkwise Financial, we are committed to protecting and respecting your privacy. This policy explains how we collect, use, and safeguard your personal information in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Eye className="text-primary" size={24} />
                            2. Information We Collect
                        </h2>
                        <p>We may collect and process the following data about you:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Personal identifiers (name, address, date of birth)</li>
                            <li>Contact information (email address, telephone numbers)</li>
                            <li>Financial information (income, expenditure, credit history)</li>
                            <li>Employment details</li>
                            <li>Information about your home and property requirements</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <Lock className="text-primary" size={24} />
                            3. How We Use Your Information
                        </h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Provide mortgage and protection advice tailored to your needs</li>
                            <li>Submit applications to lenders and insurers on your behalf</li>
                            <li>Communicate with you regarding your enquiry</li>
                            <li>Comply with our regulatory obligations as an FCA-regulated firm</li>
                        </ul>
                    </section>

                    <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                            <FileText className="text-primary" size={20} />
                            Data Sharing
                        </h2>
                        <p className="text-sm">
                            As an Appointed Representative of Connect IFA Ltd, we may share your information with our principal firm for compliance and regulatory monitoring purposes. We also share data with lenders, insurers, and other third parties involved in your financial applications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or request the deletion of your personal data. You also have the right to object to processing and the right to data portability. To exercise these rights, please contact our Data Protection Officer at contact@mkwisefinancial.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

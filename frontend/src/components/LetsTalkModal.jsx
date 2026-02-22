import React from 'react';
import { X, Phone, MessageSquare, Calendar, CheckCircle } from 'lucide-react';

const LetsTalkModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[420px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-10 pb-6 text-center border-b border-gray-50">
                    <h2 className="text-4xl font-black text-[#0f172a] mb-3 tracking-tight">Let's Talk</h2>
                    <p className="text-slate-400 text-sm leading-relaxed px-4 font-medium">
                        Our expert advisors are ready to help you navigate your mortgage journey.
                    </p>
                </div>

                <div className="p-8 space-y-4">
                    {/* Call Now */}
                    <a
                        href="tel:+442079460000"
                        className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl group transition-all hover:shadow-xl hover:border-primary/20"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <Phone size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-slate-900 leading-tight">Call Now</p>
                                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">+44 (0) 20 7946 0000</p>
                            </div>
                        </div>
                        <span className="material-icons text-slate-200 text-sm group-hover:text-primary transition-colors">chevron_right</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/442079460000"
                        className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl group transition-all hover:shadow-xl hover:border-primary/20"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                                <MessageSquare size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-slate-900 leading-tight">WhatsApp</p>
                                <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">Chat with an advisor instantly</p>
                            </div>
                        </div>
                        <span className="material-icons text-slate-200 text-sm group-hover:text-primary transition-colors">chevron_right</span>
                    </a>

                    {/* Book a Callback */}
                    <a
                        href="/contact"
                        className="flex items-center justify-between p-6 bg-primary rounded-xl group transition-all shadow-xl shadow-blue-600/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                <Calendar size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-white leading-tight">Book a Callback</p>
                                <p className="text-xs text-blue-100/70 font-bold tracking-tight mt-1">Choose a time that works for you</p>
                            </div>
                        </div>
                        <span className="material-icons text-white/30 text-sm group-hover:text-white transition-colors">chevron_right</span>
                    </a>
                </div>

                <div className="p-8 py-10 bg-slate-50 border-t border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-500/20">
                            <CheckCircle className="text-white" size={14} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-tight">
                            Mkwise Financial is authorized and regulated by the Financial Conduct Authority (FCA). Your home may be repossessed if you do not keep up repayments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetsTalkModal;

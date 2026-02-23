import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { useModals } from '../context/ModalContext';

const StickyBookingButton = () => {
    const { openScheduler } = useModals();

    return (
        <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[55]"
        >
            <button
                onClick={openScheduler}
                className="group relative flex items-center gap-3 md:gap-4 bg-slate-900 text-white py-3.5 md:py-5 pl-5 md:pl-7 pr-4 md:pr-6 rounded-l-[1.5rem] md:rounded-l-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:bg-primary transition-all duration-500 hover:pr-8 md:hover:pr-10 border-l border-t border-b border-white/10 group overflow-hidden"
            >
                {/* Background Animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none"
                />

                <div className="flex flex-col items-start relative z-10">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-white/80 transition-colors mb-0.5 md:mb-1">
                        Consult Now
                    </span>
                    <span className="text-xs md:text-[15px] font-black tracking-tight flex items-center gap-2">
                        Seek a advisor
                        <Sparkles size={12} className="text-primary group-hover:text-white animate-pulse hidden md:block" />
                    </span>
                </div>

                <div className="relative z-10 w-9 h-9 md:w-11 md:h-11 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:scale-110 group-active:scale-95 border border-white/10 group-hover:border-transparent">
                    <Calendar size={18} className="text-white group-hover:text-primary transition-colors md:hidden" />
                    <Calendar size={22} className="text-white group-hover:text-primary transition-colors hidden md:block" />

                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                </div>

                <div className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 relative z-10">
                    <ChevronRight size={18} strokeWidth={3} />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />
            </button>
        </motion.div>
    );
};

export default StickyBookingButton;

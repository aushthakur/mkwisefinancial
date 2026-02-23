import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { useModals } from '../context/ModalContext';

const StickyBookingButton = () => {
    const { openScheduler } = useModals();

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring' }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[55]"
        >
            <button
                onClick={openScheduler}
                className="group relative flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-md text-slate-600 py-2.5 md:py-3 pl-4 md:pl-5 pr-3 md:pr-4 rounded-l-xl md:rounded-l-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:bg-white hover:text-primary transition-all duration-500 border-l border-t border-b border-slate-200/50 overflow-hidden"
            >
                <div className="flex flex-col items-start relative z-10">
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">
                        Consult Now
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold tracking-tight text-slate-700 group-hover:text-primary transition-colors">
                        Seek a advisor
                    </span>
                </div>

                <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 bg-primary/5 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white border border-primary/10">
                    <Calendar size={14} className="md:hidden" />
                    <Calendar size={16} className="hidden md:block" />
                </div>

                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
        </motion.div>
    );
};

export default StickyBookingButton;

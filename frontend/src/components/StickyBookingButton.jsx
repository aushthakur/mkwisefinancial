import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { useModals } from '../context/ModalContext';

const StickyBookingButton = () => {
    const { openScheduler } = useModals();

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[55]"
        >
            <button
                onClick={openScheduler}
                className="group relative flex items-center gap-3 md:gap-4 bg-primary text-white py-3 md:py-4 pl-4 md:pl-6 pr-3 md:pr-4 rounded-l-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-800 transition-all duration-300 hover:pr-6 md:hover:pr-8"
            >
                <div className="flex flex-col items-start">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/70 mb-0.5">Callback</span>
                    <span className="text-xs md:text-sm font-black tracking-tight uppercase md:normal-case">Book</span>
                </div>

                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <Calendar size={18} className="text-white md:hidden" />
                    <Calendar size={20} className="text-white hidden md:block" />
                </div>

                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={16} />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary rounded-l-2xl -z-10 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            </button>
        </motion.div>
    );
};

export default StickyBookingButton;

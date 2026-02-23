import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CalendarDays, Loader2 } from 'lucide-react';

const SchedulerModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const ghlCalendarUrl = import.meta.env.VITE_GHL_CALENDAR_URL || '';

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' },
        visible: {
            opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
            transition: { duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.95, y: 20, filter: 'blur(5px)', transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white w-full max-w-4xl h-full md:h-[85vh] rounded-none md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20 flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <CalendarDays size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">Book a Consultation</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by GoHighLevel</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-900 transition-all p-2 hover:bg-slate-100 rounded-full"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Calendar Iframe Content */}
                <div className="flex-grow relative bg-slate-50">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading Scheduler...</p>
                        </div>
                    )}

                    {ghlCalendarUrl ? (
                        <iframe
                            src={ghlCalendarUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            id="ghl-calendar-embed"
                            onLoad={() => setLoading(false)}
                            title="GoHighLevel Calendar"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                <Sparkles size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-800">Setup Required</h3>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                    Please provide your <strong>GoHighLevel Permanent Link</strong> in the configuration to activate the scheduler.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default SchedulerModal;

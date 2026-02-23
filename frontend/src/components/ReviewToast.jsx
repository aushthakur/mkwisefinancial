import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const REVIEWS = [
    {
        name: "David Richardson",
        text: "Excellent service from Priyadarshi, he got the best deal and made it so simple.",
        rating: 5,
        time: "2 days ago"
    },
    {
        name: "Sarah Jenkins",
        text: "MKWise Financial is brilliant! They maintain a long term relationship with customers.",
        rating: 5,
        time: "1 week ago"
    },
    {
        name: "Amit Patel",
        text: "Priyadarshi gave useful advice about lots of DOs and DONTs. Very friendly.",
        rating: 5,
        time: "3 days ago"
    },
    {
        name: "Michael Thompson",
        text: "Proactive in giving regular updates on finding a right and suitable mortgage.",
        rating: 5,
        time: "5 days ago"
    }
];

const ReviewToast = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
        }, 4000); // Cycle every 4 seconds

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const review = REVIEWS[currentIndex];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } }}
                className="fixed bottom-6 left-6 z-[100] w-[220px] hidden md:block"
            >
                <div className="bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_15px_40px_-12px_rgba(0,0,0,0.15)] border border-white/20 group relative overflow-hidden">
                    {/* Progress Bar */}
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-primary/20"
                    />

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary font-bold text-xs">
                            {review.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{review.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Verified Client</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed line-clamp-2 italic">
                        "{review.text}"
                    </p>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                            <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="G" className="w-2.5 h-2.5" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{review.time}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewToast;

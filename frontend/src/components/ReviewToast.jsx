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
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const review = REVIEWS[currentIndex];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } }}
                className="fixed bottom-24 md:bottom-6 left-4 right-4 md:right-auto md:w-[240px] z-[100]"
            >
                <div className="bg-white/95 backdrop-blur-xl p-3 md:p-3.5 rounded-2xl shadow-[0_15px_40px_-12px_rgba(0,0,0,0.15)] border border-white/20 group relative overflow-hidden">
                    {/* Progress Bar */}
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-0.5 bg-primary/20"
                    />

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-slate-50/50 rounded-full md:bg-transparent"
                    >
                        <X size={12} />
                    </button>

                    {/* Single Line Layout for Mobile, More Compact for Desktop */}
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 md:w-9 h-8 md:h-9 rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary font-bold text-[10px] md:text-xs">
                            {review.name.charAt(0)}
                        </div>

                        <div className="flex-grow min-w-0 pr-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-[10px] md:text-[11px] font-black text-slate-900 truncate">{review.name}</h4>
                                <div className="flex gap-0.5 flex-shrink-0">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={8} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-slate-600 font-semibold leading-tight line-clamp-1 italic">
                                "{review.text}"
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                            <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="G" className="w-2 h-2" />
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{review.time}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewToast;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
    {
        name: "David Richardson",
        role: "Homeowner",
        text: "Excellent service from Priyadarshi, he got the best deal and made it so simple throughout the process. I would highly recommend him.",
        rating: 5,
        initials: "DR"
    },
    {
        name: "Sarah Jenkins",
        role: "Protection Client",
        text: "MKWise Financial is brilliant in their services from start to finish. They don't just provide a one-time service, they maintain a long term relationship with their customers. They are knowledgeable, responsive and acted promptly.",
        rating: 5,
        initials: "SJ"
    },
    {
        name: "Amit Patel",
        role: "BTL Investor",
        text: "Priyadarshi had not only help answering my questions but also given useful advice about lots of DOs and DONTs. Very friendly and helpful people.",
        rating: 5,
        initials: "AP"
    },
    {
        name: "Michael Thompson",
        role: "First Time Buyer",
        text: "It was great and friendly experience with MKWise. Very proactive in giving regular updates on finding a right and suitable mortgage, appreciate the professional work.",
        rating: 5,
        initials: "MT"
    },
    {
        name: "Elena Rodriguez",
        role: "Remortgage Client",
        text: "Professional, patient and truly understood our family's needs regarding our protection policies. Highly recommend for mortgage advice.",
        rating: 5,
        initials: "ER"
    }
];

const ReviewCard = ({ review }) => (
    <div className="flex-shrink-0 w-[350px] mx-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] h-full flex flex-col relative group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
            <Quote className="absolute top-8 right-8 text-primary/5 w-12 h-12 rotate-12 group-hover:text-primary/10 transition-colors" />

            <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
            </div>

            <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-grow italic">
                "{review.text}"
            </p>

            <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                    {review.initials}
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">{review.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{review.role}</p>
                </div>
            </div>
        </div>
    </div>
);

const GoogleReviews = () => {
    const [shuffledReviews, setShuffledReviews] = useState([]);

    useEffect(() => {
        setShuffledReviews([...REVIEWS].sort(() => Math.random() - 0.5));
    }, []);

    if (shuffledReviews.length === 0) return null;

    // Triple the reviews to ensure smooth infinite loop
    const displayReviews = [...shuffledReviews, ...shuffledReviews, ...shuffledReviews];

    return (
        <section className="py-24 overflow-hidden bg-[#fbfcfd] relative">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google" className="w-3 h-3" />
                        Verified Google Reviews
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Trusted by Hundreds of <span className="text-primary">Families</span>
                    </h2>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="flex relative items-center">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fbfcfd] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fbfcfd] to-transparent z-10 pointer-events-none" />

                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-33.33%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex"
                >
                    {displayReviews.map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                <a
                    href="https://share.google/XEmORk9FTEeJRIxaG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors group"
                >
                    View All 150+ Reviews on Google
                    <Quote size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </section>
    );
};

export default GoogleReviews;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ExternalLink, ShieldCheck, Quote } from 'lucide-react';

const REVIEWS = [
    {
        name: "David Richardson",
        role: "Homeowner",
        text: "Excellent service from Priyadarshi, he got the best deal and made it so simple throughout the process. I would highly recommend him.",
        rating: 5,
        initials: "DR",
        date: "2 days ago"
    },
    {
        name: "Sarah Jenkins",
        role: "Protection Client",
        text: "MKWise Financial is brilliant in their services from start to finish. They don't just provide a one-time service, they maintain a long term relationship with their customers.",
        rating: 5,
        initials: "SJ",
        date: "1 week ago"
    },
    {
        name: "Amit Patel",
        role: "BTL Investor",
        text: "Priyadarshi had not only help answering my questions but also given useful advice about lots of DOs and DONTs. Very friendly and helpful people.",
        rating: 5,
        initials: "AP",
        date: "3 days ago"
    },
    {
        name: "Michael Chen",
        role: "First-Time Buyer",
        text: "As a first-time buyer, I was overwhelmed. The team at MKWise made everything clear and found me a rate I couldn't get elsewhere. Outstanding support!",
        rating: 5,
        initials: "MC",
        date: "5 days ago"
    },
    {
        name: "Emma Wilson",
        role: "Remortgage Client",
        text: "Managed to save me over £200 a month on my mortgage switch. The process was entirely stress-free. and the communication was top-notch.",
        rating: 5,
        initials: "EW",
        date: "1 day ago"
    },
    {
        name: "Robert Taylor",
        role: "Homeowner",
        text: "Professional, transparent, and incredibly fast. They really went above and beyond to secure our mortgage under tight deadlines.",
        rating: 5,
        initials: "RT",
        date: "4 days ago"
    }
];

const ReviewCard = ({ review }) => (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] mx-2 md:mx-4 py-6 md:py-8">
        <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-200/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] h-full flex flex-col relative group hover:border-blue-500/30 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] transition-all duration-500">
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#FBBC04] text-[#FBBC04] md:w-4 md:h-4" />
                    ))}
                </div>
                <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google" className="w-4 h-4 md:w-5 md:h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-slate-700 font-medium leading-[1.6] md:leading-[1.8] mb-6 md:mb-10 flex-grow text-[12px] md:text-[15px]">
                "{review.text}"
            </p>

            <div className="flex items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-100">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#4285F4]/10 flex items-center justify-center text-[#4285F4] font-black text-[10px] md:text-sm">
                    {review.initials}
                </div>
                <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-[11px] md:text-[14px] flex items-center gap-1.5 md:gap-2 truncate">
                        {review.name}
                        <ShieldCheck size={12} className="text-blue-500 md:w-3.5 md:h-3.5" />
                    </h4>
                    <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{review.date}</p>
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

    const displayReviews = [...shuffledReviews, ...shuffledReviews, ...shuffledReviews, ...shuffledReviews];

    return (
        <section className="py-16 md:py-32 bg-white relative overflow-hidden">
            {/* GMB Header Style */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-10 md:mb-20 text-center">
                <div className="inline-flex flex-col items-center w-full">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                        <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google" className="w-4 h-4 md:w-5 md:h-5 shadow-sm" />
                        <span className="text-[10px] md:text-xs font-black text-slate-900 tracking-tight uppercase">Business Profile</span>
                    </div>

                    <h2 className="text-3xl md:text-6xl font-black text-slate-950 tracking-tight mb-6 md:mb-8 leading-tight">
                        Our <span className="text-[#4285F4]">Google</span> Presence
                    </h2>

                    <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#f8f9fa] border border-slate-100 shadow-inner">
                        <div className="flex flex-col items-center md:items-start shrink-0">
                            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1">5.0</div>
                            <div className="flex gap-0.5 md:gap-1 mb-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-[#FBBC04] text-[#FBBC04] md:w-5 md:h-5" />
                                ))}
                            </div>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">150+ Verified Reviews</p>
                        </div>

                        <div className="w-full md:w-px h-px md:h-16 bg-slate-200" />

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                            {[
                                { label: "Expertise", score: "5.0" },
                                { label: "Response", score: "5.0" },
                                { label: "Integrity", score: "5.0" }
                            ].map((stat, i) => (
                                <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 md:gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                                    <span className="text-[9px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Infinite Marquee */}
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30,
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

            <div className="mt-10 md:mt-20 text-center px-6">
                <a
                    href="https://share.google/XEmORk9FTEeJRIxaG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3.5 md:py-4 bg-[#f8f9fa] hover:bg-white border border-slate-200 rounded-xl md:rounded-2xl text-[10px] md:text-[12px] font-black text-slate-900 uppercase tracking-[0.1em] transition-all hover:shadow-xl active:scale-95 group w-full md:w-auto justify-center shadow-sm"
                >
                    <MessageSquare size={14} className="text-[#4285F4] md:w-4 md:h-4" />
                    Read all reviews on Google Maps
                    <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity md:w-3.5 md:h-3.5" />
                </a>
            </div>
        </section>
    );
};

export default GoogleReviews;


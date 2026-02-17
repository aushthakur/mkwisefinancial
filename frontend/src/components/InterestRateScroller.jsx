import React from 'react';
import { motion } from 'framer-motion';

const bankRates = [
    { bank: 'HSBC', rate: '4.15%', type: '5-Year Fixed' },
    { bank: 'Barclays', rate: '4.29%', type: '2-Year Fixed' },
    { bank: 'NatWest', rate: '4.24%', type: '5-Year Fixed' },
    { bank: 'Santander', rate: '4.35%', type: 'Variable' },
    { bank: 'Halifax', rate: '4.19%', type: '5-Year Fixed' },
    { bank: 'Nationwide', rate: '4.12%', type: '10-Year Fixed' },
    { bank: 'Lloyds Bank', rate: '4.31%', type: '2-Year Fixed' },
    { bank: 'Virgin Money', rate: '4.27%', type: '5-Year Fixed' },
];

const InterestRateScroller = () => {
    // Duplicate the array to ensure seamless looping
    const duplicatedRates = [...bankRates, ...bankRates];

    return (
        <div className="bg-white border-b border-primary/10 h-10 overflow-hidden flex items-center select-none font-display">
            <div className="shrink-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 h-full flex items-center z-10 shadow-lg">
                Live Rates
            </div>

            <motion.div
                className="flex whitespace-nowrap gap-12"
                initial={{ x: 0 }}
                animate={{ x: '-50%' }}
                transition={{
                    duration: 30,
                    ease: 'linear',
                    repeat: Infinity
                }}
            >
                {duplicatedRates.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 text-xs">
                        <span className="font-bold text-slate-900">{item.bank}</span>
                        <span className="text-primary font-black">{item.rate}</span>
                        <span className="text-slate-400 font-medium uppercase tracking-tighter text-[9px] bg-white px-1.5 py-0.5 rounded-sm border border-gray-100">
                            {item.type}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default InterestRateScroller;

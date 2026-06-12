import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useModals } from '../context/ModalContext';
import { X, Calendar, Clock, Video, ArrowRight, CheckCircle2, Users, Shield } from 'lucide-react';
import GoogleReviews from '../components/GoogleReviews';
import mukeshImg from '../assets/MukeshKumar.png';
import nileshImg from '../assets/NileshRathod.png';
import gurpreetImg from '../assets/GurpreetGupta.png';
import vigneshImg from '../assets/VigneshMohan.png';

const Home = () => {
    const { openGetStarted, openLetsTalk } = useModals();
    const [showWebinarModal, setShowWebinarModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show promotional modal shortly after load
        const timer = setTimeout(() => setShowWebinarModal(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="font-display bg-white min-h-screen">
            <Helmet>
                <title>MKWise Financial | Expert Mortgage & Protection Advice</title>
                <meta name="description" content="Expert UK mortgage and protection advice. From first-time buyers to remortgaging and life insurance, MKWise Financial finds you the best deals." />
            </Helmet>
            {/* Hero Section */}
            <header className="relative pt-32 pb-48 overflow-hidden bg-slate-900">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        poster="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
                    >
                        <source src="/videos/hero-bg.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-400/20">
                            FCA Regulated Advisory
                        </span>
                        <h1 className="text-5xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-10 tracking-tight">
                            Expert Mortgage & <br />
                            <span className="text-blue-400">Protection Advice</span> <br />
                            Tailored to You
                        </h1>
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl font-medium">
                            Navigating the UK market to find your perfect home loan and total financial security. We work with a panel of lenders to find the best rates for your unique circumstances.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={openGetStarted}
                                className="bg-primary hover:bg-blue-700 text-white px-10 py-5 rounded-sm font-bold transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
                            >
                                SEEK AN ADVISOR
                            </button>
                            <button
                                onClick={openLetsTalk}
                                className="border border-white/30 text-white px-10 py-5 rounded-sm font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                            >
                                Let's Talk
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Trust Row */}
            <section className="bg-white border-y border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">FCA Regulated</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Advisors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <span className="material-icons text-2xl" aria-hidden="true">account_balance</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">Panel of Lenders</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Extensive Access</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <span className="material-icons text-2xl" aria-hidden="true">public</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">Expert Advice</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">customer-focused, innovative solutions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Our Specialisms</h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto mb-10"></div>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                            Whether you're stepping onto the ladder or protecting what matters most, we have the expertise to guide you.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: 'First-Time Buyers', icon: 'key', desc: 'Navigate your first purchase with confidence. We explain the process and find the best high-LTV rates.' },
                            { title: 'Remortgaging', icon: 'sync', desc: 'Lower your monthly payments or release equity. We\'ll compare your current deal against a panel of lenders.' },
                            { title: 'Life Protection', icon: 'shield', desc: 'Protect your family and your home. Expert advice on life insurance, critical illness, and income protection.' }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-white p-10 border border-gray-100 rounded-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                            >
                                <div className="mb-8 inline-block p-4 bg-primary/5 rounded-sm group-hover:bg-primary transition-colors">
                                    <span className={`material-icons text-primary group-hover:text-white text-3xl`}>{card.icon}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{card.title}</h3>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                                <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group-hover:gap-4 transition-all" to="/mortgages">
                                    Learn more <span className="material-icons text-sm">east</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4-Step Process */}
            <section className="py-32 bg-[#f8f9fb]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-4">
                        <div className="max-w-xl text-left">
                            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">How We Work</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">A straightforward, transparent journey from our first conversation to your completion day.</p>
                        </div>
                        <div className="hidden md:block h-px flex-1 bg-primary/10 mx-16 mb-6"></div>
                        <span className="text-primary font-black text-8xl opacity-10">01-04</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
                        {[
                            { num: '01', title: 'Initial Chat', desc: 'A free, no-obligation discussion about your goals and financial situation.' },
                            { num: '02', title: 'Market Search', desc: 'We scan our panel of lenders to find the specific products that fit your criteria.' },
                            { num: '03', title: 'Application', desc: 'We handle the paperwork and liaise with lenders and solicitors on your behalf.' },
                            { num: '04', title: 'Completion', desc: 'Welcome to your new home. We stay with you until the keys are in your hand.' }
                        ].map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="text-5xl font-black text-primary/10 mb-6 group-hover:text-primary transition-colors">{step.num}</div>
                                <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">{step.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Google Reviews Testimonials */}
            <GoogleReviews />

            {/* WEBINAR PROMO MODAL — Premium MKWise Brand */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
                .mkw-modal-root { font-family: 'Inter', sans-serif; }
                .mkw-modal-headline { font-family: 'Playfair Display', Georgia, serif; }
                .mkw-modal-gold-bar {
                    height: 3px;
                    background: linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37);
                }
                .mkw-modal-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: rgba(212,175,55,0.15);
                    border: 1px solid rgba(212,175,55,0.35);
                    border-radius: 100px; padding: 5px 14px; margin-bottom: 18px;
                }
                .mkw-modal-badge-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #D4AF37; animation: mkwPulse 1.5s ease-in-out infinite;
                }
                @keyframes mkwPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
                .mkw-modal-badge-text { font-size: 10px; font-weight: 700; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.1em; }
                .mkw-modal-pill {
                    display: flex; align-items: center; gap: 6px;
                    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 7px; padding: 7px 12px; color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 500;
                }
                .mkw-modal-pill svg { color: #D4AF37; width: 13px; height: 13px; }
                .mkw-modal-check { color: #D4AF37; width: 14px; height: 14px; flex-shrink: 0; }
                .mkw-modal-cta {
                    width: 100%; background: #D4AF37; color: #0B1F4D;
                    border: none; border-radius: 9px; padding: 14px 24px;
                    font-size: 13px; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    text-transform: uppercase; letter-spacing: 0.06em;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 6px 24px rgba(212,175,55,0.35); margin-top: 20px;
                }
                .mkw-modal-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,0.5); }
                
                /* Stage */
                .mkw-stage {
                    position: relative;
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                    background: linear-gradient(-45deg, #07142e, #0B1F4D, #1E3A8A, #1D4ED8, #123C8D);
                    background-size: 300% 300%;
                    animation: mkwElectricGlow 8s ease infinite;
                    border-radius: 14px;
                    border: 1.5px solid rgba(59, 130, 246, 0.4);
                    margin-bottom: 16px;
                    box-shadow: 0 0 25px rgba(29, 78, 216, 0.45), inset 0 0 50px rgba(0,0,0,0.6);
                }
                @keyframes mkwElectricGlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .mkw-stage-bg {
                    position: absolute; inset: 0;
                    background-image: 
                        linear-gradient(rgba(29, 78, 216, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(29, 78, 216, 0.15) 1px, transparent 1px);
                    background-size: 20px 20px;
                    opacity: 0.7;
                    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
                }
                .mkw-stage-glow {
                    position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
                    width: 110%; height: 70%;
                    background: radial-gradient(ellipse at bottom, rgba(0, 229, 255, 0.28) 0%, rgba(212, 175, 55, 0.15) 45%, transparent 75%);
                    filter: blur(15px);
                    animation: mkwPulseGlow 4s ease-in-out infinite alternate;
                }
                @keyframes mkwPulseGlow {
                    0% { transform: translateX(-50%) scale(0.92); opacity: 0.7; }
                    100% { transform: translateX(-50%) scale(1.08); opacity: 1; }
                }
                
                /* LIVE badge */
                .mkw-live-badge {
                    position: absolute; top: 12px; left: 12px;
                    display: flex; align-items: center; gap: 5px;
                    background: rgba(220,38,38,0.95); backdrop-filter: blur(4px);
                    border-radius: 100px; padding: 4px 10px; z-index: 40;
                    box-shadow: 0 2px 12px rgba(220,38,38,0.4);
                }
                .mkw-live-dot {
                    width: 6px; height: 6px; background: #fff; border-radius: 50%;
                    animation: mkwLivePulse 1.2s ease-in-out infinite;
                }
                @keyframes mkwLivePulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.5; }
                }
                .mkw-live-text { font-size: 9px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.12em; }
                
                /* Speaker figures */
                .mkw-fig {
                    position: absolute;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                .mkw-fig img {
                    display: block;
                    object-fit: cover;
                    object-position: top center;
                    border: none;
                    background: transparent;
                }
                
                /* Gurpreet — back-left, tilted */
                .mkw-fig-gl {
                    left: 2%;
                    z-index: 10;
                    transform: rotate(-6deg) translateY(8px);
                    transform-origin: bottom center;
                    opacity: 0.85;
                    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(0.85);
                }
                .mkw-fig-gl img { width: 85px; height: 145px; }
                
                /* Vignesh — back-right, tilted */
                .mkw-fig-br {
                    right: 2%;
                    z-index: 10;
                    transform: rotate(6deg) translateY(8px);
                    transform-origin: bottom center;
                    opacity: 0.85;
                    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(0.85);
                }
                .mkw-fig-br img { width: 85px; height: 145px; }
                
                /* Mukesh — front left (prominent/main focal) */
                .mkw-fig-fl {
                    left: 18%;
                    z-index: 30;
                    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.65));
                }
                .mkw-fig-fl img { width: 112px; height: 195px; }
                
                /* Nilesh — front right */
                .mkw-fig-fr {
                    right: 18%;
                    z-index: 20;
                    filter: drop-shadow(0 9px 18px rgba(0,0,0,0.5)) brightness(0.95);
                }
                .mkw-fig-fr img { width: 100px; height: 175px; }
                
                .mkw-modal-dismiss { font-size: 11px; color: rgba(255,255,255,0.3); text-align:center; margin-top:12px; cursor:pointer; }
                .mkw-modal-dismiss:hover { color:rgba(255,255,255,0.6); }
            `}</style>
            <AnimatePresence>
                {showWebinarModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 mkw-modal-root">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowWebinarModal(false)}
                            className="absolute inset-0 bg-[#0B1F4D]/75 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="relative w-full max-w-3xl z-10 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(11,31,77,0.6)]"
                            style={{ background: 'linear-gradient(135deg,#0B1F4D 0%,#123C8D 100%)' }}
                        >
                            {/* Gold top bar */}
                            <div className="mkw-modal-gold-bar" />

                            {/* Close */}
                            <button
                                onClick={() => setShowWebinarModal(false)}
                                className="absolute top-4 right-4 z-50 text-white/40 hover:text-white bg-white/5 hover:bg-white/15 rounded-full p-2 transition-all"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-col md:flex-row">

                                {/* LEFT — Speakers Stage */}
                                <div className="md:w-[42%] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <div>
                                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', marginBottom:12 }}>Your Expert Panel</p>
                                        
                                        {/* Staged composition */}
                                        <div className="mkw-stage">
                                            {/* LIVE badge */}
                                            <div className="mkw-live-badge">
                                                <span className="mkw-live-dot" />
                                                <span className="mkw-live-text">Live</span>
                                            </div>
                                            <div className="mkw-stage-bg" />
                                            <div className="mkw-stage-glow" />
                                            
                                            {/* Gurpreet — back-left, tilted */}
                                            <div className="mkw-fig mkw-fig-gl">
                                                <img src={gurpreetImg} alt="Gurpreet Gupta" />
                                            </div>
                                            
                                            {/* Mukesh — front-left */}
                                            <div className="mkw-fig mkw-fig-fl">
                                                <img src={mukeshImg} alt="Mukesh Kumar" />
                                            </div>
                                            
                                            {/* Nilesh — front-right */}
                                            <div className="mkw-fig mkw-fig-fr">
                                                <img src={nileshImg} alt="Nilesh Rathod" />
                                            </div>
                                            
                                            {/* Vignesh — back-right, tilted */}
                                            <div className="mkw-fig mkw-fig-br">
                                                <img src={vigneshImg} alt="Vignesh Mohan" />
                                            </div>
                                        </div>

                                        {/* Detailed Speaker List below stage */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                                            {[
                                                { name: 'Mukesh Kumar', role: 'Founder, MKWise Financial' },
                                                { name: 'Nilesh Rathod', role: 'Estate & Wills Planning Expert' },
                                                { name: 'Gurpreet Gupta', role: 'Mortgage Advisor' },
                                                { name: 'Vignesh Mohan', role: 'Mortgage Advisor' }
                                            ].map((s, i) => (
                                                <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: i < 2 ? '2px solid #D4AF37' : '2px solid rgba(255,255,255,0.1)' }}>
                                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#fff' }}>{s.name}</div>
                                                    <div style={{ fontSize: '10px', color: i < 2 ? '#D4AF37' : 'rgba(255,255,255,0.5)', fontWeight: '500', marginTop: '1px' }}>{s.role}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Trust note */}
                                    <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6 }}>
                                        <Users style={{ width:13, height:13, color:'#D4AF37', flexShrink:0 }} />
                                        <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontWeight:500 }}>500+ families helped onto the ladder</span>
                                    </div>
                                </div>

                                {/* RIGHT — Content */}
                                <div className="md:w-[58%] p-7 md:p-8 flex flex-col justify-center">
                                    <div className="mkw-modal-badge">
                                        <span className="mkw-modal-badge-dot" />
                                        <span className="mkw-modal-badge-text">Free Live Webinar · 9 July 2026</span>
                                    </div>

                                    <h3 className="mkw-modal-headline" style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:10 }}>
                                        How Young Professionals Can{' '}
                                        <span style={{ color:'#D4AF37' }}>Save For Their First Home</span>{' '}Faster
                                    </h3>

                                    {/* Event pills */}
                                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
                                        <div className="mkw-modal-pill"><Calendar />9 July 2026</div>
                                        <div className="mkw-modal-pill"><Clock />6:00 PM BST</div>
                                        <div className="mkw-modal-pill"><Video />Live on Zoom</div>
                                    </div>

                                    {/* Benefits */}
                                    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:6 }}>
                                        {[
                                            'Property ladder explained simply',
                                            'Save your deposit faster',
                                            'Mortgage preparation strategies',
                                        ].map((t,i)=>(
                                            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>
                                                <CheckCircle2 className="mkw-modal-check" /> {t}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Value */}
                                    <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderLeft:'3px solid #D4AF37', borderRadius:10, padding:'12px 16px' }}>
                                        <div>
                                            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>Value <s>£250</s></div>
                                            <div style={{ fontSize:28, fontWeight:800, color:'#4ade80', lineHeight:1.1 }}>£0</div>
                                        </div>
                                        <div style={{ fontSize:10, background:'rgba(74,222,128,0.15)', color:'#4ade80', borderRadius:6, padding:'3px 10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Completely Free</div>
                                    </div>

                                    <button
                                        className="mkw-modal-cta"
                                        onClick={() => navigate('/register-for-9thjuly')}
                                        id="modal-register-btn"
                                    >
                                        Reserve My Free Seat <ArrowRight style={{ width:17, height:17 }} />
                                    </button>

                                    <div className="mkw-modal-dismiss" onClick={() => setShowWebinarModal(false)}>
                                        No thanks, I'll miss out
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Video, ArrowRight, Home, Shield,
  TrendingUp, Key, ChevronDown, CheckCircle2, Users,
  Star, Award, MessageCircle, MapPin
} from 'lucide-react';
import logo from '../assets/logo.png';
import mukeshImg from '../assets/MukeshKumar.png';
import nileshImg from '../assets/NileshRathod.png';
import gurpreetImg from '../assets/GurpreetGupta.png';
import vigneshImg from '../assets/VigneshMohan.png';

// ─────────────────────────────────────────────
//  Brand tokens
// ─────────────────────────────────────────────
const NAVY  = '#0B1F4D';
const BLUE  = '#123C8D';
const GOLD  = '#D4AF37';

// ─────────────────────────────────────────────
//  Utility: countdown timer
// ─────────────────────────────────────────────
const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// ─────────────────────────────────────────────
//  Countdown Unit — premium card style
// ─────────────────────────────────────────────
const CountUnit = ({ value, label }) => (
  <div className="mkw-count-unit">
    <div className="mkw-count-box">
      <span className="mkw-count-number">{String(value).padStart(2, '0')}</span>
    </div>
    <span className="mkw-count-label">{label}</span>
  </div>
);

// ─────────────────────────────────────────────
//  Registration Form Component
// ─────────────────────────────────────────────
const RegistrationForm = ({ id = 'hero-form' }) => {
  const [form, setForm]           = useState({ firstName: '', email: '', mobile: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      firstName: form.firstName,
      email:     form.email,
      phone:     form.mobile,
      tags:      ['Webinar-9July', 'FirstHome-Webinar'],
      source:    'Webinar Landing Page – 9 July 2026',
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/webinar-register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    } catch (_) {
      // Non-blocking
    }
    window.location.href = '/webinar-confirmed';
  };

  return (
    <form onSubmit={handleSubmit} id={id} className="mkw-form">
      <div className="mkw-input-group">
        <label className="mkw-label">First Name</label>
        <input
          type="text"
          required
          placeholder="Your first name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="mkw-input"
        />
      </div>
      <div className="mkw-input-group">
        <label className="mkw-label">Email Address</label>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mkw-input"
        />
      </div>
      <div className="mkw-input-group">
        <label className="mkw-label">Mobile Number</label>
        <input
          type="tel"
          required
          placeholder="+44 7700 000000"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="mkw-input"
        />
      </div>

      {error && <p className="mkw-error">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mkw-submit-btn"
        id="register-submit-btn"
      >
        {submitting ? (
          <span className="mkw-btn-inner">
            <svg className="mkw-spinner" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Securing Your Seat…
          </span>
        ) : (
          <span className="mkw-btn-inner">
            Reserve My Free Seat <ArrowRight className="mkw-btn-icon" />
          </span>
        )}
      </button>

      <div className="mkw-secure-note">
        <Shield className="mkw-secure-icon" />
        <span>Your information is 100% secure &amp; never shared</span>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────
//  FAQ Item
// ─────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mkw-faq-item${open ? ' mkw-faq-open' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="mkw-faq-trigger"
        aria-expanded={open}
      >
        <span className="mkw-faq-q">{q}</span>
        <span className={`mkw-faq-chevron${open ? ' mkw-faq-chevron-open' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mkw-faq-body"
          >
            <p className="mkw-faq-a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────
export default function WebinarRegistration() {
  const { days, hours, minutes, seconds } = useCountdown('2026-07-09T18:00:00');

  const scrollToForm = () => {
    const el = document.getElementById('hero-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const learns = [
    { icon: <Home className="w-5 h-5" />,         text: 'Property ladder explained — where to start' },
    { icon: <TrendingUp className="w-5 h-5" />,   text: 'Save your deposit faster with proven strategies' },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Mortgage preparation strategies lenders love' },
    { icon: <Key className="w-5 h-5" />,           text: 'Wealth building through property investment' },
    { icon: <Shield className="w-5 h-5" />,        text: 'Common first-time buyer mistakes to avoid' },
    { icon: <MessageCircle className="w-5 h-5" />, text: 'Live expert Q&A — get your questions answered' },
  ];

  const speakers = [
    { img: mukeshImg,  name: 'Mukesh Kumar',   role: 'Founder, MKWise Financial', initials: 'MK' },
    { img: nileshImg,  name: 'Nilesh Rathod',  role: 'Estate & Wills Planning Expert', initials: 'NR' },
    { img: gurpreetImg, name: 'Gurpreet Gupta', role: 'Mortgage Advisor',       initials: 'GG' },
    { img: vigneshImg, name: 'Vignesh Mohan',  role: 'Mortgage Advisor',           initials: 'VM' },
  ];

  const trusts = [
    { icon: <Users className="w-6 h-6" />,        stat: '500+',      label: 'Families Assisted' },
    { icon: <Award className="w-6 h-6" />,         stat: 'FCA',       label: 'Regulated Firm' },
    { icon: <Home className="w-6 h-6" />,          stat: 'Property',  label: 'Planning Experts' },
    { icon: <MessageCircle className="w-6 h-6" />, stat: 'Live',      label: 'Q&A Session' },
  ];

  return (
    <>
      {/* ── INJECTED STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');

        /* ── Reset / Root ── */
        .mkw-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #F8FAFC;
          color: #0B1F4D;
          min-height: 100vh;
          margin: 0;
        }

        /* ── Top announcement bar ── */
        .mkw-topbar {
          background: #0B1F4D;
          padding: 10px 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .mkw-topbar-dot {
          display: flex;
          position: relative;
          width: 8px;
          height: 8px;
        }
        .mkw-topbar-dot span:first-child {
          animation: ping 1s cubic-bezier(0,0,0.2,1) infinite;
          position: absolute;
          display: inline-flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #D4AF37;
          opacity: 0.75;
        }
        .mkw-topbar-dot span:last-child {
          position: relative;
          display: inline-flex;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D4AF37;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .mkw-topbar-text {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .mkw-topbar-text strong {
          color: #D4AF37;
          font-weight: 700;
        }

        /* ── Navbar ── */
        .mkw-nav {
          background: #fff;
          border-bottom: 1px solid #e5e8ef;
          padding: 0 32px;
          height: 72px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(11,31,77,0.06);
        }
        .mkw-nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .mkw-nav-logo img {
          height: 40px;
          width: 40px;
          object-fit: contain;
        }
        .mkw-nav-brand {
          font-size: 17px;
          font-weight: 700;
          color: #0B1F4D;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .mkw-nav-brand span {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: #6b7a99;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .mkw-nav-cta {
          margin-left: auto;
          background: #0B1F4D;
          color: #fff;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
          letter-spacing: 0.01em;
        }
        .mkw-nav-cta:hover { background: #123C8D; }

        /* ── Hero Section ── */
        .mkw-hero {
          background: linear-gradient(135deg, #0B1F4D 0%, #123C8D 60%, #0d2a6b 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 80px 32px;
        }
        .mkw-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
          background-size: 36px 36px;
          pointer-events: none;
        }
        .mkw-hero-glow-1 {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .mkw-hero-glow-2 {
          position: absolute;
          bottom: -300px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(18,60,141,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .mkw-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 1024px) {
          .mkw-hero { padding: 60px 24px 80px; min-height: auto; }
          .mkw-hero-inner { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ── Hero Left ── */
        .mkw-hero-left {}
        .mkw-hero-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .mkw-hero-logo img {
          height: 44px;
          width: 44px;
          object-fit: contain;
          background: #fff;
          border-radius: 10px;
          padding: 6px;
        }
        .mkw-hero-logo-text {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }
        .mkw-hero-logo-text span {
          display: block;
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-top: 1px;
        }
        .mkw-webinar-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 28px;
        }
        .mkw-webinar-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D4AF37;
        }
        .mkw-webinar-badge-text {
          font-size: 11px;
          font-weight: 700;
          color: #D4AF37;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .mkw-hero-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        .mkw-hero-headline em {
          font-style: normal;
          color: #D4AF37;
        }
        .mkw-hero-sub {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.72);
          margin-bottom: 32px;
          max-width: 480px;
          font-weight: 400;
        }
        .mkw-event-details {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 36px;
        }
        .mkw-event-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 8px;
          padding: 8px 14px;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
        }
        .mkw-event-pill svg {
          color: #D4AF37;
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }
        .mkw-value-box {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-left: 3px solid #D4AF37;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 400px;
        }
        .mkw-value-free {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
          white-space: nowrap;
        }
        .mkw-value-free s {
          color: rgba(255,255,255,0.35);
        }
        .mkw-value-price {
          font-size: 36px;
          font-weight: 800;
          color: #4ade80;
          line-height: 1;
        }
        .mkw-value-label {
          font-size: 11px;
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          border-radius: 6px;
          padding: 3px 10px;
          font-weight: 600;
          white-space: nowrap;
        }
        .mkw-trust-bullets {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mkw-trust-bullet {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px;
        }
        .mkw-trust-bullet svg {
          color: #D4AF37;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* ── Hero Right: Form Card ── */
        .mkw-hero-right {}
        .mkw-form-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(11,31,77,0.35), 0 8px 24px rgba(11,31,77,0.2);
          overflow: hidden;
        }
        .mkw-form-card-top {
          background: linear-gradient(90deg, #0B1F4D 0%, #123C8D 100%);
          padding: 28px 32px 24px;
          position: relative;
        }
        .mkw-form-card-top::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37);
        }
        .mkw-form-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .mkw-form-card-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mkw-form-card-subtitle::before {
          content: '●';
          font-size: 8px;
          color: #D4AF37;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .mkw-form-body {
          padding: 28px 32px 32px;
        }

        /* ── Countdown inside form ── */
        .mkw-countdown-wrapper {
          margin-bottom: 24px;
        }
        .mkw-countdown-heading {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7a99;
          text-align: center;
          margin-bottom: 12px;
        }
        .mkw-countdown-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .mkw-count-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .mkw-count-box {
          background: #0B1F4D;
          border-radius: 8px;
          width: 56px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(11,31,77,0.25);
        }
        .mkw-count-number {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .mkw-count-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7a99;
          font-weight: 600;
        }
        .mkw-count-sep {
          font-size: 20px;
          font-weight: 300;
          color: #c5cede;
          margin-bottom: 14px;
        }

        /* ── Form fields ── */
        .mkw-form { display: flex; flex-direction: column; gap: 0; }
        .mkw-input-group { margin-bottom: 14px; }
        .mkw-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #3d4f72;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .mkw-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #dde2ed;
          border-radius: 10px;
          font-size: 14px;
          color: #0B1F4D;
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .mkw-input::placeholder { color: #a0abbe; }
        .mkw-input:focus {
          border-color: #123C8D;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(18,60,141,0.1);
        }
        .mkw-error {
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .mkw-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #0B1F4D 0%, #123C8D 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 15px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(11,31,77,0.35);
          position: relative;
          overflow: hidden;
          margin-top: 4px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .mkw-submit-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37);
        }
        .mkw-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(11,31,77,0.45);
        }
        .mkw-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .mkw-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .mkw-btn-icon { width: 18px; height: 18px; }
        .mkw-spinner { animation: spin 1s linear infinite; width: 18px; height: 18px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mkw-secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 11.5px;
          color: #8a97b5;
        }
        .mkw-secure-icon { width: 13px; height: 13px; color: #8a97b5; }

        /* ── Form card trust badges ── */
        .mkw-form-badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 16px 32px 20px;
          border-top: 1px solid #edf0f7;
          flex-wrap: wrap;
        }
        .mkw-form-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #6b7a99;
        }
        .mkw-form-badge svg { width: 14px; height: 14px; color: #D4AF37; }

        /* ── Trust Strip ── */
        .mkw-trust-strip {
          background: #fff;
          border-bottom: 1px solid #e5e8ef;
          padding: 28px 32px;
        }
        .mkw-trust-strip-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .mkw-trust-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 32px;
          flex: 1;
          min-width: 170px;
          max-width: 240px;
          justify-content: center;
        }
        .mkw-trust-stat + .mkw-trust-stat {
          border-left: 1px solid #e5e8ef;
        }
        @media (max-width: 640px) {
          .mkw-trust-stat + .mkw-trust-stat { border-left: none; border-top: 1px solid #e5e8ef; }
          .mkw-trust-strip-inner { flex-direction: column; }
        }
        .mkw-trust-icon-wrap {
          width: 42px;
          height: 42px;
          background: rgba(11,31,77,0.07);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #0B1F4D;
        }
        .mkw-trust-text-wrap {}
        .mkw-trust-stat-value {
          font-size: 18px;
          font-weight: 800;
          color: #0B1F4D;
          line-height: 1.1;
        }
        .mkw-trust-stat-label {
          font-size: 11px;
          color: #6b7a99;
          font-weight: 500;
          margin-top: 1px;
        }

        /* ── Speakers Section ── */
        .mkw-speakers {
          background: #F8FAFC;
          padding: 96px 32px;
        }
        .mkw-section-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .mkw-section-eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #D4AF37;
          margin-bottom: 12px;
        }
        .mkw-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #0B1F4D;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .mkw-section-sub {
          font-size: 16px;
          color: #6b7a99;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .mkw-speakers-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .mkw-speakers-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .mkw-speakers-grid { grid-template-columns: 1fr; }
        }
        .mkw-speaker-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(11,31,77,0.08);
          border: 1px solid #edf0f7;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .mkw-speaker-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(11,31,77,0.14);
        }
        .mkw-speaker-img-wrap {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: linear-gradient(135deg, #e8edf7, #d0d8ee);
          position: relative;
        }
        .mkw-speaker-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .mkw-speaker-info {
          padding: 18px 20px 20px;
          border-top: 3px solid #D4AF37;
        }
        .mkw-speaker-name {
          font-size: 15px;
          font-weight: 700;
          color: #0B1F4D;
          margin-bottom: 3px;
        }
        .mkw-speaker-role {
          font-size: 12px;
          color: #6b7a99;
          font-weight: 500;
        }

        /* ── Learn Section ── */
        .mkw-learn {
          background: #0B1F4D;
          padding: 96px 32px;
        }
        .mkw-learn .mkw-section-title { color: #fff; }
        .mkw-learn .mkw-section-sub { color: rgba(255,255,255,0.6); }
        .mkw-learn-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .mkw-learn-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .mkw-learn-grid { grid-template-columns: 1fr; }
        }
        .mkw-learn-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: background 0.2s, border-color 0.2s;
        }
        .mkw-learn-card:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(212,175,55,0.35);
        }
        .mkw-learn-icon {
          width: 40px;
          height: 40px;
          background: rgba(212,175,55,0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          flex-shrink: 0;
        }
        .mkw-learn-text {
          font-size: 14.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          line-height: 1.5;
          padding-top: 9px;
        }

        /* ── FAQ Section ── */
        .mkw-faq-section {
          background: #F8FAFC;
          padding: 96px 32px;
        }
        .mkw-faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mkw-faq-item {
          background: #fff;
          border: 1.5px solid #e5e8ef;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .mkw-faq-open {
          border-color: #123C8D;
          box-shadow: 0 4px 16px rgba(18,60,141,0.1);
        }
        .mkw-faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .mkw-faq-q {
          font-size: 15px;
          font-weight: 600;
          color: #0B1F4D;
          line-height: 1.4;
        }
        .mkw-faq-chevron {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #F8FAFC;
          color: #6b7a99;
          flex-shrink: 0;
          transition: transform 0.3s, background 0.2s, color 0.2s;
        }
        .mkw-faq-chevron-open {
          transform: rotate(180deg);
          background: #0B1F4D;
          color: #fff;
        }
        .mkw-faq-body { overflow: hidden; }
        .mkw-faq-a {
          padding: 0 24px 20px;
          font-size: 14px;
          color: #6b7a99;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Final CTA ── */
        .mkw-cta {
          background: linear-gradient(135deg, #0B1F4D 0%, #123C8D 100%);
          padding: 96px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .mkw-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
          background-size: 32px 32px;
        }
        .mkw-cta-inner {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .mkw-cta-eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #D4AF37;
          margin-bottom: 16px;
        }
        .mkw-cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .mkw-cta-title em { font-style: normal; color: #D4AF37; }
        .mkw-cta-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .mkw-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #D4AF37;
          color: #0B1F4D;
          border: none;
          border-radius: 10px;
          padding: 16px 40px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(212,175,55,0.4);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .mkw-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(212,175,55,0.5);
        }

        /* ── Footer ── */
        .mkw-footer {
          background: #07142e;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 36px 32px;
          text-align: center;
        }
        .mkw-footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .mkw-footer-logo img { height: 28px; width: 28px; object-fit: contain; opacity: 0.6; }
        .mkw-footer-legal {
          font-size: 11.5px;
          color: rgba(255,255,255,0.35);
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Mobile sticky CTA ── */
        .mkw-mobile-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: #fff;
          border-top: 1px solid #e5e8ef;
          padding: 12px 20px;
          box-shadow: 0 -4px 20px rgba(11,31,77,0.12);
        }
        @media (max-width: 1024px) {
          .mkw-mobile-cta { display: block; }
          .mkw-hero { padding-bottom: 100px; }
        }
        .mkw-mobile-cta-btn {
          width: 100%;
          background: linear-gradient(135deg, #0B1F4D, #123C8D);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ── Divider line ── */
        .mkw-gold-divider {
          height: 4px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          border: none;
          margin: 0;
        }

        /* ── Animations ── */
        @media (prefers-reduced-motion: no-preference) {
          .mkw-fade-up { opacity: 0; transform: translateY(24px); }
          .mkw-fade-up.mkw-visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease, transform 0.6s ease; }
        }

        /* ── Responsive navbar ── */
        @media (max-width: 640px) {
          .mkw-nav { padding: 0 16px; }
          .mkw-nav-cta { display: none; }
          .mkw-speakers { padding: 64px 16px; }
          .mkw-learn { padding: 64px 16px; }
          .mkw-faq-section { padding: 64px 16px; }
          .mkw-cta { padding: 64px 16px; }
          .mkw-hero-left { padding-top: 8px; }
          .mkw-value-box { max-width: 100%; padding: 14px 18px; gap: 12px; }
          .mkw-value-price { font-size: 28px; }
          .mkw-value-label { font-size: 10px; }
          .mkw-form-body { padding: 20px; }
          .mkw-form-card-top { padding: 22px 20px 20px; }
          .mkw-topbar { padding: 6px 12px; }
          .mkw-topbar-text { font-size: 10.5px; line-height: 1.45; }
          .mkw-hero-headline { font-size: clamp(1.75rem, 5vw, 2.75rem); line-height: 1.2; }
          .mkw-hero-sub { font-size: 14.5px; line-height: 1.6; margin-bottom: 24px; }
          .mkw-event-details { gap: 12px; margin-bottom: 24px; }
          .mkw-event-pill { padding: 6px 10px; font-size: 12px; }
          .mkw-trust-bullets { margin-top: 20px; gap: 8px; }
          .mkw-trust-bullet { font-size: 12.5px; }
        }
        @media (max-width: 360px) {
          .mkw-countdown-row { gap: 4px; }
          .mkw-count-box { width: 46px; height: 42px; }
          .mkw-count-number { font-size: 17px; }
          .mkw-count-sep { font-size: 14px; margin-bottom: 12px; }
        }
      `}</style>

      <div className="mkw-root">
        <Helmet>
          <title>Free First Home Webinar | MKWise Financial</title>
          <meta name="description" content="Join MKWise Financial's free webinar and learn how young professionals can save for their first home — mortgage, deposit and property strategies from industry experts." />
        </Helmet>

        {/* ── THIN ANNOUNCEMENT BAR ── */}
        <div className="mkw-topbar" style={{ padding: '7px 16px' }}>
          <div className="mkw-topbar-dot">
            <span></span>
            <span></span>
          </div>
          <p className="mkw-topbar-text">
            FREE LIVE WEBINAR · 9 July 2026 at 6:00 PM BST ·{' '}
            <strong>Limited Seats — Register Now</strong>
          </p>
        </div>

        {/* ── HERO SECTION ── */}
        <section className="mkw-hero" id="hero">
          <div className="mkw-hero-glow-1" />
          <div className="mkw-hero-glow-2" />

          <div className="mkw-hero-inner">
            {/* LEFT */}
            <motion.div
              className="mkw-hero-left"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75 }}
            >
              {/* Logo */}
              <div className="mkw-hero-logo">
                <img src={logo} alt="MKWise Financial" />
                <div className="mkw-hero-logo-text">
                  MKWise Financial
                  <span>Mortgage &amp; Property Advisers</span>
                </div>
              </div>

              {/* Webinar badge */}
              <div className="mkw-webinar-badge">
                <span className="mkw-webinar-badge-dot" />
                <span className="mkw-webinar-badge-text">Free Live Webinar · 9 July 2026</span>
              </div>

              {/* Headline */}
              <h1 className="mkw-hero-headline">
                How Young Professionals Can{' '}
                <em>Save For Their First Home</em> Faster
              </h1>

              {/* Sub */}
              <p className="mkw-hero-sub">
                Learn practical mortgage, deposit and property strategies from industry experts helping first-time buyers get on the property ladder sooner.
              </p>

              {/* Event details */}
              <div className="mkw-event-details">
                <div className="mkw-event-pill">
                  <Calendar /> 9 July 2026
                </div>
                <div className="mkw-event-pill">
                  <Clock /> 6:00 PM BST
                </div>
                <div className="mkw-event-pill">
                  <Video /> Live on Zoom
                </div>
                <div className="mkw-event-pill">
                  <MapPin /> Free to Attend
                </div>
              </div>

              {/* Value box */}
              <div className="mkw-value-box">
                <div>
                  <div className="mkw-value-free">Registration Value <s>£250</s></div>
                  <div className="mkw-value-price">£0</div>
                </div>
                <div className="mkw-value-label">Completely Free</div>
              </div>

              {/* Trust bullets */}
              <div className="mkw-trust-bullets">
                <div className="mkw-trust-bullet">
                  <CheckCircle2 /> 500+ families already on the property ladder through MKWise
                </div>
                <div className="mkw-trust-bullet">
                  <CheckCircle2 /> Expert panel of mortgage, property and estate specialists
                </div>
                <div className="mkw-trust-bullet">
                  <CheckCircle2 /> Live Q&A — get your personal questions answered
                </div>
              </div>
            </motion.div>

            {/* RIGHT — form card */}
            <motion.div
              className="mkw-hero-right"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
            >
              <div className="mkw-form-card">
                {/* Card header */}
                <div className="mkw-form-card-top">
                  <div className="mkw-form-card-title">Reserve Your Free Seat</div>
                  <div className="mkw-form-card-subtitle">Limited Seats Available — Filling Fast</div>
                </div>

                <div className="mkw-form-body">
                  {/* Countdown inside card */}
                  <div className="mkw-countdown-wrapper">
                    <div className="mkw-countdown-heading">Webinar starts in</div>
                    <div className="mkw-countdown-row">
                      <CountUnit value={days} label="Days" />
                      <span className="mkw-count-sep">:</span>
                      <CountUnit value={hours} label="Hours" />
                      <span className="mkw-count-sep">:</span>
                      <CountUnit value={minutes} label="Mins" />
                      <span className="mkw-count-sep">:</span>
                      <CountUnit value={seconds} label="Secs" />
                    </div>
                  </div>

                  {/* Form */}
                  <RegistrationForm id="hero-form" />
                </div>

                {/* Trust badges below form */}
                <div className="mkw-form-badges">
                  <div className="mkw-form-badge">
                    <Shield /> Secure &amp; Private
                  </div>
                  <div className="mkw-form-badge">
                    <Award /> FCA Regulated
                  </div>
                  <div className="mkw-form-badge">
                    <Star /> 500+ Families
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <div className="mkw-trust-strip">
          <div className="mkw-trust-strip-inner">
            {trusts.map((t, i) => (
              <div className="mkw-trust-stat" key={i}>
                <div className="mkw-trust-icon-wrap">{t.icon}</div>
                <div className="mkw-trust-text-wrap">
                  <div className="mkw-trust-stat-value">{t.stat}</div>
                  <div className="mkw-trust-stat-label">{t.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="mkw-gold-divider" />

        {/* ── SPEAKERS SECTION ── */}
        <section className="mkw-speakers">
          <div className="mkw-section-header">
            <div className="mkw-section-eyebrow">Your Expert Panel</div>
            <h2 className="mkw-section-title">Meet Your Speakers</h2>
            <p className="mkw-section-sub">
              Industry specialists bringing you real-world insight from the UK mortgage and property market.
            </p>
          </div>

          <div className="mkw-speakers-grid">
            {speakers.map((s, i) => (
              <motion.div
                key={i}
                className="mkw-speaker-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="mkw-speaker-img-wrap">
                  <img src={s.img} alt={s.name} />
                </div>
                <div className="mkw-speaker-info">
                  <div className="mkw-speaker-name">{s.name}</div>
                  <div className="mkw-speaker-role">{s.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="mkw-gold-divider" />

        {/* ── WHAT YOU'LL LEARN ── */}
        <section className="mkw-learn">
          <div className="mkw-section-header">
            <div className="mkw-section-eyebrow" style={{ color: '#D4AF37' }}>Webinar Curriculum</div>
            <h2 className="mkw-section-title">What You Will Learn</h2>
            <p className="mkw-section-sub">
              Everything you need to know, packed into one powerful live session.
            </p>
          </div>

          <div className="mkw-learn-grid">
            {learns.map((l, i) => (
              <motion.div
                key={i}
                className="mkw-learn-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <div className="mkw-learn-icon">{l.icon}</div>
                <span className="mkw-learn-text">{l.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="mkw-gold-divider" />

        {/* ── FAQ SECTION ── */}
        <section className="mkw-faq-section">
          <div className="mkw-section-header">
            <div className="mkw-section-eyebrow">Common Questions</div>
            <h2 className="mkw-section-title">Got Questions?</h2>
            <p className="mkw-section-sub">Everything you need to know before registering.</p>
          </div>
          <div className="mkw-faq-list">
            <FAQItem
              q="Is the webinar really free?"
              a="Yes, 100% free. There is no cost to attend. Simply register to secure your spot."
            />
            <FAQItem
              q="Will there be a replay?"
              a="We plan to send a replay, but attending live gives you the chance to ask our experts direct questions during the Q&A."
            />
            <FAQItem
              q="Who is this webinar for?"
              a="Ideal for young professionals, renters, and first-time buyers who feel priced out or confused by the property market."
            />
            <FAQItem
              q="How do I join on the day?"
              a="After registering, you'll receive a unique Zoom link via email. Click it at 6:00 PM on 9 July 2026."
            />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="mkw-cta">
          <div className="mkw-cta-inner">
            <div className="mkw-cta-eyebrow">Take The First Step</div>
            <h2 className="mkw-cta-title">
              Stop Renting.{' '}
              <em>Start Owning.</em>
            </h2>
            <p className="mkw-cta-sub">
              Join the webinar and take your first definitive step towards owning your home. Our experts are ready to guide you.
            </p>
            <button
              className="mkw-cta-btn"
              onClick={scrollToForm}
              id="footer-cta-btn"
            >
              Reserve My Free Seat <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mkw-footer">
          <div className="mkw-footer-logo">
            <img src={logo} alt="MKWise" />
          </div>
          <p className="mkw-footer-legal">
            MKWise Financial is a trading name of [Company Name]. Registered in England &amp; Wales.
            Your home may be repossessed if you do not keep up repayments on your mortgage.
          </p>
        </footer>

        {/* ── MOBILE STICKY CTA ── */}
        <div className="mkw-mobile-cta">
          <button
            className="mkw-mobile-cta-btn"
            onClick={scrollToForm}
            id="mobile-sticky-cta"
          >
            Reserve My Free Seat <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </>
  );
}

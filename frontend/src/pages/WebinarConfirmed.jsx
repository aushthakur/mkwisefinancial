import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Video, CheckCircle2, CalendarPlus,
  ArrowLeft, MessageCircleQuestion, Share2
} from 'lucide-react';
import logo from '../assets/logo.png';
import mukeshImg from '../assets/MukeshKumar.png';
import nileshImg from '../assets/NileshRathod.png';
import gurpreetImg from '../assets/GurpreetGupta.png';
import vigneshImg from '../assets/VigneshMohan.png';

const googleCalendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=First+Home+Masterclass&dates=20260709T170000Z/20260709T180000Z&details=Your+exclusive+Zoom+link+will+be+sent+to+your+email.+Get+ready+to+learn+how+to+buy+your+first+home!&location=Online+via+Zoom';

export default function WebinarConfirmed() {
  const speakers = [
    { name: 'Mukesh Kumar',   role: 'Founder, MKWise Financial', img: mukeshImg  },
    { name: 'Nilesh Rathod',  role: 'Estate & Wills Planning Expert', img: nileshImg  },
    { name: 'Gurpreet Gupta',  role: 'Mortgage Advisor',       img: gurpreetImg },
    { name: 'Vignesh Mohan',  role: 'Mortgage Advisor',           img: vigneshImg  },
  ];

  const nextSteps = [
    { icon: <CalendarPlus className="wc-step-icon" />, title: 'Add to Your Calendar', desc: "Block out 9 July at 6:00 PM so you don't miss it." },
    { icon: <MessageCircleQuestion className="wc-step-icon" />, title: 'Prepare Your Questions', desc: "Write down anything you want to ask our experts in the live Q&A." },
    { icon: <Share2 className="wc-step-icon" />, title: 'Invite a Friend', desc: "Know someone who'd benefit? Forward them the registration link." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');

        .wc-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          margin: 0;
        }

        /* ── Thin topbar ── */
        .wc-topbar {
          background: #0B1F4D;
          padding: 7px 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .wc-topbar-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #D4AF37;
          flex-shrink: 0;
          animation: wcPulse 1.5s ease-in-out infinite;
        }
        @keyframes wcPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .wc-topbar-text { color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 500; }
        .wc-topbar-text strong { color: #D4AF37; }

        /* ── Gold divider ── */
        .wc-gold-bar {
          height: 4px;
          background: linear-gradient(90deg, #0B1F4D, #D4AF37, #0B1F4D);
        }

        /* ── Page wrapper ── */
        .wc-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 52px 24px 80px;
        }

        /* ── Logo row ── */
        .wc-logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        .wc-logo-img {
          height: 38px; width: 38px;
          object-fit: contain;
          background: #fff;
          border-radius: 10px;
          padding: 6px;
          box-shadow: 0 2px 10px rgba(11,31,77,0.12);
        }
        .wc-logo-text {
          font-size: 15px;
          font-weight: 700;
          color: #0B1F4D;
          line-height: 1.1;
        }
        .wc-logo-text span {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: #6b7a99;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── Confirmation card ── */
        .wc-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(11,31,77,0.1);
          border: 1px solid #edf0f7;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .wc-card-top {
          background: linear-gradient(135deg, #0B1F4D 0%, #123C8D 100%);
          padding: 36px 36px 32px;
          text-align: center;
          position: relative;
        }
        .wc-card-top::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37);
        }
        .wc-success-ring {
          width: 72px; height: 72px;
          background: rgba(212,175,55,0.15);
          border: 2px solid rgba(212,175,55,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .wc-success-ring svg { width: 32px; height: 32px; color: #D4AF37; }
        .wc-confirmed-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(74,222,128,0.15);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 100px;
          padding: 4px 14px;
          margin-bottom: 16px;
        }
        .wc-confirmed-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: wcPulse 1.5s ease-in-out infinite;
        }
        .wc-confirmed-badge-text {
          font-size: 10px; font-weight: 700;
          color: #4ade80; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .wc-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .wc-headline em { font-style: normal; color: #D4AF37; }
        .wc-subtext {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Event details strip ── */
        .wc-event-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #edf0f7;
        }
        @media (max-width: 500px) {
          .wc-event-strip { grid-template-columns: 1fr; }
          .wc-event-cell + .wc-event-cell { border-left: none; border-top: 1px solid #edf0f7; }
        }
        .wc-event-cell {
          padding: 20px 16px;
          text-align: center;
          border-left: 1px solid #edf0f7;
        }
        .wc-event-cell:first-child { border-left: none; }
        .wc-event-icon { color: #D4AF37; width: 20px; height: 20px; margin: 0 auto 8px; }
        .wc-event-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9aa5be; margin-bottom: 3px; }
        .wc-event-val { font-size: 14px; font-weight: 700; color: #0B1F4D; }

        /* ── Calendar button ── */
        .wc-cal-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: calc(100% - 48px);
          margin: 24px auto 0;
          background: #0B1F4D;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: background 0.2s, transform 0.2s;
          box-shadow: 0 4px 16px rgba(11,31,77,0.2);
          margin-bottom: 24px;
        }
        .wc-cal-btn:hover { background: #123C8D; transform: translateY(-2px); }
        .wc-cal-btn svg { width: 16px; height: 16px; }

        /* ── Next steps ── */
        .wc-steps-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #edf0f7;
          box-shadow: 0 4px 20px rgba(11,31,77,0.06);
          padding: 28px;
          margin-bottom: 24px;
        }
        .wc-steps-title {
          font-size: 13px;
          font-weight: 700;
          color: #0B1F4D;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wc-steps-title svg { width: 16px; height: 16px; color: #D4AF37; }
        .wc-steps-list { display: flex; flex-direction: column; gap: 16px; }
        .wc-step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          background: #F8FAFC;
          border-radius: 10px;
          border: 1px solid #edf0f7;
          transition: border-color 0.2s;
        }
        .wc-step-item:hover { border-color: #D4AF37; }
        .wc-step-icon-wrap {
          width: 38px; height: 38px;
          background: rgba(11,31,77,0.07);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wc-step-icon { width: 18px; height: 18px; color: #0B1F4D; }
        .wc-step-title { font-size: 13px; font-weight: 700; color: #0B1F4D; margin-bottom: 2px; }
        .wc-step-desc { font-size: 12.5px; color: #6b7a99; line-height: 1.5; }

        /* ── Speakers ── */
        .wc-speakers-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #edf0f7;
          box-shadow: 0 4px 20px rgba(11,31,77,0.06);
          padding: 28px;
          margin-bottom: 32px;
        }
        .wc-speakers-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9aa5be;
          text-align: center;
          margin-bottom: 20px;
        }
        .wc-speakers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 500px) {
          .wc-speakers-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .wc-speaker-card {
          background: #F8FAFC;
          border: 1px solid #edf0f7;
          border-radius: 12px;
          overflow: hidden;
          text-align: center;
          transition: border-color 0.2s, transform 0.2s;
        }
        .wc-speaker-card:hover { border-color: #D4AF37; transform: translateY(-3px); }
        .wc-speaker-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .wc-speaker-info {
          padding: 8px 8px 10px;
          border-top: 2px solid #D4AF37;
        }
        .wc-speaker-name { font-size: 11px; font-weight: 700; color: #0B1F4D; }
        .wc-speaker-role { font-size: 10px; color: #9aa5be; margin-top: 1px; }

        /* ── Back link ── */
        .wc-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7a99;
          text-decoration: none;
          transition: color 0.2s;
        }
        .wc-back:hover { color: #0B1F4D; }
        .wc-back svg { width: 15px; height: 15px; }

        /* ── Footer ── */
        .wc-footer {
          text-align: center;
          padding: 20px 24px 32px;
          font-size: 11.5px;
          color: #b0bcd4;
        }

        /* ── Mobile styling ── */
        @media (max-width: 600px) {
          .wc-page { padding: 32px 16px 64px; }
          .wc-card-top { padding: 28px 20px 24px; }
          .wc-headline { font-size: clamp(1.4rem, 6vw, 1.85rem); line-height: 1.25; }
          .wc-subtext { font-size: 13px; line-height: 1.5; }
          .wc-cal-btn { width: calc(100% - 32px); padding: 12px 16px; font-size: 12px; margin-top: 20px; }
          .wc-steps-card { padding: 20px 16px; }
          .wc-step-item { padding: 10px 12px; gap: 10px; }
          .wc-step-desc { font-size: 12px; }
          .wc-speakers-card { padding: 20px 16px; }
          .wc-speakers-grid { gap: 10px; }
        }
      `}</style>

      <div className="wc-root">
        <Helmet>
          <title>You're Registered! | MKWise Financial</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Thin topbar */}
        <div className="wc-topbar">
          <span className="wc-topbar-dot" />
          <p className="wc-topbar-text">
            <strong>You're registered!</strong> · First Home Webinar · 9 July 2026 at 6:00 PM BST
          </p>
        </div>

        {/* Gold bar */}
        <div className="wc-gold-bar" />

        <div className="wc-page">

          {/* Logo */}
          <motion.div
            className="wc-logo-row"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="MKWise Financial" className="wc-logo-img" />
            <div className="wc-logo-text">
              MKWise Financial
              <span>Mortgage &amp; Property Advisers</span>
            </div>
          </motion.div>

          {/* Confirmation card */}
          <motion.div
            className="wc-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="wc-card-top">
              {/* Success icon */}
              <motion.div
                className="wc-success-ring"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.25 }}
              >
                <CheckCircle2 />
              </motion.div>

              <div className="wc-confirmed-badge">
                <span className="wc-confirmed-badge-dot" />
                <span className="wc-confirmed-badge-text">Seat Confirmed</span>
              </div>

              <h1 className="wc-headline">
                You're In! See You on <em>9 July</em>
              </h1>
              <p className="wc-subtext">
                Your seat is reserved. Our team will be in touch with your joining details ahead of the event.
              </p>
            </div>

            {/* Event details */}
            <div className="wc-event-strip">
              {[
                { icon: <Calendar className="wc-event-icon" />, label: 'Date',     val: '9 July 2026'  },
                { icon: <Clock    className="wc-event-icon" />, label: 'Time',     val: '6:00 PM BST'  },
                { icon: <Video    className="wc-event-icon" />, label: 'Platform', val: 'Live on Zoom' },
              ].map((d, i) => (
                <div key={i} className="wc-event-cell">
                  {d.icon}
                  <div className="wc-event-label">{d.label}</div>
                  <div className="wc-event-val">{d.val}</div>
                </div>
              ))}
            </div>

            {/* Calendar button */}
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wc-cal-btn"
              id="add-to-calendar-btn"
            >
              <CalendarPlus /> Add To Google Calendar
            </a>
          </motion.div>

          {/* Next steps */}
          <motion.div
            className="wc-steps-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="wc-steps-title">
              <CheckCircle2 /> Your Next Steps
            </div>
            <div className="wc-steps-list">
              {nextSteps.map((s, i) => (
                <div key={i} className="wc-step-item">
                  <div className="wc-step-icon-wrap">{s.icon}</div>
                  <div>
                    <div className="wc-step-title">{s.title}</div>
                    <div className="wc-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Speakers */}
          <motion.div
            className="wc-speakers-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="wc-speakers-label">Your Masterclass Expert Panel</div>
            <div className="wc-speakers-grid">
              {speakers.map((s, i) => (
                <div key={i} className="wc-speaker-card">
                  <img src={s.img} alt={s.name} className="wc-speaker-img" />
                  <div className="wc-speaker-info">
                    <div className="wc-speaker-name">{s.name.split(' ')[0]}</div>
                    <div className="wc-speaker-role">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Back link */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="wc-back">
              <ArrowLeft /> Back to Homepage
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="wc-footer">
          © {new Date().getFullYear()} MKWise Financial · All rights reserved
        </div>
      </div>
    </>
  );
}

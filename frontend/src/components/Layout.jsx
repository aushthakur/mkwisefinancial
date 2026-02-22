import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import InterestRateScroller from './InterestRateScroller';
import { useModals } from '../context/ModalContext';
import GetStartedModal from './GetStartedModal';
import LetsTalkModal from './LetsTalkModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const { isGetStartedOpen, closeGetStarted, isLetsTalkOpen, closeLetsTalk } = useModals();

    return (
        <div className="min-h-screen flex flex-col pt-0 bg-white selection:bg-primary/20">
            <GetStartedModal isOpen={isGetStartedOpen} onClose={closeGetStarted} />
            <LetsTalkModal isOpen={isLetsTalkOpen} onClose={closeLetsTalk} />
            <div className="sticky top-0 z-[60]">
                <Navbar />
                <InterestRateScroller />
            </div>

            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <Chatbot />
            <Footer />
        </div>
    );
};

export default Layout;

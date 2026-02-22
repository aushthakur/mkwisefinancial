import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
    const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);

    const openGetStarted = () => setIsGetStartedOpen(true);
    const closeGetStarted = () => setIsGetStartedOpen(false);

    const openLetsTalk = () => setIsLetsTalkOpen(true);
    const closeLetsTalk = () => setIsLetsTalkOpen(false);

    return (
        <ModalContext.Provider
            value={{
                isGetStartedOpen,
                openGetStarted,
                closeGetStarted,
                isLetsTalkOpen,
                openLetsTalk,
                closeLetsTalk
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModals = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModals must be used within a ModalProvider');
    }
    return context;
};

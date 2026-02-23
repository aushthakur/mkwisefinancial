import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, ExternalLink, Loader2, User, ChevronDown, Calendar } from 'lucide-react';
import axios from 'axios';
import { useModals } from '../context/ModalContext';

const SUGGESTED_QUESTIONS = [
    'How do I book a consultation call?',
    'What are current UK mortgage rates?',
    'How much can I borrow for a mortgage?',
    'What is LTV and why does it matter?',
    'How does remortgaging work in the UK?',
    'What documents do I need for a mortgage?',
];

const TypingIndicator = () => (
    <div className="flex gap-2 items-center max-w-[85%]">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Bot size={12} className="text-primary" />
        </div>
        <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    </div>
);

const MessageBubble = ({ msg }) => {
    if (msg.role === 'user') {
        return (
            <div className="flex justify-end gap-2">
                <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-xs leading-relaxed font-medium shadow-sm">
                    {msg.content}
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-auto">
                    <User size={12} className="text-slate-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-2 max-w-[95%]">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Bot size={12} className="text-primary" />
            </div>
            <div className="space-y-2 flex-1">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs text-slate-700 leading-relaxed font-medium">
                    {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-2.5 space-y-1.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <ExternalLink size={9} />  Sources
                        </p>
                        {msg.sources.map((source) => (
                            <a
                                key={source.url}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[10px] text-primary font-bold hover:underline truncate"
                            >
                                <ExternalLink size={9} className="shrink-0" />
                                {source.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your MKWise Mortgage Assistant, powered by AI. Ask me anything about UK mortgages — rates, affordability, remortgaging, Help to Buy, and more.",
            sources: null
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async (text) => {
        const question = text || input.trim();
        if (!question || isLoading) return;

        // Custom check for booking consultation
        const lowerQ = question.toLowerCase();
        if (lowerQ.includes('book') || lowerQ.includes('schedule') || lowerQ.includes('consultation')) {
            const userMsg = { role: 'user', content: question };
            setMessages(prev => [...prev, userMsg]);
            setInput('');
            setIsLoading(true);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "Certainly! I'm opening our consultation scheduler for you right now.",
                    sources: null
                }]);
                setIsLoading(false);
                setTimeout(() => {
                    setIsOpen(false);
                    openScheduler();
                }, 1500);
            }, 600);
            return;
        }

        const userMsg = { role: 'user', content: question };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setShowSuggestions(false);

        // Build history for context (last 6 messages excluding the initial greeting)
        const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${apiUrl}/api/chatbot`, {
                message: question,
                history
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply,
                sources: data.sources || []
            }]);
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, the AI assistant is temporarily unavailable. Please try again shortly, or contact our advisors directly.',
                sources: [{ name: 'Contact MKWise Financial', url: '/contact' }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] font-display flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white shadow-2xl rounded-2xl w-[340px] sm:w-[380px] mb-4 border border-gray-100 overflow-hidden flex flex-col"
                    style={{ height: '520px' }}
                >
                    {/* Header */}
                    <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-none">Mortgage Assistant</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <p className="text-blue-100 text-[10px] font-bold tracking-widest uppercase">AI Powered</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openScheduler();
                                }}
                                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg flex items-center gap-2"
                                title="Book a Call"
                            >
                                <Calendar size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} msg={msg} />
                        ))}

                        {isLoading && <TypingIndicator />}

                        {/* Suggested Questions */}
                        {showSuggestions && messages.length <= 1 && (
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Suggested Questions</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="text-left bg-white border border-slate-100 px-3 py-2.5 rounded-xl text-[10px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm flex justify-between items-center group"
                                        >
                                            {q}
                                            <ChevronDown size={11} className="rotate-[-90deg] text-slate-300 group-hover:text-primary shrink-0 ml-2" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Disclaimer */}
                    <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
                        <p className="text-[9px] text-amber-700 font-bold leading-tight">
                            AI-generated guidance only. For regulated advice, speak to an FCA-authorised advisor.
                        </p>
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <div className="relative flex items-center gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="flex-1 text-xs py-3 pl-4 pr-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 disabled:opacity-50"
                                placeholder="Ask about UK mortgages..."
                                type="text"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:bg-blue-800 hover:scale-110 active:scale-95 transition-all"
            >
                {isOpen ? (
                    <Minimize2 size={22} />
                ) : (
                    <div className="relative">
                        <MessageSquare size={22} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary rounded-full animate-bounce" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default Chatbot;

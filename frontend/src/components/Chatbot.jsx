import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[60] font-display flex flex-col items-end">
            {/* Bot Window */}
            {isOpen && (
                <div className="bg-white shadow-2xl rounded-xl w-80 mb-4 border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-primary p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-none">Mortgage Assistant</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    <p className="text-blue-100 text-[10px] font-bold tracking-widest uppercase">We're Online</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/60 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="p-4 h-72 flex flex-col gap-4 overflow-y-auto bg-slate-50">
                        <div className="flex gap-2 max-w-[85%]">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot size={12} className="text-primary" />
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs text-slate-700 leading-relaxed font-medium">
                                Hi! I'm your Mkwise Mortgage Assistant. How can I help you today?
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-[10px]">
                            <p className="text-slate-400 font-black px-2 uppercase tracking-[0.2em] underline decoration-primary/20 underline-offset-4">Suggested</p>
                            <div className="flex flex-col gap-2 w-full pr-8">
                                <button className="text-left bg-white border border-gray-100 p-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-slate-700 shadow-sm">
                                    What are the latest rates?
                                </button>
                                <button className="text-left bg-white border border-gray-100 p-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-slate-700 shadow-sm">
                                    How much can I borrow?
                                </button>
                                <button className="text-left bg-white border border-gray-100 p-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-slate-700 shadow-sm">
                                    Book a free consultation
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative flex items-center">
                            <input
                                className="w-full text-xs py-3 pl-4 pr-12 bg-slate-100 border-none rounded-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:font-bold placeholder:text-slate-300"
                                placeholder="Type your message..."
                                type="text"
                            />
                            <button className="absolute right-2 p-2 text-primary hover:text-blue-800 transition-all">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-800 hover:scale-110 active:scale-95 transition-all group"
            >
                {isOpen ? (
                    <Minimize2 size={24} />
                ) : (
                    <div className="relative">
                        <MessageSquare size={24} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary rounded-full animate-bounce"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default Chatbot;

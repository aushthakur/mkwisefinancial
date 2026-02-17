import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const mortgages = [
        { title: 'First Time Buyer', path: '/mortgages/first-time-buyer' },
        { title: 'Remortgaging', path: '/mortgages/remortgaging' },
        { title: 'Buy to Let', path: '/mortgages/buy-to-let' },
        { title: 'Shared Ownership', path: '/mortgages/shared-ownership' },
        { title: 'Bad Credit Mortgages', path: '/mortgages/bad-credit' },
        { title: 'High Net Worth', path: '/mortgages/high-net-worth' },
    ];

    const protections = [
        { title: 'Life Insurance', path: '/protection/life-insurance' },
        { title: 'Critical Illness Cover', path: '/protection/critical-illness' },
        { title: 'Income Protection', path: '/protection/income-protection' },
        { title: 'Mortgage Protection', path: '/protection/mortgage-protection' },
        { title: 'Buildings & Contents', path: '/protection/buildings-contents' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 font-display transition-all">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-sm">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary uppercase">Mkwise Financial</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Home</Link>

                        <div className="relative group">
                            <button
                                className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors cursor-pointer"
                                onMouseEnter={() => setActiveDropdown('mortgages')}
                            >
                                Mortgages <ChevronDown className="ml-1 w-3 h-3 opacity-50" />
                            </button>
                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-lg border border-gray-100 py-4 mt-2 transition-all ${activeDropdown === 'mortgages' ? 'block' : 'hidden'} group-hover:block`}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {mortgages.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="block px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-primary uppercase tracking-widest transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors cursor-pointer"
                                onMouseEnter={() => setActiveDropdown('protection')}
                            >
                                Protection <ChevronDown className="ml-1 w-3 h-3 opacity-50" />
                            </button>
                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-lg border border-gray-100 py-4 mt-2 transition-all ${activeDropdown === 'protection' ? 'block' : 'hidden'} group-hover:block`}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {protections.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="block px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-primary uppercase tracking-widest transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">About Us</Link>
                        <Link to="/contact" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/contact" className="hidden sm:block bg-primary hover:bg-blue-800 text-white px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                            Get Started
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="px-6 pt-6 space-y-4">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-50">Home</Link>

                        <div className="py-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">Mortgage Services</span>
                            <div className="grid grid-cols-1 gap-2">
                                {mortgages.map((item) => (
                                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="block py-1 text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest">{item.title}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="py-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">Protection Advice</span>
                            <div className="grid grid-cols-1 gap-2">
                                {protections.map((item) => (
                                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="block py-1 text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest">{item.title}</Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-50">About Us</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-xs font-black text-slate-900 uppercase tracking-widest border-b border-gray-50">Contact Our Advisors</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

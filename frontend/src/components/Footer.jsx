import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 font-display">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="Mkwise Financial Logo" className="h-10 w-auto" />
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Providing professional mortgage and protection advice across the United Kingdom.
                        </p>
                        <div className="flex gap-4">
                            <a className="hover:text-primary transition-colors cursor-pointer" href="https://facebook.com/mkwisefinancial" target="_blank" rel="noopener noreferrer"><span className="material-icons text-xl text-[inherit]">facebook</span></a>
                            <a className="hover:text-primary transition-colors cursor-pointer" href="mailto:info@mkwisefinancial.co.uk"><span className="material-icons text-xl text-[inherit]">alternate_email</span></a>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Services</h5>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="hover:text-primary transition-colors" to="/mortgages">Mortgage Overview</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/mortgages/first-time-buyer">First Time Buyers</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/mortgages/remortgaging">Remortgaging</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/protection">Protection Advice</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h5>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="hover:text-primary transition-colors" to="/about">About Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Privacy Policy</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/contact">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h5>
                        <p className="text-sm mb-2">info@mkwisefinancial.co.uk</p>
                        <p className="text-sm mb-2">020 7946 0000</p>
                        <p className="text-sm">Main Office, Canary Wharf<br />London, E14 5AA</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-[11px] leading-relaxed text-slate-500 uppercase tracking-tight">
                    <p className="mb-4">
                        Mkwise Financial is an appointed representative of [Network Name Here] which is authorised and regulated by the Financial Conduct Authority (FCA). Our FCA Register number is [Number].
                    </p>
                    <p className="mb-4 text-white font-bold">
                        YOUR HOME MAY BE REPOSSESSED IF YOU DO NOT KEEP UP REPAYMENTS ON YOUR MORTGAGE.
                    </p>
                    <p>
                        © {new Date().getFullYear()} Mkwise Financial. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

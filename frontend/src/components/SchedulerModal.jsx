import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon,
    User, Mail, Phone, CheckCircle2, ChevronDown, Sparkles,
    CalendarDays, ArrowRight
} from 'lucide-react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
    isBefore, startOfToday, isWeekend, parse, addMinutes
} from 'date-fns';
import axios from 'axios';

const SchedulerModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Info, 4: Success
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Generate time slots
    const timeSlots = useMemo(() => {
        const slots = [];
        let current = parse('09:00', 'HH:mm', new Date());
        const end = parse('17:00', 'HH:mm', new Date());

        while (isBefore(current, end)) {
            slots.push(format(current, 'HH:mm'));
            current = addMinutes(current, 30);
        }
        return slots;
    }, []);

    if (!isOpen) return null;

    const handleDateClick = (day) => {
        if (isBefore(day, startOfToday())) return;
        setSelectedDate(day);
        setStep(2);
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const bookingDetails = `
--- Booking Scheduled ---
Date: ${format(selectedDate, 'PPP')}
Time: ${selectedTime}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
            `.trim();

            await axios.post(`${apiUrl}/api/contact`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                serviceType: 'Consultation Booking',
                message: bookingDetails,
                bookingDate: format(selectedDate, 'yyyy-MM-dd'),
                bookingTime: selectedTime,
                isBooking: true
            });
            setStep(4);
        } catch (error) {
            console.error('Error booking consultation:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const isDisabled = isBefore(day, startOfToday()) || !isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer group
                            ${isDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-700 hover:bg-primary/5'}
                            ${isSelected ? 'bg-primary text-white hover:bg-primary' : ''}
                            ${isToday && !isSelected ? 'border-2 border-primary/20 bg-primary/5' : ''}
                        `}
                        onClick={() => !isDisabled && handleDateClick(cloneDay)}
                    >
                        <span className="font-bold text-sm relative z-10">{formattedDate}</span>
                        {isToday && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="space-y-1">{rows}</div>;
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' },
        visible: {
            opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
            transition: { duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.95, y: 20, filter: 'blur(5px)', transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white/95 w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20 backdrop-blur-md"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-all z-10 p-2 hover:bg-slate-100 rounded-full"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="date"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select a Date</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <CalendarIcon size={12} className="text-primary" />
                                        Availability for consultation
                                    </p>
                                </div>

                                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-black text-slate-900 text-lg">
                                            {format(currentMonth, 'MMMM yyyy')}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                            <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    {renderCalendar()}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="time"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-blue-700 transition-colors group mb-4"
                                >
                                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                    Back to Calendar
                                </button>

                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Pick a Time</h3>
                                    <p className="text-sm font-bold text-primary">
                                        {format(selectedDate, 'EEEE, do MMMM')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeClick(time)}
                                            className="p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 hover:border-primary hover:bg-white hover:text-primary transition-all text-sm"
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="info"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] transition-colors mb-4"
                                >
                                    <ChevronLeft size={14} />
                                    Back to Time slots
                                </button>

                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your Details</h3>
                                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-primary uppercase tracking-widest">Selected Session</p>
                                            <p className="text-sm font-bold text-slate-700">{format(selectedDate, 'PPP')} @ {selectedTime}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input required name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-900" />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-900" />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none font-bold text-slate-900" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !formData.name || !formData.email || !formData.phone}
                                        className="w-full bg-slate-900 hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Booking...' : 'Confirm Consultation'}
                                        {!loading && <ArrowRight size={20} />}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-10 space-y-8"
                            >
                                <div className="relative inline-block">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1.2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-emerald-400 rounded-full"
                                    />
                                    <div className="relative w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                        <CheckCircle2 size={56} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Booked!</h2>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-[320px] mx-auto text-lg">
                                        Your consultation is confirmed for <strong>{format(selectedDate, 'PPP')}</strong> at <strong>{selectedTime}</strong>.
                                    </p>
                                </div>

                                <div className="grid gap-3 pt-4">
                                    <a
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultation+with+Mkwise+Financial&dates=${format(selectedDate, 'yyyyMMdd')}T${selectedTime.replace(':', '')}00Z/${format(selectedDate, 'yyyyMMdd')}T${format(addMinutes(parse(selectedTime, 'HH:mm', selectedDate), 30), 'HHmm')}00Z&details=Mortgage+consultation+call.&sprop=name:Mkwise+Financial`}
                                        target="_blank" rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-primary hover:text-primary transition-all"
                                    >
                                        <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google" className="w-5 h-5" />
                                        Add to Google Calendar
                                    </a>
                                    <a
                                        href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=Consultation+with+Mkwise+Financial&startdt=${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00&enddt=${format(selectedDate, 'yyyy-MM-dd')}T${format(addMinutes(parse(selectedTime, 'HH:mm', selectedDate), 30), 'HH:mm')}:00&body=Mortgage+consultation+call.`}
                                        target="_blank" rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-primary hover:text-primary transition-all"
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook" className="w-5 h-5" />
                                        Add to Outlook Calendar
                                    </a>
                                </div>

                                <button onClick={onClose} className="w-full text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-900 transition-colors pt-4">
                                    Close Scheduler
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default SchedulerModal;

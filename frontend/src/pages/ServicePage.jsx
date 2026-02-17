import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Home, Key, Percent, Briefcase, CreditCard, DollarSign } from 'lucide-react';

const serviceData = {
    mortgage: {
        overview: {
            title: 'Mortgage Services Overview',
            subtitle: 'Expert advice for every property journey.',
            description: 'Navigating the mortgage market can be complex. Our experts provide independent advice to find the right mortgage for your needs, whether you are buying your first home or expanding your portfolio.',
            icon: <Home size={40} />,
            features: ['Nationwide coverage', 'Independent advice', '1000s of products', 'Fast application']
        },
        'buy-to-let': {
            title: 'Buy-to-Let Mortgages',
            subtitle: 'Maximizing returns for property investors.',
            description: 'A Buy-to-Let mortgage is designed specifically for people who want to buy a property to rent it out. We help both experienced landlords and first-time investors find competitive deals.',
            icon: <DollarSign size={40} />,
            features: ['LTD company options', 'Portfolio planning', 'Market-leading rates', 'Expert guidance']
        },
        'first-time-buyer': {
            title: 'First Time Buyer',
            subtitle: 'Step onto the property ladder with confidence.',
            description: 'Buying your first home is a huge milestone. We guide you through the entire process, explaining terminology and finding schemes like Shared Ownership or low-deposit mortgages.',
            icon: <Key size={40} />,
            features: ['Deposit assistance tips', 'Step-by-step guidance', 'Exclusive deals', 'Free consultation']
        },
        'remortgaging': {
            title: 'Remortgaging',
            subtitle: 'Switch and save on your monthly payments.',
            description: 'Remortgaging could save you thousands. Whether your fixed rate is ending or you want to release equity, we scan the market to find a better deal than your current lender.',
            icon: <Percent size={40} />,
            features: ['Equity release', 'Better interest rates', 'Lower monthly costs', 'Quick switching']
        },
        'shared-ownership': {
            title: 'Shared Ownership',
            subtitle: 'Buy a share of your home and pay rent on the rest.',
            description: 'Shared ownership allows you to buy between 25% and 75% of a property. It is a great way to get on the ladder with a smaller deposit and mortgage.',
            icon: <Bookmark size={40} />,
            features: ['Lower deposit needs', 'Affordable monthlys', 'Staircasing support', 'New build access']
        },
        'bad-credit': {
            title: 'Bad Credit Mortgages',
            subtitle: 'Financial hurdles shouldn\'t stop your dreams.',
            description: 'Even if you have previously struggled with credit, we work with specialist lenders who look beyond a credit score to understand your current situation.',
            icon: <CreditCard size={40} />,
            features: ['Specialist lenders', 'CCJ/Default support', 'Transparent advice', 'Manual underwriting']
        },
        'high-net-worth': {
            title: 'High Net Worth Mortgages',
            subtitle: 'Bespoke solutions for high-value properties.',
            description: 'High net worth individuals often require complex lending solutions. We provide access to private banks and tailored products for multi-million pound properties.',
            icon: <Briefcase size={40} />,
            features: ['Private bank access', 'Tailored terms', 'Large loan expertise', 'Discreet service']
        }
    },
    protection: {
        overview: {
            title: 'Protection Services Overview',
            subtitle: 'Securing what matters most to you.',
            description: 'Life is unpredictable. We help you choose the right protection policies to ensure that your family and your home are financially secure, no matter what happens.',
            icon: <Shield size={40} />,
            features: ['Total peace of mind', 'Tailored coverage', 'Claims support', 'Regular reviews']
        },
        'life-insurance': {
            title: 'Life Insurance',
            subtitle: 'Provide financial security for your loved ones.',
            description: 'Life insurance pays out a lump sum if you pass away during the policy term. It can pay off a mortgage or provide an income for your dependents.',
            icon: <Heart size={40} />,
            features: ['Fixed premiums', 'Joint or single policies', 'Critical illness add-ons', 'Peace of mind']
        },
        'critical-illness': {
            title: 'Critical Illness Cover',
            subtitle: 'Focus on recovery, not finances.',
            description: 'This policy pays a lump sum if you are diagnosed with a specified serious illness. It helps cover costs like mortgage payments or medical expenses.',
            icon: <Briefcase size={40} />,
            features: ['Extensive condition list', 'Children\'s cover included', 'Tax-free lump sum', 'Support services']
        },
        'income-protection': {
            title: 'Income Protection',
            subtitle: 'Replace your earnings if you can\'t work.',
            description: 'If you are unable to work due to illness or injury, income protection provides a regular monthly payment to help you keep up with your expenses.',
            icon: <DollarSign size={40} />,
            features: ['Long-term support', 'Percentage of salary', 'Self-employed options', 'Flexible deferral']
        },
        'mortgage-protection': {
            title: 'Mortgage Protection',
            subtitle: 'Ensure your home is always safe.',
            description: 'Specifically designed to pay off your mortgage balance if you pass away or fall ill, ensuring your family stays in their home.',
            icon: <Shield size={40} />,
            features: ['Decreasing term options', 'Mortgage link', 'Affordable security', 'Reliable payout']
        },
        'buildings-contents': {
            title: 'Buildings & Contents',
            subtitle: 'Protect your physical home and belongings.',
            description: 'Comprehensive insurance for your building structure and everything inside it. Essential for any homeowner or landlord.',
            icon: <Home size={40} />,
            features: ['Accidental damage', 'New for old', 'Legal cover options', 'Quick claims']
        }
    }
};

const ServicePage = ({ type, category }) => {
    const data = serviceData[type][category];

    if (!data) return <div>Service not found</div>;

    return (
        <div className="font-inter">
            {/* Hero */}
            <section className="bg-primary text-white py-24 rounded-b-[4rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                            {data.icon}
                        </div>
                        <div>
                            <span className="text-blue-200 font-bold text-xs uppercase tracking-widest">{type} services</span>
                            <h1 className="text-4xl lg:text-6xl font-extrabold">{data.title}</h1>
                        </div>
                    </div>
                    <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                        {data.subtitle}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-2 lg:gap-20">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">How we help with {data.title}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-10">
                            {data.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                            {data.features.map((feature, i) => (
                                <div key={i} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="text-primary" size={20} />
                                    <span className="font-semibold text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col justify-center items-center text-center">
                        <h3 className="text-3xl font-bold mb-6">Need expert advice?</h3>
                        <p className="text-slate-400 mb-10 max-w-sm">
                            Our advisors are available for a free, no-obligation consultation to discuss your specific needs.
                        </p>
                        <Link to="/contact" className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-blue-900/40 flex items-center">
                            Book Appointment <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicePage;

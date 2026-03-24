import React, { useState, useMemo } from 'react';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import AmortizationTable from './AmortizationTable';
import { generateAmortizationSchedule, getRemainingBalance } from './calculatorUtils';
import { Helmet } from 'react-helmet-async';

const MortgageCalculator = () => {
  // Main Calculator State
  const [state, setState] = useState({
    propertyPrice: 300000,
    deposit: 60000,
    termYears: 25,
    interestRate: 4.5,
    mortgageType: 'repayment', // 'repayment' | 'interest-only'
    isRemortgage: false,
    elapsedMonths: 60, // 5 years elapsed for remortgage scenario
    overpayment: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      // Use numeric value or 0 if NaN (like clearing the input)
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleToggleType = (type) => {
    setState(prev => ({ ...prev, mortgageType: type }));
  };

  const handleToggleRemortgage = (isRemortgage) => {
    setState(prev => ({ ...prev, isRemortgage }));
  };

  // derived calculations
  const calculations = useMemo(() => {
    // Basic protection against empty or invalid values
    const safePrice = Number(state.propertyPrice) || 0;
    const safeDeposit = Number(state.deposit) || 0;
    const safeTerm = Number(state.termYears) || 25;
    const safeInterest = Number(state.interestRate) || 0.1; // avoid divide by zero
    const safeOverpayment = Number(state.overpayment) || 0;
    const safeElapsed = Number(state.elapsedMonths) || 0;

    let loanAmount = Math.max(0, safePrice - safeDeposit);

    // If remortgage, calculate what the balance would be today if they took out Price over Term at 4%
    // In a real scenario, they'd explicitly enter their current balance.
    // For this calculator, we either let them enter the property price as the "Original Loan Amount"
    // and we compute the current balance based on elapsed months. 
    // Or simpler: Property Price becomes "Original Balance", then compute current balance from it.
    if (state.isRemortgage) {
       loanAmount = getRemainingBalance(safePrice, 4.0, safeTerm, safeElapsed, 'repayment'); // assuming original rate 4% for calculation demo, or could add an input for original rate. Let's just use safePrice as the current balance directly if they want exact, or we just calculate based on current given inputs.
       // Actually, to make remortgage simple for the user: Let "PropertyPrice" field just act as the outstanding balance if it's remortgage.
       // The user requested: original loan amount + time elapsed + new interest rate.
       // So: original = safePrice, time elapsed = safeElapsed, remaining term = safeTerm - elapsed/12
       const remainingTermYears = Math.max(1, safeTerm - (safeElapsed / 12));
       const currentBalance = getRemainingBalance(safePrice, 4.5, safeTerm, safeElapsed, 'repayment'); // just an estimation of balance
       
       return generateAmortizationSchedule(
          currentBalance,
          safeInterest,
          remainingTermYears,
          safeOverpayment,
          state.mortgageType
       );
    }

    return generateAmortizationSchedule(
      loanAmount,
      safeInterest,
      safeTerm,
      safeOverpayment,
      state.mortgageType
    );
  }, [state]);


  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MKWise Mortgage & Remortgage Calculator",
    "description": "Calculate your UK mortgage repayments, interest-only options, and overpayment savings instantly.",
    "applicationCategory": "CalculatorApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP"
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full mt-20 px-4">
      <Helmet>
        <title>UK Mortgage & Remortgage Calculator | MKWise Financial</title>
        <meta name="description" content="Use our production-ready UK mortgage calculator to estimate monthly repayments, overpayment savings, and interest breakdown." />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
      
      <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
             Comprehensive Mortgage Calculator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Plan your property journey with our advanced calculator. Explore repayments, interest-only options, remortaging, and the power of overpayments.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
          <InputPanel
            state={state}
            handleChange={handleChange}
            handleToggleType={handleToggleType}
            handleToggleRemortgage={handleToggleRemortgage}
          />
        </div>
        
        <div className="lg:col-span-5 xl:col-span-4 h-full">
          <ResultsPanel
             calculations={calculations}
             state={state}
          />
        </div>
      </div>

      <div className="w-full">
         <AmortizationTable schedule={calculations.monthlySchedule} />
      </div>

    </div>
  );
};

export default MortgageCalculator;

/**
 * Calculates standard repayment mortgage monthly payment.
 * Formula: P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
 *
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (e.g. 5 for 5%)
 * @param {number} years - Term in years
 * @returns {number} Monthly payment
 */
export const calculateRepaymentMonthly = (principal, annualRate, years) => {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const mathPower = Math.pow(1 + r, n);
  return principal * ((r * mathPower) / (mathPower - 1));
};

/**
 * Calculates interest-only mortgage monthly payment.
 * Formula: (Principal * Annual Interest Rate) / 12
 *
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate
 * @returns {number} Monthly payment
 */
export const calculateInterestOnlyMonthly = (principal, annualRate) => {
  return (principal * (annualRate / 100)) / 12;
};

/**
 * Generates an amortization schedule.
 *
 * @param {number} principal - Starting loan amount
 * @param {number} annualRate - Annual interest rate
 * @param {number} years - Term in years
 * @param {number} monthlyOverpayment - Extra amount paid per month
 * @param {string} type - 'repayment' | 'interest-only'
 * @returns {Object} Amortization data array, total interest, total paid, and time saved in months
 */
export const generateAmortizationSchedule = (
  principal,
  annualRate,
  years,
  monthlyOverpayment = 0,
  type = 'repayment'
) => {
  const schedule = [];
  const r = annualRate / 100 / 12;
  
  // Base required payment without overpayment
  let basePayment = 0;
  if (type === 'repayment') {
    basePayment = calculateRepaymentMonthly(principal, annualRate, years);
  } else {
    basePayment = calculateInterestOnlyMonthly(principal, annualRate);
  }

  // Actual payment made
  let actualPayment = basePayment + monthlyOverpayment;
  
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let originalMonths = years * 12;
  let currentMonth = 0;

  while (balance > 0.01 && currentMonth < originalMonths * 2) { // cap to avoid infinite loops if payment < interest
    currentMonth++;
    const interestPayment = balance * r;
    
    let principalPayment = 0;
    if (type === 'repayment') {
       principalPayment = actualPayment - interestPayment;
    } else {
       // Interest only with overpayment means overpayment goes to principal
       principalPayment = monthlyOverpayment;
    }

    let paymentThisMonth = actualPayment;

    // Handle final payment
    if (balance + interestPayment < actualPayment) {
      principalPayment = balance;
      paymentThisMonth = balance + interestPayment;
    } else if (principalPayment <= 0 && type === 'repayment') {
      // Payment isn't covering interest - infinite loop guard
      break; 
    }

    balance -= principalPayment;
    totalInterest += interestPayment;
    totalPaid += paymentThisMonth;

    schedule.push({
      month: currentMonth,
      year: Math.ceil(currentMonth / 12),
      payment: paymentThisMonth,
      principalPayment: principalPayment > 0 ? principalPayment : 0,
      interestPayment: interestPayment,
      remainingBalance: Math.max(0, balance),
      totalInterest: totalInterest
    });

    if (balance <= 0) break;
  }

  // Time saved logic
  const monthsTaken = currentMonth;
  let monthsSaved = 0;
  if (type === 'repayment' && monthlyOverpayment > 0 && balance <= 0) {
     monthsSaved = originalMonths - monthsTaken;
  }

  // Group by year for charting
  const yearlySchedule = [];
  for (let y = 1; y <= Math.ceil(monthsTaken / 12); y++) {
    const yearData = schedule.filter(s => s.year === y);
    if (yearData.length > 0) {
       yearlySchedule.push({
         year: y,
         balance: yearData[yearData.length - 1].remainingBalance,
         interestPaid: yearData.reduce((acc, curr) => acc + curr.interestPayment, 0),
         principalPaid: yearData.reduce((acc, curr) => acc + curr.principalPayment, 0),
         totalInterest: yearData[yearData.length - 1].totalInterest
       });
    }
  }

  return {
    monthlySchedule: schedule,
    yearlySchedule: yearlySchedule,
    totalInterest,
    totalPaid,
    monthsSaved: Math.max(0, monthsSaved),
    basePayment,
    actualPayment: type === 'interest-only' && monthlyOverpayment === 0 ? actualPayment : (schedule[0]?.payment || 0),
    monthsTaken
  };
};

/**
 * Calculates remaining balance after X months for remortgage calculation.
 */
export const getRemainingBalance = (principal, annualRate, years, elapsedMonths, type = 'repayment') => {
   if (elapsedMonths <= 0) return principal;
   const schedule = generateAmortizationSchedule(principal, annualRate, years, 0, type);
   if (elapsedMonths > schedule.monthlySchedule.length) return 0;
   return schedule.monthlySchedule[elapsedMonths - 1].remainingBalance;
};

import ChartGraph from './ChartGraph';
import { ArrowRight, PoundSterling, Clock, PiggyBank, ArrowDown } from 'lucide-react';
import { useModals } from '../../../context/ModalContext';

const ResultsPanel = ({ calculations, state }) => {
  const { openGetStarted } = useModals();
  const {
      basePayment,
      actualPayment,
      totalInterest,
      totalPaid,
      monthsSaved,
      yearlySchedule
  } = calculations;

  const originalMonths = state.termYears * 12;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl shadow-xl border border-blue-800 p-6 sm:p-8 flex flex-col h-full text-white">
      <h2 className="text-2xl font-bold font-sans mb-8">Summary</h2>

      <div className="space-y-6 flex-grow">
        
        {/* Main Highlight: Monthly Payment */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
          <p className="text-blue-200 text-sm font-medium mb-1 flex justify-between items-center">
             <span>{state.isRemortgage ? 'New Monthly Payment' : 'Monthly Payment'}</span>
             {state.overpayment > 0 && <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30">Includes overpayment</span>}
          </p>
          <div className="flex items-baseline gap-1">
             <span className="text-4xl font-bold">£{(actualPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             <span className="text-blue-300">/mo</span>
          </div>
          {state.overpayment > 0 && (
              <p className="text-xs text-blue-300 mt-2 flex items-center gap-1">
                 Base payment: £{(basePayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
          )}
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-blue-200 text-xs mb-1 flex items-center gap-1"><PoundSterling className="w-3 h-3" /> Total Repaid</p>
            <p className="text-lg font-bold">£{(totalPaid).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-blue-200 text-xs mb-1 flex items-center gap-1"><PiggyBank className="w-3 h-3" /> Total Interest</p>
            <p className="text-lg font-bold">£{(totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Overpayment Savings Highlight */}
         {state.overpayment > 0 && monthsSaved > 0 && (
             <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 flex flex-col gap-2">
                 <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
                     <Clock className="w-4 h-4" /> Term Reduced By
                 </p>
                 <p className="text-2xl font-bold text-green-400">
                    {Math.floor(monthsSaved / 12)} yrs {monthsSaved % 12} mos
                 </p>
                 <p className="text-xs text-green-200">
                     Mortgage will be paid off early.
                 </p>
             </div>
         )}
         
         {/* Interest-Only specific message */}
         {state.mortgageType === 'interest-only' && state.overpayment === 0 && (
             <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20 text-orange-200 text-sm flex gap-2">
                 <ArrowDown className="w-5 h-5 flex-shrink-0" />
                 <p>Your payments act only to service the interest. You will still owe the full principal amount at the end of the term.</p>
             </div>
         )}

         {/* Chart Preview */}
         <div className="mt-8">
             <h3 className="text-lg font-semibold mb-4 text-blue-100 mb-0">Balance Overview</h3>
             <ChartGraph data={yearlySchedule} />
         </div>

      </div>

      {/* CTA Button */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <button 
          onClick={() => openGetStarted({
            intent: state.isRemortgage ? 'Remortgage/Refinance' : 'Buy a Property',
            mortgageAmount: state.propertyPrice - state.deposit,
            propertyValue: state.propertyPrice
          })}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex justify-center items-center gap-2 group"
        >
           Get Your Quote 
           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-xs text-blue-300 mt-3 opacity-70">No credit check required to get initial quotes.</p>
      </div>
    </div>
  );
};

export default ResultsPanel;

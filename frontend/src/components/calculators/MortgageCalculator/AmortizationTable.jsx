import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AmortizationTable = ({ schedule }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Display only first 12 months if not expanded
  const displaySchedule = isExpanded ? schedule : schedule.slice(0, 12);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xl font-bold text-gray-900">Amortization Schedule</h3>
        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
           {isExpanded ? (
               <><ChevronUp className="w-4 h-4" /> Hide details</>
           ) : (
               <><ChevronDown className="w-4 h-4" /> View full schedule</>
           )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm border-b">
              <tr>
                <th scope="col" className="px-6 py-4">Month</th>
                <th scope="col" className="px-6 py-4">Year</th>
                <th scope="col" className="px-6 py-4 text-right">Payment</th>
                <th scope="col" className="px-6 py-4 text-right">Interest</th>
                <th scope="col" className="px-6 py-4 text-right">Principal</th>
                <th scope="col" className="px-6 py-4 text-right">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {displaySchedule.map((row) => (
                <tr key={row.month} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.month}</td>
                  <td className="px-6 py-4">Year {row.year}</td>
                  <td className="px-6 py-4 text-right font-medium">£{Math.round(row.payment).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-red-600">£{Math.round(row.interestPayment).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-green-600">£{Math.round(row.principalPayment).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">£{Math.round(row.remainingBalance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;

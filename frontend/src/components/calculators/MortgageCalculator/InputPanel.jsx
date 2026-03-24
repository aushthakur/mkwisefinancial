import React from 'react';
import { PoundSterling, Percent, Calendar, RefreshCw, Home } from 'lucide-react';

const InputPanel = ({
  state,
  handleChange,
  handleToggleType,
  handleToggleRemortgage
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 flex flex-col space-y-8">
      
      {/* Header & Toggles */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-sans mb-6">Mortgage Details</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => handleToggleRemortgage(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!state.isRemortgage ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            New Mortgage
          </button>
          <button
            onClick={() => handleToggleRemortgage(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${state.isRemortgage ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Remortgage
          </button>
        </div>

        <div className="flex gap-2">
            <button
                onClick={() => handleToggleType('repayment')}
                className={`flex-1 py-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${state.mortgageType === 'repayment' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Repayment</span>
            </button>
            <button
                onClick={() => handleToggleType('interest-only')}
                className={`flex-1 py-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${state.mortgageType === 'interest-only' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
                <Percent className="w-5 h-5" />
                <span className="text-sm font-medium">Interest-Only</span>
            </button>
        </div>
      </div>

      <div className="space-y-6">
          {/* Property Price / Current Balance */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>{state.isRemortgage ? 'Original Mortgage Balance' : 'Property Price'}</span>
              <span className="text-blue-600 font-bold">£{(state.propertyPrice).toLocaleString()}</span>
            </label>
            <div className="relative flex items-center mb-4">
              <span className="absolute left-4 text-gray-500"><PoundSterling className="w-4 h-4" /></span>
              <input
                type="number"
                name="propertyPrice"
                value={state.propertyPrice}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 text-lg"
              />
            </div>
            <input
              type="range"
              name="propertyPrice"
              min="50000"
              max="2000000"
              step="5000"
              value={state.propertyPrice}
              onChange={handleChange}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Deposit / Target Balance (only if not remortgage) */}
          {!state.isRemortgage && (
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Deposit Amount</span>
                <span className="text-blue-600 font-bold">£{(state.deposit).toLocaleString()}</span>
              </label>
              <div className="relative flex items-center mb-4">
                <span className="absolute left-4 text-gray-500"><PoundSterling className="w-4 h-4" /></span>
                <input
                  type="number"
                  name="deposit"
                  value={state.deposit}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 text-lg"
                />
              </div>
              <input
                type="range"
                name="deposit"
                min="0"
                max={state.propertyPrice - 10000}
                step="1000"
                value={state.deposit}
                onChange={handleChange}
                className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Term Input */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Mortgage Term</span>
              <span className="text-blue-600 font-bold">{state.termYears} Years</span>
            </label>
            <div className="relative flex items-center mb-4">
              <span className="absolute left-4 text-gray-500"><Calendar className="w-4 h-4" /></span>
              <input
                type="number"
                name="termYears"
                value={state.termYears}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 text-lg"
              />
              <span className="absolute right-4 text-gray-500 font-medium">yrs</span>
            </div>
            <input
              type="range"
              name="termYears"
              min="5"
              max="40"
              step="1"
              value={state.termYears}
              onChange={handleChange}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Remortgage Specific: Time Elapsed */}
          {state.isRemortgage && (
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Months Elapsed Since Start</span>
                  <span className="text-blue-600 font-bold">{state.elapsedMonths} Months</span>
                </label>
                <div className="relative flex items-center mb-4">
                  <span className="absolute left-4 text-gray-500"><RefreshCw className="w-4 h-4" /></span>
                  <input
                    type="number"
                    name="elapsedMonths"
                    value={state.elapsedMonths}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 text-lg"
                  />
                  <span className="absolute right-4 text-gray-500 font-medium">mo</span>
                </div>
                <input
              type="range"
              name="elapsedMonths"
              min="0"
              max={state.termYears * 12 - 12}
              step="1"
              value={state.elapsedMonths}
              onChange={handleChange}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
              </div>
          )}

          {/* Interest Rate */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>{state.isRemortgage ? 'New Interest Rate' : 'Interest Rate'}</span>
              <span className="text-blue-600 font-bold">{state.interestRate}%</span>
            </label>
            <div className="relative flex items-center mb-4">
              <span className="absolute left-4 text-gray-500"><Percent className="w-4 h-4" /></span>
              <input
                type="number"
                name="interestRate"
                value={state.interestRate}
                onChange={handleChange}
                step="0.1"
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 text-lg"
              />
              <span className="absolute right-4 text-gray-500 font-medium">%</span>
            </div>
            <input
              type="range"
              name="interestRate"
              min="0.5"
              max="15"
              step="0.1"
              value={state.interestRate}
              onChange={handleChange}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="h-px bg-gray-200 my-4" />

          {/* Overpayment */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Monthly Overpayment</span>
              <span className="text-green-600 font-bold">£{(state.overpayment).toLocaleString()}</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-500"><PoundSterling className="w-4 h-4" /></span>
              <input
                type="number"
                name="overpayment"
                value={state.overpayment}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-semibold text-gray-900 text-lg"
                placeholder="Optional"
              />
            </div>
             <p className="text-xs text-gray-500 mt-2">Reduce your interest and term by paying extra.</p>
          </div>
      </div>
    </div>
  );
};

export default InputPanel;

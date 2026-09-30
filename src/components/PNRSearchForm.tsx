import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { SamplePNR, ProviderStatus } from '../types';

interface PNRSearchFormProps {
  onSearch: (pnr: string) => void;
  isLoading: boolean;
  samplePnrs: SamplePNR[];
  providerStatus: ProviderStatus | null;
}

export const PNRSearchForm: React.FC<PNRSearchFormProps> = ({
  onSearch,
  isLoading,
  samplePnrs,
  providerStatus
}) => {
  const [pnrInput, setPnrInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pnrInput.trim();
    if (!clean) {
      setValidationError('Please enter a 10-digit Indian Railway PNR number.');
      return;
    }
    if (!/^\d{10}$/.test(clean)) {
      setValidationError('PNR must be exactly 10 numeric digits.');
      return;
    }
    if (clean.startsWith('0')) {
      setValidationError('Indian Railways PNR cannot begin with 0.');
      return;
    }
    setValidationError(null);
    onSearch(clean);
  };

  const handleSelectSample = (samplePnr: string) => {
    setPnrInput(samplePnr);
    setValidationError(null);
    onSearch(samplePnr);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
          AI-Powered Railway PNR Confirmation Prediction
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl mx-auto">
          Enter your 10-digit Indian Railway PNR to estimate your confirmation probability using
          calibrated gradient-boosted decision trees and historical booking churn patterns.
        </p>

        {/* PNR Input Box */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPnrInput(val);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter 10-digit PNR (e.g. 4523891024)"
                className="w-full h-12 pl-4 pr-10 text-base font-mono tracking-wider text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              {pnrInput && (
                <span className="absolute right-3 top-3.5 text-xs font-mono text-slate-400">
                  {pnrInput.length}/10
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || pnrInput.length !== 10}
              className="w-full sm:w-auto h-12 px-6 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Checking PNR...' : 'CHECK PNR'}</span>
            </button>
          </div>

          {validationError && (
            <p className="text-xs text-rose-600 font-medium text-left mt-2 pl-1">
              {validationError}
            </p>
          )}
        </form>

        {/* Quick Sample PNR buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Try Curated Sample PNR Scenarios:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {samplePnrs.map((item) => (
              <button
                key={item.pnr}
                onClick={() => handleSelectSample(item.pnr)}
                disabled={isLoading}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono font-bold text-slate-800 group-hover:text-blue-700">
                    {item.pnr}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {item.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.scenario}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Provider Mode notice */}
        {providerStatus && providerStatus.dataSourceMode === 'DEMO' && (
          <div className="mt-5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>
              {providerStatus.demoNotice} You can test any valid 10-digit number.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

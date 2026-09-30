import React, { useState } from 'react';
import { Ticket, ArrowRight, Brain, BarChart3, Target, Sparkles, Loader2 } from 'lucide-react';
import heroTrainImage from '../assets/images/hero_speed_train_1790615386090.jpg';
import { useLanguage } from '../context/LanguageContext';

interface Page1HomeProps {
  onPredict: (pnr: string) => void;
  isLoading: boolean;
  searchError: string | null;
}

export const Page1Home: React.FC<Page1HomeProps> = ({
  onPredict,
  isLoading,
  searchError
}) => {
  const [pnrInput, setPnrInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useLanguage();

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
    onPredict(clean);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Background Starry Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex-1 flex flex-col justify-center">
        {/* Hero Title Section */}
        <div className="mb-4 pt-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-lg mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Hero Bullet Train Visual */}
        <div className="relative max-w-xl mx-auto w-full mb-6 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 group">
          <img
            src={heroTrainImage}
            alt="Futuristic high-speed train on glowing tracks"
            referrerPolicy="no-referrer"
            className="w-full h-44 sm:h-52 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E23] via-transparent to-transparent opacity-80" />
        </div>

        {/* Enter PNR Number Floating Glass Card */}
        <div className="relative max-w-lg mx-auto w-full bg-[#12163A]/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 text-center">
          {/* Centered Ticket Icon Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#12163A] flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Ticket className="w-6 h-6" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
            {t('input.label')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {t('hero.badge')}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="relative flex items-center bg-[#0B0E23]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
              <Ticket className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
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
                placeholder={t('input.placeholder')}
                className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder-slate-500 focus:outline-none"
                disabled={isLoading}
              />
              <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">
                {pnrInput.length}/10
              </span>
            </div>

            {(validationError || searchError) && (
              <p role="alert" className="text-xs text-rose-400 text-left font-medium pl-1">
                {validationError || searchError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || pnrInput.length !== 10}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('input.analyzing')}</span>
                </>
              ) : (
                <>
                  <span>{t('input.button')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feature Pillars: 3 Pillars */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto w-full mt-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-1.5 shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white block">AI Powered</span>
            <span className="text-[10px] text-slate-400 block">Smart ML Model</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-300 mb-1.5 shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white block">Historical Data</span>
            <span className="text-[10px] text-slate-400 block">Past Journey Analysis</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-1.5 shadow-md">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white block">High Accuracy</span>
            <span className="text-[10px] text-slate-400 block">Better Predictions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Train, Home, Info, HelpCircle } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  page: 1 | 2;
  onNavigateHome: () => void;
  onOpenAbout: () => void;
  onOpenHowItWorks: () => void;
  dataSourceMode?: 'LIVE' | 'DEMO';
}

export const Header: React.FC<HeaderProps> = ({
  page,
  onNavigateHome,
  onOpenAbout,
  onOpenHowItWorks,
  dataSourceMode = 'DEMO'
}) => {
  const isDark = page === 1;
  const { t } = useLanguage();

  return (
    <header className={`w-full z-30 transition-colors duration-300 ${
      isDark ? 'bg-transparent text-white' : 'bg-white border-b border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${
            isDark
              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/20'
              : 'bg-blue-700 text-white shadow-md'
          }`}>
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                RailAI
              </span>
            </div>
            <span className={`text-[11px] block leading-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('brand.subtitle')}
            </span>
          </div>
        </button>

        {/* Navigation Links and Language Switcher */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            {isDark ? (
              <>
                <button
                  onClick={onNavigateHome}
                  className="text-white font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-500 after:rounded-full"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={onOpenAbout}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {t('nav.about')}
                </button>
                <button
                  onClick={onOpenHowItWorks}
                  className="text-slate-300 hover:text-white transition-colors hidden sm:inline-block"
                >
                  {t('nav.howItWorks')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onNavigateHome}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700 font-medium transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>{t('nav.home')}</span>
                </button>
                <button
                  onClick={onOpenAbout}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700 font-medium transition-colors"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>{t('nav.about')}</span>
                </button>
                <button
                  onClick={onOpenHowItWorks}
                  className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-blue-700 font-medium transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>{t('nav.howItWorks')}</span>
                </button>
              </>
            )}
          </nav>

          {/* Regional Indian Railway Language Switcher */}
          <LanguageSwitcher isDark={isDark} />
        </div>
      </div>
    </header>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SupportedLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  isDark?: boolean;
}

const LANGUAGES: Array<{
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  badge: string;
}> = [
  { code: 'en', name: 'English', nativeName: 'English', badge: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', badge: 'HI' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', badge: 'TA' }
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isDark = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select Application Language"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
          isDark
            ? 'bg-white/10 hover:bg-white/15 text-white border-white/20 active:bg-white/20'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-300 active:bg-slate-200'
        }`}
      >
        <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />
        <span className="font-medium hidden sm:inline">{currentLang.nativeName}</span>
        <span className="font-mono font-bold sm:hidden">{currentLang.badge}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-xl border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? 'bg-[#15193B] border-slate-700 text-white shadow-black/50'
              : 'bg-white border-slate-200 text-slate-800 shadow-slate-900/10'
          }`}
        >
          <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b ${
            isDark ? 'text-slate-400 border-slate-800' : 'text-slate-400 border-slate-100'
          }`}>
            Regional Language / भाषा / மொழி
          </div>

          <div className="py-1">
            {LANGUAGES.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <button
                  key={langItem.code}
                  onClick={() => {
                    setLanguage(langItem.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-600/30 text-indigo-300 font-bold'
                        : 'bg-blue-50 text-blue-700 font-bold'
                      : isDark
                      ? 'hover:bg-white/5 text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-slate-300">
                      {langItem.badge}
                    </span>
                    <div>
                      <span className="block leading-tight">{langItem.nativeName}</span>
                      <span className="block text-[10px] text-slate-400 leading-tight">
                        {langItem.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Search, Sparkles, ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  onOpenCalculator: () => void;
  onOpenAiChat: () => void;
  onOpenQsRankings?: () => void;
}

const COUNTRIES = [
  { name: 'All', uz: 'Barchasi', ru: 'Все', en: 'All' },
  { name: 'US', label: 'AQSh (USA)', flag: '🇺🇸' },
  { name: 'GB', label: 'Buyuk Britaniya (UK)', flag: '🇬🇧' },
  { name: 'DE', label: 'Germaniya', flag: '🇩🇪' },
  { name: 'KR', label: 'Janubiy Koreya', flag: '🇰🇷' },
  { name: 'HU', label: 'Vengriya', flag: '🇭🇺' },
  { name: 'IT', label: 'Italiya', flag: '🇮🇹' },
  { name: 'TR', label: 'Turkiya', flag: '🇹🇷' },
  { name: 'CA', label: 'Kanada', flag: '🇨🇦' },
  { name: 'AU', label: 'Avstraliya', flag: '🇦🇺' },
  { name: 'UZ', label: "O'zbekiston", flag: '🇺🇿' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  selectedCountry,
  onSelectCountry,
  onOpenCalculator,
  onOpenAiChat,
  onOpenQsRankings,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-indigo-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800">
      {/* Decorative Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-400/10 via-blue-500/10 to-teal-300/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          {onOpenQsRankings && (
            <button
              onClick={onOpenQsRankings}
              id="hero-qs-rankings-pill"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-xs transition-all hover:scale-105 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>QS World University Rankings 2027</span>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-1.5 py-0.2 rounded font-extrabold ml-0.5">NEW</span>
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini AI Search Grounding & .edu Real-time Engine</span>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.hero.badgeVerified}</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {t.hero.title1}{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t.hero.desc}
          </p>
        </div>

        {/* Search Bar with Instant Actions */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-lg shadow-indigo-500/5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700 p-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              id="hero-main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 dark:text-white bg-transparent focus:outline-hidden placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
              >
                ✕
              </button>
            )}
            <button
              onClick={onOpenCalculator}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
              id="hero-calc-cta-btn"
            >
              <span>{t.nav.matchCalculator}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Country Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto mb-8">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1.5">
            {t.hero.quickFilterCountry}
          </span>
          {COUNTRIES.map((c) => {
            const isSelected = selectedCountry === c.name || (c.name === 'All' && selectedCountry === '');
            return (
              <button
                key={c.name}
                id={`hero-country-pill-${c.name.toLowerCase()}`}
                onClick={() => onSelectCountry(c.name === 'All' ? '' : c.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                {c.flag && <span>{c.flag}</span>}
                <span>{c.label || (c as any)[currentLang] || c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-xs">
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {currentLang === 'uz' ? "Doimiy Yangilanuvchi Talablar" : currentLang === 'ru' ? "Актуальные Требования Вузов" : "Real-Time Updated Criteria"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {currentLang === 'uz' ? "Har 24-72 soatda avtomatik tekshiruv" : currentLang === 'ru' ? "Проверка каждые 24-72 часа" : "Automated scheduled verification"}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {currentLang === 'uz' ? "100% To'liq Grantlar Bazasi" : currentLang === 'ru' ? "База 100% Полных Грантов" : "100% Full-Ride Scholarships"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {currentLang === 'uz' ? "Fulbright, DAAD, Stipendium, El-Yurt" : currentLang === 'ru' ? "Fulbright, DAAD, Stipendium, El-Yurt" : "Fulbright, DAAD, Stipendium, El-Yurt"}
              </p>
            </div>
          </div>

          <div 
            onClick={onOpenAiChat}
            className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3 cursor-pointer hover:border-indigo-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-indigo-900 dark:text-indigo-200">
                {currentLang === 'uz' ? "AI Qabul Eksperti bilan Suhbat" : currentLang === 'ru' ? "AI Консультант по Поступлению" : "AI Admissions Consultant"}
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 text-[11px]">
                {currentLang === 'uz' ? "24/7 shaxsiy tavsiyalar olish" : currentLang === 'ru' ? "Персональные советы 24/7" : "Get 24/7 instant guidance"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

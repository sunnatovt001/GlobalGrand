import React from 'react';
import { Globe, Sparkles, Compass, Award, Calculator, User, ShieldCheck, KeyRound, UserPlus, LogIn } from 'lucide-react';
import { Language, AuthUser } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'explore' | 'qsRankings' | 'scholarships' | 'calculator' | 'cabinet' | 'aiChat' | 'crawler' | 'profile' | 'admin';
  onTabChange: (tab: 'explore' | 'qsRankings' | 'scholarships' | 'calculator' | 'cabinet' | 'aiChat' | 'crawler' | 'profile' | 'admin') => void;
  savedCount: number;
  currentUser: AuthUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  savedCount,
  currentUser,
  onOpenAuthModal,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            id="globalgrand-brand-logo"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                GlobalGrand
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block font-medium -mt-0.5">
                {currentLang === 'uz' ? "Dunyo Oliygohlari & Grantlari" : currentLang === 'ru' ? "Мировые Вузы и Гранты" : "Admissions & Scholarships"}
              </p>
            </div>
          </div>

          {/* Compact Streamlined Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              id="nav-tab-explore"
              onClick={() => onTabChange('explore')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'explore'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.nav.explore}</span>
            </button>

            <button
              id="nav-tab-qs-rankings"
              onClick={() => onTabChange('qsRankings')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'qsRankings'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>QS 2027</span>
            </button>

            <button
              id="nav-tab-scholarships"
              onClick={() => onTabChange('scholarships')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'scholarships'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.nav.scholarships}</span>
            </button>

            <button
              id="nav-tab-calculator"
              onClick={() => onTabChange('calculator')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.nav.matchCalculator}</span>
            </button>

            {/* Profile Tab */}
            <button
              id="nav-tab-profile"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuthModal('login');
                } else {
                  onTabChange('profile');
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profilim</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Admin Panel (If Admin role) */}
            {currentUser?.role === 'admin' && (
              <button
                id="nav-tab-admin"
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            <button
              id="nav-tab-aiconsultant"
              onClick={() => onTabChange('aiChat')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'aiChat'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Maslahatchi</span>
            </button>
          </nav>

          {/* Right Tools: Auth Status, Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* If Logged In: Show User Pill */}
            {currentUser ? (
              <button
                id="header-user-profile-btn"
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 sm:gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                title="Hisob boshqaruvi / Shaxsiy profil"
              >
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover bg-indigo-100"
                />
                <div className="text-left text-[11px] leading-tight max-w-[85px] sm:max-w-[110px]">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className={`text-[9px] font-extrabold uppercase ${
                    currentUser.role === 'admin' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {currentUser.role}
                  </p>
                </div>
              </button>
            ) : (
              /* If Not Logged In: Show Sign In & Sign Up Buttons */
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  id="header-signin-btn"
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{currentLang === 'uz' ? 'Kirish' : currentLang === 'ru' ? 'Войти' : 'Sign in'}</span>
                </button>

                <button
                  id="header-signup-btn"
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{currentLang === 'uz' ? "Ro'yxatdan o'tish" : currentLang === 'ru' ? 'Регистрация' : 'Sign up'}</span>
                  <span className="sm:hidden">{currentLang === 'uz' ? "Qo'shilish" : currentLang === 'ru' ? 'Рег.' : 'Sign up'}</span>
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700">
              <button
                id="lang-btn-uz"
                onClick={() => onLanguageChange('uz')}
                className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentLang === 'uz'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                UZ
              </button>
              <button
                id="lang-btn-ru"
                onClick={() => onLanguageChange('ru')}
                className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentLang === 'ru'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                RU
              </button>
              <button
                id="lang-btn-en"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 sm:px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentLang === 'en'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>

          </div>
        </div>

        {/* Compact Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-100 dark:border-slate-800 scrollbar-none text-xs touch-pan-x">
          <button
            id="mob-nav-explore"
            onClick={() => onTabChange('explore')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-colors shrink-0 ${
              activeTab === 'explore' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.explore}
          </button>
          
          <button
            id="mob-nav-qs"
            onClick={() => onTabChange('qsRankings')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1 transition-colors shrink-0 ${
              activeTab === 'qsRankings' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400'
            }`}
          >
            <Award className="w-3 h-3" />
            QS 2027
          </button>

          <button
            id="mob-nav-scholarships"
            onClick={() => onTabChange('scholarships')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-colors shrink-0 ${
              activeTab === 'scholarships' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.scholarships}
          </button>

          <button
            id="mob-nav-calculator"
            onClick={() => onTabChange('calculator')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-colors shrink-0 ${
              activeTab === 'calculator' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav.matchCalculator}
          </button>

          <button
            id="mob-nav-profile"
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal('login');
              } else {
                onTabChange('profile');
              }
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1 transition-colors shrink-0 ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <User className="w-3 h-3" />
            Profilim {savedCount > 0 && `(${savedCount})`}
          </button>

          {currentUser?.role === 'admin' && (
            <button
              id="mob-nav-admin"
              onClick={() => onTabChange('admin')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1 transition-colors shrink-0 ${
                activeTab === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          )}

          <button
            id="mob-nav-ai"
            onClick={() => onTabChange('aiChat')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1 transition-colors shrink-0 ${
              activeTab === 'aiChat' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            AI Maslahatchi
          </button>
        </div>

      </div>
    </header>
  );
};


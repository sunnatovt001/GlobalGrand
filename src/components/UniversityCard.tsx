import React from 'react';
import { 
  Bookmark, 
  Sparkles, 
  Award, 
  Calendar, 
  CheckCircle, 
  ExternalLink, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Language, University } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface UniversityCardProps {
  university: University;
  currentLang: Language;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectUniversity: (uni: University) => void;
  onQuickReverify: (uni: University) => void;
  isVerifying?: boolean;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  currentLang,
  isSaved,
  onToggleSave,
  onSelectUniversity,
  onQuickReverify,
  isVerifying = false,
}) => {
  const t = TRANSLATIONS[currentLang];
  const u = university;

  // Compute nearest deadline
  const nearestDeadline = u.deadlines?.[0];
  const formattedVerifiedDate = new Date(u.verification.lastVerifiedAt).toLocaleDateString(
    currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div 
      id={`university-card-${u.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      <div>
        {/* Cover & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={u.coverImage}
            alt={u.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-400/40 shadow-xs flex items-center gap-1">
                <span>🏆</span>
                <span>QS #{u.rankingQs}</span>
              </span>
              {u.scholarships.length > 0 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 backdrop-blur-md text-white shadow-xs flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>100% Grant</span>
                </span>
              )}
            </div>

            {/* Bookmark button */}
            <button
              id={`bookmark-btn-${u.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(u.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
              }`}
              title={isSaved ? t.card.saved : t.card.save}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Location & Title on cover */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5 text-slate-200 text-xs font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{u.city}, {u.country}</span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug line-clamp-1 drop-shadow-xs">
              {u.name}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3.5">
          
          {/* Tuition & Acceptance row */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {t.card.tuition}
              </p>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                {u.tuitionUsdPerYear === 0 ? "100% Bepul" : `$${u.tuitionUsdPerYear.toLocaleString()}/yil`}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {currentLang === 'uz' ? "Qabul foizi" : currentLang === 'ru' ? "Прием" : "Acceptance"}
              </p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                {u.requirements.acceptanceRatePercent}%
              </p>
            </div>
          </div>

          {/* Minimum Requirements Badges */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">IELTS:</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-300">{u.requirements.minIelts}+</span>
            </div>
            <div className="flex-1 bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">GPA:</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-300">{u.requirements.minGpa}+</span>
            </div>
          </div>

          {/* Nearest Deadline */}
          {nearestDeadline && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-semibold">{nearestDeadline.season}:</span>
              <span className="text-slate-500 dark:text-slate-400">{nearestDeadline.date}</span>
            </div>
          )}

          {/* Popular Majors Tags */}
          <div className="flex flex-wrap gap-1">
            {u.popularMajors.slice(0, 2).map((m, idx) => (
              <span 
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                {m}
              </span>
            ))}
            {u.popularMajors.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                +{u.popularMajors.length - 2}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Card Footer with Verification Pill & Action Buttons */}
      <div className="p-4 pt-0 space-y-2.5">
        
        {/* Real-time verification notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate">{formattedVerifiedDate}</span>
          </div>

          <button
            id={`reverify-btn-${u.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickReverify(u);
            }}
            disabled={isVerifying}
            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 hover:underline disabled:opacity-50"
            title="Google Search Grounding bilan qayta tekshirish"
          >
            <Sparkles className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? '...' : t.card.liveReverify}</span>
          </button>
        </div>

        {/* View Details Primary Button */}
        <button
          id={`view-details-btn-${u.id}`}
          onClick={() => onSelectUniversity(u)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs group-hover:bg-indigo-600"
        >
          <span>{t.card.viewDetails}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};

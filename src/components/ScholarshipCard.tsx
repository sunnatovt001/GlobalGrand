import React from 'react';
import { Award, Calendar, DollarSign, ExternalLink, Globe, CheckCircle2, BookOpen } from 'lucide-react';
import { ExternalScholarship, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ScholarshipCardProps {
  scholarship: ExternalScholarship;
  currentLang: Language;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const s = scholarship;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-5 flex flex-col justify-between">
      
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{s.coverageType}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {s.providerCountry}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <span>{s.deadline}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug mb-2">
          {s.name}
        </h3>
        
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {s.description[currentLang]}
        </p>

        {/* Financial Breakdown Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/80 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            {t.scholarshipSection.financialBreakdown}
          </p>
          <p className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 mt-0.5">
            {s.financialBreakdown[currentLang]}
          </p>
        </div>

        {/* Eligibility Requirements */}
        <div className="space-y-2 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t.scholarshipSection.eligibility}
          </p>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {s.eligibilityCriteria[currentLang]?.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Target Degrees & Tests */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
          {s.degreeLevels.map((d, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
              {d}
            </span>
          ))}
          {s.requiredTests.map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      <a
        href={s.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
      >
        <span>{t.scholarshipSection.officialApply}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Award, 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  ShieldCheck, 
  BookOpen,
  DollarSign
} from 'lucide-react';
import { DegreeLevel, Language, RecommendationResult, University, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { calculateUniversityMatch } from '../utils/scoring';

interface RecommendationCalculatorProps {
  universities: University[];
  currentLang: Language;
  onSelectUniversity: (uni: University) => void;
  onToggleSave: (id: string) => void;
  savedIds: string[];
}

export const RecommendationCalculator: React.FC<RecommendationCalculatorProps> = ({
  universities,
  currentLang,
  onSelectUniversity,
  onToggleSave,
  savedIds,
}) => {
  const t = TRANSLATIONS[currentLang];

  // User input profile state
  const [profile, setProfile] = useState<UserProfile>({
    gpa: 3.4,
    gpaScale: '4.0',
    ielts: 6.5,
    toefl: 0,
    duolingo: 0,
    sat: 1300,
    maxBudgetUsd: 5000,
    targetDegree: 'Bachelor',
    selectedMajors: ['Computer Science', 'Business & Management'],
    needScholarship: 'full',
    preferredCountries: [],
    priorityWeights: {
      gpa: 0.2,
      language: 0.25,
      budget: 0.25,
      major: 0.1,
      scholarship: 0.1,
      ranking: 0.1,
    },
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Reach' | 'Match' | 'Safety'>('All');

  // Compute recommendations
  const allResults: RecommendationResult[] = universities.map((u) =>
    calculateUniversityMatch(u, profile)
  ).sort((a, b) => b.overallScore - a.overallScore);

  const reachResults = allResults.filter((r) => r.matchCategory === 'Reach');
  const matchResults = allResults.filter((r) => r.matchCategory === 'Match');
  const safetyResults = allResults.filter((r) => r.matchCategory === 'Safety');

  const filteredResults = activeCategoryFilter === 'All'
    ? allResults
    : allResults.filter((r) => r.matchCategory === activeCategoryFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Ko'p Mezonli Shaxsiylashtirilgan Skoring Modeli</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.scoring.title}
          </h2>
          <p className="mt-2 text-sm text-indigo-200 leading-relaxed font-normal">
            {t.scoring.subtitle}
          </p>
        </div>
      </div>

      {/* Inputs Form & Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span>Sizning Akademik Profilingiz va Byudjetingiz</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* GPA Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.scoring.yourGpa}
              </label>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {profile.gpa.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={2.0}
              max={4.0}
              step={0.05}
              value={profile.gpa}
              onChange={(e) => setProfile({ ...profile, gpa: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
            </div>
          </div>

          {/* IELTS Score Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.scoring.yourIelts}
              </label>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {profile.ielts.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={4.5}
              max={9.0}
              step={0.5}
              value={profile.ielts}
              onChange={(e) => setProfile({ ...profile, ielts: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5.0</span>
              <span>6.5</span>
              <span>9.0</span>
            </div>
          </div>

          {/* SAT Score Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.scoring.yourSat}
              </label>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {profile.sat && profile.sat > 0 ? profile.sat : 'Topshirilmagan'}
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={1600}
              step={20}
              value={profile.sat || 1200}
              onChange={(e) => setProfile({ ...profile, sat: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>800</span>
              <span>1350</span>
              <span>1600</span>
            </div>
          </div>

          {/* Annual Budget Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.scoring.yourBudget}
              </label>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                ${profile.maxBudgetUsd.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60000}
              step={2500}
              value={profile.maxBudgetUsd}
              onChange={(e) => setProfile({ ...profile, maxBudgetUsd: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$0 (Grant)</span>
              <span>$15k</span>
              <span>$60k+</span>
            </div>
          </div>

        </div>

        {/* Degree & Scholarship Need Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.scoring.targetDegree}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Bachelor', 'Master', 'PhD', 'Foundation'] as DegreeLevel[]).map((deg) => (
                <button
                  key={deg}
                  onClick={() => setProfile({ ...profile, targetDegree: deg })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    profile.targetDegree === deg
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.scoring.needScholarshipLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'full', label: t.scoring.needFull },
                { id: 'partial', label: t.scoring.needPartial },
                { id: 'any', label: t.scoring.needAny },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setProfile({ ...profile, needScholarship: opt.id as any })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    profile.needScholarship === opt.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Results Summary Tabs (Reach, Match, Safety) */}
      <div className="space-y-4">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategoryFilter('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategoryFilter === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            Barchasi ({allResults.length})
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryFilter === 'Match'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.categories.match} ({matchResults.length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Safety')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryFilter === 'Safety'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.categories.safety} ({safetyResults.length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Reach')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategoryFilter === 'Reach'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.categories.reach} ({reachResults.length})</span>
          </button>
        </div>

        {/* Results Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map((res) => {
            const u = res.university;
            const isSaved = savedIds.includes(u.id);

            return (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
              >
                <div>
                  {/* Top Category & Match Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        res.matchCategory === 'Match'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : res.matchCategory === 'Safety'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {res.matchCategory === 'Match' ? t.categories.match : res.matchCategory === 'Safety' ? t.categories.safety : t.categories.reach}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{res.overallScore}% Moslik</span>
                    </div>
                  </div>

                  {/* University Name */}
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                    {u.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {u.city}, {u.country} • QS #{u.rankingQs}
                  </p>

                  {/* Match Score Breakdown Progress Bars */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-[11px] mb-3">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>GPA Mosligi</span>
                      <span className="font-bold">{res.scoreBreakdown.gpaScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${res.scoreBreakdown.gpaScore}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>IELTS / Til Mosligi</span>
                      <span className="font-bold">{res.scoreBreakdown.languageScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${res.scoreBreakdown.languageScore}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Byudjet & Grant Qamrovi</span>
                      <span className="font-bold">{res.scoreBreakdown.budgetScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${res.scoreBreakdown.budgetScore}%` }} />
                    </div>
                  </div>

                  {/* Reasons & Tips */}
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4">
                    {res.reasons[currentLang]?.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{r}</span>
                      </div>
                    ))}
                    {res.improvementTips[currentLang]?.slice(0, 1).map((tip, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300 italic bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                        <span>💡</span>
                        <span className="leading-snug">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onSelectUniversity(u)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                  >
                    Batafsil Ko'rish
                  </button>
                  <button
                    onClick={() => onToggleSave(u.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                      isSaved
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isSaved ? 'Saqlangan' : 'Saqlash'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

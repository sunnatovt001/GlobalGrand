import React from 'react';
import { SlidersHorizontal, RotateCcw, DollarSign, Award, GraduationCap, Check } from 'lucide-react';
import { DegreeLevel, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FilterBarProps {
  currentLang: Language;
  selectedDegree: DegreeLevel | '';
  onSelectDegree: (degree: DegreeLevel | '') => void;
  maxTuition: number;
  onMaxTuitionChange: (val: number) => void;
  minIelts: number;
  onMinIeltsChange: (val: number) => void;
  scholarshipOnly: boolean;
  onToggleScholarshipOnly: () => void;
  elYurtOnly: boolean;
  onToggleElYurtOnly: () => void;
  sortBy: 'ranking' | 'tuitionAsc' | 'acceptance';
  onSortByChange: (sort: 'ranking' | 'tuitionAsc' | 'acceptance') => void;
  onResetFilters: () => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentLang,
  selectedDegree,
  onSelectDegree,
  maxTuition,
  onMaxTuitionChange,
  minIelts,
  onMinIeltsChange,
  scholarshipOnly,
  onToggleScholarshipOnly,
  elYurtOnly,
  onToggleElYurtOnly,
  sortBy,
  onSortByChange,
  onResetFilters,
  resultsCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  const degrees: { id: DegreeLevel | ''; label: string }[] = [
    { id: '', label: t.filters.allDegrees },
    { id: 'Bachelor', label: t.filters.bachelor },
    { id: 'Master', label: t.filters.master },
    { id: 'PhD', label: t.filters.phd },
    { id: 'Foundation', label: t.filters.foundation },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {t.filters.title}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
            {resultsCount} {t.filters.resultsCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">{t.filters.sortBy}:</span>
            <select
              id="filter-sort-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ranking">{t.filters.sortRanking}</option>
              <option value="tuitionAsc">{t.filters.sortTuitionLow}</option>
              <option value="acceptance">{t.filters.sortAcceptanceRate}</option>
            </select>
          </div>

          <button
            id="filter-reset-btn"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.filters.reset}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        
        {/* Degree Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.filters.degree}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {degrees.map((d) => (
              <button
                key={d.id || 'all'}
                id={`degree-filter-${d.id ? d.id.toLowerCase() : 'all'}`}
                onClick={() => onSelectDegree(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedDegree === d.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Annual Tuition Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-700 dark:text-slate-300">{t.filters.maxTuition}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
              {maxTuition >= 70000 ? (currentLang === 'uz' ? 'Cheksiz' : currentLang === 'ru' ? 'Любой' : 'Any') : `$${maxTuition.toLocaleString()}/yr`}
            </span>
          </div>
          <input
            id="tuition-slider-input"
            type="range"
            min={0}
            max={70000}
            step={2500}
            value={maxTuition}
            onChange={(e) => onMaxTuitionChange(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>$0 (100% Grant)</span>
            <span>$25k</span>
            <span>$70k+</span>
          </div>
        </div>

        {/* Min IELTS Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-700 dark:text-slate-300">{t.filters.minIelts}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
              {minIelts <= 4.5 ? (currentLang === 'uz' ? 'Talab qilinmaydi' : currentLang === 'ru' ? 'Любой' : 'Any') : `${minIelts.toFixed(1)}+`}
            </span>
          </div>
          <input
            id="ielts-slider-input"
            type="range"
            min={4.5}
            max={8.0}
            step={0.5}
            value={minIelts}
            onChange={(e) => onMinIeltsChange(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>4.5</span>
            <span>6.0</span>
            <span>7.0</span>
            <span>8.0</span>
          </div>
        </div>

        {/* Quick Toggles: Scholarships & El-Yurt Umidi */}
        <div className="flex flex-col justify-center gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              id="scholarship-only-checkbox"
              type="checkbox"
              checked={scholarshipOnly}
              onChange={onToggleScholarshipOnly}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 rounded-sm focus:ring-indigo-500"
            />
            <span className="truncate">{t.filters.scholarshipOnly}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              id="elyurt-only-checkbox"
              type="checkbox"
              checked={elYurtOnly}
              onChange={onToggleElYurtOnly}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 rounded-sm focus:ring-indigo-500"
            />
            <span className="text-amber-600 dark:text-amber-400 truncate">{t.filters.elYurtOnly}</span>
          </label>
        </div>

      </div>

    </div>
  );
};

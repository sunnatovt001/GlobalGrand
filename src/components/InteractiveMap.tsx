import React from 'react';
import { MapPin, Globe2, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface InteractiveMapProps {
  currentLang: Language;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  universityCounts: Record<string, number>;
}

const REGIONS = [
  { id: '', name: { uz: 'Barcha Qit\'alar', ru: 'Весь мир', en: 'All World' }, icon: '🌍' },
  { id: 'Europe', name: { uz: 'Yevropa & UK', ru: 'Европа и Британия', en: 'Europe & UK' }, icon: '🏰', countries: 'UK, Germany, Italy, Hungary' },
  { id: 'North America', name: { uz: 'Shimoliy Amerika', ru: 'Северная Америка', en: 'North America' }, icon: '🗽', countries: 'USA, Canada' },
  { id: 'East Asia', name: { uz: 'Sharqiy Osiyo', ru: 'Восточная Азия', en: 'East Asia' }, icon: '⛩️', countries: 'South Korea, Japan, China' },
  { id: 'Central Asia', name: { uz: 'Markaziy Osiyo', ru: 'Центральная Азия', en: 'Central Asia' }, icon: '🏛️', countries: 'Uzbekistan, Kazakhstan' },
  { id: 'Middle East', name: { uz: 'Yaqin Sharq', ru: 'Ближний Восток', en: 'Middle East' }, icon: '🕌', countries: 'Turkey, UAE, Qatar' },
  { id: 'Oceania', name: { uz: 'Okeaniya', ru: 'Океания', en: 'Oceania' }, icon: '🦘', countries: 'Australia, New Zealand' },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentLang,
  selectedRegion,
  onSelectRegion,
  universityCounts,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {currentLang === 'uz' ? "Dunyo Xaritasi Bo'yicha Tanlash" : currentLang === 'ru' ? "Интерактивная Карта Мира" : "Interactive Global Map & Regions"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLang === 'uz' ? "Mintaqani bosing va mos universitetlar hamda grantlarni filtrlang" : currentLang === 'ru' ? "Выберите регион для мгновенной фильтрации" : "Click a region to filter universities and regional grants"}
            </p>
          </div>
        </div>

        {selectedRegion && (
          <button
            onClick={() => onSelectRegion('')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {currentLang === 'uz' ? "Barcha qit'alarni ko'rsatish" : currentLang === 'ru' ? "Показать все регионы" : "Show all regions"}
          </button>
        )}
      </div>

      {/* Region Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {REGIONS.map((r) => {
          const isSelected = selectedRegion === r.id;
          const count = r.id === '' 
            ? Object.values(universityCounts).reduce<number>((acc, val) => acc + (Number(val) || 0), 0)
            : universityCounts[r.id] || 0;

          return (
            <button
              key={r.id || 'all'}
              id={`region-btn-${r.id ? r.id.toLowerCase().replace(/\s+/g, '-') : 'all'}`}
              onClick={() => onSelectRegion(r.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{r.icon}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="font-bold text-xs truncate">
                {r.name[currentLang]}
              </p>
              {r.countries && (
                <p
                  className={`text-[10px] truncate mt-0.5 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  {r.countries}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

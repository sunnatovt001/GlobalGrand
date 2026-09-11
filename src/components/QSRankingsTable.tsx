import React, { useState, useMemo } from 'react';
import { QSRankingItem, University } from '../types';
import { QS_RANKING_2027_LIST } from '../data/universities/qs_ranking_list';
import { Search, Filter, ArrowUpDown, ExternalLink, CheckCircle2, TrendingUp, TrendingDown, Minus, Sparkles, Building2, Globe, Award } from 'lucide-react';

interface QSRankingsTableProps {
  onSelectUniversity?: (uni: University) => void;
  universitiesDatabase: University[];
  onOpenAiConsultant?: (prompt?: string) => void;
}

export const QSRankingsTable: React.FC<QSRankingsTableProps> = ({
  onSelectUniversity,
  universitiesDatabase,
  onOpenAiConsultant,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [onlyCentralAsia, setOnlyCentralAsia] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'score'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const pageSize = 25;

  const filteredItems = useMemo(() => {
    return QS_RANKING_2027_LIST.filter((item) => {
      if (onlyCentralAsia && !item.isUzbekistanOrCentralAsia && item.country !== 'Uzbekistan' && item.country !== 'Kazakhstan' && item.country !== 'Kyrgyzstan') {
        return false;
      }
      if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCountry = item.country.toLowerCase().includes(q);
        const matchRank = String(item.rank2027).includes(q);
        if (!matchName && !matchCountry && !matchRank) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rank') {
        const numA = typeof a.rank2027 === 'number' ? a.rank2027 : parseInt(String(a.rank2027).split('-')[0]) || 9999;
        const numB = typeof b.rank2027 === 'number' ? b.rank2027 : parseInt(String(b.rank2027).split('-')[0]) || 9999;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortBy === 'score') {
        const scoreA = typeof a.overallScore === 'number' ? a.overallScore : 0;
        const scoreB = typeof b.overallScore === 'number' ? b.overallScore : 0;
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      return 0;
    });
  }, [search, selectedRegion, onlyCentralAsia, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  // Helper to match with full detailed profile in database
  const getFullProfile = (item: QSRankingItem): University | undefined => {
    return universitiesDatabase.find((u) => {
      const uName = u.name.toLowerCase();
      const iName = item.name.toLowerCase();
      return uName.includes(iName) || iName.includes(uName) || (u.rankingQs === item.rank2027 && u.country.toLowerCase().includes(item.country.toLowerCase()));
    });
  };

  const getRankDiff = (rank2027: string | number, rank2026: string | number) => {
    const num27 = typeof rank2027 === 'number' ? rank2027 : parseInt(String(rank2027).split('-')[0]);
    const num26 = typeof rank2026 === 'number' ? rank2026 : parseInt(String(rank2026).split('-')[0]);
    if (!isNaN(num27) && !isNaN(num26)) {
      const diff = num26 - num27;
      if (diff > 0) return { type: 'up', val: `+${diff}` };
      if (diff < 0) return { type: 'down', val: `${diff}` };
      return { type: 'same', val: '=' };
    }
    return { type: 'neutral', val: '-' };
  };

  return (
    <div id="qs-rankings-module" className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            QS World University Rankings 2027 Rasmiy Ro'yxati
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dunyoning va O'zbekistonning eng nufuzli TOP universitetlari
          </h2>
          <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
            QS World University Rankings ro'yxatidagi barcha oliygohlar, ularning o'rinlari, 2026-yilga nisbatan o'sishi hamda O'zbekiston va Markaziy Osiyo oliygohlari ma'lumotlari.
          </p>

          {/* Quick Highlight Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-200 block">Jami reytinglangan</span>
              <span className="text-xl font-bold text-white">1,500+</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-200 block">O'zbekiston (#1)</span>
              <span className="text-xl font-bold text-amber-300">TIIAME #458</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-200 block">O'zbekiston (#2)</span>
              <span className="text-xl font-bold text-emerald-300">O'zMU #801-850</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-xs text-blue-200 block">El-Yurt Umidi</span>
              <span className="text-xl font-bold text-cyan-300">Top-300 mos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="qs-search-input"
              type="text"
              placeholder="Universitet nomi, davlat yoki o'rin bo'yicha qidirish..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Region Filter */}
            <select
              id="qs-region-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Barcha Mintaqalar</option>
              <option value="Americas">Shimoliy & Janubiy Amerika</option>
              <option value="Europe">Yevropa</option>
              <option value="Asia">Osiyo</option>
              <option value="Central Asia">Markaziy Osiyo & O'zbekiston</option>
              <option value="Middle East">Yaqin Sharq</option>
              <option value="Oceania">Okeaniya (Avstraliya/NZ)</option>
            </select>

            {/* Central Asia Toggle */}
            <button
              id="qs-central-asia-toggle"
              onClick={() => {
                setOnlyCentralAsia(!onlyCentralAsia);
                setPage(1);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                onlyCentralAsia
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              🇺🇿 O'zbekiston & Markaziy Osiyo
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">QS 2027</th>
                <th className="py-3.5 px-3 w-16 text-center">2026</th>
                <th className="py-3.5 px-4">Universitet Nomi & Mamlakat</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Mintaqa & Turi</th>
                <th className="py-3.5 px-4 hidden lg:table-cell text-center">Ilmiy Tadqiqot</th>
                <th className="py-3.5 px-4 text-center">Umumiy Ball</th>
                <th className="py-3.5 px-4 text-right">Qabul & Profil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-normal">
              {paginatedItems.map((item) => {
                const diff = getRankDiff(item.rank2027, item.rank2026);
                const fullProfile = getFullProfile(item);
                const isUz = item.country === 'Uzbekistan' || item.name.includes('Tashkent') || item.name.includes('Samarkand');

                return (
                  <tr
                    key={item.index + '-' + item.name}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isUz ? 'bg-amber-50/40 dark:bg-amber-950/20 font-medium' : ''
                    }`}
                  >
                    {/* 2027 Rank */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-lg text-xs ${
                          typeof item.rank2027 === 'number' && item.rank2027 <= 10
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                            : typeof item.rank2027 === 'number' && item.rank2027 <= 100
                            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                            : isUz
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        #{item.rank2027}
                      </span>
                    </td>

                    {/* Previous Rank Diff */}
                    <td className="py-4 px-3 text-center text-xs">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-slate-400 dark:text-slate-500">#{item.rank2026}</span>
                        {diff.type === 'up' && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] flex items-center">
                            <TrendingUp className="w-3 h-3" />
                            {diff.val}
                          </span>
                        )}
                        {diff.type === 'down' && (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold text-[10px] flex items-center">
                            <TrendingDown className="w-3 h-3" />
                            {diff.val}
                          </span>
                        )}
                        {diff.type === 'same' && (
                          <span className="text-slate-400 text-[10px]">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* University Name & Country */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                            {item.name}
                          </span>
                          {isUz && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                              🇺🇿 O'zbekiston
                            </span>
                          )}
                          {fullProfile && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Verifikatsiyalangan
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{item.country}</span>
                          {item.status && <span className="text-slate-300 dark:text-slate-600">•</span>}
                          <span>{item.status}</span>
                        </div>
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-4 px-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-300">
                      <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {item.region}
                      </span>
                    </td>

                    {/* Research Focus */}
                    <td className="py-4 px-4 hidden lg:table-cell text-center text-xs">
                      {item.research === 'VH' ? (
                        <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 text-[11px] font-medium">
                          Very High (VH)
                        </span>
                      ) : item.research === 'HI' ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium">
                          High (HI)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">O'rtacha</span>
                      )}
                    </td>

                    {/* Overall Score */}
                    <td className="py-4 px-4 text-center">
                      {item.overallScore ? (
                        <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md text-xs">
                          {item.overallScore} / 100
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      {fullProfile ? (
                        <button
                          onClick={() => onSelectUniversity && onSelectUniversity(fullProfile)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          Talablar & Grant
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onOpenAiConsultant
                              ? onOpenAiConsultant(`${item.name} (${item.country}) universiteti haqida qabul talablari, IELTS, GPA va grantlari haqida to'liq ma'lumot ber.`)
                              : null
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          AI Qabul Tahlili
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Jami: <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredItems.length}</span> ta universitet
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              Oldingi
            </button>
            <span>
              Sahifa <strong className="text-slate-800 dark:text-slate-200">{page}</strong> / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              Keyingi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bookmark, 
  CheckSquare, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ApplicationChecklistItem, Language, University } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface UserCabinetProps {
  savedUniversities: University[];
  currentLang: Language;
  onSelectUniversity: (uni: University) => void;
  onRemoveSaved: (id: string) => void;
  onExploreMore: () => void;
}

const DEFAULT_CHECKLIST: ApplicationChecklistItem[] = [
  { id: 'c1', title: "IELTS / TOEFL / Duolingo sertifikatini olish va balni tekshirish", completed: true, category: 'tests', notes: 'IELTS 7.0 natijasi olindi' },
  { id: 'c2', title: "Diplom va baholar transkriptini notarial tarjima va apostil qilish", completed: true, category: 'docs' },
  { id: 'c3', title: "Akademik rezyume (CV / Europass format) tayyorlash", completed: false, category: 'docs' },
  { id: 'c4', title: "2 ta professor yoki ish beruvchidan tavsiyanoma (Recommendation Letter) olish", completed: false, category: 'recommendation' },
  { id: 'c5', title: "Motivatsion insho (Statement of Purpose / Personal Statement) yozish", completed: false, category: 'essay', notes: 'Dastur yo\'nalishiga moslashtirish kerak' },
  { id: 'c6', title: "Moliyaviy kafolat hujjati (Bank Statement / Grant sertifikati) tayyorlash", completed: false, category: 'financial' },
  { id: 'c7', title: "Rasmiy qabul portaliga barcha hujjatlarni yuklab ariza yuborish", completed: false, category: 'submission' },
];

export const UserCabinet: React.FC<UserCabinetProps> = ({
  savedUniversities,
  currentLang,
  onSelectUniversity,
  onRemoveSaved,
  onExploreMore,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'saved' | 'checklist' | 'deadlines'>('saved');
  const [checklist, setChecklist] = useState<ApplicationChecklistItem[]>(DEFAULT_CHECKLIST);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  const toggleChecklist = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;
    const newItem: ApplicationChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newTodoTitle.trim(),
      completed: false,
      category: 'docs',
    };
    setChecklist([...checklist, newItem]);
    setNewTodoTitle('');
  };

  const handleDeleteTodo = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Talabaning Shaxsiy Ishchi Makoni</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.cabinet.title}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed font-normal">
            {t.cabinet.subtitle}
          </p>

          {/* Progress Overview */}
          <div className="mt-6 max-w-md bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>{t.cabinet.progress}</span>
              <span className="text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5">
              {completedCount} / {checklist.length} ta topshiriq bajarildi
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{t.cabinet.savedTab} ({savedUniversities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{t.cabinet.checklistTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('deadlines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'deadlines'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.cabinet.deadlinesTab}</span>
        </button>
      </div>

      {/* TAB 1: SAVED UNIVERSITIES */}
      {activeTab === 'saved' && (
        <div>
          {savedUniversities.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Saqlangan Universitetlar Yo'q
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t.cabinet.noSaved}
              </p>
              <button
                onClick={onExploreMore}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Universitetlarni Qidirish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedUniversities.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-500 text-slate-950">
                        QS #{u.rankingQs}
                      </span>
                      <button
                        onClick={() => onRemoveSaved(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                      {u.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">{u.city}, {u.country}</p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kontrakt:</span>
                        <span className="font-bold">{u.tuitionUsdPerYear === 0 ? '100% Bepul' : `$${u.tuitionUsdPerYear.toLocaleString()}/yil`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">IELTS / GPA:</span>
                        <span className="font-bold">{u.requirements.minIelts}+ / {u.requirements.minGpa}+</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectUniversity(u)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors"
                  >
                    Batafsil Ko'rish
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATION CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Xalqaro Ariza Tayyorgarligi Bosqichlari
              </h3>
              <p className="text-xs text-slate-500">
                Har bir topshiriqni bajargan sari belgilab boring.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="Yangi topshiriq qo'shish..."
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
              />
              <button
                onClick={handleAddTodo}
                className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  item.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 mt-0.5"
                  />
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.title}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-400 mt-0.5 no-underline">
                        📝 {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(item.id);
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEADLINES CALENDAR */}
      {activeTab === 'deadlines' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            Saqlangan Oliygohlarning Yaqinlashayotgan Muddatlari
          </h3>

          <div className="space-y-3">
            {savedUniversities.flatMap((u) =>
              u.deadlines.map((dl, i) => ({
                id: `${u.id}-${i}`,
                uniName: u.name,
                country: u.country,
                season: dl.season,
                date: dl.date,
                type: dl.type,
              }))
            ).length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Hali saqlangan universitetlar yo'q. Universitet qo'shsangiz ularning deadline taqvimi shu yerda aks etadi.
              </p>
            ) : (
              savedUniversities.flatMap((u) =>
                u.deadlines.map((dl, i) => (
                  <div
                    key={`${u.id}-${i}`}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">{u.name}</p>
                        <p className="text-slate-500">{dl.season} • {dl.type}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs">
                      {dl.date}
                    </span>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
};

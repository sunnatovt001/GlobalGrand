import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  ShieldCheck, 
  Flag,
  RotateCcw,
  Bookmark
} from 'lucide-react';
import { Language, University, SourceCitation } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface UniversityDetailModalProps {
  university: University | null;
  onClose: () => void;
  currentLang: Language;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onReportIssue: (uni: University) => void;
  onLiveVerify: (uni: University) => Promise<any>;
}

export const UniversityDetailModal: React.FC<UniversityDetailModalProps> = ({
  university,
  onClose,
  currentLang,
  isSaved,
  onToggleSave,
  onReportIssue,
  onLiveVerify,
}) => {
  if (!university) return null;

  const t = TRANSLATIONS[currentLang];
  const u = university;

  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'scholarships' | 'deadlines' | 'uzbekistan' | 'aiVerify'>('overview');
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVerifyResult, setLiveVerifyResult] = useState<any>(null);

  const handleRunVerification = async () => {
    setIsVerifying(true);
    try {
      const res = await onLiveVerify(u);
      setLiveVerifyResult(res);
    } catch (err) {
      console.error('Verification failed', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const formattedDate = new Date(u.verification.lastVerifiedAt).toLocaleDateString(
    currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="university-detail-modal-container"
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        
        {/* Header with Cover */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 bg-slate-800">
          <img
            src={u.coverImage}
            alt={u.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

          {/* Close & Save Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => onToggleSave(u.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isSaved
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-white hover:bg-white'
              }`}
              title={isSaved ? t.card.saved : t.card.save}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header Info */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-amber-500 text-slate-950 shadow-xs">
                  QS #{u.rankingQs}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                  THE #{u.rankingThe}
                </span>
                {u.uzbekistanContext.elYurtUmidiEligible && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-600 text-white shadow-xs">
                    El-Yurt Umidi (Top 300)
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {u.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{u.city}, {u.country}</span>
              </div>
            </div>

            <a
              href={u.officialAdmissionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shrink-0 shadow-md"
            >
              <span>{t.modal.applyLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.modal.overview}
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'requirements'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.modal.requirementsTab}
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'scholarships'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.modal.scholarshipsTab} ({u.scholarships.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deadlines')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'deadlines'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.modal.deadlinesTab}
          </button>

          <button
            onClick={() => setActiveTab('uzbekistan')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'uzbekistan'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.modal.uzbekistanTab}
          </button>

          <button
            onClick={() => setActiveTab('aiVerify')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'aiVerify'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modal.aiVerifyTab}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {currentLang === 'uz' ? "Universitet Haqida" : currentLang === 'ru' ? "Об Университете" : "About University"}
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {u.description[currentLang]}
                </p>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{t.card.tuition}</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {u.tuitionUsdPerYear === 0 ? "Bepul" : `$${u.tuitionUsdPerYear.toLocaleString()}/yil`}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">{u.tuitionRangeText}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{t.card.living}</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    ${u.livingCostUsdPerYear.toLocaleString()}/yil
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Yotoqxona & oziq-ovqat</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{t.modal.acceptanceRate}</p>
                  <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {u.requirements.acceptanceRatePercent}%
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Tanlov darajasi</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ta'lim Tili</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {u.teachingLanguages.join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Xalqaro dasturlar</p>
                </div>
              </div>

              {/* Popular Majors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {currentLang === 'uz' ? "Eng Kuchli Fakultetlar va Yo'nalishlar" : currentLang === 'ru' ? "Популярные Факультеты" : "Featured Faculties & Majors"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {u.popularMajors.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 text-xs font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Degrees Offered */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {currentLang === 'uz' ? "Taklif Etiladigan Bosqichlar" : currentLang === 'ru' ? "Степени Обучения" : "Degrees Offered"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {u.degreesOffered.map((d, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              
              {/* Test Benchmarks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t.modal.testsTitle}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">IELTS</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{u.requirements.minIelts}+</p>
                    <p className="text-[10px] text-slate-500">Minimal umumiy ball</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">TOEFL iBT</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{u.requirements.minToefl}+</p>
                    <p className="text-[10px] text-slate-500">Internet-based test</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">GPA (Baho)</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{u.requirements.minGpa}+</p>
                    <p className="text-[10px] text-slate-500">{u.requirements.gpaScale}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">SAT Test</p>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                      {u.requirements.satRequired ? `${u.requirements.minSat}+` : 'Majburiy emas'}
                    </p>
                    <p className="text-[10px] text-slate-500">{u.requirements.satRequired ? 'Talab qilinadi' : 'Test-optional'}</p>
                  </div>
                </div>

                {u.requirements.languageNotes && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800">
                    💡 {u.requirements.languageNotes}
                  </p>
                )}
              </div>

              {/* Required Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t.modal.requiredDocsTitle}
                </h4>
                <div className="space-y-2">
                  {u.requirements.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Fee */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {currentLang === 'uz' ? "Ariza topshirish badali (Application Fee):" : currentLang === 'ru' ? "Сбор за подачу заявки:" : "Application Fee:"}
                </span>
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
                  {u.requirements.applicationFeeUsd === 0 ? "Bepul ($0)" : `$${u.requirements.applicationFeeUsd} USD`}
                </span>
              </div>

            </div>
          )}

          {/* TAB: SCHOLARSHIPS */}
          {activeTab === 'scholarships' && (
            <div className="space-y-4">
              {u.scholarships.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  {currentLang === 'uz' ? "Ushbu universitet uchun maxsus grant ma'lumotlari kiritilmagan." : "No specific university scholarships listed."}
                </p>
              ) : (
                u.scholarships.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-1 border border-emerald-200 dark:border-emerald-800">
                          {sch.coverageType}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {sch.name}
                        </h4>
                      </div>

                      {sch.applicationLink && (
                        <a
                          href={sch.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shrink-0 flex items-center gap-1"
                        >
                          <span>Ariza</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs space-y-1">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {currentLang === 'uz' ? "Grant miqdori:" : currentLang === 'ru' ? "Сумма гранта:" : "Grant value:"}{' '}
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{sch.amountValue}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {currentLang === 'uz' ? "Muddati:" : currentLang === 'ru' ? "Дедлайн:" : "Deadline:"} {sch.deadline}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                        {currentLang === 'uz' ? "Nomzodga Talablar:" : currentLang === 'ru' ? "Критерии отбора:" : "Eligibility Criteria:"}
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {sch.eligibility.map((el, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: DEADLINES */}
          {activeTab === 'deadlines' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                {u.deadlines.map((dl, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white">{dl.season}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{dl.type}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                        {dl.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold mb-1">⚠️ Muhim Eslatma:</p>
                <p>Xalqaro grantlar va viza jarayoni uchun arizani odatdagi muddatdan kamida 2-3 oy oldin topshirish tavsiya etiladi.</p>
              </div>
            </div>
          )}

          {/* TAB: UZBEKISTAN & CENTRAL ASIA CONTEXT */}
          {activeTab === 'uzbekistan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.modal.visaRate}</p>
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {u.uzbekistanContext.visaSuccessRatePercent}%
                  </p>
                  <p className="text-xs text-slate-500">O'zbekistonlik arizachilar uchun o'rtacha viza ko'rsatkichi</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.modal.workPermit}</p>
                  <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    Haftasiga {u.uzbekistanContext.workPermitHoursPerWeek} soat
                  </p>
                  <p className="text-xs text-slate-500">Talaba vizasi bilan qonuniy ishlash huquqi</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.modal.postStudyVisa}</p>
                  <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {u.uzbekistanContext.postStudyYears === 0 ? "Mamlakat ichki qoidasi" : `${u.uzbekistanContext.postStudyWorkYears} yil`}
                  </p>
                  <p className="text-xs text-slate-500">Bitirgandan so'ng rasmiy ishlash vizasi (Graduate / OPT)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.modal.halalFood}</p>
                  <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {u.uzbekistanContext.halalFoodAvailability === 'High' ? "Keng Mavjud" : "O'rtacha"}
                  </p>
                  <p className="text-xs text-slate-500">Talabalar jamoati: ~{u.uzbekistanContext.centralAsianStudentCountApprox}+ talaba</p>
                </div>
              </div>

              {u.uzbekistanContext.elYurtUmidiEligible && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                  <p className="font-extrabold text-sm mb-1">🏛️ {t.modal.elYurtBadgeText}</p>
                  <p>Ushbu universitet O'zbekiston Respublikasi Prezidentining "El-Yurt Umidi" jamg'armasi tomonidan to'liq 100% moliyalashtiriladigan TOP-300 ro'yxatiga kiradi.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: REAL-TIME AI GROUNDING & VERIFICATION */}
          {activeTab === 'aiVerify' && (
            <div className="space-y-5">
              
              {/* Grounding Header Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h4 className="font-extrabold text-sm sm:text-base">
                      Gemini Real-Time Google Search Grounding
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {t.modal.sourceLevel1}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  GlobalGrand universitetlarning rasmiy .edu va .ac veb-saytlaridan ma'lumotlarni real-vaqtda qidirib, har bir o'zgarish (kontrakt, til talablari, deadline)ni tekshiradi.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    <span>{t.card.verifiedAt}: </span>
                    <span className="font-bold text-white">{formattedDate}</span>
                  </div>

                  <button
                    id="modal-run-verification-btn"
                    onClick={handleRunVerification}
                    disabled={isVerifying}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? t.modal.rechecking : t.modal.recheckBtn}</span>
                  </button>
                </div>
              </div>

              {/* Live result output if triggered */}
              {liveVerifyResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Real-time ma'lumotlar muvaffaqiyatli yangilandi</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {liveVerifyResult.verification?.summary || liveVerifyResult.summary}
                  </p>
                </div>
              )}

              {/* Verified Citations List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {t.modal.citationsTitle}
                </h4>
                <div className="space-y-2">
                  {(liveVerifyResult?.verification?.citations || u.verification.citations).map((c: SourceCitation, idx: number) => (
                    <a
                      key={idx}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-400 font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{c.title || c.url}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Source Hierarchy Explanations */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {currentLang === 'uz' ? "Manbalar Ishonchliligi Ierarxiyasi:" : "Hierarchy of Verified Sources:"}
                </p>
                <p>1. Universitet rasmiy .edu/.ac sayti ➔ 2. Rasmiy grant portali (DAAD/Chevening) ➔ 3. QS/THE reyting agentliklari.</p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onReportIssue(u)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{t.card.reportIssue}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              Yopish
            </button>
            <a
              href={u.officialAdmissionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{t.modal.applyLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

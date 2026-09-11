import React, { useState } from 'react';
import { X, Flag, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language, University } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ReportInfoModalProps {
  university: University | null;
  onClose: () => void;
  currentLang: Language;
}

export const ReportInfoModal: React.FC<ReportInfoModalProps> = ({
  university,
  onClose,
  currentLang,
}) => {
  if (!university) return null;

  const t = TRANSLATIONS[currentLang];

  const [field, setField] = useState('Tuition');
  const [correctionText, setCorrectionText] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/report-inaccurate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: university.id,
          universityName: university.name,
          reportedField: field,
          userCorrectionText: correctionText,
          sourceLink,
          reporterEmail: email,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-600/10 via-slate-50 to-white dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {t.report.title}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                {university.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t.report.success}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bizning AI Grounding tizimi va moderatorlarimiz rasmiy .edu sahifani tekshirib, ma'lumotlar bazasini tezkor yangilaydi.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Yopish
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.report.desc}
            </p>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.report.fieldLabel}
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="Tuition">{t.report.fieldTuition}</option>
                <option value="Deadline">{t.report.fieldDeadline}</option>
                <option value="Requirements">{t.report.fieldRequirements}</option>
                <option value="Scholarship">{t.report.fieldScholarship}</option>
                <option value="Other">{t.report.fieldOther}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.report.correctionLabel} *
              </label>
              <textarea
                required
                rows={3}
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                placeholder="Masalan: Kontrakt $12,000 emas, xalqaro talabalar uchun $15,500 ga oshirilgan..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.report.sourceLabel}
              </label>
              <input
                type="url"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                placeholder="https://admissions.university.edu/tuition"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.report.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading || !correctionText.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{loading ? t.report.submitting : t.report.submit}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

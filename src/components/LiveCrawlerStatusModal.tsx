import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, RefreshCw, Globe, CheckCircle2, Clock, Server, ArrowRight, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LiveCrawlerStatusModalProps {
  currentLang: Language;
  onClose: () => void;
}

export const LiveCrawlerStatusModal: React.FC<LiveCrawlerStatusModalProps> = ({
  currentLang,
  onClose,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [crawlerData, setCrawlerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringBatch, setTriggeringBatch] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/crawler/status');
      const data = await res.json();
      setCrawlerData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTriggerBatchScan = async () => {
    setTriggeringBatch(true);
    try {
      await fetch('/api/crawler/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      await fetchStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setTriggeringBatch(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-900/40">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>24/7 Avtomatlashgan .edu Crawl & Grounding Tizimi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.transparencyNotice.title}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed font-normal">
            {t.transparencyNotice.text}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleTriggerBatchScan}
              disabled={triggeringBatch}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${triggeringBatch ? 'animate-spin' : ''}`} />
              <span>{triggeringBatch ? 'Tekshirilmoqda...' : 'Hozir Yangilanishlarni Tekshirish'}</span>
            </button>
            <span className="text-xs text-slate-400">
              Davriylik: Har 48 soatda rasmiy .edu sahifalar monitoringi
            </span>
          </div>
        </div>
      </div>

      {/* Verification Hierarchy & Trust Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Daraja 1: Rasmiy .edu / .ac.uk Portallari
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kontrakt narxi va stipendiya shartlari bevosita oliygohning o'z ro'yxatga olish bo'limi (Registrar)dan tekshiriladi.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Daraja 2: Davlat Grant Jamg'armalari
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stipendium Hungaricum (Tempus), DAAD, Fulbright, Turkiye Burslari va El-Yurt Umidi rasmiy qabul mezonlari.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Daraja 3: Xalqaro Reyting Agentliklari
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            QS World University Rankings va Times Higher Education (THE) 2025/2026 yangilangan reyting jadvallari.
          </p>
        </div>
      </div>

      {/* Live Crawler History Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Oxirgi Avtomatlashgan Tekshiruvlar Jurnali (Crawler Log)
            </h3>
            <p className="text-xs text-slate-500">
              Universitetlar ma'lumotlari yangilanishi va havolalar holati.
            </p>
          </div>
          <button
            onClick={fetchStatus}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Jurnal yuklanmoqda...</p>
        ) : (
          <div className="space-y-3">
            {crawlerData?.history?.map((log: any) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {log.universityName}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                      {log.differencesFound}
                    </p>
                    {log.sourceUrl && (
                      <a
                        href={log.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                      >
                        <span>{log.sourceUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Tasdiqlangan
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(log.checkedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Globe, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AIConsultantChatProps {
  currentLang: Language;
  userProfile?: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Array<{ title: string; url: string }>;
  timestamp: string;
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  currentLang,
  userProfile,
}) => {
  const t = TRANSLATIONS[currentLang];

  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    sender: 'assistant',
    text: currentLang === 'uz'
      ? "Assalomu alaykum! Men GlobalGrand AI xalqaro ta'lim va grantlar bo'yicha maslahatchisiman. Men rasmiy Google Search orqali dunyo oliygohlari talablari, 100% to'liq stipendiyalar (Stipendium Hungaricum, Chevening, DAAD, El-Yurt Umidi) va viza masalalarida sizga yordam beraman. Sizga qanday yordam bera olaman?"
      : currentLang === 'ru'
      ? "Здравствуйте! Я AI консультант GlobalGrand по международному образованию и грантам. С доступом к реальному поиску Google я помогу вам подобрать программы со 100% стипендиями, подготовить мотивационные письма и проверить дедлайны."
      : "Hello! I am GlobalGrand's AI Admissions Advisor, grounded with live Google Search. Ask me about international requirements, full-ride scholarships (Fulbright, DAAD, Stipendium Hungaricum), and winning strategies.",
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat-admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          language: currentLang,
          userProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Javob olindi.',
        citations: data.citations || [],
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: currentLang === 'uz'
          ? "Kechirasiz, sun'iy intellekt xizmati bilan bog'lanishda xatolik yuz berdi. Iltimos, bir ozdan so'ng qayta urinib ko'ring yoki savolingizni qisqartirib yozing."
          : "Sorry, an error occurred while querying the AI search service. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[750px] animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span>{t.aiChat.title}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Google Grounded
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-normal">
              {t.aiChat.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([initialGreeting])}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
          title="Suhbatni yangilash"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs shrink-0">
        <span className="font-bold text-slate-400 shrink-0">Tavsiya savollar:</span>
        <button
          onClick={() => handleSendMessage(t.aiChat.suggest1)}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 whitespace-nowrap text-[11px] font-medium transition-colors"
        >
          {t.aiChat.suggest1}
        </button>
        <button
          onClick={() => handleSendMessage(t.aiChat.suggest2)}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 whitespace-nowrap text-[11px] font-medium transition-colors"
        >
          {t.aiChat.suggest2}
        </button>
        <button
          onClick={() => handleSendMessage(t.aiChat.suggest3)}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 whitespace-nowrap text-[11px] font-medium transition-colors"
        >
          {t.aiChat.suggest3}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Citations block */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Foydalanilgan Rasmiy Manbalar:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{c.title || c.url}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Google Search orqali eng yangi ma'lumotlar tahlil qilinmoqda...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.aiChat.placeholder}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
          >
            <span>{t.aiChat.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthUser } from '../types';
import { INITIAL_MOCK_USERS } from '../data/mockUsers';

interface AdminLockGateProps {
  onSuccessLogin: (adminUser: AuthUser) => void;
  onBackToHome: () => void;
}

export const AdminLockGate: React.FC<AdminLockGateProps> = ({
  onSuccessLogin,
  onBackToHome,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanLogin = login.trim().toLowerCase();
    const cleanPass = password.trim();

    const isValidAdminLogin = cleanLogin === 'admin001' || cleanLogin === 'admin' || cleanLogin === 'admin001@globalgrand.uz';
    const isValidAdminPass = cleanPass === 'Admin123456';

    if (isValidAdminLogin && isValidAdminPass) {
      const adminUser = INITIAL_MOCK_USERS.find(u => u.role === 'admin') || INITIAL_MOCK_USERS[0];

      setSuccess("✅ Admin huquqlari tasdiqlandi! Panel ochilmoqda...");
      setTimeout(() => {
        onSuccessLogin(adminUser);
      }, 500);
    } else {
      setError("❌ Noto'g'ri login yoki parol! Ushbu panelga faqat Admin kirishi mumkin. (Login: Admin001, Parol: Admin123456)");
    }
  };

  const handleQuickFillAdmin = () => {
    setLogin('Admin001');
    setPassword('Admin123456');
    setError(null);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Admin Boshqaruv Paneli
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            🔒 <b>Himoyalangan Hudud:</b> Ushbu bo'lim va talabalar ma'lumotlari faqat vakolatli tizim ma'murlari (Admin) uchun ochiq.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Admin Login / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Admin loginingizni kiriting"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Admin Paroli
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            Admin Panelga Kirish
          </button>
        </form>

        {/* Back link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Bosh sahifaga qaytish
          </button>
        </div>

      </div>
    </div>
  );
};

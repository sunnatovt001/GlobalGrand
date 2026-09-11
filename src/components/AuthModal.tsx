import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, CheckCircle, UserCheck, AlertCircle, LogOut, KeyRound, Phone, UserPlus } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { INITIAL_MOCK_USERS } from '../data/mockUsers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSelectUser: (user: AuthUser | null) => void;
  currentLang: Language;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  currentLang,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Sync initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  // Login form
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputClean = loginInput.trim();
    const passClean = passwordInput.trim();

    if (!inputClean || !passClean) {
      setErrorMessage("Iltimos, login va parolni kiriting.");
      return;
    }

    // 1. Check Admin Credentials: Login = Admin001 / admin / admin001@globalgrand.uz, Password = Admin123456
    const isAdminLogin = 
      inputClean.toLowerCase() === 'admin001' || 
      inputClean.toLowerCase() === 'admin' || 
      inputClean.toLowerCase() === 'admin001@globalgrand.uz' ||
      inputClean.toLowerCase() === 'admin@globalgrand.uz';

    if (isAdminLogin) {
      if (passClean === 'Admin123456') {
        const adminUser = INITIAL_MOCK_USERS.find(u => u.role === 'admin') || {
          id: 'user-admin',
          name: 'Dilshod Rahmatov (Admin)',
          username: 'Admin001',
          password: 'Admin123456',
          email: 'admin001@globalgrand.uz',
          role: 'admin' as const,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          phone: '+998 71 200 88 99',
          telegramUsername: '@globalgrand_admin',
          city: 'Toshkent',
          country: "O'zbekiston",
          schoolOrUniversity: 'GlobalGrand Markaziy Administratsiyasi',
          bio: "Platforma boshqaruvchisi va ma'lumotlar verifikatsiya koordinatori.",
          profile: {
            gpa: 4.0,
            ielts: 8.5,
            toefl: 115,
            duolingo: 150,
            sat: 1550,
            targetDegree: 'Master',
            maxBudgetUsd: 50000,
            selectedMajors: ['Computer Science', 'Economics'],
            selectedCountries: ['US', 'GB'],
            needScholarship: 'any',
            priorityWeights: {
              gpa: 20,
              language: 20,
              budget: 20,
              major: 20,
              scholarship: 20,
              ranking: 20,
            },
          },
          documents: {
            cvUploaded: true,
            cvName: 'Admin_Master_CV.pdf',
            diplomaUploaded: true,
            recommendationLettersCount: 3,
          },
          targetList: [],
        };
        onSelectUser(adminUser);
        setSuccessMessage("✅ Admin tizimiga muvaffaqiyatli kirdingiz!");
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 500);
        return;
      } else {
        setErrorMessage("❌ Login yoki parol noto'g'ri. Qaytadan tekshirib ko'ring.");
        return;
      }
    }

    // 2. Check registered custom users from localStorage
    try {
      const storedUsers: AuthUser[] = JSON.parse(localStorage.getItem('globalgrand_registered_users') || '[]');
      const matchedStored = storedUsers.find(
        u => (u.username && u.username.toLowerCase() === inputClean.toLowerCase()) || 
             (u.email && u.email.toLowerCase() === inputClean.toLowerCase())
      );

      if (matchedStored) {
        if (matchedStored.password === passClean) {
          onSelectUser(matchedStored);
          setSuccessMessage(`✅ Xush kelibsiz, ${matchedStored.name}!`);
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 500);
          return;
        } else {
          setErrorMessage("❌ Login yoki parol noto'g'ri. Qaytadan tekshirib ko'ring.");
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setErrorMessage("❌ Bunday hisob topilmadi. Agar birinchi marta kirayotgan bo'lsangiz, 'Ro'yxatdan o'tish' tugmasini bosing.");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Kiritilgan parollar bir-biriga mos kelmadi.");
      return;
    }

    // Check if username or email already exists
    try {
      const storedUsers: AuthUser[] = JSON.parse(localStorage.getItem('globalgrand_registered_users') || '[]');
      const userExists = storedUsers.some(
        u => (u.username && u.username.toLowerCase() === regUsername.trim().toLowerCase()) ||
             (u.email && u.email.toLowerCase() === regEmail.trim().toLowerCase())
      );

      if (userExists) {
        setErrorMessage("Bu login yoki email bilan avval ro'yxatdan o'tilgan. Iltimos, boshqa login tanlang.");
        return;
      }

      const isAdm = regUsername.trim().toLowerCase() === 'admin001' && regPassword === 'Admin123456';

      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: regFullName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        role: isAdm ? 'admin' : 'student',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${regUsername.trim()}`,
        city: 'Toshkent',
        country: "O'zbekiston",
        phone: regPhone.trim() || undefined,
        profile: {
          gpa: 3.7,
          ielts: 6.5,
          toefl: 85,
          duolingo: 120,
          targetDegree: 'Bachelor',
          maxBudgetUsd: 12000,
          selectedMajors: ['Computer Science'],
          selectedCountries: ['US', 'DE', 'HU'],
          needScholarship: 'full',
          priorityWeights: {
            gpa: 20,
            language: 20,
            budget: 20,
            major: 20,
            scholarship: 20,
            ranking: 20,
          },
        },
        documents: {
          cvUploaded: false,
          diplomaUploaded: false,
          recommendationLettersCount: 0,
        },
        targetList: [],
      };

      storedUsers.push(newUser);
      localStorage.setItem('globalgrand_registered_users', JSON.stringify(storedUsers));

      onSelectUser(newUser);
      setSuccessMessage(`✅ Yangi hisob muvaffaqiyatli yaratildi! Xush kelibsiz, ${newUser.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 700);
    } catch (e) {
      console.error(e);
      setErrorMessage("Hisob yaratishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  const handleLogout = () => {
    onSelectUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {authMode === 'login' ? 'Tizimga Kirish (Sign in)' : "Yangi Ro'yxatdan O'tish (Sign up)"}
              </h2>
              <p className="text-[11px] text-slate-500">
                GlobalGrand shaxsiy profili
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Tab Toggle: Login vs Register */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🔑 Kirish (Sign in)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'register' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            📝 Ro'yxatdan o'tish (Sign up)
          </button>
        </div>

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Login / Username yoki Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Login yoki email manzilingiz"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
              🔒 <b>Xavfsizlik:</b> Shaxsiy arizalaringiz va hujjatlaringiz faqat sizning hisobingizga bog'lanadi.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Tizimga Kirish (Sign in)
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Ism va Familiyangiz *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Masalan: Azizbek Karimov"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Yangi Login / Username yarating *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Masalan: azizbek2026"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Manzilingiz *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="namuna@mail.uz"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Telefon raqamingiz (ixtiyoriy)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Yangi Parol *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Kamida 6 ta belgi"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Parolni Tasdiqlang *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Parolni qaytaring"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <UserPlus className="w-4 h-4" />
              Yangi Shaxsiy Hisob Yaratish (Sign up)
            </button>
          </form>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Tizimdan chiqish (Log out)
            </button>
          ) : (
            <span className="text-slate-400 text-[11px]">Mehmon rejimi</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};




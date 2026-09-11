import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  FileText, 
  Award, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Building2, 
  BookOpen, 
  DollarSign, 
  Globe2, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  FileCheck,
  Percent,
  CheckCircle,
  Bookmark,
  Share2,
  QrCode,
  Copy,
  Smartphone,
  MessageCircle,
  CheckSquare,
  Lock
} from 'lucide-react';
import { AuthUser, Language, University, UserTargetUniversity, DegreeLevel, ApplicationChecklistItem } from '../types';

interface UserProfileViewProps {
  user: AuthUser;
  onUpdateUser: (updatedUser: AuthUser) => void;
  universitiesDatabase: University[];
  onSelectUniversity: (uni: University) => void;
  onOpenCalculator: () => void;
  onOpenAiConsultant: (prompt?: string) => void;
  currentLang: Language;
  savedUniversities?: University[];
  onToggleSave?: (id: string) => void;
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

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateUser,
  universitiesDatabase,
  onSelectUniversity,
  onOpenCalculator,
  onOpenAiConsultant,
  currentLang,
  savedUniversities = [],
  onToggleSave,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'cabinet' | 'applications' | 'documents' | 'settings'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPhoneShareModal, setShowPhoneShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for editing
  const [formData, setFormData] = useState<AuthUser>(user);
  const [checklist, setChecklist] = useState<ApplicationChecklistItem[]>(DEFAULT_CHECKLIST);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Password change state in settings
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    setFormData(user);
    setIsEditingProfile(false);
  }, [user]);

  const [newMajor, setNewMajor] = useState('');
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [selectedUniForApp, setSelectedUniForApp] = useState('');
  const [appMajor, setAppMajor] = useState('');
  const [appDegree, setAppDegree] = useState<DegreeLevel>('Bachelor');
  const [appScholarship, setAppScholarship] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [dbSaveFeedback, setDbSaveFeedback] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    setIsSavingDb(true);
    onUpdateUser(formData);
    setIsEditingProfile(false);
    setSavedSuccessMsg(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: formData.id,
          email: formData.email,
          name: formData.name,
          avatar: formData.avatar,
          role: formData.role,
          bio: formData.bio || '',
          phone: formData.phone || '',
          telegram: formData.telegramUsername || '',
          city: formData.city || 'Toshkent',
          country: formData.country || "O'zbekiston",
          targetDegree: formData.profile.targetDegree,
          targetMajor: formData.profile.selectedMajors.join(', '),
          gpa: String(formData.profile.gpa),
          ielts: String(formData.profile.ielts),
          toefl: String(formData.profile.toefl || ''),
          sat: String(formData.profile.sat || ''),
          duolingo: String(formData.profile.duolingo || ''),
        }),
      });
      const resData = await response.json();
      if (resData.success) {
        setDbSaveFeedback("✅ Barcha ma'lumotlar Cloud SQL (PostgreSQL) bazasida muvaffaqiyatli saqlandi!");
      }
    } catch (err) {
      console.error('Failed to sync to database:', err);
    } finally {
      setIsSavingDb(false);
      setTimeout(() => {
        setSavedSuccessMsg(false);
        setDbSaveFeedback(null);
      }, 4000);
    }
  };

  const handleAddMajor = () => {
    if (newMajor.trim() && !formData.profile.selectedMajors.includes(newMajor.trim())) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          selectedMajors: [...formData.profile.selectedMajors, newMajor.trim()],
        },
      });
      setNewMajor('');
    }
  };

  const handleRemoveMajor = (majorToRemove: string) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        selectedMajors: formData.profile.selectedMajors.filter(m => m !== majorToRemove),
      },
    });
  };

  const handleUpdateApplicationStatus = (index: number, newStatus: UserTargetUniversity['status']) => {
    const updatedList = [...user.targetList];
    updatedList[index].status = newStatus;
    const updated = { ...user, targetList: updatedList };
    onUpdateUser(updated);
  };

  const handleRemoveApplication = (index: number) => {
    const updatedList = user.targetList.filter((_, i) => i !== index);
    const updated = { ...user, targetList: updatedList };
    onUpdateUser(updated);
  };

  const handleAddNewApplication = () => {
    if (!selectedUniForApp) return;
    const newTarget: UserTargetUniversity = {
      universityId: selectedUniForApp,
      degree: appDegree,
      major: appMajor || 'Computer Science',
      status: 'wishlist',
      appliedDate: new Date().toISOString().split('T')[0],
      scholarshipApplied: appScholarship || undefined,
    };

    const updated = { ...user, targetList: [newTarget, ...user.targetList] };
    onUpdateUser(updated);
    setShowAddApplicationModal(false);
    setSelectedUniForApp('');
    setAppMajor('');
    setAppScholarship('');
  };

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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPass.length < 6) {
      setPassError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (newPass !== confirmPass) {
      setPassError("Yangi parollar bir-biriga mos kelmadi.");
      return;
    }

    const updated = { ...user, password: newPass };
    onUpdateUser(updated);
    setPassSuccess("✅ Parol muvaffaqiyatli yangilandi!");
    setNewPass('');
    setConfirmPass('');
  };

  // Readiness Calculation (0 - 100%)
  const calculateReadiness = () => {
    let score = 0;
    if (user.profile.gpa >= 3.0) score += 20;
    if (user.profile.ielts >= 6.0 || user.profile.toefl >= 80) score += 25;
    if (user.documents.cvUploaded) score += 15;
    if (user.documents.motivationLetterDraft && user.documents.motivationLetterDraft.length > 50) score += 20;
    if (user.documents.diplomaUploaded) score += 10;
    if (user.documents.recommendationLettersCount >= 2) score += 10;
    return Math.min(100, score);
  };

  const completedChecklistCount = checklist.filter((i) => i.completed).length;
  const checklistProgressPercent = Math.round((completedChecklistCount / (checklist.length || 1)) * 100);

  // Phone share URL
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://globalgrand.uz';
  const shareText = `🎓 GlobalGrand - ${user.name}ning qabul profili:\n- GPA: ${user.profile.gpa}\n- IELTS: ${user.profile.ielts}\n- Yo'nalish: ${user.profile.selectedMajors.join(', ')}\n- Saqlangan oliygohlar: ${savedUniversities.length} ta`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareUrl}\n\n${shareText}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md bg-indigo-50"
              />
              <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                user.role === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
              }`}>
                {user.role}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.role === 'admin' && (
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span>@{user.username || user.email.split('@')[0]}</span>
                <span>•</span>
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <span>{user.phone}</span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  🎯 {user.profile.targetDegree}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  📊 GPA: {user.profile.gpa} / 4.0
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  🌐 IELTS: {user.profile.ielts}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons: Share to Phone & AI Assistant */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => setShowPhoneShareModal(true)}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
              title="Telefonga yuborish / QR kod orqali ochish"
            >
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>Telefonga Ulashish</span>
            </button>

            <button
              onClick={() => onOpenAiConsultant(`Mening profilim: GPA ${user.profile.gpa}, IELTS ${user.profile.ielts}, yo'nalish ${user.profile.selectedMajors.join(', ')}. Qaysi universitetlarga 100% grant yutish imkoniyatim yuqori?`)}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Analiz Olish</span>
            </button>
          </div>

        </div>

        {/* Readiness Meter */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Xalqaro Grant & Qabulga Tayyorgarlik Darajasi:
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">
              {calculateReadiness()}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${calculateReadiness()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeSubTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Akademik Profil</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cabinet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeSubTab === 'cabinet'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4 text-amber-500" />
          <span>Saqlangan Oliygohlar & Kabinet</span>
          {savedUniversities.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px]">
              {savedUniversities.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeSubTab === 'applications'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Arizalarim ({user.targetList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeSubTab === 'documents'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Hujjatlar & AI Insho</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeSubTab === 'settings'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Xavfsizlik & Sozlamalar</span>
        </button>
      </div>

      {/* SUBTAB 1: ACADEMIC & PERSONAL PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in">
          
          {savedSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Profil ma'lumotlaringiz yangilandi!</span>
              </div>
              {dbSaveFeedback && (
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {dbSaveFeedback}
                </span>
              )}
            </div>
          )}

          {/* Section 1: Personal Details & Avatar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Shaxsiy Ma'lumotlar & Profil
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ismingiz, aloqa ma'lumotlaringiz va shaxsiy parametrlaringizni tahrirlashingiz mumkin.
                </p>
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Tahrirlash
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditingProfile(false); setFormData(user); }}
                    className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    disabled={isSavingDb}
                    onClick={handleSaveProfile}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSavingDb ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              )}
            </div>

            {/* Avatar Selection in Edit Mode */}
            {isEditingProfile && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Profil Rasmini Tanlang yoki URL Kiriting:</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name || 'Student'}`,
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
                  ].map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: avatarUrl })}
                      className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all ${
                        formData.avatar === avatarUrl ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Yoki to'g'ridan-to'g'ri rasm URL manzilini kiriting..."
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Full Name */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">To'liq Ism & Familiya:</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Elektron Pochta (Email):</span>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Telefon Raqami:</span>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.phone || "Kiritilmagan"}
                  </p>
                )}
              </div>

              {/* Telegram Username */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Telegram Username:</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    placeholder="@username"
                    value={formData.telegramUsername || ''}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                    {user.telegramUsername ? `@${user.telegramUsername.replace(/^@/, '')}` : "Kiritilmagan"}
                  </p>
                )}
              </div>

              {/* City & Country */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Shahar & Davlat:</span>
                {isEditingProfile ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Shahar (Toshkent)"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Davlat (O'zbekiston)"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs font-bold"
                    />
                  </div>
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.city || 'Toshkent'}, {user.country || "O'zbekiston"}
                  </p>
                )}
              </div>

              {/* School or University */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Maktab / Litsey / Universitet:</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    placeholder="Masalan: PM School, WIUT, TATU"
                    value={formData.schoolOrUniversity || ''}
                    onChange={(e) => setFormData({ ...formData, schoolOrUniversity: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.schoolOrUniversity || "Kiritilmagan"}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 sm:col-span-2 lg:col-span-3">
                <span className="font-bold text-slate-500 dark:text-slate-400">Qisqacha Ma'lumot (Bio):</span>
                {isEditingProfile ? (
                  <textarea
                    rows={2}
                    placeholder="Qiziqishlaringiz, yutuqlaringiz va maqsadlaringiz haqida qisqacha yozing..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-medium text-xs"
                  />
                ) : (
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {user.bio || "Hali ma'lumot kiritilmagan."}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Academic & Testing Scores */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Akademik Ko'rsatkichlar & Xalqaro Testlar
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ushbu ko'rsatkichlar asosida AI sizga eng mos 100% grantli oliygohlarni hisoblab beradi.
                </p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* GPA */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Akademik GPA (Baholar):</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="4.0"
                    value={formData.profile.gpa}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, gpa: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.profile.gpa} / 4.0 scale
                  </p>
                )}
              </div>

              {/* IELTS */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">IELTS Score:</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9.0"
                    value={formData.profile.ielts}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, ielts: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    {user.profile.ielts} (Band)
                  </p>
                )}
              </div>

              {/* SAT */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">SAT Score:</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    step="10"
                    min="400"
                    max="1600"
                    placeholder="Masalan: 1450"
                    value={formData.profile.sat || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, sat: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {user.profile.sat ? `${user.profile.sat} / 1600` : "Mavjud emas"}
                  </p>
                )}
              </div>

              {/* Target Degree */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Maqsadli Daraja:</span>
                {isEditingProfile ? (
                  <select
                    value={formData.profile.targetDegree}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, targetDegree: e.target.value as DegreeLevel }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Bachelor">Bakalavr (Undergraduate)</option>
                    <option value="Master">Magistratura (Graduate)</option>
                    <option value="PhD">Doktorantura (PhD)</option>
                    <option value="Foundation">Foundation (Tayyorlov)</option>
                  </select>
                ) : (
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {user.profile.targetDegree}
                  </p>
                )}
              </div>

              {/* Max Budget */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Maksimal Byudjet (Yiliga):</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    step="1000"
                    value={formData.profile.maxBudgetUsd}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, maxBudgetUsd: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  />
                ) : (
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${user.profile.maxBudgetUsd.toLocaleString()} / yil
                  </p>
                )}
              </div>

              {/* Need Scholarship */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400">Grant Talabi:</span>
                {isEditingProfile ? (
                  <select
                    value={formData.profile.needScholarship}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, needScholarship: e.target.value as any }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="full">100% To'liq Grant (Full Ride)</option>
                    <option value="partial">Qisman Grant (50-70%)</option>
                    <option value="none">O'z hisobidan (Self-funded)</option>
                  </select>
                ) : (
                  <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                    {user.profile.needScholarship === 'full' ? '100% To\'liq Grant' : user.profile.needScholarship === 'partial' ? 'Qisman Grant' : 'O\'z hisobidan'}
                  </p>
                )}
              </div>

              {/* Selected Majors */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 sm:col-span-2 lg:col-span-3">
                <span className="font-bold text-slate-500 dark:text-slate-400">Qiziqqan Mutaxassisliklar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.profile.selectedMajors.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      {m}
                      {isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMajor(m)}
                          className="hover:text-red-500 font-bold ml-1"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditingProfile && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Yangi soha qo'shish (masalan: Artificial Intelligence)..."
                      value={newMajor}
                      onChange={(e) => setNewMajor(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMajor(); } }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMajor}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Qo'shish
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: USER CABINET & SAVED UNIVERSITIES */}
      {activeSubTab === 'cabinet' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Saved Universities Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  Saqlangan Oliygohlar ({savedUniversities.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Siz tanlagan va ariza topshirish rejalashtirilgan oliygohlar to'plami.
                </p>
              </div>

              {savedUniversities.length > 0 && (
                <button
                  onClick={() => setShowPhoneShareModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Ulashish
                </button>
              )}
            </div>

            {savedUniversities.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  Hozircha saqlangan oliygohlar mavjud emas
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Universitetlar ro'yxatidagi xatcho'p (bookmark) belgisini bosib, qiziqqan oliygohlaringizni bu yerga saqlashingiz mumkin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            {uni.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {uni.city}, {uni.country}
                          </p>
                        </div>
                      </div>

                      {onToggleSave && (
                        <button
                          type="button"
                          onClick={() => onToggleSave(uni.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          title="Saqlanganlardan o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-slate-400 block">QS Reyting:</span>
                        <span className="font-black text-amber-600 dark:text-amber-400">#{uni.rankingQs}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Kontrakt:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{uni.tuitionRangeText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectUniversity(uni)}
                        className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                      >
                        Batafsil ko'rish
                      </button>
                      <a
                        href={uni.officialAdmissionsUrl || uni.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                        title="Rasmiy Qabul Portali"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Roadmap Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  Qabulga Tayyorgarlik Bosqichlari (Roadmap Checklist)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Barcha talab etiladigan bosqichlarni belgilab boring ({checklistProgressPercent}% bajarildi).
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                {completedChecklistCount} / {checklist.length} bajarildi
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                    item.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                      item.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {item.completed && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                        {item.title}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteTodo(item.id); }}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Todo */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Yangi vazifa yoki talab qo'shish..."
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTodo(); }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTodo}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Qo'shish
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: APPLICATIONS TRACKER */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Mening Topshirgan Arizalarim (Application Tracker)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Har bir oliygohga topshirilgan arizalar holati va natijalari (Wishlist, Applied, Accepted, Rejected).
                </p>
              </div>

              <button
                onClick={() => setShowAddApplicationModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Yangi Ariza Qo'shish
              </button>
            </div>

            {user.targetList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  Hozircha arizalar ro'yxati bo'sh
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  "Yangi Ariza Qo'shish" tugmasini bosib, o'zingiz hujjat topshirmoqchi bo'lgan universitetlarni kiriting.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.targetList.map((app, idx) => {
                  const uni = universitiesDatabase.find(u => u.id === app.universityId);
                  return (
                    <div
                      key={`${app.universityId}-${idx}`}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={uni?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80'}
                          alt={uni?.name || app.universityId}
                          className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {uni?.name || app.universityId}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {app.degree} • {app.major} {app.scholarshipApplied && `• Grant: ${app.scholarshipApplied}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicationStatus(idx, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
                            app.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-300' :
                            app.status === 'applied' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 border-blue-300' :
                            app.status === 'rejected' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 border-red-300' :
                            'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="wishlist">Rejada (Wishlist)</option>
                          <option value="applied">Yuborildi (Applied)</option>
                          <option value="accepted">Qabul qilindi (Accepted) 🎉</option>
                          <option value="rejected">Rad etildi (Rejected)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveApplication(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DOCUMENTS VAULT */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Hujjatlar Ombri & AI Insho Yordamchisi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Barcha qabul hujjatlaringizni yuklang va AI orqali tekshirtiring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">CV / Rezyume:</span>
                <p className="text-slate-500 text-[11px]">
                  {user.documents.cvUploaded ? "✅ Yuklangan (Europass / Harvard format)" : "❌ Hali yuklanmagan"}
                </p>
                <button
                  type="button"
                  onClick={() => onUpdateUser({ ...user, documents: { ...user.documents, cvUploaded: !user.documents.cvUploaded } })}
                  className="w-full py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                >
                  {user.documents.cvUploaded ? "O'chirish" : "Yuklash"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Diplom / Attestat & Transkript:</span>
                <p className="text-slate-500 text-[11px]">
                  {user.documents.diplomaUploaded ? "✅ Notarial tasdiqlangan nusxa bor" : "❌ Hali yuklanmagan"}
                </p>
                <button
                  type="button"
                  onClick={() => onUpdateUser({ ...user, documents: { ...user.documents, diplomaUploaded: !user.documents.diplomaUploaded } })}
                  className="w-full py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                >
                  {user.documents.diplomaUploaded ? "O'chirish" : "Yuklash"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tavsiyanomalar (Recommendation):</span>
                <p className="text-slate-500 text-[11px]">
                  {user.documents.recommendationLettersCount} ta xat qo'shilgan
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateUser({ ...user, documents: { ...user.documents, recommendationLettersCount: Math.max(0, user.documents.recommendationLettersCount - 1) } })}
                    className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold">{user.documents.recommendationLettersCount}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateUser({ ...user, documents: { ...user.documents, recommendationLettersCount: user.documents.recommendationLettersCount + 1 } })}
                    className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Motivation Letter Editor */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Motivatsion Xat (Statement of Purpose / Personal Statement) Qoralama:
                </span>
                <button
                  type="button"
                  onClick={() => onOpenAiConsultant(`Ushbu motivatsion inshomni tekshirib, xalqaro grant qabul komissiyasi talablariga moslashtirish bo'yicha maslahat ber:\n\n${user.documents.motivationLetterDraft || 'Men xalqaro IT sohasida ta\'lim olib, O\'zbekiston raqamli iqtisodiyotini rivojlantirmoqchiman.'}`)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  AI bilan takomillashtirish
                </button>
              </div>

              <textarea
                rows={5}
                placeholder="Motivatsion xatingiz matnini shu yerga yozing..."
                value={user.documents.motivationLetterDraft || ''}
                onChange={(e) => onUpdateUser({
                  ...user,
                  documents: { ...user.documents, motivationLetterDraft: e.target.value }
                })}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: SETTINGS & PASSWORD */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-xl">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                Xavfsizlik & Parol O'zgartirish
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hisobingiz xavfsizligini ta'minlash uchun parolingizni yangilang.
              </p>
            </div>

            {passError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Yangi Parol
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 ta belgi"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Yangi Parolni Tasdiqlang
                </label>
                <input
                  type="password"
                  required
                  placeholder="Parolni qaytadan kiriting"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Parolni Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE / PHONE SHARE MODAL (Telefonga poslashish / ulashish) */}
      {showPhoneShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Telefonga Ulashish / Poslashish
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Smartfoningizda darhol oching yoki do'stlarga yuboring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneShareModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* QR Code generator container */}
            <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-inner border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code"
                  className="w-36 h-36 mx-auto rounded-lg"
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                📱 Telefoningiz kamerasini QR kodga qarating va ilovani smartfonda oching!
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
                Telegramda yuborish
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Copy Link button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                {copiedLink ? "Nusxalandi! ✅" : "Havola va Profil Ma'lumotlarini Nusxalash"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ADD APPLICATION */}
      {showAddApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Yangi Ariza Qo'shish
              </h3>
              <button onClick={() => setShowAddApplicationModal(false)} className="text-slate-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Universitetni tanlang:</label>
                <select
                  value={selectedUniForApp}
                  onChange={(e) => setSelectedUniForApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="">-- Universitetni tanlang --</option>
                  {universitiesDatabase.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Daraja:</label>
                <select
                  value={appDegree}
                  onChange={(e) => setAppDegree(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Bachelor">Bakalavr</option>
                  <option value="Master">Magistratura</option>
                  <option value="PhD">Doktorantura</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Yo'nalish / Major:</label>
                <input
                  type="text"
                  placeholder="Masalan: Software Engineering"
                  value={appMajor}
                  onChange={(e) => setAppMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grant nomi (ixtiyoriy):</label>
                <input
                  type="text"
                  placeholder="Masalan: Stipendium Hungaricum / DAAD"
                  value={appScholarship}
                  onChange={(e) => setAppScholarship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleAddNewApplication}
                disabled={!selectedUniForApp}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Arizani Ro'yxatga Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

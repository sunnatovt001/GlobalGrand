import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Award, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Upload,
  Globe2, 
  Sparkles, 
  ExternalLink,
  DollarSign,
  GraduationCap,
  Save,
  X,
  Check,
  Clock,
  Layers,
  BarChart3,
  Users,
  Smartphone,
  Send,
  MessageCircle,
  Copy,
  Lock,
  Eye,
  Activity,
  UserCheck
} from 'lucide-react';
import { University, ExternalScholarship, VerificationReportPayload, AdminAuditLog, DegreeLevel, Language, AuthUser } from '../types';

interface AdminPanelProps {
  universities: University[];
  onAddUniversity: (newUni: University) => void;
  onUpdateUniversity: (updatedUni: University) => void;
  onDeleteUniversity: (uniId: string) => void;
  scholarships: ExternalScholarship[];
  onAddScholarship: (scholarship: ExternalScholarship) => void;
  onLiveVerifyUniversity: (uni: University) => Promise<void>;
  currentLang: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  universities,
  onAddUniversity,
  onUpdateUniversity,
  onDeleteUniversity,
  scholarships,
  onAddScholarship,
  onLiveVerifyUniversity,
  currentLang,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'universities' | 'scholarships' | 'users' | 'reports' | 'crawler' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
  
  // Modals & Dialogs
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [isAddingNewUni, setIsAddingNewUni] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<ExternalScholarship | null>(null);
  const [isAddingScholarship, setIsAddingScholarship] = useState(false);
  const [showPhoneShareModal, setShowPhoneShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Local state for registered users (from localStorage)
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Local state for scholarships list
  const [allScholarships, setAllScholarships] = useState<ExternalScholarship[]>(scholarships);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-09-11 12:45',
      adminName: 'Admin001 (Bosh Admin)',
      action: 'verify_ai',
      targetTitle: 'Technical University of Munich',
      details: 'Gemini AI Grounded Crawler orqali qabul talablari va kontrakt yangilandi.'
    },
    {
      id: 'log-2',
      timestamp: '2026-09-11 11:20',
      adminName: 'Admin001 (Bosh Admin)',
      action: 'add_scholarship',
      targetTitle: 'Stipendium Hungaricum 2026-2027',
      details: "To'liq 100% grant dasturi ro'yxatga kiritildi."
    },
    {
      id: 'log-3',
      timestamp: '2026-09-11 09:30',
      adminName: 'Admin001 (Bosh Admin)',
      action: 'update_university',
      targetTitle: 'KAIST South Korea',
      details: "Bakalavriat qabul muddati yangilandi (2026-yil 25-oktabr)."
    }
  ]);

  // Mock Student Reports Queue
  const [reports, setReports] = useState<VerificationReportPayload[]>([
    {
      id: 'rep-1',
      universityId: 'tum-germany',
      universityName: 'Technical University of Munich',
      reportedField: "Tuition Fee (Yevropa Ittifoqidan tashqari talabalar uchun yangi to'lov)",
      userCorrectionText: "Bavariya yangi qonuniga binoan non-EU talabalar uchun semestriga €2,000-€3,000 to'lov joriy qilindi.",
      sourceLink: 'https://www.tum.de/en/studies/fees-and-financial-aid/tuition-fees',
      reporterEmail: 'shohruh.it@gmail.com',
      createdAt: '2026-09-10 14:30',
      status: 'pending',
    },
    {
      id: 'rep-2',
      universityId: 'kaist-korea',
      universityName: 'KAIST',
      reportedField: 'Early Decision Deadline',
      userCorrectionText: 'Bahorgi semestr uchun topshirish sanasi 2026-yil 25-oktabrgacha uzaytirildi.',
      sourceLink: 'https://admission.kaist.ac.kr',
      reporterEmail: 'nodirbek.kaist@mail.uz',
      createdAt: '2026-09-11 09:15',
      status: 'pending',
    }
  ]);

  // Load Registered Users on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('globalgrand_registered_users');
      if (stored) {
        const users = JSON.parse(stored);
        setRegisteredUsers(users);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const addAuditLog = (action: AdminAuditLog['action'], targetTitle: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminName: 'Admin001 (Bosh Admin)',
      action,
      targetTitle,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // University Form State
  const [uniFormData, setUniFormData] = useState<Partial<University>>({
    name: '',
    country: 'USA',
    countryCode: 'US',
    region: 'North America',
    city: '',
    rankingQs: 100,
    rankingThe: 120,
    websiteUrl: 'https://',
    officialAdmissionsUrl: 'https://',
    tuitionUsdPerYear: 20000,
    tuitionRangeText: '$15,000 - $25,000 / yil',
    livingCostUsdPerYear: 12000,
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    degreesOffered: ['Bachelor', 'Master', 'PhD'],
    teachingLanguages: ['English'],
    popularMajors: ['Computer Science', 'Business & Management'],
    description: {
      uz: 'Dunyoning yetakchi nufuzli oliygohi.',
      ru: 'Один из ведущих университетов мира.',
      en: 'A world-class leading research university.'
    },
    requirements: {
      minGpa: 3.2,
      gpaScale: '4.0 scale',
      minIelts: 6.5,
      minToefl: 85,
      satRequired: false,
      acceptanceRatePercent: 30,
      requiredDocuments: ['Pasport', 'Attestat / Diplom', 'IELTS Sertifikati', 'Motivatsion Xat (SOP)', 'Tavsiyanoma'],
      applicationFeeUsd: 75,
    },
    scholarships: [],
    deadlines: [
      { season: 'Fall 2026', date: '2026-01-15', type: 'Regular' }
    ],
    uzbekistanContext: {
      visaSuccessRatePercent: 88,
      centralAsianStudentCountApprox: 45,
      workPermitHoursPerWeek: 20,
      postStudyWorkYears: 2,
      elYurtUmidiEligible: true,
      halalFoodAvailability: 'Medium',
    }
  });

  // Scholarship Form State
  const [scholarshipFormData, setScholarshipFormData] = useState<Partial<ExternalScholarship>>({
    title: '',
    country: 'Xalqaro',
    providerCountry: 'Xalqaro',
    coverage: '100% Grant + Oylik Stipendiya',
    coverageType: 'Full-Ride',
    deadline: '2026-01-15',
    officialUrl: 'https://',
    financialBreakdown: "Kontrakt (100%), oylik stipendiya, bepul yotoqxona va sug'urta",
    requiredTests: 'IELTS 6.5+ / GPA 3.5+',
    description: {
      uz: "O'zbekistonlik talabalar uchun to'liq grant dasturi.",
      ru: 'Полная стипендиальная программа для иностранных студентов.',
      en: 'Fully-funded scholarship program for international students.'
    }
  });

  const handleOpenEdit = (uni: University) => {
    setUniFormData(JSON.parse(JSON.stringify(uni)));
    setEditingUniversity(uni);
    setIsAddingNewUni(false);
  };

  const handleOpenAdd = () => {
    setUniFormData({
      id: `uni-${Date.now()}`,
      name: '',
      country: 'AQSh',
      countryCode: 'US',
      region: 'North America',
      city: '',
      rankingQs: 50,
      rankingThe: 60,
      websiteUrl: 'https://',
      officialAdmissionsUrl: 'https://',
      tuitionUsdPerYear: 18000,
      tuitionRangeText: '$15,000 - $22,000 / yil',
      livingCostUsdPerYear: 10000,
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      degreesOffered: ['Bachelor', 'Master'],
      teachingLanguages: ['English'],
      popularMajors: ['Computer Science', 'Business'],
      description: {
        uz: "Xalqaro talabalar uchun ajoyib imkoniyatlarga ega oliygoh.",
        ru: 'Отличный университет с широкими возможностями для иностранных студентов.',
        en: 'Excellent university with great global opportunities.'
      },
      requirements: {
        minGpa: 3.0,
        gpaScale: '4.0 scale',
        minIelts: 6.5,
        minToefl: 80,
        satRequired: false,
        acceptanceRatePercent: 40,
        requiredDocuments: ['Pasport', 'Attestat / Diplom', 'IELTS / TOEFL', 'Motivation Letter'],
        applicationFeeUsd: 50,
      },
      scholarships: [],
      deadlines: [{ season: 'Fall 2026', date: '2026-02-01', type: 'Regular' }],
      verification: {
        lastVerifiedAt: new Date().toISOString(),
        status: 'verified_official',
        sourceLevel: 1,
        primarySourceUrl: 'https://',
        primarySourceName: 'Official Admissions Office',
        citations: []
      },
      uzbekistanContext: {
        visaSuccessRatePercent: 85,
        centralAsianStudentCountApprox: 20,
        workPermitHoursPerWeek: 20,
        postStudyWorkYears: 2,
        elYurtUmidiEligible: true,
        halalFoodAvailability: 'Medium',
      }
    });
    setIsAddingNewUni(true);
    setEditingUniversity(null);
  };

  const handleSaveUniversity = () => {
    if (!uniFormData.name) {
      alert('Iltimos, universitet nomini kiriting.');
      return;
    }

    if (isAddingNewUni) {
      const newUni = uniFormData as University;
      onAddUniversity(newUni);
      addAuditLog('add_university', newUni.name, `Yangi oliygoh kiritildi: QS #${newUni.rankingQs}, ${newUni.country}`);
      showToast(`"${newUni.name}" muvaffaqiyatli ma'lumotlar bazasiga qo'shildi!`);
    } else if (editingUniversity) {
      const updatedUni = uniFormData as University;
      onUpdateUniversity(updatedUni);
      addAuditLog('update_university', updatedUni.name, `Oliygoh ma'lumotlari yangilandi.`);
      showToast(`"${updatedUni.name}" ma'lumotlari yangilandi!`);
    }

    setIsAddingNewUni(false);
    setEditingUniversity(null);
  };

  const handleTriggerCrawler = async (uni: University) => {
    setVerifyingId(uni.id);
    try {
      await onLiveVerifyUniversity(uni);
      addAuditLog('verify_ai', uni.name, 'Gemini AI Search Grounding tekshiruvi amalga oshirildi.');
      showToast(`"${uni.name}" rasmiy sayti Gemini AI orqali tekshirildi va yangilandi!`);
    } catch (e) {
      alert('Xatolik yuz berdi');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleApproveReport = (report: VerificationReportPayload) => {
    const targetUni = universities.find(u => u.id === report.universityId);
    if (targetUni) {
      handleTriggerCrawler(targetUni);
    }
    setReports(reports.map(r => r.id === report.id ? { ...r, status: 'approved' } : r));
    addAuditLog('resolve_report', report.universityName, `Talaba xabari tasdiqlandi: ${report.reportedField}`);
    showToast(`Xabarnoma tasdiqlandi va oliygoh qayta tekshiruvga yuborildi!`);
  };

  const handleDismissReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
    showToast(`Xabarnoma ro'yxatdan olib tashlandi.`);
  };

  const handleSaveScholarship = () => {
    if (!scholarshipFormData.title) {
      alert('Grant nomini kiriting!');
      return;
    }

    const newSch: ExternalScholarship = {
      id: scholarshipFormData.id || `sch-${Date.now()}`,
      title: scholarshipFormData.title,
      name: scholarshipFormData.title,
      country: scholarshipFormData.country || 'Xalqaro',
      providerCountry: scholarshipFormData.providerCountry || 'Xalqaro',
      coverage: scholarshipFormData.coverage || '100% Grant',
      coverageType: scholarshipFormData.coverageType || 'Full-Ride',
      deadline: scholarshipFormData.deadline || '2026-01-15',
      officialUrl: scholarshipFormData.officialUrl || 'https://',
      financialBreakdown: scholarshipFormData.financialBreakdown || "100% Kontrakt + Oylik Stipendiya",
      requiredTests: scholarshipFormData.requiredTests || 'IELTS 6.5+',
      description: scholarshipFormData.description || {
        uz: "Xalqaro to'liq grant dasturi.",
        ru: 'Полная стипендиальная программа.',
        en: 'Fully-funded scholarship program.'
      }
    };

    if (isAddingScholarship) {
      onAddScholarship(newSch);
      setAllScholarships(prev => [newSch, ...prev]);
      addAuditLog('add_scholarship', newSch.title!, `Yangi grant dasturi kiritildi: ${newSch.coverage}`);
      showToast(`"${newSch.title}" granti bazaga qo'shildi!`);
    } else if (editingScholarship) {
      setAllScholarships(prev => prev.map(s => s.id === newSch.id ? newSch : s));
      showToast(`"${newSch.title}" granti yangilandi!`);
    }

    setIsAddingScholarship(false);
    setEditingScholarship(null);
  };

  const handleDeleteScholarship = (id: string, title: string) => {
    if (confirm(`"${title}" grantini o'chirishni tasdiqlaysizmi?`)) {
      setAllScholarships(prev => prev.filter(s => s.id !== id));
      showToast(`"${title}" o'chirildi.`);
    }
  };

  const handleToggleUserRole = (userId: string) => {
    const updated = registeredUsers.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'student' : 'admin';
        return { ...u, role: nextRole as any };
      }
      return u;
    });
    setRegisteredUsers(updated);
    localStorage.setItem('globalgrand_registered_users', JSON.stringify(updated));
    showToast("Foydalanuvchi roli muvaffaqiyatli yangilandi!");
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(universities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `globalgrand_universities_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Universitetlar bazasi JSON formatida yuklab olindi!");
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filtered universities
  const filteredUniversities = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountryFilter || u.countryCode === selectedCountryFilter;
    return matchesSearch && matchesCountry;
  });

  // Filtered registered users
  const filteredUsers = registeredUsers.filter(u => {
    const q = userSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.email.toLowerCase().includes(q) || 
           (u.city && u.city.toLowerCase().includes(q));
  });

  const shareUrl = window.location.href;
  const shareText = "GlobalGrand - Xalqaro grantlar va dunyo TOP universitetlariga qabul platformasi.";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>GLOBALGRAND MASTER ADMIN PANEL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Platforma Boshqaruv Markazi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Universitetlar bazasi, to'liq grantlar katalogi, ro'yxatdan o'tgan talabalar akkauntlari, AI Grounded Crawler va tizim audit loglari monitoringi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowPhoneShareModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Telefonga ulashish / QR kod bilan ochish"
            >
              <Smartphone className="w-4 h-4" />
              <span>Telefonga Poslashish</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Universitet</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Barcha ma'lumotlarni JSON formatida yuklab olish"
            >
              <Download className="w-4 h-4" />
              <span>Eksport (JSON)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mt-6 pt-4 border-t border-slate-800 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Umumiy Ko'rsatkichlar & Statistika</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('universities')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'universities'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Universitetlar Boshqaruvi ({universities.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('scholarships')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'scholarships'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Grantlar & Stipendiyalar ({allScholarships.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Foydalanuvchilar & Talabalar ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer relative ${
              activeAdminTab === 'reports'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Talabalar Xabarnomalari</span>
            {reports.filter(r => r.status === 'pending').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[10px] flex items-center justify-center font-bold">
                {reports.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'audit'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audit & Xavfsizlik Loglari</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('crawler')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'crawler'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Crawler Loglari</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Jami Oliygohlar</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {universities.length}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                QS 2027 va THE reytinglari bilan
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">100% Grant Dasturlari</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {allScholarships.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Full-Ride & Hukumat stipendiyalari
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Ro'yxatdagi Foydalanuvchilar</span>
                <Users className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {registeredUsers.length}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Faol talabalar profillari
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Kutilayotgan Xabarlar</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-amber-600">
                {reports.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Talabalar xatolik hisobotlari
              </p>
            </div>
          </div>

          {/* Quick Region Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-600" />
                <span>Mintaqalar Bo'yicha Qamrov</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'Shimoliy Amerika (AQSh, Kanada)', count: universities.filter(u => u.region === 'North America').length, pct: '40%' },
                  { label: 'Yevropa (Buyuk Britaniya, Germaniya, Vengriya, Italiya)', count: universities.filter(u => u.region === 'Europe').length, pct: '35%' },
                  { label: 'Sharqiy & Janubi-Sharqiy Osiyo (Koreya, Singapur, Yaponiya)', count: universities.filter(u => u.region === 'East Asia').length, pct: '15%' },
                  { label: "Markaziy Osiyo & O'zbekiston (TIIAME, NUU, SamSU, KazNU)", count: universities.filter(u => u.region === 'Central Asia' || u.countryCode === 'UZ').length, pct: '10%' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item.label}</span>
                      <span className="font-bold">{item.count} ta oliygoh</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tezkor Boshqaruv Harakatlari</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  onClick={handleOpenAdd}
                  className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold flex flex-col items-start gap-1 text-left hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <span>Yangi Universitet Qo'shish</span>
                  <span className="text-[10px] font-normal text-slate-500">QS 2027, talablar va grantlar bilan</span>
                </button>

                <button
                  onClick={() => {
                    setScholarshipFormData({
                      title: '',
                      country: 'Xalqaro',
                      providerCountry: 'Xalqaro',
                      coverage: '100% Grant + Oylik Stipendiya',
                      coverageType: 'Full-Ride',
                      deadline: '2026-01-15',
                      officialUrl: 'https://',
                      financialBreakdown: "Kontrakt (100%), oylik stipendiya, bepul yotoqxona",
                      requiredTests: 'IELTS 6.5+ / GPA 3.5+',
                      description: {
                        uz: "Xalqaro to'liq grant dasturi.",
                        ru: 'Полная стипендиальная программа.',
                        en: 'Fully-funded scholarship.'
                      }
                    });
                    setIsAddingScholarship(true);
                    setActiveAdminTab('scholarships');
                  }}
                  className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold flex flex-col items-start gap-1 text-left hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Yangi Grant Kiritish</span>
                  <span className="text-[10px] font-normal text-slate-500">Stipendium, Turkiye Burslari, DAAD</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('users')}
                  className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-bold flex flex-col items-start gap-1 text-left hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <Users className="w-5 h-5 text-sky-600" />
                  <span>Talabalar Boshqaruvi</span>
                  <span className="text-[10px] font-normal text-slate-500">{registeredUsers.length} ta ro'yxatdan o'tgan foydalanuvchi</span>
                </button>

                <button
                  onClick={() => setShowPhoneShareModal(true)}
                  className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold flex flex-col items-start gap-1 text-left hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Telefonga Poslashish</span>
                  <span className="text-[10px] font-normal text-slate-500">QR kod orqali smartfonga yuborish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSITIES MANAGEMENT TABLE */}
      {activeAdminTab === 'universities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Universitet yoki mamlakat qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="">Barcha Davlatlar</option>
                <option value="US">AQSh (USA)</option>
                <option value="GB">Buyuk Britaniya (UK)</option>
                <option value="DE">Germaniya</option>
                <option value="KR">Janubiy Koreya</option>
                <option value="HU">Vengriya</option>
                <option value="IT">Italiya</option>
                <option value="UZ">O'zbekiston</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi Oliygoh</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">QS Rank</th>
                    <th className="py-3 px-4">Universitet Nomi & Mamlakat</th>
                    <th className="py-3 px-4">Kontrakt / Yil</th>
                    <th className="py-3 px-4">Min. IELTS / GPA</th>
                    <th className="py-3 px-4">100% Grant</th>
                    <th className="py-3 px-4">Verifikatsiya</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUniversities.map((uni) => (
                    <tr key={uni.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400">
                        #{uni.rankingQs}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {uni.logo && (
                            <img src={uni.logo} alt={uni.name} className="w-7 h-7 rounded-lg object-contain p-0.5 bg-slate-50 border border-slate-200 dark:border-slate-700" />
                          )}
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">
                              {uni.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {uni.city}, {uni.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        ${uni.tuitionUsdPerYear.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        IELTS {uni.requirements.minIelts} • GPA {uni.requirements.minGpa}
                      </td>
                      <td className="py-3 px-4">
                        {uni.scholarships.some(s => s.coverageType.includes('100%')) ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Mavjud (100%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Qisman / Yo'q</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>.edu rasmiy</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTriggerCrawler(uni)}
                            disabled={verifyingId === uni.id}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Gemini AI orqali real-time tekshirish"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${verifyingId === uni.id ? 'animate-spin text-indigo-600' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(uni)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${uni.name}" oliygohini o'chirishni tasdiqlaysizmi?`)) {
                                onDeleteUniversity(uni.id);
                                addAuditLog('delete_university', uni.name, "Oliygoh o'chirildi.");
                                showToast(`"${uni.name}" o'chirildi.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHOLARSHIPS MANAGEMENT */}
      {activeAdminTab === 'scholarships' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Xalqaro Grantlar & Stipendiyalar Katalogi</span>
              </h2>
              <p className="text-xs text-slate-500">
                Stipendium Hungaricum, Turkiye Burslari, DAAD, Chevening kabi to'liq grantlarni boshqaring.
              </p>
            </div>

            <button
              onClick={() => {
                setScholarshipFormData({
                  title: '',
                  country: 'Xalqaro',
                  providerCountry: 'Xalqaro',
                  coverage: '100% Grant + Oylik Stipendiya',
                  coverageType: 'Full-Ride',
                  deadline: '2026-01-15',
                  officialUrl: 'https://',
                  financialBreakdown: "100% Kontrakt, oylik stipendiya, bepul yotoqxona va tibbiy sug'urta",
                  requiredTests: 'IELTS 6.5+ / GPA 3.5+',
                  description: {
                    uz: "O'zbekistonlik talabalar uchun to'liq grant dasturi.",
                    ru: 'Полная стипендиальная программа.',
                    en: 'Fully-funded scholarship.'
                  }
                });
                setIsAddingScholarship(true);
                setEditingScholarship(null);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi Grant Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allScholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                      {sch.providerCountry || sch.country || 'Xalqaro'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Muddati: {sch.deadline}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {sch.title || sch.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {sch.description?.uz || (typeof sch.financialBreakdown === 'string' ? sch.financialBreakdown : 'To\'liq grant imkoniyati')}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Qamrovi: <span className="text-emerald-600 dark:text-emerald-400">{sch.coverage || sch.coverageType || '100%'}</span>
                    </p>
                    <p className="text-slate-500">
                      Talablar: {Array.isArray(sch.requiredTests) ? sch.requiredTests.join(', ') : sch.requiredTests || 'IELTS 6.0+'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  {sch.officialUrl && (
                    <a
                      href={sch.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Rasmiy sayt</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => {
                        setScholarshipFormData(sch);
                        setEditingScholarship(sch);
                        setIsAddingScholarship(false);
                      }}
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteScholarship(sch.id, sch.title || sch.name || 'Grant')}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS & STUDENTS ROSTER */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                <span>Ro'yxatdan O'tgan Foydalanuvchilar & Talabalar Akkauntlari</span>
              </h2>
              <p className="text-xs text-slate-500">
                Talabalar ballari (GPA, IELTS), tanlagan maqsadli oliygohlari va ro'yxatdan o'tgan sanasi.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Foydalanuvchi qidirish..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Foydalanuvchi</th>
                    <th className="py-3 px-4">Email / Login</th>
                    <th className="py-3 px-4">GPA / IELTS / SAT</th>
                    <th className="py-3 px-4">Maqsadli Daraja</th>
                    <th className="py-3 px-4">Topshirilgan Oliygohlar</th>
                    <th className="py-3 px-4">Roli</th>
                    <th className="py-3 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                            alt={u.name}
                            className="w-7 h-7 rounded-xl object-cover border border-indigo-200"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {u.city || 'Toshkent'}, {u.country || "O'zbekiston"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          GPA: {u.profile?.gpa || 3.8}
                        </span>
                        <span className="text-slate-500 ml-2">
                          IELTS: {u.profile?.ielts || 7.5}
                        </span>
                        {u.profile?.sat && u.profile.sat > 0 && (
                          <span className="text-slate-500 ml-2">SAT: {u.profile.sat}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {u.profile?.targetDegree || 'Bakalavr'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                          {u.targetList ? u.targetList.length : 0} ta oliygoh
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300' 
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserRole(u.id)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          {u.role === 'admin' ? "Studentga o'tkazish" : "Admin qilish"}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Foydalanuvchilar topilmadi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STUDENT REPORTS */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Talabalar Tomonidan Yuborilgan Xabarnomalar</span>
              </h2>
              <p className="text-xs text-slate-500">
                Foydalanuvchilar oliygoh kontrakt narxi yoki topshirish muddatlari o'zgarganini xabar qilganda bu yerda ko'rinadi.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {report.universityName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                        {report.reportedField}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Yuboruvchi: {report.reporterEmail || 'Anonim'} • {report.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismissReport(report.id!)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      onClick={() => handleApproveReport(report)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>AI orqali tekshirish & tasdiqlash</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Talabaning izohi:</p>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{report.userCorrectionText}"</p>
                  {report.sourceLink && (
                    <a
                      href={report.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-2"
                    >
                      <span>Rasmiy manba sahifasi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Barcha xabarnomalar ko'rib chiqilgan!</p>
                <p className="text-xs text-slate-500">Hozirda kutilayotgan talabalar murojaatlari mavjud emas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Admin Faoliyati & Xavfsizlik Audit Loglari</span>
              </h2>
              <p className="text-xs text-slate-500">
                Barcha admin amallari, tahrirlar va AI tekshiruvlarining xavfsiz vaqti va jurnali.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {log.targetTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <p className="font-bold text-slate-600 dark:text-slate-300">{log.adminName}</p>
                  <p>{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI CRAWLER LOGS */}
      {activeAdminTab === 'crawler' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Gemini Real-Time AI Search Grounding Crawler</span>
              </h2>
              <p className="text-xs text-slate-500">
                Har bir universitet sahifasining so'nggi tekshirilgan vaqti va rasmiy .edu manbalar reyestri.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {universities.slice(0, 15).map(u => (
              <div key={u.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{u.name}</span>
                    <span className="text-slate-400 ml-2">({u.websiteUrl})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span>Oxirgi tekshiruv: {u.verification.lastVerifiedAt.split('T')[0]}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {u.verification.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: MOBILE SHARE & QR SYNC (Telefonga poslashish) */}
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
                    Telefonga Poslashish / Ulashish
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Smartfoningizda darhol oching yoki do'stlarga yuboring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneShareModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QR Code generator */}
            <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-inner border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code"
                  className="w-36 h-36 mx-auto rounded-lg"
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                📱 Telefoningiz kamerasini QR kodga qarating va platformani smartfonda oching!
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>

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
                onClick={handleCopyShareLink}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                {copiedLink ? "Nusxalandi! ✅" : "Havolani Nusxalash"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT SCHOLARSHIP */}
      {(isAddingScholarship || editingScholarship) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isAddingScholarship ? "Yangi Xalqaro Grant Qo'shish" : "Grant Ma'lumotlarini Tahrirlash"}
              </h2>
              <button 
                onClick={() => { setIsAddingScholarship(false); setEditingScholarship(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grant Nomi</label>
                <input
                  type="text"
                  value={scholarshipFormData.title || ''}
                  onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, title: e.target.value })}
                  placeholder="Masalan: Stipendium Hungaricum 2026-2027"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Davlat</label>
                  <input
                    type="text"
                    value={scholarshipFormData.country || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, country: e.target.value, providerCountry: e.target.value })}
                    placeholder="Vengriya"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topshirish Muddati (Deadline)</label>
                  <input
                    type="text"
                    value={scholarshipFormData.deadline || ''}
                    onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, deadline: e.target.value })}
                    placeholder="2026-01-15"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qamrovi (Coverage)</label>
                <input
                  type="text"
                  value={scholarshipFormData.coverage || ''}
                  onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, coverage: e.target.value })}
                  placeholder="100% Kontrakt + Oylik Stipendiya + Yotoqxona"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Talab Qilinadigan Ballar</label>
                <input
                  type="text"
                  value={typeof scholarshipFormData.requiredTests === 'string' ? scholarshipFormData.requiredTests : (scholarshipFormData.requiredTests?.join(', ') || '')}
                  onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, requiredTests: e.target.value })}
                  placeholder="IELTS 6.5+ yoki GPA 3.5+"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rasmiy Veb-Sayt Havolasi</label>
                <input
                  type="text"
                  value={scholarshipFormData.officialUrl || ''}
                  onChange={(e) => setScholarshipFormData({ ...scholarshipFormData, officialUrl: e.target.value })}
                  placeholder="https://stipendiumhungaricum.hu"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setIsAddingScholarship(false); setEditingScholarship(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveScholarship}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Saqlash & Bazaga Qo'shish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT UNIVERSITY */}
      {(isAddingNewUni || editingUniversity) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {isAddingNewUni ? "Yangi Universitet Qo'shish" : `${editingUniversity?.name} ma'lumotlarini tahrirlash`}
              </h2>
              <button 
                onClick={() => { setIsAddingNewUni(false); setEditingUniversity(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Universitet Nomi (Inglizcha)</label>
                <input
                  type="text"
                  value={uniFormData.name}
                  onChange={(e) => setUniFormData({ ...uniFormData, name: e.target.value })}
                  placeholder="Masalan: Harvard University"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mamlakat</label>
                <input
                  type="text"
                  value={uniFormData.country}
                  onChange={(e) => setUniFormData({ ...uniFormData, country: e.target.value })}
                  placeholder="AQSh"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Shahar</label>
                <input
                  type="text"
                  value={uniFormData.city}
                  onChange={(e) => setUniFormData({ ...uniFormData, city: e.target.value })}
                  placeholder="Cambridge"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">QS Reyting 2027</label>
                <input
                  type="number"
                  value={uniFormData.rankingQs}
                  onChange={(e) => setUniFormData({ ...uniFormData, rankingQs: parseInt(e.target.value) || 100 })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kontrakt / Yil ($ USD)</label>
                <input
                  type="number"
                  value={uniFormData.tuitionUsdPerYear}
                  onChange={(e) => setUniFormData({ ...uniFormData, tuitionUsdPerYear: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min. IELTS Balli</label>
                <input
                  type="number"
                  step="0.5"
                  value={uniFormData.requirements?.minIelts}
                  onChange={(e) => setUniFormData({
                    ...uniFormData,
                    requirements: { ...uniFormData.requirements!, minIelts: parseFloat(e.target.value) || 6.0 }
                  })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min. GPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={uniFormData.requirements?.minGpa}
                  onChange={(e) => setUniFormData({
                    ...uniFormData,
                    requirements: { ...uniFormData.requirements!, minGpa: parseFloat(e.target.value) || 3.0 }
                  })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rasmiy Qabul Havolasi (Official Admissions URL)</label>
                <input
                  type="text"
                  value={uniFormData.officialAdmissionsUrl}
                  onChange={(e) => setUniFormData({ ...uniFormData, officialAdmissionsUrl: e.target.value })}
                  placeholder="https://admissions.harvard.edu"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="el-yurt-check"
                  checked={uniFormData.uzbekistanContext?.elYurtUmidiEligible}
                  onChange={(e) => setUniFormData({
                    ...uniFormData,
                    uzbekistanContext: { ...uniFormData.uzbekistanContext!, elYurtUmidiEligible: e.target.checked }
                  })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="el-yurt-check" className="font-bold text-slate-800 dark:text-slate-200">
                  "El-Yurt Umidi" jamg'armasi doirasiga kiradi (Top-300 / Mutaxassislik)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setIsAddingNewUni(false); setEditingUniversity(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveUniversity}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Saqlash & Bazaga Qo'shish</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

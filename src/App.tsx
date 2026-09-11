import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { FilterBar } from './components/FilterBar';
import { UniversityCard } from './components/UniversityCard';
import { UniversityDetailModal } from './components/UniversityDetailModal';
import { ScholarshipCard } from './components/ScholarshipCard';
import { RecommendationCalculator } from './components/RecommendationCalculator';
import { UserCabinet } from './components/UserCabinet';
import { AIConsultantChat } from './components/AIConsultantChat';
import { ReportInfoModal } from './components/ReportInfoModal';
import { LiveCrawlerStatusModal } from './components/LiveCrawlerStatusModal';
import { QSRankingsTable } from './components/QSRankingsTable';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLockGate } from './components/AdminLockGate';
import { AuthModal } from './components/AuthModal';

import { UNIVERSITIES_DATABASE } from './data/universities';
import { SCHOLARSHIPS_DATABASE } from './data/scholarships';
import { INITIAL_MOCK_USERS } from './data/mockUsers';
import { TRANSLATIONS } from './data/translations';
import { DegreeLevel, Language, University, AuthUser, ExternalScholarship } from './types';

import { ShieldCheck, Sparkles, Globe, Heart, Award, Bookmark, ArrowRight, ExternalLink, User, KeyRound, UserPlus } from 'lucide-react';

export default function App() {
  // Language
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const t = TRANSLATIONS[currentLang];

  // User Data Store for complete multi-user isolation
  const [usersStore, setUsersStore] = useState<Record<string, AuthUser>>(() => {
    try {
      const saved = localStorage.getItem('globalgrand_users_store');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current Auth User & Auth Modal State (null if not signed in / no profile)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('globalgrand_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('globalgrand_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('globalgrand_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const handleUpdateCurrentUser = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    setUsersStore(prev => {
      const next = { ...prev, [updatedUser.id]: updatedUser };
      try {
        localStorage.setItem('globalgrand_users_store', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleSelectUser = (selectedUser: AuthUser | null) => {
    if (selectedUser) {
      const freshData = usersStore[selectedUser.id] || selectedUser;
      setCurrentUser(freshData);
    } else {
      setCurrentUser(null);
    }
  };

  // Navigation Tabs: 'explore' | 'qsRankings' | 'scholarships' | 'calculator' | 'cabinet' | 'aiChat' | 'crawler' | 'profile' | 'admin'
  const [activeTab, setActiveTab] = useState<'explore' | 'qsRankings' | 'scholarships' | 'calculator' | 'cabinet' | 'aiChat' | 'crawler' | 'profile' | 'admin'>('explore');

  // Universities Database State (allows local updates when AI verifies or Admin edits)
  const [universities, setUniversities] = useState<University[]>(() => {
    try {
      const saved = localStorage.getItem('globalgrand_unis_db');
      return saved ? JSON.parse(saved) : UNIVERSITIES_DATABASE;
    } catch {
      return UNIVERSITIES_DATABASE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('globalgrand_unis_db', JSON.stringify(universities));
    } catch (e) {
      console.error(e);
    }
  }, [universities]);

  const [scholarshipsList, setScholarshipsList] = useState<ExternalScholarship[]>(SCHOLARSHIPS_DATABASE);

  // Admin University Management
  const handleAddUniversity = (newUni: University) => {
    setUniversities(prev => [newUni, ...prev]);
  };

  const handleUpdateUniversity = (updatedUni: University) => {
    setUniversities(prev => prev.map(u => u.id === updatedUni.id ? updatedUni : u));
  };

  const handleDeleteUniversity = (uniId: string) => {
    setUniversities(prev => prev.filter(u => u.id !== uniId));
  };

  const handleAddScholarship = (newSch: ExternalScholarship) => {
    setScholarshipsList(prev => [newSch, ...prev]);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<DegreeLevel | ''>('');
  const [maxTuition, setMaxTuition] = useState<number>(70000);
  const [minIelts, setMinIelts] = useState<number>(4.5);
  const [scholarshipOnly, setScholarshipOnly] = useState<boolean>(false);
  const [elYurtOnly, setElYurtOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'ranking' | 'tuitionAsc' | 'acceptance'>('ranking');

  // Modals & Selected items
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [reportingUniversity, setReportingUniversity] = useState<University | null>(null);
  const [verifyingUniId, setVerifyingUniId] = useState<string | null>(null);

  // Saved Bookmarks (persisted to localStorage)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('globalgrand_saved_unis');
      return saved ? JSON.parse(saved) : ['mit-usa', 'tum-germany', 'debrecen-hungary'];
    } catch {
      return ['mit-usa', 'tum-germany', 'debrecen-hungary'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('globalgrand_saved_unis', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Region count calculator
  const universityCountsByRegion = useMemo(() => {
    const counts: Record<string, number> = {};
    universities.forEach((u) => {
      counts[u.region] = (counts[u.region] || 0) + 1;
    });
    return counts;
  }, [universities]);

  // Filtered & Sorted Universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesCountry = u.country.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
        const matchesMajors = u.popularMajors.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesCountry && !matchesMajors) return false;
      }

      // Country
      if (selectedCountry && u.countryCode !== selectedCountry && !u.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
        return false;
      }

      // Region
      if (selectedRegion && u.region !== selectedRegion) {
        return false;
      }

      // Degree
      if (selectedDegree && !u.degreesOffered.includes(selectedDegree)) {
        return false;
      }

      // Max Tuition
      if (maxTuition < 70000 && u.tuitionUsdPerYear > maxTuition) {
        return false;
      }

      // Min IELTS
      if (minIelts > 4.5 && u.requirements.minIelts > minIelts) {
        return false;
      }

      // 100% Scholarship Only
      if (scholarshipOnly && u.scholarships.length === 0) {
        return false;
      }

      // El-Yurt Umidi (Top 300)
      if (elYurtOnly && !u.uzbekistanContext.elYurtUmidiEligible) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ranking') {
        return a.rankingQs - b.rankingQs;
      }
      if (sortBy === 'tuitionAsc') {
        return a.tuitionUsdPerYear - b.tuitionUsdPerYear;
      }
      if (sortBy === 'acceptance') {
        return b.requirements.acceptanceRatePercent - a.requirements.acceptanceRatePercent;
      }
      return 0;
    });
  }, [universities, searchQuery, selectedCountry, selectedRegion, selectedDegree, maxTuition, minIelts, scholarshipOnly, elYurtOnly, sortBy]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedRegion('');
    setSelectedDegree('');
    setMaxTuition(70000);
    setMinIelts(4.5);
    setScholarshipOnly(false);
    setElYurtOnly(false);
    setSortBy('ranking');
  };

  // Real-time AI Verification Handler
  const handleLiveVerifyUniversity = async (uni: University) => {
    setVerifyingUniId(uni.id);
    try {
      const res = await fetch('/api/verify-university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: uni.id,
          universityName: uni.name,
          country: uni.country,
          officialUrl: uni.officialAdmissionsUrl,
          currentTuition: `$${uni.tuitionUsdPerYear}/year`,
          currentIelts: uni.requirements.minIelts,
        }),
      });

      const data = await res.json();
      if (data.verification) {
        // Update university verification date in state
        setUniversities((prev) =>
          prev.map((u) =>
            u.id === uni.id
              ? {
                  ...u,
                  verification: {
                    ...u.verification,
                    lastVerifiedAt: data.verification.lastVerifiedAt,
                    status: 'verified_official',
                    citations: data.verification.citations || u.verification.citations,
                  },
                }
              : u
          )
        );
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setVerifyingUniId(null);
    }
  };

  // Saved Universities list
  const savedUniversitiesList = useMemo(() => {
    return universities.filter((u) => savedIds.includes(u.id));
  }, [universities, savedIds]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedIds.length}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Views Container */}
      <main>
        {/* VIEW 1: EXPLORE UNIVERSITIES */}
        {activeTab === 'explore' && (
          <div>
            {/* Hero Section with Search */}
            <HeroSection
              currentLang={currentLang}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              onSelectCountry={(c) => {
                setSelectedCountry(c);
                setSelectedRegion('');
              }}
              onOpenCalculator={() => setActiveTab('calculator')}
              onOpenAiChat={() => setActiveTab('aiChat')}
              onOpenQsRankings={() => setActiveTab('qsRankings')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Interactive World Map & Region filter */}
              <InteractiveMap
                currentLang={currentLang}
                selectedRegion={selectedRegion}
                onSelectRegion={(r) => {
                  setSelectedRegion(r);
                  setSelectedCountry('');
                }}
                universityCounts={universityCountsByRegion}
              />

              {/* Filter Bar */}
              <FilterBar
                currentLang={currentLang}
                selectedDegree={selectedDegree}
                onSelectDegree={setSelectedDegree}
                maxTuition={maxTuition}
                onMaxTuitionChange={setMaxTuition}
                minIelts={minIelts}
                onMinIeltsChange={setMinIelts}
                scholarshipOnly={scholarshipOnly}
                onToggleScholarshipOnly={() => setScholarshipOnly(!scholarshipOnly)}
                elYurtOnly={elYurtOnly}
                onToggleElYurtOnly={() => setElYurtOnly(!elYurtOnly)}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onResetFilters={handleResetFilters}
                resultsCount={filteredUniversities.length}
              />

              {/* Universities Grid */}
              {filteredUniversities.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Tanlangan filtrlar bo'yicha universitet topilmadi
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Qidiruv so'zini o'zgartirib ko'ring yoki filtrlarni tozalang.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Filtrlarni Tozalash
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUniversities.map((uni) => (
                    <UniversityCard
                      key={uni.id}
                      university={uni}
                      currentLang={currentLang}
                      isSaved={savedIds.includes(uni.id)}
                      onToggleSave={toggleSave}
                      onSelectUniversity={setSelectedUniversity}
                      onQuickReverify={handleLiveVerifyUniversity}
                      isVerifying={verifyingUniId === uni.id}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW: QS WORLD UNIVERSITY RANKINGS 2027 TABLE */}
        {activeTab === 'qsRankings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <QSRankingsTable
              onSelectUniversity={setSelectedUniversity}
              universitiesDatabase={universities}
              onOpenAiConsultant={(prompt) => {
                setActiveTab('aiChat');
              }}
            />
          </div>
        )}

        {/* VIEW: USER PROFILE & ROADMAP */}
        {activeTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
            {currentUser ? (
              <UserProfileView
                user={currentUser}
                onUpdateUser={handleUpdateCurrentUser}
                universitiesDatabase={universities}
                onSelectUniversity={setSelectedUniversity}
                onOpenCalculator={() => setActiveTab('calculator')}
                onOpenAiConsultant={(prompt) => {
                  setActiveTab('aiChat');
                }}
                currentLang={currentLang}
              />
            ) : (
              /* Sign In / Sign Up Gate if user has no profile */
              <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                  <User className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Shaxsiy Profilingizga Kiring
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Profilingiz orqali saqlangan universitetlar, 100% grant moslik koeffitsienti, yuklangan hujjatlar va arizalaringizni kuzatib boring.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    id="profile-gate-signin-btn"
                    onClick={() => handleOpenAuthModal('login')}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
                    <span>Tizimga Kirish (Sign in)</span>
                  </button>
                  <button
                    id="profile-gate-signup-btn"
                    onClick={() => handleOpenAuthModal('register')}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Yangi Ro'yxatdan O'tish (Sign up)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
            {currentUser?.role === 'admin' ? (
              <AdminPanel
                universities={universities}
                onAddUniversity={handleAddUniversity}
                onUpdateUniversity={handleUpdateUniversity}
                onDeleteUniversity={handleDeleteUniversity}
                scholarships={scholarshipsList}
                onAddScholarship={handleAddScholarship}
                onLiveVerifyUniversity={handleLiveVerifyUniversity}
                currentLang={currentLang}
              />
            ) : (
              <AdminLockGate
                onSuccessLogin={(adminUser) => handleSelectUser(adminUser)}
                onBackToHome={() => setActiveTab('explore')}
              />
            )}
          </div>
        )}

        {/* VIEW 2: GLOBAL SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>100% To'liq Moliyalashtiriluvchi Xalqaro Dasturlar</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {t.scholarshipSection.title}
                </h2>
                <p className="mt-3 text-sm text-indigo-200 leading-relaxed">
                  {t.scholarshipSection.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarshipsList.map((sch) => (
                <ScholarshipCard
                  key={sch.id}
                  scholarship={sch}
                  currentLang={currentLang}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: MATCH ALGORITHM CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <RecommendationCalculator
              universities={universities}
              currentLang={currentLang}
              onSelectUniversity={setSelectedUniversity}
              onToggleSave={toggleSave}
              savedIds={savedIds}
            />
          </div>
        )}

        {/* VIEW 4: STUDENT USER CABINET */}
        {activeTab === 'cabinet' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <UserCabinet
              savedUniversities={savedUniversitiesList}
              currentLang={currentLang}
              onSelectUniversity={setSelectedUniversity}
              onRemoveSaved={toggleSave}
              onExploreMore={() => setActiveTab('explore')}
            />
          </div>
        )}

        {/* VIEW 5: AI ADMISSIONS CONSULTANT */}
        {activeTab === 'aiChat' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AIConsultantChat
              currentLang={currentLang}
            />
          </div>
        )}

        {/* VIEW 6: LIVE CRAWLER MONITOR & TRANSPARENCY */}
        {activeTab === 'crawler' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LiveCrawlerStatusModal
              currentLang={currentLang}
              onClose={() => setActiveTab('explore')}
            />
          </div>
        )}
      </main>

      {/* University Detail Modal */}
      <UniversityDetailModal
        university={selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
        currentLang={currentLang}
        isSaved={selectedUniversity ? savedIds.includes(selectedUniversity.id) : false}
        onToggleSave={toggleSave}
        onReportIssue={(uni) => setReportingUniversity(uni)}
        onLiveVerify={handleLiveVerifyUniversity}
      />

      {/* Report Issue Modal */}
      <ReportInfoModal
        university={reportingUniversity}
        onClose={() => setReportingUniversity(null)}
        currentLang={currentLang}
      />

      {/* Authentication & User Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        currentLang={currentLang}
        initialMode={authModalMode}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  GlobalGrand
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Google AI Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                Dunyo bo'ylab talabalar uchun universitetlar, qabul talablari va to'liq grantlar haqida doimiy yangilanib turuvchi intellektual ma'lumotlar tizimi.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Har bir oliygoh rasmiy .edu va hukumat manbalari bilan tasdiqlangan</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Bo'limlar
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('explore')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Universitetlar Katalogi
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('qsRankings')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-amber-600 dark:text-amber-400">
                    QS World University Rankings 2027
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('scholarships')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Xalqaro Grantlar
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Moslik Kalkulyatori (Reach/Match/Safety)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cabinet')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Shaxsiy Kabinet & Checklist
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('profile')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400">
                    Mening Profilim & Hujjatlar
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-amber-600 dark:text-amber-400">
                    🛡️ Admin Panel & Boshqaruv
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Shaffoflik & AI
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('crawler')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Jonli .edu Crawl Monitoring
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('aiChat')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    AI Qabul Maslahatchisi
                  </button>
                </li>
                <li className="text-[11px] text-slate-400">
                  Model: Gemini 3.8 Flash + Google Search Grounding
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} GlobalGrand. Barcha huquqlar himoyalangan.</p>
            <p className="text-slate-400">
              Ma'lumotlar rasmiy oliygohlar portallari hamda davlat grant jamg'armalari orqali tekshiriladi.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

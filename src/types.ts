export type Language = 'uz' | 'ru' | 'en';

export type DegreeLevel = 'Bachelor' | 'Master' | 'PhD' | 'Foundation';

export type CategoryMatch = 'Reach' | 'Match' | 'Safety';

export interface SourceCitation {
  title: string;
  url: string;
  snippet?: string;
  domainLevel?: 1 | 2 | 3 | 4; // 1: Official .edu / .ac.uk, 2: Gov / Official Scholarship Body, 3: QS / THE, 4: Portals
}

export interface ApplicationDeadline {
  season: 'Fall 2025' | 'Spring 2026' | 'Fall 2026' | 'Rolling' | 'Priority / Scholarship';
  date: string; // YYYY-MM-DD or formatted string
  type: 'Early Decision' | 'Regular' | 'Scholarship Deadline' | 'International Final';
}

export interface UniversityScholarship {
  id: string;
  name: string;
  provider: 'University' | 'Government' | 'Foundation' | 'Partner';
  coverageType: '100% Full Ride (Tuition + Stipend)' | '100% Tuition Waiver' | '50-80% Partial' | 'Fixed Annual Stipend';
  amountValue: string;
  eligibility: string[];
  deadline: string;
  applicationLink?: string;
  elYurtUmidiEligible?: boolean;
}

export interface UniversityRequirement {
  minGpa: number; // e.g. 3.2 on a 4.0 scale or equivalent 80%
  gpaScale: string;
  minIelts: number;
  minToefl: number;
  minDuolingo?: number;
  satRequired: boolean;
  minSat?: number;
  greGmatRequired?: boolean;
  requiredDocuments: string[];
  applicationFeeUsd: number;
  acceptanceRatePercent: number;
  languageNotes?: string;
}

export interface QSRankingItem {
  index: number;
  rank2027: string | number;
  rank2026: string | number;
  name: string;
  country: string;
  region: string;
  size?: string;
  focus?: string;
  research?: string;
  status?: string;
  overallScore?: number | string;
  academicRepScore?: number | string;
  employerRepScore?: number | string;
  facultyStudentScore?: number | string;
  citationsScore?: number | string;
  intlFacultyScore?: number | string;
  intlStudentsScore?: number | string;
  employmentOutcomesScore?: number | string;
  sustainabilityScore?: number | string;
  isUzbekistanOrCentralAsia?: boolean;
}

export interface University {
  id: string;
  name: string;
  nativeName?: string;
  country: string;
  countryCode: string; // ISO 2 letter e.g. 'US', 'GB', 'DE', 'KR', 'IT', 'UZ'
  region: 'North America' | 'Europe' | 'East Asia' | 'Central Asia' | 'Middle East' | 'Oceania' | 'Latin America' | 'Africa';
  city: string;
  logo: string;
  coverImage: string;
  rankingQs: number | string;
  rankingThe: number | string;
  previousRankingQs?: number | string;
  qsClassification?: {
    size?: string;
    focus?: string;
    research?: string;
    status?: string;
  };
  websiteUrl: string;
  officialAdmissionsUrl: string;
  tuitionUsdPerYear: number;
  tuitionRangeText: string;
  livingCostUsdPerYear: number;
  teachingLanguages: string[];
  degreesOffered: DegreeLevel[];
  popularMajors: string[];
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  requirements: UniversityRequirement;
  scholarships: UniversityScholarship[];
  deadlines: ApplicationDeadline[];
  verification: {
    lastVerifiedAt: string; // ISO string
    status: 'verified_official' | 'live_grounded' | 'scheduled_updated';
    sourceLevel: 1 | 2 | 3;
    primarySourceUrl: string;
    primarySourceName: string;
    citations: SourceCitation[];
    changeSummary?: string;
  };
  uzbekistanContext: {
    visaSuccessRatePercent: number;
    centralAsianStudentCountApprox: number;
    workPermitHoursPerWeek: number;
    postStudyWorkYears: number;
    elYurtUmidiEligible: boolean; // Top 300 or top specialized
    halalFoodAvailability: 'High' | 'Medium' | 'Limited';
  };
}

export interface ExternalScholarship {
  id: string;
  name?: string;
  title?: string;
  country?: string;
  providerCountry?: string;
  targetDegrees?: DegreeLevel[];
  degreeLevels?: DegreeLevel[];
  coverage?: string;
  coverageType?: string;
  financialBreakdown: string | {
    uz: string;
    ru: string;
    en: string;
  };
  eligibility?: string[];
  eligibilityCriteria?: {
    uz: string[];
    ru: string[];
    en: string[];
  };
  requiredTests: string | string[];
  deadline: string;
  officialUrl: string;
  organizer?: string;
  badge?: string;
  popularForCentralAsia?: boolean;
  description: {
    uz: string;
    ru: string;
    en: string;
  };
}

export interface ApplicationChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category?: 'docs' | 'tests' | 'recommendation' | 'essay' | 'financial' | 'submission';
  notes?: string;
  deadline?: string;
}

export interface UserProfile {
  gpa: number; // 0.0 - 4.0
  ielts: number; // 0.0 - 9.0
  toefl: number; // 0 - 120
  duolingo: number; // 0 - 160
  sat?: number; // 400 - 1600
  targetDegree: DegreeLevel;
  maxBudgetUsd: number;
  selectedMajors: string[];
  selectedCountries: string[];
  needScholarship: 'full' | 'partial' | 'any';
  priorityWeights: {
    gpa: number; // weight
    language: number;
    budget: number;
    major: number;
    scholarship: number;
    ranking: number;
  };
}

export interface RecommendationResult {
  university: University;
  matchCategory: CategoryMatch;
  overallScore: number; // 0 - 100
  scoreBreakdown: {
    gpaScore: number;
    languageScore: number;
    budgetScore: number;
    majorScore: number;
    scholarshipScore: number;
    rankingScore: number;
  };
  reasons: {
    uz: string[];
    ru: string[];
    en: string[];
  };
  improvementTips: {
    uz: string[];
    ru: string[];
    en: string[];
  };
}

export interface ChecklistItem {
  id: string;
  titleKey: string;
  category: 'Documents' | 'Testing' | 'Application' | 'Scholarship' | 'Visa';
  isCompleted: boolean;
  notes?: string;
  deadline?: string;
}

export interface SavedApplication {
  universityId: string;
  savedAt: string;
  targetMajor: string;
  targetDeadline: string;
  status: 'planning' | 'preparing_docs' | 'submitted' | 'interview' | 'accepted' | 'rejected';
  customNotes?: string;
  checklist: ChecklistItem[];
}

export interface VerificationReportPayload {
  universityId: string;
  universityName: string;
  reportedField: string;
  userCorrectionText: string;
  sourceLink?: string;
  reporterEmail?: string;
  id?: string;
  createdAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UserTargetUniversity {
  universityId: string;
  degree: DegreeLevel;
  major: string;
  status: 'wishlist' | 'preparing_docs' | 'submitted' | 'interview' | 'accepted' | 'rejected';
  appliedDate?: string;
  notes?: string;
  scholarshipApplied?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'student' | 'admin' | 'counselor';
  avatar?: string;
  phone?: string;
  telegramUsername?: string;
  city?: string;
  country?: string;
  schoolOrUniversity?: string;
  graduationYear?: number;
  bio?: string;
  profile: UserProfile;
  documents: {
    cvUploaded: boolean;
    cvName?: string;
    motivationLetterDraft?: string;
    ieltsCertificateId?: string;
    satScoreReportId?: string;
    diplomaUploaded: boolean;
    recommendationLettersCount: number;
  };
  targetList: UserTargetUniversity[];
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: 'add_university' | 'update_university' | 'delete_university' | 'verify_ai' | 'resolve_report' | 'add_scholarship';
  targetTitle: string;
  details: string;
}

import { AuthUser } from '../types';

export const INITIAL_MOCK_USERS: AuthUser[] = [
  {
    id: 'user-admin',
    name: 'Dilshod Rahmatov (Admin)',
    username: 'Admin001',
    password: 'Admin123456',
    email: 'admin001@globalgrand.uz',
    role: 'admin',
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
  },
];


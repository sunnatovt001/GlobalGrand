import { RecommendationResult, University, UserProfile } from '../types';

export function calculateUniversityMatch(university: University, user: UserProfile): RecommendationResult {
  const req = university.requirements;

  // 1. GPA Match (0 - 100)
  let gpaScore = 0;
  if (user.gpa >= req.minGpa) {
    const surplus = user.gpa - req.minGpa;
    gpaScore = Math.min(100, 85 + surplus * 30);
  } else {
    const deficit = req.minGpa - user.gpa;
    gpaScore = Math.max(10, 80 - deficit * 120);
  }

  // 2. Language Match (0 - 100)
  let languageScore = 0;
  const userIeltsEquiv = user.ielts > 0 ? user.ielts : user.toefl > 0 ? user.toefl / 15 : user.duolingo > 0 ? user.duolingo / 20 : 5.0;
  if (userIeltsEquiv >= req.minIelts) {
    const surplus = userIeltsEquiv - req.minIelts;
    languageScore = Math.min(100, 85 + surplus * 15);
  } else {
    const deficit = req.minIelts - userIeltsEquiv;
    languageScore = Math.max(15, 80 - deficit * 40);
  }

  // 3. Budget Match (0 - 100)
  let budgetScore = 0;
  const totalCost = university.tuitionUsdPerYear + university.livingCostUsdPerYear;
  const hasFullScholarship = university.scholarships.some(
    (s) => s.coverageType.includes('100% Full Ride') || s.coverageType.includes('100% Tuition')
  );

  if (user.maxBudgetUsd >= totalCost) {
    budgetScore = 100;
  } else if (hasFullScholarship) {
    // If student cannot afford out of pocket but full scholarship exists
    budgetScore = 80;
  } else if (user.maxBudgetUsd >= university.tuitionUsdPerYear) {
    budgetScore = 65;
  } else {
    const ratio = Math.max(0.1, user.maxBudgetUsd / Math.max(1, university.tuitionUsdPerYear));
    budgetScore = Math.min(60, Math.round(ratio * 70));
  }

  // 4. Major Match (0 - 100)
  let majorScore = 75; // baseline
  if (user.selectedMajors.length > 0) {
    const hasMatchingMajor = university.popularMajors.some((m) =>
      user.selectedMajors.some((um) => m.toLowerCase().includes(um.toLowerCase()) || um.toLowerCase().includes(m.toLowerCase()))
    );
    majorScore = hasMatchingMajor ? 100 : 55;
  }

  // 5. Scholarship Opportunity (0 - 100)
  let scholarshipScore = 30;
  if (university.scholarships.length > 0) {
    scholarshipScore = hasFullScholarship ? 95 : 75;
  }
  if (university.uzbekistanContext.elYurtUmidiEligible) {
    scholarshipScore = Math.min(100, scholarshipScore + 10);
  }

  // 6. Ranking Prestige (0 - 100)
  const qsRankNum = typeof university.rankingQs === 'number'
    ? university.rankingQs
    : parseInt(String(university.rankingQs).replace(/[^\d]/g, ''), 10) || 999;

  let rankingScore = 50;
  if (qsRankNum <= 20) rankingScore = 100;
  else if (qsRankNum <= 50) rankingScore = 90;
  else if (qsRankNum <= 150) rankingScore = 80;
  else if (qsRankNum <= 400) rankingScore = 70;
  else if (qsRankNum <= 800) rankingScore = 60;
  else rankingScore = 50;

  // Normalized weights
  const rawWeights = user.priorityWeights;
  const totalWeight =
    rawWeights.gpa +
    rawWeights.language +
    rawWeights.budget +
    rawWeights.major +
    rawWeights.scholarship +
    rawWeights.ranking;

  const wGpa = rawWeights.gpa / totalWeight;
  const wLang = rawWeights.language / totalWeight;
  const wBudget = rawWeights.budget / totalWeight;
  const wMajor = rawWeights.major / totalWeight;
  const wScholar = rawWeights.scholarship / totalWeight;
  const wRank = rawWeights.ranking / totalWeight;

  const overallScore = Math.round(
    gpaScore * wGpa +
      languageScore * wLang +
      budgetScore * wBudget +
      majorScore * wMajor +
      scholarshipScore * wScholar +
      rankingScore * wRank
  );

  // Category determination (Reach, Match, Safety)
  let matchCategory: 'Reach' | 'Match' | 'Safety' = 'Match';

  const isHighlyCompetitive = qsRankNum <= 50 || req.acceptanceRatePercent < 15;
  const satisfiesGpa = user.gpa >= req.minGpa;
  const satisfiesLang = userIeltsEquiv >= req.minIelts;
  const exceedsGpaByComfort = user.gpa >= req.minGpa + 0.2;
  const exceedsLangByComfort = userIeltsEquiv >= req.minIelts + 0.5;

  if (isHighlyCompetitive || !satisfiesGpa || !satisfiesLang || overallScore < 65) {
    matchCategory = 'Reach';
  } else if (
    overallScore >= 80 &&
    exceedsGpaByComfort &&
    exceedsLangByComfort &&
    req.acceptanceRatePercent >= 35
  ) {
    matchCategory = 'Safety';
  } else {
    matchCategory = 'Match';
  }

  // Explanations & Improvement Tips
  const reasons = {
    uz: [
      satisfiesGpa
        ? `GPA ko'rsatkichingiz (${user.gpa}) minimal talabdan (${req.minGpa}) yuqori.`
        : `GPA bali (${user.gpa}) talab qilingan (${req.minGpa}) dan pastroq, kompensatsiya kerak.`,
      satisfiesLang
        ? `Til darajangiz (IELTS ${userIeltsEquiv}) talab qilingan (${req.minIelts}) darajaga to'liq yetarli.`
        : `Til sertifikatini IELTS ${req.minIelts} ga ko'tarish qabul imkoniyatini keskin oshiradi.`,
      hasFullScholarship
        ? `Universitetda 100% to'liq grant / ehtiyojga asoslangan moliyaviy yordam mavjud.`
        : `Kontrakt va yashash xarajatlari byudjet bilan solishtirildi.`,
    ],
    ru: [
      satisfiesGpa
        ? `Ваш GPA (${user.gpa}) полностью соответствует или превышает минимум (${req.minGpa}).`
        : `Ваш GPA (${user.gpa}) ниже среднего порога (${req.minGpa}).`,
      satisfiesLang
        ? `Уровень английского (IELTS ${userIeltsEquiv}) достаточен для поступления.`
        : `Рекомендуется повысить балл IELTS до ${req.minIelts}.`,
      hasFullScholarship
        ? `Доступны 100% грантовые программы и финансовая помощь.`
        : `Финансовые условия сопоставлены с вашим бюджетом.`,
    ],
    en: [
      satisfiesGpa
        ? `Your GPA (${user.gpa}) satisfies or exceeds the minimum threshold (${req.minGpa}).`
        : `Your GPA (${user.gpa}) is below the standard minimum (${req.minGpa}).`,
      satisfiesLang
        ? `Your language proficiency meets requirements (IELTS ${userIeltsEquiv} vs min ${req.minIelts}).`
        : `Improving your language test score to IELTS ${req.minIelts}+ is recommended.`,
      hasFullScholarship
        ? `Full-ride / high coverage scholarships available.`
        : `Budget alignment evaluated against estimated costs.`,
    ],
  };

  const improvementTips = {
    uz: [
      matchCategory === 'Reach'
        ? "Ushbu oliygoh uchun kuchli motivatsiya xati (SOP), ilmiy loyihalar va xalqaro olimpiada natijalari yordam beradi."
        : "Hujjatlarni 'Early Action' yoki birinchi grant raundida topshirish qabul ehtimolini 25% ga oshiradi.",
      req.satRequired && (!user.sat || user.sat < (req.minSat || 1350))
        ? `SAT testidan kamida ${req.minSat || 1350}+ ball to'plash tavsiya etiladi.`
        : "O'qituvchilaringizdan 2 ta batafsil tavsiyanoma (Recommendation Letters) tayyorlang.",
    ],
    ru: [
      matchCategory === 'Reach'
        ? 'Уделите особое внимание мотивационному письму (SOP) и внеучебным достижениям.'
        : 'Подача документов в первом раунде (Early Action) повышает шансы на 25%.',
      req.satRequired && (!user.sat || user.sat < (req.minSat || 1350))
        ? `Рекомендуется сдать SAT на балл ${req.minSat || 1350}+.`
        : 'Подготовьте 2 подробных рекомендательных письма от преподавателей.',
    ],
    en: [
      matchCategory === 'Reach'
        ? 'Enhance your application with exceptional essays, extracurricular leadership, and projects.'
        : 'Applying in early rounds increases scholarship consideration odds by up to 25%.',
      req.satRequired && (!user.sat || user.sat < (req.minSat || 1350))
        ? `Aim for a standardized SAT score of ${req.minSat || 1350}+.`
        : 'Secure 2 detailed, personalized academic recommendation letters.',
    ],
  };

  return {
    university,
    matchCategory,
    overallScore,
    scoreBreakdown: {
      gpaScore: Math.round(gpaScore),
      languageScore: Math.round(languageScore),
      budgetScore: Math.round(budgetScore),
      majorScore: Math.round(majorScore),
      scholarshipScore: Math.round(scholarshipScore),
      rankingScore: Math.round(rankingScore),
    },
    reasons,
    improvementTips,
  };
}

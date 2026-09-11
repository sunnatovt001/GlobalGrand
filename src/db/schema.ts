import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  role: text('role').default('student'),
  bio: text('bio'),
  phone: text('phone'),
  telegram: text('telegram'),
  city: text('city').default('Toshkent'),
  country: text('country').default("O'zbekiston"),
  targetDegree: text('target_degree').default('Bachelor'),
  targetMajor: text('target_major').default('Computer Science'),
  gpa: text('gpa').default('3.8'),
  ielts: text('ielts').default('7.0'),
  toefl: text('toefl').default(''),
  sat: text('sat').default(''),
  duolingo: text('duolingo').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Universities table
export const universitiesTable = pgTable('universities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  countryCode: text('country_code').notNull(),
  city: text('city').notNull(),
  region: text('region'),
  rankingQs: integer('ranking_qs'),
  rankingThe: integer('ranking_the'),
  tuitionUsdPerYear: integer('tuition_usd_per_year'),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// External Scholarships table
export const scholarshipsTable = pgTable('scholarships', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  country: text('country'),
  coverage: text('coverage'),
  deadline: text('deadline'),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Student Applications Tracker table
export const applicationsTable = pgTable('applications', {
  id: text('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  universityId: text('university_id').notNull(),
  universityName: text('university_name').notNull(),
  status: text('status').notNull().default('draft'),
  degree: text('degree').default('Bachelor'),
  major: text('major').default('Computer Science'),
  intakeSeason: text('intake_season').default('Fall 2026'),
  appliedDate: text('applied_date'),
  notes: text('notes'),
  checklist: jsonb('checklist'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Verification Reports table
export const verificationReportsTable = pgTable('verification_reports', {
  id: text('id').primaryKey(),
  universityId: text('university_id').notNull(),
  universityName: text('university_name').notNull(),
  reportedField: text('reported_field').notNull(),
  userCorrectionText: text('user_correction_text').notNull(),
  sourceLink: text('source_link'),
  reporterEmail: text('reporter_email'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin Audit Logs table
export const auditLogsTable = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  adminName: text('admin_name').notNull(),
  action: text('action').notNull(),
  targetTitle: text('target_title').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

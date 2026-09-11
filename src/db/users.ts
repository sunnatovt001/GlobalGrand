import { db } from './index';
import { users, universitiesTable, scholarshipsTable, applicationsTable, auditLogsTable, verificationReportsTable } from './schema';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, avatar?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing && existing.length > 0) {
      return existing[0];
    }

    const inserted = await db.insert(users).values({
      uid,
      email,
      name: name || email.split('@')[0],
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: email.includes('admin') ? 'admin' : 'student',
      city: 'Toshkent',
      country: "O'zbekiston",
      targetDegree: 'Bachelor',
      targetMajor: 'Computer Science',
      gpa: '3.8',
      ielts: '7.0',
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('User database operation failed', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error('getUserByUid error:', error);
    throw new Error('Failed to fetch user', { cause: error });
  }
}

export async function updateUserProfile(uid: string, data: {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  telegram?: string;
  city?: string;
  country?: string;
  avatar?: string;
  targetDegree?: string;
  targetMajor?: string;
  gpa?: string;
  ielts?: string;
  toefl?: string;
  sat?: string;
  duolingo?: string;
  role?: string;
}) {
  try {
    // Upsert or update
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length === 0) {
      const inserted = await db.insert(users).values({
        uid,
        email: data.email || 'user@example.com',
        name: data.name || 'Student',
        ...data,
        updatedAt: new Date(),
      }).returning();
      return inserted[0];
    }

    const updated = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();

    return updated[0];
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw new Error('Failed to update user profile in PostgreSQL database', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('getAllUsers error:', error);
    return [];
  }
}

// Database helper for universities
export async function syncUniversities(unis: any[]) {
  try {
    for (const uni of unis) {
      await db.insert(universitiesTable).values({
        id: uni.id,
        name: uni.name,
        country: uni.country,
        countryCode: uni.countryCode,
        city: uni.city,
        region: uni.region,
        rankingQs: uni.rankingQs,
        rankingThe: uni.rankingThe,
        tuitionUsdPerYear: uni.tuitionUsdPerYear,
        data: uni,
      }).onConflictDoUpdate({
        target: universitiesTable.id,
        set: {
          name: uni.name,
          country: uni.country,
          countryCode: uni.countryCode,
          city: uni.city,
          region: uni.region,
          rankingQs: uni.rankingQs,
          rankingThe: uni.rankingThe,
          tuitionUsdPerYear: uni.tuitionUsdPerYear,
          data: uni,
          updatedAt: new Date(),
        }
      });
    }
  } catch (e) {
    console.error('syncUniversities error:', e);
  }
}

export async function getDbUniversities() {
  try {
    const rows = await db.select().from(universitiesTable);
    return rows.map(r => r.data);
  } catch (e) {
    console.error('getDbUniversities error:', e);
    return [];
  }
}

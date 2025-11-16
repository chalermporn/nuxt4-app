import { Elysia } from 'elysia';
import { db } from '../../db';
import { users, refreshTokens } from '../../db/schema';
import { sql, count, eq, gte, lt, desc, and } from 'drizzle-orm';
import { jwtConfig, authMiddleware, requireRole } from '../middleware/auth';

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .use(jwtConfig)
  .use(authMiddleware)
  .use(requireRole(['admin', 'moderator']))

  // Get dashboard analytics
  .get('/dashboard', async ({ set }) => {
    try {
      // Get total users count by role
      const userStats = await db
        .select({
          role: users.role,
          count: count(),
        })
        .from(users)
        .groupBy(users.role);

      // Calculate user growth
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now);
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const newUsersToday = await db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, today));

      const newUsersThisWeek = await db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, thisWeek));

      const newUsersThisMonth = await db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, thisMonth));

      // Get total users
      const totalUsers = await db.select({ count: count() }).from(users);

      // Get active sessions (valid refresh tokens)
      const activeSessions = await db
        .select({ count: count() })
        .from(refreshTokens)
        .where(gte(refreshTokens.expiresAt, new Date()));

      // Get recent users (last 10)
      const recentUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(10);

      // Get user growth trend (last 7 days)
      const growthTrend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayUsers = await db
          .select({ count: count() })
          .from(users)
          .where(
            and(
              gte(users.createdAt, date),
              lt(users.createdAt, nextDate)
            )
          );

        growthTrend.push({
          date: date.toISOString().split('T')[0],
          count: dayUsers[0]?.count || 0,
        });
      }

      // Calculate role distribution percentages
      const total = totalUsers[0]?.count || 1;
      const roleDistribution = userStats.map((stat) => ({
        role: stat.role,
        count: stat.count,
        percentage: ((stat.count / total) * 100).toFixed(1),
      }));

      return {
        overview: {
          totalUsers: totalUsers[0]?.count || 0,
          activeSessions: activeSessions[0]?.count || 0,
          newUsersToday: newUsersToday[0]?.count || 0,
          newUsersThisWeek: newUsersThisWeek[0]?.count || 0,
          newUsersThisMonth: newUsersThisMonth[0]?.count || 0,
        },
        roleDistribution,
        growthTrend,
        recentUsers,
      };
    } catch (error) {
      console.error('Analytics error:', error);
      set.status = 500;
      return { error: 'Failed to fetch analytics' };
    }
  })

  // Get user activity insights
  .get('/activity', async ({ set }) => {
    try {
      // Get login activity (based on refresh tokens)
      const recentActivity = await db
        .select({
          userId: refreshTokens.userId,
          userName: users.name,
          userEmail: users.email,
          userRole: users.role,
          createdAt: refreshTokens.createdAt,
        })
        .from(refreshTokens)
        .innerJoin(users, eq(refreshTokens.userId, users.id))
        .orderBy(desc(refreshTokens.createdAt))
        .limit(20);

      // Get users with most sessions
      const topActiveUsers = await db
        .select({
          userId: refreshTokens.userId,
          userName: users.name,
          userEmail: users.email,
          sessionCount: count(),
        })
        .from(refreshTokens)
        .innerJoin(users, eq(refreshTokens.userId, users.id))
        .groupBy(refreshTokens.userId, users.name, users.email)
        .orderBy(desc(count()))
        .limit(10);

      return {
        recentActivity,
        topActiveUsers,
      };
    } catch (error) {
      console.error('Activity analytics error:', error);
      set.status = 500;
      return { error: 'Failed to fetch activity analytics' };
    }
  })

  // Get system health stats
  .get('/health', async ({ set }) => {
    try {
      const now = new Date();

      // Total refresh tokens
      const totalTokens = await db
        .select({ count: count() })
        .from(refreshTokens);

      // Active tokens
      const activeTokens = await db
        .select({ count: count() })
        .from(refreshTokens)
        .where(gte(refreshTokens.expiresAt, now));

      // Expired tokens
      const expiredTokens = (totalTokens[0]?.count || 0) - (activeTokens[0]?.count || 0);

      // Database size estimation
      const dbStats = {
        totalUsers: await db.select({ count: count() }).from(users),
        totalTokens: totalTokens[0]?.count || 0,
        activeTokens: activeTokens[0]?.count || 0,
        expiredTokens,
      };

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStats,
      };
    } catch (error) {
      console.error('Health check error:', error);
      set.status = 500;
      return {
        status: 'unhealthy',
        error: 'Failed to fetch health stats',
      };
    }
  });

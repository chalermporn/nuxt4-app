import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { users, refreshTokens } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcrypt';
import { jwtConfig } from '../middleware/auth';

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwtConfig)
  
  // Register new user
  .post(
    '/register',
    async ({ body, set, jwt }) => {
      try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, body.email),
        });

        if (existingUser) {
          set.status = 400;
          return { error: 'User already exists' };
        }

        // Hash password
        const hashedPassword = await hash(body.password, SALT_ROUNDS);

        // Create user
        const [newUser] = await db
          .insert(users)
          .values({
            email: body.email,
            password: hashedPassword,
            name: body.name,
            role: 'user', // Default role
          })
          .returning();

        // Generate tokens
        const accessToken = await jwt.sign({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
        });

        const refreshToken = await jwt.sign({
          userId: newUser.id,
          type: 'refresh',
          iat: Date.now(), // Add timestamp to make token unique
        });

        // Store refresh token
        await db.insert(refreshTokens).values({
          userId: newUser.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
        });

        return {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
          accessToken,
          refreshToken,
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Registration failed' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
        name: t.String({ minLength: 2 }),
      }),
    }
  )

  // Login
  .post(
    '/login',
    async ({ body, set, jwt }) => {
      try {
        // Find user
        const user = await db.query.users.findFirst({
          where: eq(users.email, body.email),
        });

        if (!user) {
          set.status = 401;
          return { error: 'Invalid credentials' };
        }

        // Verify password
        const isValid = await compare(body.password, user.password);
        if (!isValid) {
          set.status = 401;
          return { error: 'Invalid credentials' };
        }

        // Generate tokens
        const accessToken = await jwt.sign({
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        const refreshToken = await jwt.sign({
          userId: user.id,
          type: 'refresh',
          iat: Date.now(), // Add timestamp to make token unique
        });

        // Delete any existing refresh tokens for this user
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));

        // Store refresh token
        await db.insert(refreshTokens).values({
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken,
          refreshToken,
        };
      } catch (error) {
        console.error('Login error:', error);
        set.status = 500;
        return { error: 'Login failed' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  )

  // Refresh token
  .post(
    '/refresh',
    async ({ body, set, jwt }) => {
      try {
        // Verify refresh token
        const payload = await jwt.verify(body.refreshToken);
        if (!payload || payload.type !== 'refresh') {
          set.status = 401;
          return { error: 'Invalid refresh token' };
        }

        // Check if refresh token exists and is not expired
        const storedToken = await db.query.refreshTokens.findFirst({
          where: eq(refreshTokens.token, body.refreshToken),
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
          set.status = 401;
          return { error: 'Refresh token expired or invalid' };
        }

        // Get user
        const user = await db.query.users.findFirst({
          where: eq(users.id, storedToken.userId),
        });

        if (!user) {
          set.status = 401;
          return { error: 'User not found' };
        }

        // Generate new access token
        const accessToken = await jwt.sign({
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Token refresh failed' };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
    }
  )

  // Logout
  .post(
    '/logout',
    async ({ body, set }) => {
      try {
        // Delete refresh token
        await db.delete(refreshTokens).where(eq(refreshTokens.token, body.refreshToken));

        return { message: 'Logged out successfully' };
      } catch (error) {
        set.status = 500;
        return { error: 'Logout failed' };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
    }
  );

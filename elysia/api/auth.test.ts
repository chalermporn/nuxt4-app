import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Elysia } from 'elysia';
import { authRoutes } from './auth';
import { db } from '../../db';
import { users, refreshTokens } from '../../db/schema';
import { eq } from 'drizzle-orm';

describe('Auth API', () => {
  const app = new Elysia().use(authRoutes);

  // Clean up database before each test
  beforeEach(async () => {
    await db.delete(refreshTokens);
    await db.delete(users);
  });

  afterEach(async () => {
    await db.delete(refreshTokens);
    await db.delete(users);
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.name).toBe('Test User');
      expect(data.user.role).toBe('user');
    });

    it('should reject registration with existing email', async () => {
      // First registration
      await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      // Second registration with same email
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'different123',
            name: 'Another User',
          }),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });

    it('should reject registration with invalid email', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'invalid-email',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      expect(response.status).toBe(422);
    });

    it('should reject registration with short password', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: '12345',
            name: 'Test User',
          }),
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a test user
      await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );
    });

    it('should login successfully with valid credentials', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        console.error('Login failed:', response.status, errorData);
      }

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject login with invalid email', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'password123',
          }),
        })
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'wrongpassword',
          }),
        })
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and get tokens
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      const data = await response.json();
      refreshToken = data.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken,
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject invalid refresh token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: 'invalid-token',
          }),
        })
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Invalid');
    });

    it('should reject expired refresh token', async () => {
      // Create a valid JWT and store it with an expired date
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'expired@example.com',
            password: 'password123',
            name: 'Expired User',
          }),
        })
      );

      const { refreshToken: validToken, user } = await response.json();

      // Update the token to be expired
      await db
        .update(refreshTokens)
        .set({ expiresAt: new Date(Date.now() - 1000) })
        .where(eq(refreshTokens.token, validToken));

      const refreshResponse = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: validToken,
          }),
        })
      );

      expect(refreshResponse.status).toBe(401);
      const data = await refreshResponse.json();
      expect(data.error).toContain('expired');
    });

    it('should reject refresh token when user is deleted', async () => {
      // Create a user and get their refresh token
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'deleted@example.com',
            password: 'password123',
            name: 'Deleted User',
          }),
        })
      );

      const { refreshToken: validToken, user: createdUser } = await response.json();

      // Delete the user but keep the refresh token
      await db.delete(users).where(eq(users.id, createdUser.id));

      // Try to refresh with the orphaned token
      const refreshResponse = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: validToken,
          }),
        })
      );

      expect(refreshResponse.status).toBe(401);
      const data = await refreshResponse.json();
      expect(data.error).toContain('User not found');
    });
  });

  describe('POST /auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and get tokens
      const response = await app.handle(
        new Request('http://localhost/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      const data = await response.json();
      refreshToken = data.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken,
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Logged out successfully');

      // Verify token is deleted
      const token = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, refreshToken),
      });
      expect(token).toBeUndefined();
    });

    it('should handle logout with invalid token gracefully', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: 'invalid-token',
          }),
        })
      );

      // Should still return success even if token doesn't exist
      expect(response.status).toBe(200);
    });
  });
});

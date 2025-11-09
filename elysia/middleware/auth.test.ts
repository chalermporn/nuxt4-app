import { describe, it, expect, beforeEach } from 'vitest';
import { Elysia } from 'elysia';
import { jwtConfig, authMiddleware, requireRole } from './auth';

describe('Auth Middleware', () => {
  describe('authMiddleware', () => {
    let app: Elysia;
    let validToken: string;

    beforeEach(async () => {
      const jwtApp = new Elysia().use(jwtConfig);

      // Access JWT properly through the app instance
      let jwtInstance: any;
      jwtApp.get('/get-jwt', ({ jwt }) => {
        jwtInstance = jwt;
        return { ok: true };
      });

      // Trigger the route to get jwt instance
      await jwtApp.handle(new Request('http://localhost/get-jwt'));

      // Generate a valid token for testing
      validToken = await jwtInstance.sign({
        userId: 1,
        email: 'test@example.com',
        role: 'user',
      });

      app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .get('/protected', ({ user }) => ({
          message: 'Success',
          user,
        }));
    });

    it('should allow request with valid Bearer token', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected', {
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject request without Authorization header', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected')
      );

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token format', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected', {
          headers: {
            Authorization: 'InvalidFormat token123',
          },
        })
      );

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected', {
          headers: {
            Authorization: 'Bearer invalid.token.here',
          },
        })
      );

      expect(response.status).toBe(401);
    });

    it('should reject request with missing Bearer prefix', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected', {
          headers: {
            Authorization: validToken,
          },
        })
      );

      expect(response.status).toBe(401);
    });

    it('should extract user information from token', async () => {
      const response = await app.handle(
        new Request('http://localhost/protected', {
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        })
      );

      const data = await response.json();
      expect(data.user).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'user',
      });
    });
  });

  describe('requireRole', () => {
    let app: Elysia;
    let adminToken: string;
    let userToken: string;
    let moderatorToken: string;

    beforeEach(async () => {
      const jwtApp = new Elysia().use(jwtConfig);

      // Access JWT properly through the app instance
      let jwtInstance: any;
      jwtApp.get('/get-jwt', ({ jwt }) => {
        jwtInstance = jwt;
        return { ok: true };
      });

      // Trigger the route to get jwt instance
      await jwtApp.handle(new Request('http://localhost/get-jwt'));

      adminToken = await jwtInstance.sign({
        userId: 1,
        email: 'admin@example.com',
        role: 'admin',
      });

      userToken = await jwtInstance.sign({
        userId: 2,
        email: 'user@example.com',
        role: 'user',
      });

      moderatorToken = await jwtInstance.sign({
        userId: 3,
        email: 'moderator@example.com',
        role: 'moderator',
      });
    });

    it('should allow admin to access admin-only route', async () => {
      app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireRole(['admin']))
        .get('/admin-only', ({ user }) => ({
          message: 'Admin access granted',
          user,
        }));

      const response = await app.handle(
        new Request('http://localhost/admin-only', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Admin access granted');
    });

    it('should reject user from accessing admin-only route', async () => {
      app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireRole(['admin']))
        .get('/admin-only', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/admin-only', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should allow multiple roles to access route', async () => {
      app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireRole(['admin', 'moderator']))
        .get('/admin-or-mod', ({ user }) => ({
          message: 'Access granted',
          user,
        }));

      // Admin should have access
      const adminResponse = await app.handle(
        new Request('http://localhost/admin-or-mod', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );
      expect(adminResponse.status).toBe(200);

      // Moderator should have access
      const modResponse = await app.handle(
        new Request('http://localhost/admin-or-mod', {
          headers: {
            Authorization: `Bearer ${moderatorToken}`,
          },
        })
      );
      expect(modResponse.status).toBe(200);

      // User should not have access
      const userResponse = await app.handle(
        new Request('http://localhost/admin-or-mod', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );
      expect(userResponse.status).toBe(403);
    });

    it('should return 403 with proper error message', async () => {
      app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireRole(['admin']))
        .get('/admin-only', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/admin-only', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('Forbidden');
    });
  });
});

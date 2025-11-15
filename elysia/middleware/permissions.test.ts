/**
 * Permission Middleware Test Suite
 * Tests for permission-based access control middleware
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { Elysia } from 'elysia';
import {
  jwtConfig,
  authMiddleware,
  requirePermission,
  requireResourcePermission,
  requireAnyPermission,
  requireAllPermissions,
} from './auth';
import { db } from '../../db';
import { roles, permissions, rolePermissions } from '../../db/schema';

describe('Permission Middleware', () => {
  let adminToken: string;
  let moderatorToken: string;
  let userToken: string;
  let jwtInstance: any;

  // Setup test data
  beforeAll(async () => {
    // Setup JWT instance
    const jwtApp = new Elysia().use(jwtConfig);
    jwtApp.get('/get-jwt', ({ jwt }) => {
      jwtInstance = jwt;
      return { ok: true };
    });
    await jwtApp.handle(new Request('http://localhost/get-jwt'));

    // Clean up existing test data
    await db.delete(rolePermissions);
    await db.delete(permissions);
    await db.delete(roles);

    // Create test roles
    const [adminRole] = await db.insert(roles).values({
      name: 'admin',
      description: 'Admin role for testing',
    }).returning();

    const [modRole] = await db.insert(roles).values({
      name: 'moderator',
      description: 'Moderator role for testing',
    }).returning();

    const [userRoleData] = await db.insert(roles).values({
      name: 'user',
      description: 'User role for testing',
    }).returning();

    // Create test permissions
    const testPermissions = await db.insert(permissions).values([
      { name: 'posts:create', description: 'Create posts', resource: 'posts', action: 'create' },
      { name: 'posts:read', description: 'Read posts', resource: 'posts', action: 'read' },
      { name: 'posts:update', description: 'Update posts', resource: 'posts', action: 'update' },
      { name: 'posts:delete', description: 'Delete posts', resource: 'posts', action: 'delete' },
      { name: 'users:create', description: 'Create users', resource: 'users', action: 'create' },
      { name: 'users:read', description: 'Read users', resource: 'users', action: 'read' },
      { name: 'users:update', description: 'Update users', resource: 'users', action: 'update' },
      { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
    ]).returning();

    // Assign permissions to roles
    // Admin gets all permissions
    await db.insert(rolePermissions).values(
      testPermissions.map((perm) => ({
        roleId: adminRole.id,
        permissionId: perm.id,
      }))
    );

    // Moderator gets read and update for posts and users
    const modPerms = testPermissions.filter((p) =>
      ['posts:read', 'posts:update', 'users:read', 'users:update'].includes(p.name)
    );
    await db.insert(rolePermissions).values(
      modPerms.map((perm) => ({
        roleId: modRole.id,
        permissionId: perm.id,
      }))
    );

    // User gets only read permissions
    const userPerms = testPermissions.filter((p) =>
      ['posts:read', 'users:read'].includes(p.name)
    );
    await db.insert(rolePermissions).values(
      userPerms.map((perm) => ({
        roleId: userRoleData.id,
        permissionId: perm.id,
      }))
    );

    // Generate tokens
    adminToken = await jwtInstance.sign({
      userId: 1,
      email: 'admin@example.com',
      role: 'admin',
    });

    moderatorToken = await jwtInstance.sign({
      userId: 2,
      email: 'moderator@example.com',
      role: 'moderator',
    });

    userToken = await jwtInstance.sign({
      userId: 3,
      email: 'user@example.com',
      role: 'user',
    });
  });

  afterAll(async () => {
    await db.delete(rolePermissions);
    await db.delete(permissions);
    await db.delete(roles);
  });

  describe('requirePermission', () => {
    it('should allow admin with posts:create permission', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('posts:create'))
        .get('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny user without posts:create permission', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('posts:create'))
        .get('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('Missing permission');
    });

    it('should allow moderator with posts:update permission', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('posts:update'))
        .patch('/posts/:id', () => ({ message: 'Updated' }));

      const response = await app.handle(
        new Request('http://localhost/posts/1', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny moderator without posts:delete permission', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('posts:delete'))
        .delete('/posts/:id', () => ({ message: 'Deleted' }));

      const response = await app.handle(
        new Request('http://localhost/posts/1', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should return 401 without authentication', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('posts:read'))
        .get('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts')
      );

      expect(response.status).toBe(401);
    });
  });

  describe('requireResourcePermission', () => {
    it('should allow admin to create users', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireResourcePermission('users', 'create'))
        .post('/users', () => ({ message: 'User created' }));

      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny moderator from creating users', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireResourcePermission('users', 'create'))
        .post('/users', () => ({ message: 'User created' }));

      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('users:create');
    });

    it('should allow user to read posts', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireResourcePermission('posts', 'read'))
        .get('/posts', () => ({ message: 'Posts retrieved' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny user from deleting posts', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireResourcePermission('posts', 'delete'))
        .delete('/posts/:id', () => ({ message: 'Post deleted' }));

      const response = await app.handle(
        new Request('http://localhost/posts/1', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(403);
    });
  });

  describe('requireAnyPermission', () => {
    it('should allow admin with any of the permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAnyPermission(['posts:create', 'posts:update', 'posts:delete']))
        .post('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should allow moderator with one of the permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAnyPermission(['posts:create', 'posts:update']))
        .patch('/posts/:id', () => ({ message: 'Updated' }));

      const response = await app.handle(
        new Request('http://localhost/posts/1', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny user without any of the permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAnyPermission(['posts:create', 'posts:update', 'posts:delete']))
        .post('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('Missing any of permissions');
    });

    it('should allow user with read permission from list', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAnyPermission(['posts:read', 'posts:create']))
        .get('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(200);
    });
  });

  describe('requireAllPermissions', () => {
    it('should allow admin with all permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions(['posts:create', 'posts:update', 'posts:delete']))
        .post('/posts/admin', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts/admin', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny moderator without all permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions(['posts:read', 'posts:update', 'posts:delete']))
        .post('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('Missing permissions');
    });

    it('should allow moderator with all required permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions(['posts:read', 'posts:update']))
        .patch('/posts/:id', () => ({ message: 'Updated' }));

      const response = await app.handle(
        new Request('http://localhost/posts/1', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should deny user without all permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions(['posts:read', 'posts:create']))
        .post('/posts', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/posts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${userToken}` },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should show missing permissions in error message', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions(['users:create', 'users:delete']))
        .post('/users', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(403);
      const text = await response.text();
      expect(text).toContain('Missing permissions');
      expect(text).toContain('users:create');
      expect(text).toContain('users:delete');
    });
  });

  describe('Multiple middleware combination', () => {
    it('should work with multiple permission checks', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('users:read'))
        .use(requirePermission('users:update'))
        .patch('/users/:id', () => ({ message: 'User updated' }));

      const response = await app.handle(
        new Request('http://localhost/users/1', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(200);
    });

    it('should fail if second permission check fails', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('users:read'))
        .use(requirePermission('users:delete'))
        .delete('/users/:id', () => ({ message: 'User deleted' }));

      const response = await app.handle(
        new Request('http://localhost/users/1', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${moderatorToken}` },
        })
      );

      expect(response.status).toBe(403);
    });
  });

  describe('Edge cases', () => {
    it('should handle non-existent permissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requirePermission('nonexistent:permission'))
        .get('/test', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/test', {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should handle empty permission arrays in requireAnyPermission', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAnyPermission([]))
        .get('/test', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/test', {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      // Should deny since no permissions match (empty array)
      expect(response.status).toBe(403);
    });

    it('should handle empty permission arrays in requireAllPermissions', async () => {
      const app = new Elysia()
        .use(jwtConfig)
        .use(authMiddleware)
        .use(requireAllPermissions([]))
        .get('/test', () => ({ message: 'Success' }));

      const response = await app.handle(
        new Request('http://localhost/test', {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      // Should allow since all (zero) permissions are met
      expect(response.status).toBe(200);
    });
  });
});

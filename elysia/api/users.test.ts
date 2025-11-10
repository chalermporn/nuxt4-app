import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Elysia } from 'elysia';
import { usersRoutes } from './users';
import { authRoutes } from './auth';
import { db } from '../../db';
import { users, refreshTokens } from '../../db/schema';
import { hash } from 'bcrypt';

describe('Users API', () => {
  const app = new Elysia().use(authRoutes).use(usersRoutes);
  let adminToken: string;
  let moderatorToken: string;
  let userToken: string;
  let adminUserId: number;

  // Setup test users with different roles
  beforeEach(async () => {
    await db.delete(refreshTokens);
    await db.delete(users);

    // Create admin user
    const hashedPassword = await hash('password123', 10);
    const [adminUser] = await db
      .insert(users)
      .values({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      })
      .returning();

    adminUserId = adminUser.id;

    // Create moderator user
    await db.insert(users).values({
      email: 'moderator@example.com',
      password: hashedPassword,
      name: 'Moderator User',
      role: 'moderator',
    });

    // Create regular user
    await db.insert(users).values({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'user',
    });

    // Login as admin to get token
    const adminLoginResponse = await app.handle(
      new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123',
        }),
      })
    );
    const adminData = await adminLoginResponse.json();
    adminToken = adminData.accessToken;

    // Login as moderator to get token
    const modLoginResponse = await app.handle(
      new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'moderator@example.com',
          password: 'password123',
        }),
      })
    );
    const modData = await modLoginResponse.json();
    moderatorToken = modData.accessToken;

    // Login as user to get token
    const userLoginResponse = await app.handle(
      new Request('http://localhost/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'password123',
        }),
      })
    );
    const userData = await userLoginResponse.json();
    userToken = userData.accessToken;
  });

  afterEach(async () => {
    await db.delete(refreshTokens);
    await db.delete(users);
  });

  describe('GET /users', () => {
    it('should allow admin to get all users', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('users');
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.users.length).toBeGreaterThanOrEqual(3);
    });

    it('should allow moderator to get all users', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${moderatorToken}`,
          },
        })
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        console.error('Moderator access failed:', response.status, errorData);
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('users');
    });

    it('should reject regular user from getting all users', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should reject unauthorized request', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(401);
    });
  });

  describe('GET /users/:id', () => {
    it('should allow admin to get user by id', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('admin@example.com');
      expect(data.user).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.handle(
        new Request('http://localhost/users/99999', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('User not found');
    });
  });

  describe('POST /users', () => {
    it('should allow admin to create new user', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
            role: 'user',
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('newuser@example.com');
      expect(data.message).toBe('User created successfully');
    });

    it('should reject moderator from creating user', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${moderatorToken}`,
          },
          body: JSON.stringify({
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
          }),
        })
      );

      expect(response.status).toBe(403);
    });

    it('should reject duplicate email', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            email: 'admin@example.com', // Already exists
            password: 'password123',
            name: 'Duplicate User',
          }),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });

    it('should validate email format', async () => {
      const response = await app.handle(
        new Request('http://localhost/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            email: 'invalid-email',
            password: 'password123',
            name: 'Test User',
          }),
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should allow admin to update user', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            name: 'Updated Admin',
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.user.name).toBe('Updated Admin');
      expect(data.message).toBe('User updated successfully');
    });

    it('should allow admin to update user password', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            password: 'newpassword123',
          }),
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('User updated successfully');
    });

    it('should reject moderator from updating user', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${moderatorToken}`,
          },
          body: JSON.stringify({
            name: 'Updated Name',
          }),
        })
      );

      expect(response.status).toBe(403);
    });

    it('should reject email that is already in use', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            email: 'moderator@example.com', // Already in use by another user
          }),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Email already in use');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.handle(
        new Request('http://localhost/users/99999', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            name: 'Updated Name',
          }),
        })
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should allow admin to delete user', async () => {
      // Get a user id to delete (not the admin)
      const allUsers = await db.query.users.findMany();
      const userToDelete = allUsers.find((u) => u.email === 'user@example.com');

      const response = await app.handle(
        new Request(`http://localhost/users/${userToDelete!.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('User deleted successfully');
    });

    it('should prevent admin from deleting themselves', async () => {
      const response = await app.handle(
        new Request(`http://localhost/users/${adminUserId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Cannot delete your own account');
    });

    it('should reject moderator from deleting user', async () => {
      const allUsers = await db.query.users.findMany();
      const userToDelete = allUsers.find((u) => u.email === 'user@example.com');

      const response = await app.handle(
        new Request(`http://localhost/users/${userToDelete!.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${moderatorToken}`,
          },
        })
      );

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.handle(
        new Request('http://localhost/users/99999', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
      );

      expect(response.status).toBe(404);
    });
  });
});

import { describe, it, expect } from 'bun:test';

const API_URL = 'http://localhost:3001/api';

describe('Users API Verification', () => {
    it('should include updatedAt in users list', async () => {
        // 1. Login as Admin
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123',
            }),
        });

        if (!loginRes.ok) {
            const error = await loginRes.json();
            console.error('Login failed:', error);
            throw new Error('Login failed');
        }

        const { accessToken } = await loginRes.json();
        expect(accessToken).toBeDefined();

        // 2. Get Users
        const usersRes = await fetch(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!usersRes.ok) {
            const error = await usersRes.json();
            console.error('Get users failed:', error);
            throw new Error('Get users failed');
        }

        const { users } = await usersRes.json();
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);

        // 3. Verify updatedAt exists
        const firstUser = users[0];
        console.log('First user:', firstUser);
        expect(firstUser).toHaveProperty('updatedAt');
        expect(firstUser.updatedAt).toBeDefined();
    });
});

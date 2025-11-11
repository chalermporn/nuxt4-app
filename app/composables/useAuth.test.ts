import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { User } from './useAuth';

// Mock console.error to suppress error messages in test output
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock Nuxt composables
const mockUser = { value: null as User | null };
const mockAccessToken = { value: null as string | null };
const mockRefreshToken = { value: null as string | null };

// Create mock functions
const mockUseState = vi.fn((key: string, init?: () => any) => {
  // Call the initializer to ensure it's covered
  if (init) init();

  if (key === 'auth-user') return mockUser;
  if (key === 'auth-access-token') return mockAccessToken;
  if (key === 'auth-refresh-token') return mockRefreshToken;
  return { value: init ? init() : null };
});

const mockComputed = vi.fn((fn: () => any) => {
  return {
    get value() {
      return fn();
    }
  };
});

const mockReadonly = vi.fn((ref) => ref);

// Set up global mocks
(globalThis as any).useState = mockUseState;
(globalThis as any).computed = mockComputed;
(globalThis as any).readonly = mockReadonly;

// Mock $fetch
const mockFetch = vi.fn();
globalThis.$fetch = mockFetch as any;

// Mock process.client
globalThis.process = {
  client: true,
} as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
globalThis.localStorage = localStorageMock as any;

describe('useAuth', () => {
  let useAuth: () => ReturnType<typeof import('./useAuth').useAuth>;

  beforeEach(async () => {
    // Clear mocks
    vi.clearAllMocks();
    localStorageMock.clear();
    mockUser.value = null;
    mockAccessToken.value = null;
    mockRefreshToken.value = null;

    // Reset process.client to default (true)
    globalThis.process = {
      client: true,
    } as any;

    // Import fresh instance
    const module = await import('./useAuth');
    useAuth = module.useAuth;
  });

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.login('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          body: { email: 'test@example.com', password: 'password123' },
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockUser.value).toEqual(mockResponse.user);
      expect(mockAccessToken.value).toBe('access-token-123');
      expect(mockRefreshToken.value).toBe('refresh-token-123');

      // Check localStorage
      expect(localStorageMock.getItem('accessToken')).toBe('access-token-123');
      expect(localStorageMock.getItem('refreshToken')).toBe('refresh-token-123');
      expect(localStorageMock.getItem('user')).toBe(
        JSON.stringify(mockResponse.user)
      );
    });

    it('should throw error on login failure', async () => {
      mockFetch.mockRejectedValueOnce({
        data: { error: 'Invalid credentials' },
      });

      const auth = useAuth();

      await expect(
        auth.login('wrong@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw generic error on login failure without error message', async () => {
      mockFetch.mockRejectedValueOnce({});

      const auth = useAuth();

      await expect(
        auth.login('wrong@example.com', 'wrongpass')
      ).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should register successfully and store tokens', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'new@example.com',
          name: 'New User',
          role: 'user',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.register(
        'new@example.com',
        'password123',
        'New User'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        {
          method: 'POST',
          body: {
            email: 'new@example.com',
            password: 'password123',
            name: 'New User',
          },
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockUser.value).toEqual(mockResponse.user);
    });

    it('should throw error on registration failure', async () => {
      mockFetch.mockRejectedValueOnce({
        data: { error: 'User already exists' },
      });

      const auth = useAuth();

      await expect(
        auth.register('existing@example.com', 'password123', 'Test User')
      ).rejects.toThrow('User already exists');
    });

    it('should throw generic error on registration failure without error message', async () => {
      mockFetch.mockRejectedValueOnce({});

      const auth = useAuth();

      await expect(
        auth.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('Registration failed');
    });
  });

  describe('refresh', () => {
    it('should refresh access token successfully', async () => {
      mockRefreshToken.value = 'refresh-token-123';

      const mockResponse = {
        accessToken: 'new-access-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.refresh();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/refresh',
        {
          method: 'POST',
          body: { refreshToken: 'refresh-token-123' },
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockAccessToken.value).toBe('new-access-token');
      expect(localStorageMock.getItem('accessToken')).toBe('new-access-token');
    });

    it('should throw error when no refresh token available', async () => {
      mockRefreshToken.value = null;

      const auth = useAuth();

      await expect(auth.refresh()).rejects.toThrow(
        'No refresh token available'
      );
    });

    it('should logout on refresh failure', async () => {
      mockRefreshToken.value = 'refresh-token-123';
      mockAccessToken.value = 'old-access-token';
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      mockFetch.mockRejectedValueOnce({
        data: { error: 'Token expired' },
      });

      const auth = useAuth();

      await expect(auth.refresh()).rejects.toThrow();

      // Should have cleared state
      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
    });

    it('should throw generic error on refresh failure without error message', async () => {
      mockRefreshToken.value = 'refresh-token-123';

      mockFetch.mockRejectedValueOnce({});

      const auth = useAuth();

      await expect(auth.refresh()).rejects.toThrow('Token refresh failed');

      // Should have cleared state
      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear state', async () => {
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      mockAccessToken.value = 'access-token-123';
      mockRefreshToken.value = 'refresh-token-123';

      localStorageMock.setItem('accessToken', 'access-token-123');
      localStorageMock.setItem('refreshToken', 'refresh-token-123');
      localStorageMock.setItem('user', JSON.stringify(mockUser.value));

      mockFetch.mockResolvedValueOnce({ message: 'Logged out' });

      const auth = useAuth();
      await auth.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        {
          method: 'POST',
          body: { refreshToken: 'refresh-token-123' },
        }
      );

      // Check state cleared
      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();

      // Check localStorage cleared
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(localStorageMock.getItem('refreshToken')).toBeNull();
      expect(localStorageMock.getItem('user')).toBeNull();
    });

    it('should clear state even if logout request fails', async () => {
      mockRefreshToken.value = 'refresh-token-123';
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const auth = useAuth();
      await auth.logout();

      // Should still clear state
      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
    });
  });

  describe('initAuth', () => {
    it('should initialize auth from localStorage', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      localStorageMock.setItem('accessToken', 'access-token-123');
      localStorageMock.setItem('refreshToken', 'refresh-token-123');
      localStorageMock.setItem('user', JSON.stringify(user));

      const auth = useAuth();
      auth.initAuth();

      expect(mockAccessToken.value).toBe('access-token-123');
      expect(mockRefreshToken.value).toBe('refresh-token-123');
      expect(mockUser.value).toEqual(user);
    });

    it('should not initialize if data is missing', () => {
      localStorageMock.setItem('accessToken', 'access-token-123');
      // Missing refreshToken and user

      const auth = useAuth();
      auth.initAuth();

      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
      expect(mockUser.value).toBeNull();
    });
  });

  describe('fetchWithAuth', () => {
    beforeEach(() => {
      mockAccessToken.value = 'access-token-123';
    });

    it('should make authenticated request successfully', async () => {
      const mockResponse = { data: 'test data' };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.fetchWithAuth('http://localhost/api/test');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost/api/test', {
        headers: {
          Authorization: 'Bearer access-token-123',
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when not authenticated', async () => {
      mockAccessToken.value = null;

      const auth = useAuth();

      await expect(
        auth.fetchWithAuth('http://localhost/api/test')
      ).rejects.toThrow('Not authenticated');
    });

    it('should retry with new token on 401 error', async () => {
      mockRefreshToken.value = 'refresh-token-123';

      // First call fails with 401
      mockFetch.mockRejectedValueOnce({
        status: 401,
      });

      // Refresh token call succeeds
      mockFetch.mockResolvedValueOnce({
        accessToken: 'new-access-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      });

      // Retry call succeeds
      mockFetch.mockResolvedValueOnce({ data: 'success' });

      const auth = useAuth();
      const result = await auth.fetchWithAuth('http://localhost/api/test');

      expect(mockFetch).toHaveBeenCalledTimes(3); // original + refresh + retry
      expect(result).toEqual({ data: 'success' });
    });

    it('should logout if refresh fails after 401', async () => {
      mockRefreshToken.value = 'refresh-token-123';
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };

      // First call fails with 401
      mockFetch.mockRejectedValueOnce({
        status: 401,
      });

      // Refresh token call fails
      mockFetch.mockRejectedValueOnce({
        data: { error: 'Invalid refresh token' },
      });

      // Logout call
      mockFetch.mockResolvedValueOnce({ message: 'Logged out' });

      const auth = useAuth();

      await expect(
        auth.fetchWithAuth('http://localhost/api/test')
      ).rejects.toThrow();

      // Should have logged out
      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
    });

    it('should throw error for non-401 errors without retry', async () => {
      mockAccessToken.value = 'access-token-123';

      // Request fails with non-401 error (e.g., 500)
      mockFetch.mockRejectedValueOnce({
        status: 500,
        message: 'Internal Server Error',
      });

      const auth = useAuth();

      await expect(
        auth.fetchWithAuth('http://localhost/api/test')
      ).rejects.toEqual({
        status: 500,
        message: 'Internal Server Error',
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user and token exist', () => {
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      mockAccessToken.value = 'access-token-123';

      const auth = useAuth();
      expect(auth.isAuthenticated.value).toBe(true);
    });

    it('should return false when user is null', () => {
      mockUser.value = null;
      mockAccessToken.value = 'access-token-123';

      const auth = useAuth();
      expect(auth.isAuthenticated.value).toBe(false);
    });

    it('should return false when token is null', () => {
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      mockAccessToken.value = null;

      const auth = useAuth();
      expect(auth.isAuthenticated.value).toBe(false);
    });
  });

  describe('readonly properties', () => {
    it('should return readonly user property', () => {
      const testUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      mockUser.value = testUser;

      const auth = useAuth();
      expect(auth.user.value).toEqual(testUser);
    });

    it('should return readonly accessToken property', () => {
      mockAccessToken.value = 'test-token-123';

      const auth = useAuth();
      expect(auth.accessToken.value).toBe('test-token-123');
    });
  });

  describe('Server-side (process.client = false)', () => {
    beforeEach(() => {
      globalThis.process = {
        client: false,
      } as any;
    });

    it('should login without localStorage on server', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.login('test@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(mockUser.value).toEqual(mockResponse.user);
      expect(mockAccessToken.value).toBe('access-token-123');
      expect(mockRefreshToken.value).toBe('refresh-token-123');
    });

    it('should register without localStorage on server', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'new@example.com',
          name: 'New User',
          role: 'user',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.register('new@example.com', 'password123', 'New User');

      expect(result).toEqual(mockResponse);
      expect(mockUser.value).toEqual(mockResponse.user);
    });

    it('should refresh without localStorage on server', async () => {
      mockRefreshToken.value = 'refresh-token-123';

      const mockResponse = {
        accessToken: 'new-access-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const auth = useAuth();
      const result = await auth.refresh();

      expect(result).toEqual(mockResponse);
      expect(mockAccessToken.value).toBe('new-access-token');
    });

    it('should logout without localStorage on server', async () => {
      mockUser.value = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      mockAccessToken.value = 'access-token-123';
      mockRefreshToken.value = 'refresh-token-123';

      mockFetch.mockResolvedValueOnce({ message: 'Logged out' });

      const auth = useAuth();
      await auth.logout();

      expect(mockUser.value).toBeNull();
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
    });

    it('should not initialize from localStorage on server', () => {
      localStorageMock.setItem('accessToken', 'access-token-123');
      localStorageMock.setItem('refreshToken', 'refresh-token-123');
      localStorageMock.setItem('user', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }));

      const auth = useAuth();
      auth.initAuth();

      // Should not load from localStorage on server
      expect(mockAccessToken.value).toBeNull();
      expect(mockRefreshToken.value).toBeNull();
      expect(mockUser.value).toBeNull();
    });
  });
});

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null);
  const accessToken = useState<string | null>('auth-access-token', () => null);
  const refreshToken = useState<string | null>('auth-refresh-token', () => null);
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  const API_BASE = 'http://localhost:3001/api';

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: { email, password },
      });

      user.value = response.user;
      accessToken.value = response.accessToken;
      refreshToken.value = response.refreshToken;

      // Store in localStorage for persistence
      if (process.client) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.data?.error || 'Login failed');
    }
  };

  // Register
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await $fetch<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: { email, password, name },
      });

      user.value = response.user;
      accessToken.value = response.accessToken;
      refreshToken.value = response.refreshToken;

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.data?.error || 'Registration failed');
    }
  };

  // Refresh access token
  const refresh = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await $fetch<{
        accessToken: string;
        user: User;
      }>(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      });

      accessToken.value = response.accessToken;
      user.value = response.user;

      if (process.client) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      logout(); // Clear auth state on refresh failure
      throw new Error(error.data?.error || 'Token refresh failed');
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (refreshToken.value) {
        await $fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          body: { refreshToken: refreshToken.value },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear state
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  };

  // Initialize auth from localStorage
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedRefreshToken && storedUser) {
        accessToken.value = storedToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(storedUser);
      }
    }
  };

  // Fetch with auth header
  const fetchWithAuth = async <T>(url: string, options: any = {}) => {
    if (!accessToken.value) {
      throw new Error('Not authenticated');
    }

    try {
      return await $fetch<T>(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
    } catch (error: any) {
      // If token expired, try to refresh
      if (error.status === 401 && refreshToken.value) {
        try {
          await refresh();
          // Retry the request with new token
          return await $fetch<T>(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken.value}`,
            },
          });
        } catch (refreshError) {
          logout();
          throw refreshError;
        }
      }
      throw error;
    }
  };

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    isAuthenticated,
    login,
    register,
    refresh,
    logout,
    initAuth,
    fetchWithAuth,
  };
};

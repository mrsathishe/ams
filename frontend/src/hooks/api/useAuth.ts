import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { queryClient } from '../../lib/queryClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  access_token: string;
}

// API functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },

  logout: async () => {
    const response = await fetch('/api/auth/logout', { 
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.ok;
  },
};

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      login(data.user, data.access_token);
      localStorage.setItem('token', data.access_token);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      useAuthStore.getState().setError(error.message || 'Login failed');
    },
  });
};

export const useCurrentUser = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
};
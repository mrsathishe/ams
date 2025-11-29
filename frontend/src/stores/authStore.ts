import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer(set => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: user =>
          set(state => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setToken: token =>
          set(state => {
            state.token = token;
          }),

        login: (user, token) =>
          set(state => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          }),

        logout: () =>
          set(state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          }),

        setLoading: loading =>
          set(state => {
            state.isLoading = loading;
          }),

        setError: error =>
          set(state => {
            state.error = error;
          }),

        clearError: () =>
          set(state => {
            state.error = null;
          }),
      })),
      {
        name: 'auth-storage',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Convenient hooks
export const useAuth = () =>
  useAuthStore(state => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useAuthActions = () =>
  useAuthStore(state => ({
    login: state.login,
    logout: state.logout,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));
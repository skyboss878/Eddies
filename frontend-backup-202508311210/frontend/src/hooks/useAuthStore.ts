import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@services/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          localStorage.setItem('auth_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      initialize: async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const response = await apiClient.get('/auth/me');
            set({ user: response.data, token, isAuthenticated: true });
          } catch (error) {
            localStorage.removeItem('auth_token');
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

import { create } from 'zustand';
import { readAuth } from '@/lib/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Initialize auth state from localStorage
  initAuth: () => {
    const auth = readAuth();
    if (auth?.token && auth?.user) {
      set({
        user: auth.user,
        token: auth.token,
        isAuthenticated: true
      });
    }
  },

  // Set auth data
  setAuth: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true
    });
  },

  // Clear auth data
  clearAuth: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  // Get current user
  getUser: () => get().user,

  // Get current token
  getToken: () => get().token,

  // Check if authenticated
  isAuth: () => get().isAuthenticated
}));
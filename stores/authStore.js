import { create } from 'zustand';
import { readAuth, persistAuth } from '@/lib/auth';

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
    persistAuth({ user, token });
    set({
      user,
      token,
      isAuthenticated: true
    });
  },

  setUser: (user) => {
    const token = get().token;
    if (token) {
      persistAuth({ user, token });
    }
    set(state => ({
      ...state,
      user,
      isAuthenticated: !!user,
    }));
  },

  // Clear auth data
  clearAuth: () => {
    persistAuth({ user: null, token: null }); // Also clear from storage
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
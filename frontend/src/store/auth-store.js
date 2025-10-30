import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      /**
       * Login user
       * @param {Object} user - User object
       * @param {string} accessToken - JWT access token
       * @param {string} refreshToken - JWT refresh token
       */
      login: (user, accessToken, refreshToken) => {
        set({
          user,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      /**
       * Logout user
       */
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      /**
       * Update user data
       * @param {Object} userData - Partial user data to update
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      /**
       * Update tokens
       * @param {string} accessToken
       * @param {string} refreshToken
       */
      updateTokens: (accessToken, refreshToken) => {
        set({
          token: accessToken,
          refreshToken: refreshToken || get().refreshToken,
        });
      },

      /**
       * Check if user has specific role
       * @param {string} role - Role to check
       * @returns {boolean}
       */
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      /**
       * Check if user is admin
       * @returns {boolean}
       */
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

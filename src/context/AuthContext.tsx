import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Profile } from '../types/models';
import { api, getStoredToken, setStoredToken, removeStoredToken, registerLogoutCallback } from '../services/api';

export interface AuthContextType {
  user: Profile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: Profile) => void;
  logout: () => void;
  updateUser: (user: Profile) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken: string, newUser: Profile) => {
    setStoredToken(newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const updateUser = useCallback((updatedUser: Profile) => {
    setUser(updatedUser);
  }, []);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const activeToken = getStoredToken();
      if (!activeToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data?.success) {
          setUser(response.data.data);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session restoration failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
    // Register auto-logout on API 401 interceptor
    registerLogoutCallback(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

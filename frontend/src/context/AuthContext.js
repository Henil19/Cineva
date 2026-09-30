import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_TOKEN_KEY, authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('cineva:unauthorized', handleUnauthorized);

    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return () => window.removeEventListener('cineva:unauthorized', handleUnauthorized);
    }

    authService.getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch(clearSession)
      .finally(() => setLoading(false));

    return () => window.removeEventListener('cineva:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const saveSession = useCallback((response) => {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    return saveSession(response.data);
  }, [saveSession]);

  const register = useCallback(async (details) => {
    const response = await authService.register(details);
    return saveSession(response.data);
  }, [saveSession]);

  const logout = useCallback(() => clearSession(), [clearSession]);

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}

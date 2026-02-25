'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (!token) { setLoading(false); return; }
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch { Cookies.remove('token'); setUser(null); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    Cookies.set('token', data.token, { expires: 7, sameSite: 'lax' });
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    Cookies.set('token', data.token, { expires: 7, sameSite: 'lax' });
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  const updateUser = (updated) => setUser(prev => ({ ...prev, ...updated }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
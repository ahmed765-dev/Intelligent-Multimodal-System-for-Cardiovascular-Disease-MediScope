'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  medicalRecordId?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ── جيب البروفايل من الـ API عشان ناخد الـ name الصح ──
  const fetchProfile = async (): Promise<void> => {
    const res = await api.get('/users/profile');
    // الـ response: { message: '...', user: { id, name, email, ... } }
    const profile = res.data?.user ?? res.data;
    setUser({
      id: String(profile.id ?? profile._id ?? ''),
      name: profile.name ?? profile.email ?? '',
      email: profile.email ?? '',
      medicalRecordId: profile.medicalRecordId,
    });
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      // ✅ بنجيب البيانات من الـ API مش من الـ token عشان ناخد الـ name
      await fetchProfile();
    } catch {
      // لو فشل الـ request يمسح الـ token ويعمل logout
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });

    const token = res.data.access_token;
    if (token) {
      localStorage.setItem('token', token);
    }

    // ✅ بعد الـ login نجيب البروفايل عشان ناخد الـ name الصح
    await fetchProfile();

    router.push('/');
  };

  const signup = async (data: any) => {
    await api.post('/auth/signup', data);
    router.push('/login');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
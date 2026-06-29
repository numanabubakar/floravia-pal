'use client';

import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const MOCK_ADMIN = {
  id: 'admin-1',
  email: 'admin@floravia.com',
  name: 'Admin User',
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for mock authentication
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login - in production, this would call an API
    if (email === 'admin@floravia.com' && password === 'admin123') {
      setUser(MOCK_ADMIN);
      localStorage.setItem('auth_user', JSON.stringify(MOCK_ADMIN));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const isAuthenticated = !!user;

  return { user, isLoading, login, logout, isAuthenticated };
}

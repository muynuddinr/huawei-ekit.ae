"use client";

import { useState, createContext, useContext, useEffect } from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeaders: () => HeadersInit;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simple, stable authentication check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('admin-token');
        
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp > currentTime && payload.isAdmin && payload.username) {
              setToken(storedToken);
              setIsAuthenticated(true);
              console.log('✅ Auth restored from localStorage');
            } else {
              localStorage.removeItem('admin-token');
              console.log('❌ Invalid/expired token removed');
            }
          } catch {
            localStorage.removeItem('admin-token');
            console.log('❌ Corrupted token removed');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run auth check after a short delay to ensure DOM is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('admin-token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        console.log('✅ Login successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/auth', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin-token');
      setToken(null);
      setIsAuthenticated(false);
      console.log('✅ Logged out');
    }
  };

  const getAuthHeaders = (): HeadersInit => ({
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  });

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      token,
      login, 
      logout, 
      getAuthHeaders,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
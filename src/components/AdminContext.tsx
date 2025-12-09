"use client";

import { useState, createContext, useContext, useEffect } from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeaders: () => HeadersInit;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      console.log('AdminContext: Checking authentication on mount...');
      try {
        const storedToken = localStorage.getItem('admin-token');
        console.log('AdminContext: Stored token check:', storedToken ? 'Token found' : 'No token found');
        
        if (storedToken) {
          try {
            // Client-side JWT validation for faster authentication
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            console.log('AdminContext: Token payload:', { 
              username: payload.username, 
              isAdmin: payload.isAdmin, 
              exp: payload.exp,
              currentTime,
              isExpired: payload.exp < currentTime
            });
            
            // Check if token is expired
            if (payload.exp < currentTime) {
              console.log('AdminContext: Token expired, removing');
              localStorage.removeItem('admin-token');
              setToken(null);
              setIsAuthenticated(false);
              return;
            }
            
            // Check if it's a valid admin token
            if (payload.isAdmin && payload.username) {
              setToken(storedToken);
              setIsAuthenticated(true);
              console.log('AdminContext: Authentication successful (client-side validation)');
            } else {
              console.log('AdminContext: Invalid admin token structure, removing');
              localStorage.removeItem('admin-token');
              setToken(null);
              setIsAuthenticated(false);
            }
          } catch (jwtError) {
            console.error('AdminContext: JWT parsing error:', jwtError);
            localStorage.removeItem('admin-token');
            setToken(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('AdminContext: No stored token, setting unauthenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('AdminContext: Auth check error:', error);
        localStorage.removeItem('admin-token');
        setToken(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        // Store JWT token in localStorage
        localStorage.setItem('admin-token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
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
      // Call logout API to invalidate token
      if (token) {
        await fetch('/api/admin/auth', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state
      localStorage.removeItem('admin-token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const getAuthHeaders = (): HeadersInit => {
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      token,
      login, 
      logout, 
      getAuthHeaders 
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
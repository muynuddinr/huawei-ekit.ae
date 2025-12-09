"use client";

import { useState, createContext, useContext, useEffect, useRef } from 'react';

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
  const [hasInitialized, setHasInitialized] = useState(false);
  const initRef = useRef(false);

  // Check if user is already authenticated on mount - ONLY ONCE
  useEffect(() => {
    if (initRef.current) return; // Prevent multiple initializations
    initRef.current = true;
    
    const checkAuth = () => {
      console.log('🔍 AdminContext: Initializing authentication check...');
      try {
        const storedToken = localStorage.getItem('admin-token');
        console.log('🔍 AdminContext: Token check result:', storedToken ? 'Found' : 'Not found');
        
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            console.log('🔍 AdminContext: Token payload analysis:', { 
              username: payload.username, 
              isAdmin: payload.isAdmin, 
              exp: payload.exp,
              currentTime,
              isExpired: payload.exp < currentTime,
              timeRemaining: payload.exp - currentTime
            });
            
            if (payload.exp < currentTime) {
              console.log('⏰ AdminContext: Token expired, clearing');
              localStorage.removeItem('admin-token');
              setToken(null);
              setIsAuthenticated(false);
            } else if (payload.isAdmin && payload.username) {
              console.log('✅ AdminContext: Valid token found, setting authenticated');
              setToken(storedToken);
              setIsAuthenticated(true);
            } else {
              console.log('🚫 AdminContext: Invalid token structure, clearing');
              localStorage.removeItem('admin-token');
              setToken(null);
              setIsAuthenticated(false);
            }
          } catch (jwtError) {
            console.error('🔴 AdminContext: JWT parsing error:', jwtError);
            localStorage.removeItem('admin-token');
            setToken(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('ℹ️ AdminContext: No stored token, setting unauthenticated');
          setIsAuthenticated(false);
          setToken(null);
        }
        
        setHasInitialized(true);
        console.log('✅ AdminContext: Initialization complete');
      } catch (error) {
        console.error('🔴 AdminContext: Initialization error:', error);
        localStorage.removeItem('admin-token');
        setToken(null);
        setIsAuthenticated(false);
        setHasInitialized(true);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAuth, 100);
  }, []); // Only run once on mount

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('🔐 AdminContext: Attempting login...');
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('🔐 AdminContext: Login response:', { success: data.success, hasToken: !!data.token });
      
      if (data.success && data.token) {
        console.log('✅ AdminContext: Login successful, storing token');
        localStorage.setItem('admin-token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log('❌ AdminContext: Login failed');
        return false;
      }
    } catch (error) {
      console.error('🔴 AdminContext: Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('🚪 AdminContext: Logging out...');
    try {
      if (token) {
        await fetch('/api/admin/auth', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('🔴 AdminContext: Logout API error:', error);
    } finally {
      console.log('✅ AdminContext: Clearing authentication state');
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

  // Don't render children until initialization is complete
  if (!hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  console.log('🔄 AdminContext: Providing context', { isAuthenticated, hasToken: !!token });

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
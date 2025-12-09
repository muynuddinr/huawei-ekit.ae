"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminAuthGuard({ children, fallback }: AdminAuthGuardProps) {
  const { isAuthenticated, token } = useAdmin();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Prevent multiple simultaneous auth checks
    if (hasCheckedAuth.current) return;
    
    const checkAuth = async () => {
      hasCheckedAuth.current = true;
      console.log('AdminAuthGuard: Checking authentication...', { isAuthenticated, hasToken: !!token });
      
      try {
        // Wait a moment for the authentication context to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Quick client-side check first
        if (!token || !isAuthenticated) {
          console.log('AdminAuthGuard: No authentication token found, redirecting to login');
          router.replace('/admin');
          return;
        }

        // Simple JWT token validation without server call for better performance
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          console.log('AdminAuthGuard: Token payload:', { 
            username: payload.username, 
            isAdmin: payload.isAdmin, 
            exp: payload.exp,
            currentTime,
            isExpired: payload.exp < currentTime
          });
          
          // Check if token is expired
          if (payload.exp < currentTime) {
            console.log('AdminAuthGuard: Token expired, redirecting to login');
            router.replace('/admin');
            return;
          }
          
          // Check if it's a valid admin token
          if (!payload.isAdmin || !payload.username) {
            console.log('AdminAuthGuard: Invalid admin token, redirecting to login');
            router.replace('/admin');
            return;
          }
          
          // Token is valid, authorize access
          console.log('AdminAuthGuard: Authentication successful, authorizing access');
          setIsAuthorized(true);
          
        } catch (jwtError) {
          console.error('AdminAuthGuard: JWT parsing error:', jwtError);
          router.replace('/admin');
        }
        
      } catch (error) {
        console.error('AdminAuthGuard: Auth verification error:', error);
        router.replace('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, isAuthenticated, router]);

  // Reset auth check flag when token changes
  useEffect(() => {
    hasCheckedAuth.current = false;
  }, [token]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )
    );
  }

  // If not authorized, don't render anything (redirect already initiated)
  if (!isAuthorized) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
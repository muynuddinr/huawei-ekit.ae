"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminAuthGuard({ children, fallback }: AdminAuthGuardProps) {
  const { isAuthenticated, token } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only run auth check once per component mount
    if (hasInitialized) return;
    
    const checkAuth = () => {
      console.log('🔐 AdminAuthGuard: Starting auth check...', {
        pathname,
        isAuthenticated,
        hasToken: !!token,
        tokenLength: token?.length
      });
      
      setHasInitialized(true);
      
      // Give the context time to initialize
      setTimeout(() => {
        try {
          if (!token || !isAuthenticated) {
            console.log('❌ AdminAuthGuard: No valid authentication found');
            setIsLoading(false);
            setIsAuthorized(false);
            router.replace('/admin');
            return;
          }

          // Validate JWT token
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            console.log('🔍 AdminAuthGuard: Token validation:', { 
              username: payload.username, 
              isAdmin: payload.isAdmin, 
              exp: payload.exp,
              currentTime,
              isExpired: payload.exp < currentTime,
              timeLeft: payload.exp - currentTime
            });
            
            if (payload.exp < currentTime) {
              console.log('⏰ AdminAuthGuard: Token expired');
              setIsLoading(false);
              setIsAuthorized(false);
              router.replace('/admin');
              return;
            }
            
            if (!payload.isAdmin || !payload.username) {
              console.log('🚫 AdminAuthGuard: Invalid token structure');
              setIsLoading(false);
              setIsAuthorized(false);
              router.replace('/admin');
              return;
            }
            
            // All checks passed
            console.log('✅ AdminAuthGuard: Authentication successful');
            setIsAuthorized(true);
            setIsLoading(false);
            
          } catch (jwtError) {
            console.error('🔴 AdminAuthGuard: JWT parsing error:', jwtError);
            setIsLoading(false);
            setIsAuthorized(false);
            router.replace('/admin');
          }
          
        } catch (error) {
          console.error('🔴 AdminAuthGuard: General auth error:', error);
          setIsLoading(false);
          setIsAuthorized(false);
          router.replace('/admin');
        }
      }, 200); // Small delay to ensure context is ready
    };

    checkAuth();
  }, []); // Only run once on mount

  // Don't re-run auth check when token changes, only on mount
  // This prevents infinite loops

  console.log('🔄 AdminAuthGuard render state:', {
    isLoading,
    isAuthorized,
    hasInitialized,
    pathname
  });

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
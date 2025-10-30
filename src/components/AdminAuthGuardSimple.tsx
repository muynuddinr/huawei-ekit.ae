"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContextSimple';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuardSimple({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, token, isLoading } = useAdmin();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (!isAuthenticated || !token) {
      console.log('❌ Not authenticated, redirecting to login');
      router.replace('/admin');
      return;
    }

    // Validate token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp < currentTime) {
        console.log('⏰ Token expired, redirecting to login');
        router.replace('/admin');
        return;
      }
      
      if (!payload.isAdmin || !payload.username) {
        console.log('🚫 Invalid token, redirecting to login');
        router.replace('/admin');
        return;
      }
      
      console.log('✅ Authentication valid, rendering dashboard');
      setShouldRender(true);
    } catch (error) {
      console.error('🔴 Token validation error:', error);
      router.replace('/admin');
    }
  }, [isAuthenticated, token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
"use client";

import { usePathname } from 'next/navigation';
import AdminAuthGuard from './AdminAuthGuard';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const pathname = usePathname();
  
  // Don't apply auth guard to the login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }
  
  // Apply auth guard to all other admin routes
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
}
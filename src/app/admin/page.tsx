"use client";

import { AdminProvider } from '../../components/AdminContextSimple';
import AdminLogin from '../../components/AdminLogin';

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminLogin />
    </AdminProvider>
  );
}
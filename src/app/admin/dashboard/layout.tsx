"use client";

import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeader';
import { AdminProvider } from '../../../components/AdminContextSimple';
import AdminAuthGuardSimple from '../../../components/AdminAuthGuardSimple';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminAuthGuardSimple>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 lg:ml-64 flex flex-col">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </AdminAuthGuardSimple>
    </AdminProvider>
  );
}
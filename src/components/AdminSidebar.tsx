"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from './AdminContextSimple';
import { toast } from 'react-toastify';
import {
  FiHome,
  FiBarChart,
  FiMenu,
  FiLayers,
  FiFolder,
  FiFolderPlus,
  FiShoppingBag,
  FiMessageSquare,
  FiLogOut,
  FiX
} from 'react-icons/fi';

const sidebarItems = [
  {
    name: 'Dashboard Stats',
    href: '/admin/dashboard',
    icon: FiBarChart,
  },
  {
    name: 'Navbar Category',
    href: '/admin/dashboard/navbar-category',
    icon: FiMenu,
  },
  {
    name: 'Categories',
    href: '/admin/dashboard/categories',
    icon: FiLayers,
  },
  {
    name: 'Sub Categories',
    href: '/admin/dashboard/subcategories',
    icon: FiFolder,
  },
  {
    name: 'Products',
    href: '/admin/dashboard/products',
    icon: FiShoppingBag,
  },
  {
    name: 'Contacts',
    href: '/admin/dashboard/contacts',
    icon: FiMessageSquare,
  },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAdmin();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    router.push('/admin');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-6 left-4 z-50 p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center p-6 border-b border-slate-700">
            <div className="flex flex-col items-center">
              <img 
                src="/huaweilogo-new.png" 
                alt="Huawei Logo" 
                className="w-20 h-20 object-contain mb-0.5"
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-slate-400 text-sm">Huawei eKit UAE</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer with logout */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group"
            >
              <FiLogOut className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiMessageSquare, FiTrendingUp, FiDollarSign, FiEye, FiActivity, FiClock, FiArrowUp, FiArrowDown, FiPlus, FiSettings, FiDownload, FiRefreshCw, FiLayers, FiGrid, FiFolder, FiMail } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { toast } from 'react-toastify';
import { useAdmin } from '@/components/AdminContextSimple';

interface DashboardStats {
  overview: {
    totalContacts: number;
    totalProducts: number;
    totalNavbarCategories: number;
    totalSubcategories: number;
    newContacts: number;
    unreadContacts: number;
    highPriorityContacts: number;
    recentContacts: number;
  };
  contacts: {
    total: number;
    new: number;
    replied: number;
    inProgress: number;
    closed: number;
    unread: number;
    highPriority: number;
    recent: number;
    byService: Array<{ _id: string; count: number }>;
    trend: Array<{ date: string; count: number }>;
  };
  products: {
    total: number;
    byCategory: Array<{ _id: string; count: number }>;
    trend: Array<{ date: string; count: number }>;
  };
  categories: {
    navbarCategories: number;
    subcategories: number;
    breakdown: Array<{ name: string; subcategoriesCount: number }>;
  };
  growth: {
    contacts: number;
    products: number;
    categories: number;
    revenue: number;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, isAuthenticated } = useAdmin();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      if (!isAuthenticated) {
        console.error('User not authenticated');
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        console.log('Dashboard stats loaded:', data.data);
      } else {
        console.error('Failed to fetch dashboard stats:', data.error);
        toast.error(data.error || 'Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button 
            onClick={fetchDashboardStats}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      name: 'Total Contacts',
      value: stats.overview.totalContacts.toLocaleString(),
      change: `+${stats.growth.contacts}%`,
      changeType: 'increase',
      icon: FiMessageSquare,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      description: `${stats.contacts.unread} unread messages`
    },
    {
      name: 'Total Products',
      value: stats.overview.totalProducts.toLocaleString(),
      change: `+${stats.growth.products}%`,
      changeType: 'increase',
      icon: FiShoppingBag,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      description: 'Listed products'
    },
    {
      name: 'Categories',
      value: stats.overview.totalNavbarCategories.toLocaleString(),
      change: `+${stats.growth.categories}%`,
      changeType: 'increase',
      icon: FiLayers,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      description: `${stats.overview.totalSubcategories} subcategories`
    },
    {
      name: 'High Priority',
      value: stats.overview.highPriorityContacts.toLocaleString(),
      change: '+12%',
      changeType: 'increase',
      icon: FiTrendingUp,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      description: 'Urgent contacts'
    },
  ];

  const quickActions = [
    { name: 'Add New Product', icon: FiShoppingBag, color: 'from-blue-500 to-cyan-600', hoverColor: 'hover:from-blue-600 hover:to-cyan-700', href: '/admin/dashboard/products' },
    { name: 'View Contacts', icon: FiMessageSquare, color: 'from-green-500 to-emerald-600', hoverColor: 'hover:from-green-600 hover:to-emerald-700', href: '/admin/dashboard/contacts' },
    { name: 'Manage Categories', icon: FiLayers, color: 'from-purple-500 to-violet-600', hoverColor: 'hover:from-purple-600 hover:to-violet-700', href: '/admin/dashboard/categories' },
    { name: 'Navbar Settings', icon: FiGrid, color: 'from-orange-500 to-red-600', hoverColor: 'hover:from-orange-600 hover:to-red-700', href: '/admin/dashboard/navbar-category' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-end space-x-1">
                <FiClock className="w-3 h-3" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchDashboardStats}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiArrowUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Contacts Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contacts Trend (Last 7 Days)</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.contacts.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Contacts by Service Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contacts by Service Type</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.contacts.byService}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ _id, percent }: any) => `${_id} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.contacts.byService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats and Actions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Contact Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FiMail className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Status</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">New</span>
                <span className="text-lg font-bold text-blue-600">{stats.contacts.new}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Replied</span>
                <span className="text-lg font-bold text-green-600">{stats.contacts.replied}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">In Progress</span>
                <span className="text-lg font-bold text-yellow-600">{stats.contacts.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Closed</span>
                <span className="text-lg font-bold text-gray-600">{stats.contacts.closed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiLayers className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Categories Overview</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Navbar Categories</span>
                <span className="text-lg font-bold text-indigo-600">{stats.categories.navbarCategories}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Subcategories</span>
                <span className="text-lg font-bold text-purple-600">{stats.categories.subcategories}</span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
                <div className="space-y-2">
                  {stats.categories.breakdown.slice(0, 3).map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{cat.name}</span>
                      <span className="font-medium">{cat.subcategoriesCount} subs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiPlus className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`w-full text-left p-4 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg block`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{action.name}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Chart (if products exist) */}
      {stats.products.total > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <FiShoppingBag className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Products by Category</h3>
              </div>
              <span className="text-sm text-gray-500">{stats.products.total} total products</span>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.products.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
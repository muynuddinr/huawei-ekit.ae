"use client";

import { useState } from 'react';
import { FiFolder, FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiMoreVertical, FiEye, FiToggleLeft, FiToggleRight, FiPackage, FiLink } from 'react-icons/fi';

const subCategories = [
  { id: 1, name: 'Access Points', category: 'Wireless Solutions', products: 12, active: true, icon: '📶', description: 'Wi-Fi access point devices', color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Routers', category: 'Networking Solutions', products: 8, active: true, icon: '🌐', description: 'Network routing equipment', color: 'from-green-500 to-teal-500' },
  { id: 3, name: 'Switches', category: 'Networking Solutions', products: 15, active: true, icon: '🔗', description: 'Network switching devices', color: 'from-purple-500 to-pink-500' },
  { id: 4, name: 'Firewalls', category: 'Security Solutions', products: 6, active: true, icon: '🛡️', description: 'Network security appliances', color: 'from-red-500 to-orange-500' },
  { id: 5, name: 'Controllers', category: 'Wireless Solutions', products: 4, active: false, icon: '🎮', description: 'Wireless network controllers', color: 'from-indigo-500 to-blue-500' },
  { id: 6, name: 'Gateways', category: 'Networking Solutions', products: 2, active: true, icon: '🚪', description: 'Network gateway devices', color: 'from-yellow-500 to-orange-500' },
];

const categoryColors: { [key: string]: string } = {
  'Wireless Solutions': 'bg-blue-100 text-blue-700',
  'Networking Solutions': 'bg-green-100 text-green-700',
  'Security Solutions': 'bg-red-100 text-red-700',
  'Cloud Solutions': 'bg-purple-100 text-purple-700',
};

export default function SubCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subCategory.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || subCategory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(subCategories.map(sub => sub.category))];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <FiFolder className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Sub Categories
              </h1>
              <p className="text-gray-600 mt-1">Organize products into detailed sub-categories</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center space-x-2">
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Sub Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sub-categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Total: {filteredSubCategories.length}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Active: {filteredSubCategories.filter(sub => sub.active).length}
          </span>
        </div>
      </div>

      {/* Sub Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubCategories.map((subCategory) => (
          <div key={subCategory.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group overflow-hidden">
            {/* Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${subCategory.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-xl">{subCategory.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subCategory.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{subCategory.description}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <FiMoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[subCategory.category] || 'bg-gray-100 text-gray-700'}`}>
                  <FiLink className="w-3 h-3 inline mr-1" />
                  {subCategory.category}
                </span>
              </div>

              {/* Product Count */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiPackage className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Products</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{subCategory.products}</span>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <button className="flex items-center space-x-2">
                  {subCategory.active ? (
                    <FiToggleRight className="w-8 h-8 text-green-500" />
                  ) : (
                    <FiToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    subCategory.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subCategory.active ? 'Active' : 'Inactive'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <FiEye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <FiEdit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1 hover:bg-white rounded transition-colors duration-200">
                View Products
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sub-categories found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria, or add a new sub-category.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition duration-200 transform hover:scale-105"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add First Sub Category</span>
          </button>
        </div>
      )}

      {/* Quick Actions Sidebar */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-3">
          <button className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200">
            <FiPlus className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
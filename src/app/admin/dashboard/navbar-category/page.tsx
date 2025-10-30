"use client";

import { useState, useEffect } from 'react';
import { FiMenu, FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiMoreVertical, FiEye, FiToggleLeft, FiToggleRight, FiX, FiSave, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  order: number;
}

export default function NavbarCategoryPage() {
  const [categories, setCategories] = useState<NavbarCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NavbarCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    order: 0
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/navbar-categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/admin/navbar-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Category created successfully');
        setShowAddModal(false);
        resetForm();
        fetchCategories(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error creating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update form submitted for category:', selectedCategory);
    console.log('Form data:', formData);
    
    if (!selectedCategory || !formData.name.trim()) {
      console.log('Missing data - selected category or name');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Sending PATCH request to:', `/api/admin/navbar-categories/${selectedCategory._id}`);
      
      const response = await fetch(`/api/admin/navbar-categories/${selectedCategory._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        toast.success(data.message || 'Category updated successfully');
        setShowEditModal(false);
        setSelectedCategory(null);
        resetForm();
        fetchCategories(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    console.log('Delete clicked for category:', categoryName, 'ID:', categoryId);
    
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      console.log('Delete cancelled by user');
      return;
    }

    console.log('Proceeding with delete...');
    try {
      const response = await fetch(`/api/admin/navbar-categories/${categoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        toast.success(data.message || 'Category deleted successfully');
        fetchCategories(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const handleToggleActive = async (category: NavbarCategory) => {
    console.log('Toggle active clicked for category:', category.name, 'Current status:', category.isActive, 'Will change to:', !category.isActive);
    
    try {
      const requestBody = { isActive: !category.isActive };
      console.log('Sending PATCH request with body:', requestBody);
      
      const response = await fetch(`/api/admin/navbar-categories/${category._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Toggle response:', data);

      if (data.success) {
        toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
        fetchCategories(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Error updating category status');
    }
  };

  const openEditModal = (category: NavbarCategory) => {
    console.log('Opening edit modal for category:', category);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      order: category.order
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      order: 0
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCategory(null);
    resetForm();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiMenu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Navbar Categories
              </h1>
              <p className="text-gray-600 mt-1">Manage your website navigation menu items</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center space-x-2">
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Total: {categories.length} items
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Active: {categories.filter(cat => cat.isActive).length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <FiMoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Category Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Slug</div>
                    <div className="text-sm font-mono text-gray-900 truncate">{category.slug}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Order</div>
                    <div className="text-sm font-semibold text-gray-900">#{category.order}</div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <button 
                    onClick={() => handleToggleActive(category)}
                    className="flex items-center space-x-2"
                  >
                    {category.isActive ? (
                      <FiToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <FiToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEditModal(category)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category._id, category.name)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search query or add a new category.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition duration-200 transform hover:scale-105"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add First Category</span>
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
              <button 
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Creating...' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
              <button 
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Current Slug:</strong> {selectedCategory.slug}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Slug will update automatically based on the category name
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Updating...' : 'Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions Sidebar */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
          </button>
          <button 
            onClick={fetchCategories}
            className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '@/components/AdminContextSimple';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiToggleLeft, 
  FiToggleRight, 
  FiLoader, 
  FiX, 
  FiSave, 
  FiSearch,
  FiFilter,
  FiMoreVertical 
} from 'react-icons/fi';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
  };
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { getAuthHeaders } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState({
    name: '',
    navbarCategory: '',
    description: '',
    image: ''
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
        setFilteredCategories(data.data);
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

  // Fetch navbar categories for dropdown
  const fetchNavbarCategories = async () => {
    try {
      const response = await fetch('/api/admin/navbar-categories');
      const data = await response.json();
      
      if (data.success) {
        setNavbarCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching navbar categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchNavbarCategories();
  }, []);

  // Filter categories based on search and status
  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.navbarCategory?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(category =>
        statusFilter === 'active' ? category.isActive : !category.isActive
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm, statusFilter]);

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Get auth headers but exclude Content-Type for FormData
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {};
      if ('Authorization' in authHeaders && authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization as string;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success && data.imagePath) {
        return data.imagePath;
      } else {
        toast.error(data.error || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.navbarCategory) return;

    try {
      setIsSubmitting(true);
      
      // Upload image if selected
      let imagePath = formData.image;
      if (selectedFile) {
        const uploadedPath = await handleFileUpload(selectedFile);
        if (uploadedPath) {
          imagePath = uploadedPath;
        } else {
          return; // Upload failed, don't proceed
        }
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imagePath })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Category created successfully');
        setShowAddModal(false);
        resetForm();
        fetchCategories();
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
    if (!selectedCategory || !formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      
      // Upload new image if selected
      let imagePath = formData.image;
      if (selectedFile) {
        const uploadedPath = await handleFileUpload(selectedFile);
        if (uploadedPath) {
          imagePath = uploadedPath;
        } else {
          return; // Upload failed, don't proceed
        }
      }

      const response = await fetch(`/api/admin/categories/${selectedCategory._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imagePath })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Category updated successfully');
        setShowEditModal(false);
        setSelectedCategory(null);
        resetForm();
        fetchCategories();
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
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !category.isActive })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Error updating category status');
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      navbarCategory: category.navbarCategory._id,
      description: category.description || '',
      image: category.image || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      navbarCategory: '',
      description: '',
      image: ''
    });
    setSelectedFile(null);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCategory(null);
    resetForm();
  };

  const getStatsData = () => {
    const total = categories.length;
    const active = categories.filter(cat => cat.isActive).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const { total, active, inactive } = getStatsData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-600 rounded"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
            <p className="text-gray-600">Organize and manage your product categories</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <FiFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            Total: {total} categories
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Active: {active}
          </span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
            Inactive: {inactive}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
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
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-purple-600">{category.navbarCategory?.name}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <FiMoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Category Details */}
                <div className="space-y-3">
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Category Slug</div>
                      <div className="text-sm font-mono text-gray-900 truncate">{category.slug}</div>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-700">Category Status</span>
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
                <div className="text-xs text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-6">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first product category'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          )}
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
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NavBar Category *
                </label>
                <select
                  value={formData.navbarCategory}
                  onChange={(e) => setFormData({ ...formData, navbarCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select NavBar Category</option>
                  {navbarCategories.map((navCat) => (
                    <option key={navCat._id} value={navCat._id}>
                      {navCat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      // Clear the previous image path when new file is selected
                      setFormData({ ...formData, image: '' });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  accept="image/*"
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</p>
                )}
                {isUploading && (
                  <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload an image for this category (max 5MB)</p>
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Creating...' : 'Add Category'}</span>
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
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NavBar Category *
                </label>
                <select
                  value={formData.navbarCategory}
                  onChange={(e) => setFormData({ ...formData, navbarCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select NavBar Category</option>
                  {navbarCategories.map((navCat) => (
                    <option key={navCat._id} value={navCat._id}>
                      {navCat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      // Clear the previous image path when new file is selected
                      setFormData({ ...formData, image: '' });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  accept="image/*"
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</p>
                )}
                {selectedCategory.image && !selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">Current: {selectedCategory.image}</p>
                )}
                {isUploading && (
                  <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload an image for this category (max 5MB)</p>
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
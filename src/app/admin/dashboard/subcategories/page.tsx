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
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategory: NavbarCategory;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SubCategoriesPage() {
  const { getAuthHeaders } = useAdmin();
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: ''
  });

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

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/subcategories');
      const data = await response.json();
      
      if (data.success) {
        setSubCategories(data.data);
        setFilteredSubCategories(data.data);
      } else {
        toast.error('Failed to fetch subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Error fetching subcategories');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // Filter subcategories based on search and status
  useEffect(() => {
    let filtered = subcategories;

    if (searchTerm) {
      filtered = filtered.filter(subcategory =>
        subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategory.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategory.category?.navbarCategory?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategory.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(subcategory =>
        statusFilter === 'active' ? subcategory.isActive : !subcategory.isActive
      );
    }

    setFilteredSubCategories(filtered);
  }, [subcategories, searchTerm, statusFilter]);

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) return;

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

      const response = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imagePath })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'SubCategory created successfully');
        setShowAddModal(false);
        resetForm();
        fetchSubCategories();
      } else {
        toast.error(data.error || 'Failed to create subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Error creating subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategory || !formData.name.trim()) return;

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

      const response = await fetch(`/api/admin/subcategories/${selectedSubCategory._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imagePath })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'SubCategory updated successfully');
        setShowEditModal(false);
        setSelectedSubCategory(null);
        resetForm();
        fetchSubCategories();
      } else {
        toast.error(data.error || 'Failed to update subcategory');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Error updating subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubCategory = async (subcategoryId: string, subcategoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${subcategoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'SubCategory deleted successfully');
        fetchSubCategories();
      } else {
        toast.error(data.error || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory');
    }
  };

  const handleToggleActive = async (subcategory: SubCategory) => {
    try {
      const response = await fetch(`/api/admin/subcategories/${subcategory._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !subcategory.isActive })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`SubCategory ${!subcategory.isActive ? 'activated' : 'deactivated'}`);
        fetchSubCategories();
      } else {
        toast.error(data.error || 'Failed to update subcategory');
      }
    } catch (error) {
      console.error('Error toggling subcategory status:', error);
      toast.error('Error updating subcategory status');
    }
  };

  const openEditModal = (subcategory: SubCategory) => {
    setSelectedSubCategory(subcategory);
    setFormData({
      name: subcategory.name,
      category: subcategory.category._id,
      description: subcategory.description || '',
      image: subcategory.image || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image: ''
    });
    setSelectedFile(null);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedSubCategory(null);
    resetForm();
  };

  const getStatsData = () => {
    const total = subcategories.length;
    const active = subcategories.filter(sub => sub.isActive).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const { total, active, inactive } = getStatsData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-green-600 rounded"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sub Categories</h1>
            <p className="text-gray-600">Organize products under categories with subcategories</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <FiFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add SubCategory</span>
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Total: {total} subcategories
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
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
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-600">Loading subcategories...</p>
        </div>
      )}

      {/* SubCategories Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubCategories.map((subcategory) => (
            <div key={subcategory._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {subcategory.image ? (
                      <img 
                        src={subcategory.image} 
                        alt={subcategory.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {subcategory.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                      <p className="text-sm text-green-600">{subcategory.category?.name}</p>
                      <p className="text-xs text-gray-500">{subcategory.category?.navbarCategory?.name}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <FiMoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* SubCategory Details */}
                <div className="space-y-3">
                  {subcategory.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{subcategory.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">SubCategory Slug</div>
                      <div className="text-sm font-mono text-gray-900 truncate">{subcategory.slug}</div>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <button 
                    onClick={() => handleToggleActive(subcategory)}
                    className="flex items-center space-x-2"
                  >
                    {subcategory.isActive ? (
                      <FiToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <FiToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      subcategory.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subcategory.isActive ? 'Active' : 'Inactive'}
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
                    onClick={() => openEditModal(subcategory)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSubCategory(subcategory._id, subcategory.name)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(subcategory.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSubCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-6">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No subcategories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first product subcategory'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add SubCategory
            </button>
          )}
        </div>
      )}

      {/* Add SubCategory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New SubCategory</h2>
              <button 
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSubCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.navbarCategory.name} → {category.name}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subcategory description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SubCategory Image
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept="image/*"
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</p>
                )}
                {isUploading && (
                  <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload an image for this subcategory (max 5MB)</p>
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Creating...' : 'Add SubCategory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit SubCategory Modal */}
      {showEditModal && selectedSubCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit SubCategory</h2>
              <button 
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.navbarCategory.name} → {category.name}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subcategory description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SubCategory Image
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept="image/*"
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</p>
                )}
                {selectedSubCategory.image && !selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">Current: {selectedSubCategory.image}</p>
                )}
                {isUploading && (
                  <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload an image for this subcategory (max 5MB)</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Current Slug:</strong> {selectedSubCategory.slug}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Slug will update automatically based on the subcategory name
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
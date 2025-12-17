'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '@/components/AdminContextSimple';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategory: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsManagement() {
  const { getAuthHeaders } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  // keep full list locally so we can apply client-side filters/search reliably
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Debounced input to avoid firing requests on every keystroke
  const [searchInput, setSearchInput] = useState('');
  const [filterNavbar, setFilterNavbar] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keyFeatures: [''],
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    navbarCategory: '',
    category: '',
    subcategory: '',
    isActive: true
  });

  const [uploading, setUploading] = useState({
    image1: false,
    image2: false,
    image3: false,
    image4: false
  });

  // Fetch data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // request a larger page size so the UI shows all items; we'll filter client-side
      params.append('limit', '1000');

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setAllProducts(data.data);
        // apply current filters on the newly fetched data
        applyFilters(data.data, searchTerm, filterNavbar, filterCategory, filterSubCategory, filterStatus);
      } else {
        toast.error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    source: Product[] = allProducts,
    search = searchTerm,
    navbar = filterNavbar,
    category = filterCategory,
    subcategory = filterSubCategory,
    status = filterStatus
  ) => {
    const s = search.trim().toLowerCase();

    const filtered = source.filter((p) => {
      if (navbar && String(p.navbarCategory?._id || p.navbarCategory) !== String(navbar)) return false;
      if (category && String(p.category?._id || p.category) !== String(category)) return false;
      if (subcategory && String(p.subcategory?._id || p.subcategory) !== String(subcategory)) return false;
      if (status) {
        const wantActive = String(status) === 'true';
        if (p.isActive !== wantActive) return false;
      }

      if (!s) return true;

      const keys = [p.name, p.slug, p.description]
        .concat(p.keyFeatures || [])
        .concat([p.navbarCategory?.name || '', p.category?.name || '', p.subcategory?.name || ''])
        .join(' ')
        .toLowerCase();

      return keys.includes(s);
    });

    setProducts(filtered);
  };

  // Debounce the search input and update `searchTerm` after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Re-apply filters whenever the search or other filter values change
  useEffect(() => {
    applyFilters();
  }, [allProducts, searchTerm, filterNavbar, filterCategory, filterSubCategory, filterStatus]);

  const fetchNavbarCategories = async () => {
    try {
      const response = await fetch('/api/admin/navbar-categories?limit=100&isActive=true', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        const activeNavbarCategories = data.data.filter((cat: any) => cat.isActive);
        setNavbarCategories(activeNavbarCategories);
        console.log('Navbar Categories loaded:', activeNavbarCategories); // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch navbar categories:', error);
    }
  };

  const fetchCategories = async (navbarCategoryId: string = '') => {
    try {
      const params = new URLSearchParams({ limit: '100', isActive: 'true' });
      if (navbarCategoryId) params.append('navbarCategory', navbarCategoryId);
      
      const response = await fetch(`/api/admin/categories?${params.toString()}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        const activeCategories = data.data.filter((cat: any) => cat.isActive);
        setCategories(activeCategories);
        console.log('Categories loaded:', activeCategories); // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSubCategories = async (categoryId: string = '') => {
    try {
      const params = new URLSearchParams({ limit: '100', isActive: 'true' });
      if (categoryId) params.append('category', categoryId);
      
      const response = await fetch(`/api/admin/subcategories?${params.toString()}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        const activeSubCategories = data.data.filter((cat: any) => cat.isActive);
        setSubCategories(activeSubCategories);
        console.log('SubCategories loaded:', activeSubCategories); // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const uploadImage = async (file: File, imageField: keyof typeof uploading): Promise<string> => {
    setUploading(prev => ({ ...prev, [imageField]: true }));
    
    try {
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
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.imagePath) {
        return data.imagePath;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(prev => ({ ...prev, [imageField]: false }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: keyof typeof uploading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, imageField);
      setFormData(prev => ({ ...prev, [imageField]: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      // Error already handled in uploadImage
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.image1.trim()) {
      toast.error('Name, description, and primary image are required');
      return;
    }

    if (!formData.navbarCategory || !formData.category) {
      toast.error('Navbar category and category are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        keyFeatures: formData.keyFeatures.filter(f => f.trim() !== '')
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      keyFeatures: product.keyFeatures.length > 0 ? product.keyFeatures : [''],
      image1: product.image1,
      image2: product.image2 || '',
      image3: product.image3 || '',
      image4: product.image4 || '',
      navbarCategory: product.navbarCategory?._id || '',
      category: product.category?._id || '',
      subcategory: product.subcategory?._id || '',
      isActive: product.isActive
    });
    
    // Load related categories and subcategories
    if (product.navbarCategory?._id) {
      fetchCategories(product.navbarCategory._id);
    }
    if (product.category?._id) {
      fetchSubCategories(product.category._id);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) return;

    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedProducts })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`${data.deletedCount} product(s) deleted successfully`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete products');
      }
    } catch (error) {
      toast.error('Failed to delete products');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, { 
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to toggle status');
      }
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      keyFeatures: [''],
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      navbarCategory: '',
      category: '',
      subcategory: '',
      isActive: true
    });
    setEditingProduct(null);
  };

  const handleNavbarCategoryChange = (navbarCategoryId: string) => {
    console.log('Navbar category changed to:', navbarCategoryId); // Debug log
    setFormData(prev => ({ ...prev, navbarCategory: navbarCategoryId, category: '', subcategory: '' }));
    setCategories([]); // Clear categories first
    setSubCategories([]); // Clear subcategories first
    if (navbarCategoryId) {
      fetchCategories(navbarCategoryId);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId, subcategory: '' }));
    setSubCategories([]); // Clear subcategories first
    if (categoryId) {
      fetchSubCategories(categoryId);
    }
  };

  const addKeyFeature = () => {
    setFormData(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }));
  };

  const updateKeyFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((f, i) => i === index ? value : f)
    }));
  };

  const removeKeyFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    fetchProducts();
    fetchNavbarCategories();
    fetchCategories(); // Load all categories initially
  }, []);

  useEffect(() => {
    // When modal opens, ensure we have navbar categories loaded
    if (showModal && navbarCategories.length === 0) {
      fetchNavbarCategories();
    }
  }, [showModal]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          
          <select
            value={filterNavbar}
            onChange={(e) => {
              setFilterNavbar(e.target.value);
              setFilterCategory('');
              setFilterSubCategory('');
              if (e.target.value) fetchCategories(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Navbar Categories</option>
            {navbarCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory('');
              if (e.target.value) fetchSubCategories(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2"
            disabled={!filterNavbar}
          >
            <option value="">All Categories</option>
            {categories.filter(cat => !filterNavbar || cat.navbarCategory === filterNavbar).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            disabled={!filterCategory}
          >
            <option value="">All SubCategories</option>
            {subCategories.filter(cat => !filterCategory || cat.category === filterCategory).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p._id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    checked={selectedProducts.length === products.length && products.length > 0}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hierarchy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product._id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product._id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product.image1} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="text-purple-600 font-medium">
                          {product.navbarCategory?.name || 'No Navbar Category'}
                        </div>
                        <div className="text-blue-600">
                          {product.category?.name || 'No Category'}
                        </div>
                        {product.subcategory && (
                          <div className="text-green-600">{product.subcategory.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {product.keyFeatures.length > 0 ? (
                          <div className="space-y-1">
                            {product.keyFeatures.slice(0, 2).map((feature, index) => (
                              <div key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {feature}
                              </div>
                            ))}
                            {product.keyFeatures.length > 2 && (
                              <div className="text-xs text-gray-400">+{product.keyFeatures.length - 2} more</div>
                            )}
                          </div>
                        ) : (
                          'No features'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(product._id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Hierarchy Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Navbar Category *
                    </label>
                    <select
                      value={formData.navbarCategory}
                      onChange={(e) => handleNavbarCategoryChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Navbar Category</option>
                      {navbarCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={!formData.navbarCategory}
                    >
                      <option value="">Select Category</option>
                      {categories.filter(cat => {
                        const navbarCategoryId = typeof cat.navbarCategory === 'string' 
                          ? cat.navbarCategory 
                          : (cat.navbarCategory as any)?._id;
                        return navbarCategoryId === formData.navbarCategory;
                      }).map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SubCategory (Optional)
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!formData.category}
                    >
                      <option value="">Select SubCategory</option>
                      {subCategories.filter(cat => {
                        const categoryId = typeof cat.category === 'string' 
                          ? cat.category 
                          : (cat.category as any)?._id;
                        return categoryId === formData.category;
                      }).map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active</label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['image1', 'image2', 'image3', 'image4'] as const).map((imageField, index) => (
                    <div key={imageField}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image {index + 1} {index === 0 ? '*' : ''}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, imageField)}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploading[imageField]}
                        />
                        {uploading[imageField] && (
                          <div className="text-sm text-blue-600">Uploading...</div>
                        )}
                        {formData[imageField] && (
                          <div className="relative">
                            <img 
                              src={formData[imageField]} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, [imageField]: '' }))}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
                  <button
                    type="button"
                    onClick={addKeyFeature}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateKeyFeature(index, e.target.value)}
                        placeholder={`Key feature ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.keyFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyFeature(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
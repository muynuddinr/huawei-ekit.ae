'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategory: NavbarCategory;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryGroup {
  navbarCategory: NavbarCategory;
  categories: Category[];
}

interface ProductsClientProps {
  initialData: {
    success: boolean;
    data?: Category[];
  };
}

const ProductsClient: React.FC<ProductsClientProps> = ({ initialData }) => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData.success);
  const [error, setError] = useState<string | null>(initialData.success ? null : 'Failed to load categories');

  useEffect(() => {
    if (initialData.success && initialData.data) {
      processCategories(initialData.data);
      setIsLoading(false);
    } else if (!initialData.success) {
      fetchCategoriesClient();
    }
  }, [initialData]);

  const fetchCategoriesClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success && data.data) {
        processCategories(data.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error loading categories');
    } finally {
      setIsLoading(false);
    }
  };

  const processCategories = (categories: Category[]) => {
    const groupedCategories = categories.reduce((groups: { [key: string]: CategoryGroup }, category: Category) => {
      const navbarCategoryId = category.navbarCategory._id;
      
      if (!groups[navbarCategoryId]) {
        groups[navbarCategoryId] = {
          navbarCategory: category.navbarCategory,
          categories: []
        };
      }
      
      groups[navbarCategoryId].categories.push(category);
      return groups;
    }, {});

    const sortedGroups = (Object.values(groupedCategories) as CategoryGroup[]).sort(
      (a: CategoryGroup, b: CategoryGroup) => (a.navbarCategory.order || 0) - (b.navbarCategory.order || 0)
    );

    setCategoryGroups(sortedGroups);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCategoriesClient}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner/first.jpg"
            alt="Products Banner"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-red-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-full mb-6">
              <span className="text-red-300 text-sm font-semibold tracking-wide">PRODUCT CATALOG</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Explore Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Product Categories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mb-8">
              Browse by category to find the perfect solution for your needs
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-12 md:h-16 text-white" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z" fill="currentColor"/>
          </svg>
        </div>
      </motion.div>

      {/* Product Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Product <span className="text-red-600">Categories</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Select a category to explore our products
          </p>
        </motion.div>

        {categoryGroups.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categoryGroups.map((group) =>
              group.categories.map((category) => (
                <motion.div
                  key={category._id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  className="group" // let inner parts define card height (matches screenshot style)
                >
                  <Link href={`/products/${group.navbarCategory.slug}`}>
                    <div className="bg-white rounded-xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Image Container */}
                      <motion.div
                        className="relative h-44 md:h-52 flex items-center justify-center p-6 overflow-hidden bg-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {category.image ? (
                          <motion.div
                            variants={imageVariants}
                            className="relative w-full h-full flex items-center justify-center"
                          >
                            <img
                              src={category.image}
                              alt={category.name}
                              className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-inner group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300"
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Content Container */}
                      <div className="bg-gray-50 p-4 flex-1 flex flex-col justify-between">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2 leading-tight">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                            {category.description}
                          </p>
                        )}

                        {/* Action Button */}
                        <div className="flex justify-center">
                          <motion.div
                            className="inline-flex items-center text-red-600 font-medium text-xs group-hover:gap-1 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>View Category</span>
                            <svg
                              className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Available</h3>
              <p className="text-gray-600 mb-4">
                There are currently no categories available.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsClient;

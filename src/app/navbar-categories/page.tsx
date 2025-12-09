'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

const NavbarCategoriesPage = () => {
  const [categories, setCategories] = useState<NavbarCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavbarCategories = async () => {
      try {
        setIsLoading(true);
        // Use public API endpoint instead of admin endpoint
        const response = await fetch('/api/navbar-categories');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Sort by order field
          const sortedCategories = data.data.sort((a: NavbarCategory, b: NavbarCategory) => a.order - b.order);
          setCategories(sortedCategories);
        } else {
          setError('Failed to fetch navbar categories');
        }
      } catch (err) {
        console.error('Error fetching navbar categories:', err);
        setError('Error loading navbar categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavbarCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading navbar categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-4">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Main Categories
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Explore our main navigation categories and discover all the sections available on our website.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Navigation Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse through our main website sections and categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 group-hover:from-red-50 group-hover:to-red-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:bg-red-700 transition-colors duration-300">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Category Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Main Category
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Category Slug:</span>
                        <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          /{category.slug}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Display Order:</span>
                        <span className="font-semibold text-gray-700">#{category.order}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <Link
                        href={`/${category.slug}`}
                        className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 group-hover:shadow-lg"
                      >
                        Explore {category.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-6">
              📂
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Categories Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No navigation categories are currently available. Please check back later or contact us for more information.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {categories.length > 0 && (
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Need More Information?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Contact our team to learn more about our categories and services.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarCategoriesPage;
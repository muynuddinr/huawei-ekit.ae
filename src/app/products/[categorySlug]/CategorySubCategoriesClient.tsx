'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Image from 'next/image';
interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
}

interface CategorySubCategoriesClientProps {
  data: {
    category: Category;
    subcategories: SubCategory[];
  };
}

export default function CategorySubCategoriesClient({ data }: CategorySubCategoriesClientProps) {
  const { category, subcategories } = data;
  const navbarCategory = category.navbarCategory;
  const [searchTerm, setSearchTerm] = useState('');

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',

          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4"
            >
              <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-[10px] sm:text-sm text-gray-300">
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
                <span>→</span>
                <Link href="/products" className="hover:text-white transition-colors duration-200">
                  Products
                </Link>
                <span>→</span>
                <span className="text-white font-medium">
                  {category.name} 
                </span>
              </div>

            </motion.nav>

            <div className="inline-flex items-center px-3 py-1 bg-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-full mb-4">
              <span className="text-red-300 text-xs font-semibold tracking-wide">
                {category.name.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
              Explore
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                {category.name}
              </span>
            </h1>

            {category.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-6"
              >
                {category.description}
              </motion.p>
            )}

            {/* Parent Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm text-red-300 px-3 py-1 rounded-full text-xs font-medium border border-red-400/30"
            >
              <span>Part of</span>
              <span className="font-semibold">
                {navbarCategory.name}
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-10 md:h-14 text-white" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z" fill="currentColor" />
          </svg>
        </div>
      </motion.div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">



        {/* SubCategories Grid Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            SubCategories in <span className="text-red-600">{category.name}</span>
            {searchTerm && (
              <span className="text-base font-normal text-gray-600 ml-2">
                ({filteredSubcategories.length} of {subcategories.length} found)
              </span>
            )}
          </h2>
          <p className="text-gray-600">Select a subcategory to view products</p>
        </motion.div>

        {/* SubCategories Grid */}
        {subcategories.length > 0 ? (
          filteredSubcategories.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredSubcategories.map((subcategory) => (
                <motion.div
                  key={subcategory._id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Image Container */}
                    <motion.div
                      className="relative h-48  flex items-center justify-center p-4 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {subcategory.image ? (
                        <motion.div
                          variants={imageVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="relative w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
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
                          {subcategory.name.charAt(0).toUpperCase()}
                        </motion.div>
                      )}

                      {/* Status Badge */}

                    </motion.div>

                    {/* Content Container */}
                    <div className=" bg-gradient-to-br from-gray-100 to-gray-50 p-4 flex-1 flex flex-col">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2 leading-tight">
                        {subcategory.name}
                      </h3>

                      {subcategory.description && (
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                          {subcategory.description}
                        </p>
                      )}

                      {/* Action Button */}
                      <div className="flex justify-center">
                        <Link
                          href={`/products/${category.slug}/${subcategory.slug}`}
                          className="mt-auto"
                        >
                          <motion.div
                            className="inline-flex items-center text-red-600 font-medium text-xs group-hover:gap-1 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>View Products</span>
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
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Subcategories Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No subcategories found matching "${searchTerm}"`
                    : `No subcategories available under "${category.name}" yet.`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Search
                    </button>
                  )}
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                  </Link>
                </div>
              </div>
            </motion.div>
          )
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Subcategories Available</h3>
              <p className="text-gray-600 mb-4">
                There are currently no subcategories available in this section.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Image from 'next/image';
interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
    keyFeatures: string[];
    isActive: boolean;
    createdAt: string;
}

interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    category: {
        _id: string;
        name: string;
        slug: string;
        navbarCategory: {
            _id: string;
            name: string;
            slug: string;
        };
    };
}

interface SubCategoryProductsClientProps {
    data: {
        subcategory: SubCategory;
        products: Product[];
    };
}

export default function SubCategoryProductsClient({ data }: SubCategoryProductsClientProps) {
    const { subcategory, products } = data;
    const category = subcategory.category;
    const navbarCategory = category.navbarCategory;

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

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
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
                            className="mb-6"
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
                                <Link
                                    href={`/products/${category.slug}`}
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    {category.name} 
                                </Link>
                                <span>→</span>
                                <span className="text-white">
                                    {subcategory.name}
                                </span>
                            </div>


                        </motion.nav>

                        <div className="inline-flex items-center px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-full mb-6">
                            <span className="text-red-300 text-sm font-semibold tracking-wide">
                                {subcategory.name.toUpperCase()}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            Explore
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                                {subcategory.name}
                            </span>
                            Products
                        </h1>

                        {subcategory.description && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mb-8"
                            >
                                {subcategory.description}
                            </motion.p>
                        )}

                        {/* Hierarchy Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="inline-flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm text-red-300 px-4 py-2 rounded-full text-sm font-medium border border-red-400/30"
                        >
                            <span>Part of</span>
                            <Link
                                href={`/products/${category.slug}`}
                                className="hover:text-white font-semibold transition-colors duration-200"
                            >
                                {category.name}
                            </Link>
                        </motion.div>

                        {/* Products Count */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="ml-2 mt-6 inline-flex items-center space-x-2 bg-transparent backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-gray-600"
                        >
                            <span>
                                {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10">
                    <svg className="w-full h-12 md:h-16 text-white" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z" fill="currentColor" />
                    </svg>
                </div>
            </motion.div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Products Grid Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Available Products in <span className="text-red-600">{subcategory.name}</span>
                    </h2>
                    <p className="text-gray-600">High-quality {subcategory.name.toLowerCase()} products from Huawei</p>
                </motion.div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={itemVariants}
                                className="group"
                            >
                                <div className="bg-white rounded-xl border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                                    {/* Product Image */}
                                    <motion.div
                                        className="relative h-48  flex items-center justify-center p-4 overflow-hidden"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div
                                            variants={imageVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="relative w-full h-full flex items-center justify-center"
                                        >
                                            <img
                                                src={product.image1}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </motion.div>

                                        {/* Status Badge */}


                                        {/* Additional Images Preview */}
                                        {(product.image2 || product.image3 || product.image4) && (
                                            <div className="absolute bottom-2 left-2 flex space-x-1">
                                                {[product.image2, product.image3, product.image4]
                                                    .filter(Boolean)
                                                    .slice(0, 2)
                                                    .map((image, imgIndex) => (
                                                        <div key={imgIndex} className="w-6 h-6 rounded border border-white bg-white overflow-hidden shadow-xs">
                                                            <img
                                                                src={image!}
                                                                alt={`${product.name} view ${imgIndex + 2}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                {[product.image2, product.image3, product.image4].filter(Boolean).length > 2 && (
                                                    <div className="w-6 h-6 rounded border border-white bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                                        +{([product.image2, product.image3, product.image4].filter(Boolean).length - 2)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Product Content */}
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 flex-1 flex flex-col">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2 leading-tight">
                                            {product.name}
                                        </h3>

                                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                                            {product.description}
                                        </p>

                                        {/* Action Button */}
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/products/${category.slug}/${subcategory.slug}/${product.slug}`}
                                                className="mt-auto"
                                            >
                                                <motion.div
                                                    className="inline-flex items-center text-red-600 font-medium text-xs group-hover:gap-1 transition-all duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span>View Details</span>
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
                        className="text-center py-16"
                    >
                        <div className="max-w-2xl mx-auto">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Available</h3>
                            <p className="text-gray-600 mb-6">
                                There are currently no products available in the "{subcategory.name}" subcategory.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href={`/products/${category.slug}`}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to {category.name}
                                </Link>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
                                >
                                    All Products
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

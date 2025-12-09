// pages/index.js or components/SMEOfficePage.js
"use client";
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Banner from "../../public/SolutionBusiness/First.png";
// Import product images - you'll need to add these to your public folder
import AR720 from "../../public/solutionproduct/AR720.png";
import SME from "../../public/SolutionBusiness/First.png";
import SOHO from "../../public/SolutionBusiness/First.png";
import AC650 from "../../public/SolutionBusPro/AC650.png"
import S220S from "../../public/SolutionBusPro/S220S.png"
import S220S2 from "../../public/SolutionBusPro/S220S2.png"
import S310 from "../../public/SolutionBusPro/S310.png"
import Hotel from "../../public/SolutionBusiness/Hotel.jpg"
import Store from "../../public/SolutionBusiness/Store.jpg"
import Mall from "../../public/SolutionBusiness/Mall.jpg"

const SolutionBussiness = () => {
    const [randomImage, setRandomImage] = useState<StaticImageData>(Banner);
    const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
    const officeImages = [Banner];
    const products = [
        {
            id: 1,
            name: "AC650-128AP",
            type: "WLAN",
            thumbnail: AC650,
            introduction: "wireless access controller | Manage APs: 128 | 10 x 10/100/1000BASE-T ports, | 2 x 10 GE SFP+ ports",
            quantity: 1
        },
        {
            id: 2,
            name: "S220S-24T4J",
            type: "N/a",
            thumbnail: S220S2,
            introduction: "S220S-24T4J (24*10/100/1000BASE-T ports, 4*2.5GE SFP ports, built-in AC power, Fanless)",
            quantity: 1
        },
        {
            id: 3,
            name: "S220S-24LP4JX",
            type: "Switch",
            thumbnail:  S220S,
            introduction: "24 x 10/100/1000BASE-T ports, 2 x 10GE SFP+ ports, 2 x 2.5GE SFP ports | Packet forwarding rate: 73 Mpps | Switching capacity: 98 Gbit/s",
            quantity: 1
        },
        {
            id: 4,
            name: "AR720",
            type: "Router",
            thumbnail: AR720,
            introduction: "Forwarding performance: 9 Mpps to 25 Mpps | Number of connected terminals: 700 | Fixed WAN ports: 2 x GE combo ports | Fixed LAN ports: 8 x GE ports (can be switched to WAN ports) | Dimensions (H x W x D): 43.6 mm x 442 mm x 220 mm",
            quantity: 1
        },
        {
            id: 5,
            name: "S310-24T4X",
            type: "Switch",
            thumbnail: S310,
            introduction: "24 x 10/100/1000BASE-T ports, 4 x 10GE SFP+ ports | AC power supply | Packet forwarding rate: 95 Mpps | Switching capacity: 128 Gbit/s",
            quantity: 1
        }
    ];

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * officeImages.length);
        setRandomImage(officeImages[randomIndex]);
    }, []);

    const toggleExpand = (productId: number) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const scrollToProducts = () => {
        const productsSection = document.getElementById('product-configuration');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Animation variants for sections appearing one by one
    const containerAnimation : Variants= {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8
            }
        }
    };

    const sectionAnimation : Variants= {
        hidden: {
            opacity: 0,
            y: 60
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        }
    };

    const leftAnimation : Variants= {
        hidden: {
            opacity: 0,
            x: -100
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut",
                delay: 0.3
            }
        }
    };

    const rightAnimation : Variants= {
        hidden: {
            opacity: 0,
            x: 100
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut",
                delay: 0.6
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={containerAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Commercial Store Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full" variants={leftAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                {randomImage && (
                                    <div className="relative w-full h-64 lg:h-80">
                                        <Image
                                            src={randomImage}
                                            alt="Commercial Store Network"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={rightAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                HUAWEI eKit Ultra-Stable{' '}
                                <span className="text-red-600">Commercial Store</span>{' '}
                                Network Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Provides ultra-stable Wi-Fi for commercial stores with seamless payment experiences, 
                                high-quality voice services, and simplified network O&M. Ensures reliable connectivity 
                                for business operations with easy deployment and management.
                            </p>
                            <motion.button
                                onClick={scrollToProducts}
                                className="hover:bg-red-600 hover:text-white text-red-600 border-2 font-semibold py-2 px-2 transition-colors duration-300"
                            >
                                View Configuration
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Intelligent Hotel Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={leftAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>Intelligent Hotel</span> Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Delivers premium Wi-Fi experiences for hotel guests with seamless roaming, 
                                stable high-speed connectivity, and simplified network management. Supports 
                                smart room services and enhances guest satisfaction with reliable internet access.
                            </p>
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full" variants={rightAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Hotel}
                                        alt="Intelligent Hotel Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Intelligent Store Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full" variants={leftAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Store}
                                        alt="Intelligent Store Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={rightAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>Intelligent Store</span> Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Provides high-performance Wi-Fi for retail stores with seamless connectivity 
                                for POS systems, inventory management, and customer engagement. Ensures 
                                reliable network operations for smooth business processes and enhanced 
                                customer experiences.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Intelligent Mall Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={leftAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>Intelligent Mall</span> Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Offers comprehensive Wi-Fi coverage for shopping malls with high-density 
                                connectivity support. Enables seamless visitor experiences, location-based 
                                services, and efficient mall operations with reliable network performance 
                                and easy management.
                            </p>
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full" variants={rightAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Mall}
                                        alt="Intelligent Mall Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Product Configuration Section */}
                <div id="product-configuration" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Product Configuration</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Thumbnail</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Name</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Description</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="relative w-12 h-12">
                                                    <Image
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="py-3 px-4 text-gray-700">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {product.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <div className="max-w-md">
                                                    <div className={`text-xs leading-relaxed ${expandedProduct === product.id ? '' : 'line-clamp-2'}`}>
                                                        {product.introduction}
                                                    </div>
                                                    {product.introduction.length > 120 && (
                                                        <button
                                                            onClick={() => toggleExpand(product.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 focus:outline-none"
                                                        >
                                                            {expandedProduct === product.id ? 'Show less' : 'Read more'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                                                    {product.quantity}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionBussiness;
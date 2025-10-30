// pages/index.js or components/SMEOfficePage.js
"use client";
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import Banner from "../../public/Solution/IntelligentOffice.png";
// Import product images - you'll need to add these to your public folder
import AR720 from "../../public/solutionproduct/AR720.png";
import S380 from "../../public/solutionproduct/S380-S8T2T.png";
import S22024 from "../../public/solutionproduct/S220-24T4X.png";
import S11024 from "../../public/solutionproduct/S110-24LP2SR.png";
import AP162E from "../../public/solutionproduct/AP162E.png";
import AP from "../../public/solutionproduct/AP.png";
import AP362E from "../../public/solutionproduct/AP362E.png";
import SME from "../../public/Solution/SME.jpg"
import { Variants } from 'framer-motion';
import SOHO from "../..//public/Solution/SOHO.jpg"

const SolutionOffice = () => {
    const [randomImage, setRandomImage] = useState<StaticImageData | null>(null);
    const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

    // Fixed: Use Banner directly in the array
    const officeImages = [Banner];

    // Product data with full descriptions
    const products = [
        {
            id: 1,
            name: "AR720",
            type: "Router",
            thumbnail: AR720,
            introduction: "Forwarding performance: 9 Mpps to 25 Mpps | Number of connected terminals: 700 | Fixed WAN ports: 2 x GE combo ports | Fixed LAN ports: 8 x GE ports (can be switched to WAN ports) | Dimensions (H x W x D): 43.6 mm x 442 mm x 220 mm",
            quantity: 1
        },
        {
            id: 2,
            name: "S380-S8T2T",
            type: "Router",
            thumbnail: S380,
            introduction: "Multi-Service Gateway capable of managing up to 64 APs and supporting 300 maximum users. Offers 16Gbps switching capacity with packet forwarding rates of 500 Kpps upload and 420 Kpps download. Includes 2 x 10/100/1000BASE-T WAN ports and 8 x 10/100/1000BASE-T LAN ports.",
            quantity: 1
        },
        {
            id: 3,
            name: "S220-24T4X",
            type: "Switch",
            thumbnail: S22024,
            introduction: "24 x 10/100/1000BASE-T ports, 4 x 10GE SFP+ ports | built-in AC power | Packet forwarding rate: 95 Mpps | Switching capacity: 128 Gbit/s",
            quantity: 1
        },
        {
            id: 4,
            name: "S110-24LP2SR",
            type: "Switch",
            thumbnail: S11024,
            introduction: "24 x 10/100/1000BASE-T ports, 2 x GE SFP ports | PoE+ | Packet forwarding rate: 38.69 Mpps | Switching capacity: 52 Gbit/s",
            quantity: 1
        },
        {
            id: 5,
            name: "AP265E",
            type: "WLAN",
            thumbnail: AP,
            introduction: "Wall plate AP | Wi-Fi 6 | 2.975 Gbps device rate | Dual-radio | 64 access users recommended | Max. 128 access users | 23 dBm transmit power | 4 x GE electrical ports | Smart antenna | leader AP | 20 m optimal coverage range",
            quantity: 1
        },
        {
            id: 6,
            name: "AP362E",
            type: "WLAN",
            thumbnail: AP362E,
            introduction: "Settled AP | Wi-Fi 6 | 2.975 Gbps device rate | Dual-radio | 100 access users recommended | 23 dBm transmit power | Smart antenna | 20 m optimal coverage range",
            quantity: 1
        },
        {
            id: 7,
            name: "AP162E",
            type: "WLAN",
            thumbnail: AP162E,
            introduction: "Wall plate 86x86 AP | Wi-Fi 6 | 2.975 Gbps device rate | Dual-radio | 48 access users recommended | Max. 128 access users | 20 dBm transmit power | Smart antenna | 15 m optimal coverage range",
            quantity: 1
        }
    ];

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * officeImages.length);
        setRandomImage(officeImages[randomIndex]);
    }, []);

    const toggleExpand = (productId: number | null) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const scrollToProducts = () => {
        const productsSection = document.getElementById('product-configuration');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Animation variants for sections appearing one by one
    const containerAnimation: Variants= {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8 // Delay between sections
            }
        }
    };

    // Individual section animation
    const sectionAnimation: Variants={
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

    // Left/right animation for content within each section
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
                delay: 0.3 // Delay for content within section
            }
        }
    };

    const rightAnimation : Variants={
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
                delay: 0.6 // Delay for content within section
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Container for all animated sections with stagger */}
                <motion.div
                    variants={containerAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Main Banner Section - Appears FIRST */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        {/* Left side - Image */}
                        <motion.div
                            className="lg:w-1/2 w-full"
                            variants={leftAnimation}
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                {randomImage && (
                                    <div className="relative w-full h-64 lg:h-80">
                                        <Image
                                            src={randomImage}
                                            alt="Modern Office Space"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Right side - Content */}
                        <motion.div
                            className="lg:w-1/2 w-full space-y-6"
                            variants={rightAnimation}
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                HUAWEI eKit Intelligent{' '}
                                <span className="text-red-600">SME Office</span>{' '}
                                Network Solution
                            </h1>

                            <p className="text-gray-600 leading-relaxed">
                                Small- and medium-sized enterprises (SMEs) are large in number, and they look for an office
                                network featuring smooth stable Wi-Fi, high security, high reliability, and easy O&M.
                                HUAWEI eKit Intelligent SME Office Network Solution meets this need by building a high-performance,
                                secure, and intelligent office network infrastructure.
                            </p>

                            <motion.button
                                onClick={scrollToProducts}
                             
                                className="hover:bg-red-600 hover:text-white text-red-600 border-2 font-semibold py-2 px-2   transition-colors duration-300"
                            >
                                View Configuration
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* SME Office Solution Section - Appears SECOND */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        {/* Left side - Content */}
                        <motion.div
                            className="lg:w-1/2 w-full space-y-6"
                            variants={leftAnimation}
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>SME Office</span> Solution{' '}
                            </h1>

                            <p className="text-gray-600 leading-relaxed">
                                The solution provides high-quality Wi-Fi access for up to 300 employees, ensuring smooth office
                                collaboration and efficient operations. It features intelligent network management with automatic
                                deployment and fault diagnosis, reducing O&M costs by 80%. Built-in security policies protect against
                                network threats, while the compact design saves space and supports flexible expansion.
                            </p>
                        </motion.div>

                        {/* Right side - Image */}
                        <motion.div
                            className="lg:w-1/2 w-full"
                            variants={rightAnimation}
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={SME}
                                        alt="SME Office Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* SOHO Office Solution Section - Appears THIRD */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        {/* Left side - Image */}
                        <motion.div
                            className="lg:w-1/2 w-full"
                            variants={leftAnimation}
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={SOHO}
                                        alt="SOHO Office Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right side - Content */}
                        <motion.div
                            className="lg:w-1/2 w-full space-y-6"
                            variants={rightAnimation}
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>SOHO Office</span> Solution{' '}
                            </h1>

                            <p className="text-gray-600 leading-relaxed">
                                Designed for small offices and home offices, this all-in-one solution provides integrated routing,
                                switching, and Wi-Fi capabilities in a single device. It supports up to 50 users with gigabit-speed
                                connectivity, perfect for remote work and small team collaborations. The solution offers plug-and-play
                                deployment with zero-touch configuration, making it ideal for non-technical users.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Product Configuration Section - NO FRAMER MOTION */}
                <div
                    id="product-configuration"
                    className="mb-12"
                >
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

export default SolutionOffice;
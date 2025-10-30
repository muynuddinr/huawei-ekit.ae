// pages/index.js or components/SMEOfficePage.js
"use client";
import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Banner from "../../public/SolutionEdu/Edu.png";
import Hotel from "../../public/SolutionBusiness/Hotel.jpg"
import Store from "../../public/SolutionBusiness/Store.jpg"
import AR720 from "../../public/SolutionEdu/AR720.png"
import AC650AP from "../../public/SolutionEdu/AC650AP.png"
import S530T4XE from "../../public/SolutionEdu/S530T4XE.png"
import S31024T4X from "../../public/SolutionEdu/S220T4X.png"
import S220T4X from "../../public/SolutionEdu/S220T4X.png"
import S220T4S from "../../public/SolutionEdu/S220T4S.png"
import S22048P4S from "../../public/SolutionEdu/S22048P4S.png"
import AP361 from "../../public/SolutionEdu/AP361.png"
import AP761 from "../../public/SolutionEdu/AP761.png"
import AP661 from "../../public/SolutionEdu/AP661.png"
import AP266 from "../../public/SolutionEdu/AP266.png"
import Smart from "../../public/SolutionEdu/Smart.jpg"
import Campus from "../../public/SolutionEdu/Campus.jpg"

const SolutionEducation = () => {
    const [randomImage, setRandomImage] = useState<StaticImageData | null>(null);
    const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
    const officeImages = [Banner];
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
            name: "AC650-256AP",
            type: "Switch",
            thumbnail: AC650AP,
            introduction: "wireless access controller | Manage APs: 256 | 10 x 10/100/1000BASE-T ports, | 2 x 10 GE SFP+ ports",
            quantity: 1
        },
        {
            id: 3,
            name: "S530-24T4XE",
            type: "Switch",
            thumbnail: S530T4XE,
            introduction: "24 x 10/100/1000BASE-T ports, 4 x 10GE SFP+ ports, 2 x 10GE stack ports | Packet forwarding rate: 132 Mpps | Switching capacity: 176 Gbit/s",
            quantity: 1
        },
        {
            id: 4,
            name: "S310-24T4X",
            type: "Switch",
            thumbnail:  S31024T4X,
            introduction: "24 x 10/100/1000BASE-T ports, 4 x 10GE SFP+ ports | AC power supply | Packet forwarding rate: 95 Mpps | Switching capacity: 128 Gbit/s",
            quantity: 1
        },
         {
            id: 5,
            name: "S220-24T4X",
            type: "Switch",
            thumbnail: S220T4X,
            introduction: "24 x 10/100/1000BASE-T ports, 4 x 10GE SFP+ ports | built-in AC power | Packet forwarding rate: 95 Mpps | Switching capacity: 128 Gbit/s",
            quantity: 1
        },
        {
            id: 6,
            name: "S220-48T4S",
            type: "Switch",
            thumbnail: S220T4S,
            introduction: "48 x 10/100/1000BASE-T ports, 4 x GE SFP ports | built-in AC power | Packet forwarding rate: 77 Mpps | Switching capacity: 104 Gbit/s",
            quantity: 1
        },
        {
            id: 7,
            name: "S220-48P4S",
            type: "Switch",
            thumbnail: S22048P4S,
            introduction: "48 x 10/100/1000BASE-T ports, 4 x GE SFP ports | 380W PoE+ | built-in AC power | Packet forwarding rate: 77 Mpps | Switching capacity: 104 Gbit/s",
            quantity: 1
        },
        {
            id: 8,
            name: "AP361",
            type: "WLAN",
            thumbnail: AP361,
            introduction: "Settled AP | 802.11ax | 1.775 Gbps device rate | Dual-radio | 23 dBm transmit power | Smart antenna | 20 m optimal coverage range",
            quantity: 1
        },
        {
            id: 9,
            name: "AP761",
            type: "WLAN",
            thumbnail: AP761,
            introduction: "Out-door AP | Wi-Fi 6 | 1.775 Gbps device rate | Dual-radio | 120 access users recommended | Max. 1024 access users | 28 dBm transmit power | 1 GE electrical port | 1 SFP optical port | Smart antenna | 500 m max signal distance",
            quantity: 1

        },
        {
            id: 10,
            name: "AP661",
            type: "WLAN",
            thumbnail: AP661,
            introduction: "Settled AP | Wi-Fi 6 | 6.575 Gbps device rate | Tri-radio | 300 access users recommended | Max. 1536access users | 26 dBm transmit power | Smart antenna | 30 m optimal coverage range",
            quantity: 1
        },
        {
            id: 11,
            name: "AP266",
            type: "WLAN",
            thumbnail: AP266,
            introduction: "Wall plate AP | Wi-Fi 6 | 2.975 Gbps device rate | Dual-radio | 64 access users recommended | Max. 128 access users | 23 dBm transmit power | 4 x GE electrical ports | PoE | Smart antenna | leader AP | 20 m optimal coverage range",
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
    const containerAnimation : Variants= {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8
            }
        }
    };

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

    const leftAnimation: Variants= {
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
                    {/* Education Network Solution Section */}
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
                                            alt="Education Network Solution"
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
                                HUAWEI eKit Green Network Solution{' '}
                                <span className="text-red-600">Secure Primary and Secondary Education</span>{' '}
                                Network Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Primary and secondary education covers pre-schools, kindergartens, and primary and secondary schools. It requires best-in-class Wi-Fi coverage in diverse scenarios such as common classrooms, e-classrooms, offices, libraries, canteens, and sports fields. 
                            </p>
                            
                           
                            <motion.button
                                onClick={scrollToProducts}
                                className="hover:bg-red-600 hover:text-white text-red-600 border-2 font-semibold py-2 px-2 transition-colors duration-300"
                            >
                                View Configuration
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Smart Interactive Classroom Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={leftAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className='text-red-600'>Smart Interactive</span> Classroom Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Experience the joy of intelligent interactive teaching with our advanced Smart Interactive Classroom Solution. This innovative solution transforms traditional classrooms into dynamic digital learning environments that enhance student engagement and teaching effectiveness.
                            </p>
                           
                           
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full" variants={rightAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Smart}
                                        alt="Smart Interactive Classroom Solution"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Intelligent Campus Network Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full" variants={leftAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Campus}
                                        alt="Intelligent Campus Network Solution"
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
                                <span className='text-red-600'>Intelligent Campus</span> Network Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Experience the Smart Teaching Journey with our comprehensive Intelligent Campus Network Solution. This end-to-end solution connects all campus facilities including classrooms, administrative offices, libraries, dormitories, and outdoor areas into a unified, intelligent network ecosystem.
                            </p>
                           
                           
                           
                        </motion.div>
                    </motion.div>

                    {/* Additional Benefits Section */}
                    
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

export default SolutionEducation;
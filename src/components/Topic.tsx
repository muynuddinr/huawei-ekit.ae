"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Variants } from 'framer-motion';
import Topic1 from '../../public/Solution/IntelligentBussiness.png';
import Topic2 from '../../public/SolutionEdu/Campus.jpg';
import Topic3 from '../../public/Solution/IntelligentHealthcare.png';
import Topic4 from '../../public/Solution/IntelligentOffice.png';
import Topic5 from '../../public/Topic/Topic 5.png';
import Topic6 from '../../public/Topic/Topic 6.jpg';

const Topic = () => {
    const router = useRouter();

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    // Refs for in-view detection
    const gridRef = useRef(null);
    const isGridInView = useInView(gridRef, { once: true, margin: "-50px" });

    // Navigation handler for cards


    // Fixed: Correct image imports - use the imported variables directly
    const images = {
        topic: Topic1,
        huaweiEkit: Topic2,
        oceanProtect: Topic3,
        digitalPartner: Topic4,
        gartnerReport: Topic5,
        intelligentTransportation: Topic6
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-red-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
                        Data Storage Solutions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Discover our comprehensive range of future-proof data storage solutions designed for businesses of all sizes
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    ref={gridRef}
                    initial="hidden"
                    animate={isGridInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Feature Card - Left Side */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4"
                    >
                        <div

                            className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group h-full flex flex-col bg-cover bg-center"
                            style={{ backgroundImage: "url('/Topic/bg.jpg')" }}
                        >
                            <div className="p-5 md:p-6 flex-grow">
                                <motion.div
                                    variants={itemVariants}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-red-100 border border-red-200 mb-4 mx-auto"
                                >
                                    <div className=" bg-gradient-to-r from-red-400 to-red-600 mr-2 "></div>
                                    <span className="text-red-600 text-sm font-semibold tracking-wide">Intelligent Office</span>
                                </motion.div>

                                <motion.h1
                                    variants={itemVariants}
                                    className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center"
                                >
                                    Smart Workplace Solutions
                                </motion.h1>

                                <motion.p
                                    variants={itemVariants}
                                    className="text-gray-600 mb-4 text-center text-base leading-relaxed"
                                >Transform traditional offices into intelligent workspaces with AI-powered meeting systems, smart collaboration tools, and secure cloud-based platforms that enhance productivity and enable seamless hybrid work experiences.

                                </motion.p>

                                {/* Single big image */}
                                <div className="relative h-64 md:h-80 mt-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={images.topic}
                                        alt="Future-Proof Data Storage Solutions"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className=" transition-transform duration-500 ease-out"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cards Grid - Right Side */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* HUAWEI eKit */}
                        <motion.article
                            variants={itemVariants}
                            className="group cursor-pointer"

                        >
                            <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group-hover:shadow-lg">
                                <div className="relative w-full bg-gradient-to-br from-red-100 to-red-200">
                                    <Image
                                        src={images.huaweiEkit}
                                        alt="HUAWEI eKit"
                                        width={800}
                                        height={400}
                                        className="w-full h-auto transition-transform duration-500 ease-out"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow text-center">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4 self-center">
                                        Intelligent Education
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Next-Generation Learning Environments</h3>
                                    <p className="text-gray-600 text-base leading-relaxed flex-grow">
                                        Create immersive, interactive learning experiences with smart classrooms, remote education platforms, and AI-assisted teaching tools that make education more accessible, engaging, and effective for students and educators alike.

                                    </p>
                                </div>
                            </div>
                        </motion.article>

                        {/* OceanProtect */}
                        <motion.article
                            variants={itemVariants}
                            className="group cursor-pointer"

                        >
                            <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group-hover:shadow-lg">
                                <div className="relative w-full bg-gradient-to-br from-red-100 to-red-200">
                                    <Image
                                        src={images.oceanProtect}
                                        alt="OceanProtect Data Protection"
                                        width={800}
                                        height={400}
                                        style={{ objectFit: 'cover' }}
                                        className=" transition-transform duration-500 ease-out"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow text-center">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4 self-center">
                                        Intelligent Healthcare
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Healthcare Transformation</h3>
                                    <p className="text-gray-600 text-base leading-relaxed flex-grow">
                                        Revolutionize healthcare delivery with telemedicine platforms, AI-assisted diagnosis, smart hospital management systems, and connected medical devices that improve patient outcomes and optimize healthcare operations.

                                    </p>
                                </div>
                            </div>
                        </motion.article>

                        {/* Digital Partner */}
                        <motion.article
                            variants={itemVariants}
                            className="group cursor-pointer"

                        >
                            <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group-hover:shadow-lg">
                                <div className="relative w-full bg-gradient-to-br from-red-100 to-red-200">
                                    <Image
                                        src={images.digitalPartner}
                                        alt="Huawei Digital Partner"
                                        width={800}
                                        height={400}
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform duration-500 ease-out"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow text-center">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4 self-center">
                                        Intelligent Office
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Smart & Connected Workspaces</h3>
                                    <p className="text-gray-600 text-base leading-relaxed flex-grow">
                                        Transform traditional offices into intelligent, collaborative environments with IoT-enabled devices, unified communication systems, and AI-powered management tools that boost productivity, streamline operations, and enhance employee experience.
                                    </p>
                                </div>
                            </div>

                        </motion.article>

                        {/* Gartner Report */}
                        <motion.article
                            variants={itemVariants}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group-hover:shadow-lg">
                                <div className="relative w-full bg-gradient-to-br from-red-100 to-red-200">
                                    <Image
                                        src={images.intelligentTransportation}
                                        alt="Huawei Digital Partner"
                                        width={800}
                                        height={300}
                                        style={{ objectFit: 'cover' }}
                                        className=" transition-transform duration-500 ease-out"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow text-center">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-red-600 text-sm font-semibold mb-4 self-center">
                                        Intelligent Transfortation
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Transformative Mobility Solutions </h3>
                                    <p className="text-gray-600 text-base leading-relaxed flex-grow">
                                        Revolutionizing urban mobility with AI-powered traffic management, smart infrastructure, and connected vehicle systems for safer, more efficient transportation networks.
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Topic;
// pages/index.js or components/SMEOfficePage.js
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Consult from "../../public/Solution/Consult.jpg";
import Smart from "../../public/Solution/Smart.jpg"
import { Variants } from 'framer-motion';

const SolutionHealth = () => {
    const [expandedProduct, setExpandedProduct] = useState(null);

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

    const leftAnimation: Variants={
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
                    {/* Smart Ward Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full" variants={leftAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Smart}
                                        alt="Smart Ward Solution"
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
                                Smart Ward {' '}
                                <span className="text-red-600">Solution</span>
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                All-round intelligent upgrade for hospital wards
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Enhances medical efficiency and patient experience through digital transformation.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Smart Consultation Room Solution Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-8 mb-16"
                        variants={sectionAnimation}
                    >
                        <motion.div className="lg:w-1/2 w-full space-y-6" variants={leftAnimation}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                <span className="text-red-600">Smart Consultation</span> Room Solution
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Digital upgrade for outpatient services
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Improves consultation efficiency and patient satisfaction with intelligent systems.
                            </p>
                        </motion.div>

                        <motion.div className="lg:w-1/2 w-full" variants={rightAnimation}>
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <div className="relative w-full h-64 lg:h-80">
                                    <Image
                                        src={Consult}
                                        alt="Smart Consultation Room Solution"
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
            </div>
        </div>
    );
};

export default SolutionHealth;
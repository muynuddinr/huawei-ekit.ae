"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';

const fadeInUp : Variants= {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer : Variants=  {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const fadeInLeft : Variants=  {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const fadeInRight: Variants=  {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

// Animated component wrapper
const AnimatedSection = ({ children, variants = fadeInUp, className = "" }: { children: React.ReactNode, variants?: Variants, className?: string }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};




const About = () => {
    const router = useRouter();
    const [expandedProduct, setExpandedProduct] = React.useState<number | null>(null);
    const productsSectionRef = React.useRef<HTMLDivElement>(null);
    const toggleExpand = (productId: number) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    
  const goToProducts = () => {
    router.push('/products');
  };

    return (
        <>
            {/* Hero Section - Reduced Height */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden ">
                {/* Background Image - Replace with your image */}
                <div className="absolute inset-0 bg-cover bg-center bg-fixed">
                   <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url("/About/banner.png")`,
            filter: 'brightness(0.8)'
          }}
        />
                    {/* Optional overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content */}
                <AnimatedSection variants={staggerContainer} className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
                    {/* Main Heading */}
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                       About Huawei <span className='text-red-600'>eKit</span> UAE
                    </motion.h1>

                    {/* Mission Statement */}
                    <motion.p variants={fadeInUp} className="text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                        Our vision and mission is to bring digital to every person, home and
                        organization for a fully connected, intelligent world.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={goToProducts}
                        variants={fadeInUp}
                      
                        className="border-2 border-red-600 text-white/80 px-8 py-3 text-base font-medium hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
 >
                        View Our Products
                    </motion.button>
                </AnimatedSection>
            </section>

            {/* Who is Huawei Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Title */}
                        <AnimatedSection variants={fadeInLeft}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Huawei <span className='text-red-600'>eKit</span> Distributor in UAE
                            </h2>
                            <div className="w-16 h-1 bg-red-600 mb-6"></div>
                        </AnimatedSection>

                        {/* Right Column - Content */}
                        <AnimatedSection variants={fadeInRight} className="text-gray-700 leading-relaxed">
                            <p className="text-lg mb-6">
                                We are an authorized Huawei eKit distributor in the UAE, providing a complete range of genuine Huawei products, ICT infrastructure, and smart device solutions. Our authorization ensures customers receive only original products backed by Huawei's trusted warranty and support. As an official partner, we deliver reliable services, seamless supply, and tailored solutions to meet the growing digital needs of businesses and individuals across the UAE.
                            </p>
                            <p className="text-lg font-semibold">
                                Huawei eKit UAE professional dealer in UAE
                            </p>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Why Choose Huawei eKit UAE Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Huawei <span className='text-red-600'>eKit</span> UAE?
                        </h2>
                        <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
                    </AnimatedSection>

                    <AnimatedSection variants={fadeInUp} className="text-gray-700 leading-relaxed mb-12">
                        <p className="text-lg mb-6">
                            Huawei eKit UAE is the authorized distributor of Huawei eKit products in UAE. We can provide attractive prices for Huawei eKit products with support services across Gulf countries. We are the largest stock-holding distributor of Huawei eKit products. We provide a range of Huawei eKit products and can deliver the products within 24 hours in UAE and the shipment could be done in 4-8 days throughout the GCC Countries (Saudi Arabia, Bahrain, Qatar). Huawei eKit UAE provides a variety of high-end wireless networking products that utilize innovative and ground-breaking wireless technology.
                        </p>
                    </AnimatedSection>

                    {/* Use Cases Grid */}
                    <AnimatedSection variants={staggerContainer}>
                        {/* SME Offices */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">SME Offices</h3>
                            <p className="text-gray-700">
                                Seamless connectivity and constant communication are essential for boosting workplace productivity. HUAWEI eKit SME network solution ensures uninterrupted Wi-Fi 6 coverage, effortless deployment, smart remote management, empowering efficient operations.
                            </p>
                        </motion.div>

                        {/* Budget Hotels and Restaurants */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Budget Hotels and Restaurants</h3>
                            <p className="text-gray-700">
                                Hotel guests prioritize a super-fast, secure and stable wireless network. HUAWEI eKit network solution offers superior Wi-Fi 6 connectivity, catering to diverse hotel operations. Also, it simplifies O&M by reconfiguration and one-key optimization.
                            </p>
                        </motion.div>

                        {/* Primary and Secondary Education */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Primary and Secondary Education</h3>
                            <p className="text-gray-700">
                                Fast, stable wireless networks are essential for interactive, immersive education. HUAWEI eKit SME network enables seamless learning with high-density access and robust privacy protection.
                            </p>
                        </motion.div>

                        {/* Commercial Stores */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Commercial Stores</h3>
                            <p className="text-gray-700">
                                Boosting transaction efficiency through digitalization is at the core of modern retail transformation. HUAWEI eKit network ensures stable, reliable wired and wireless connections, e-transaction transceivers, and comprehensive retail solutions.
                            </p>
                        </motion.div>
                    </AnimatedSection>

                    {/* Product Configuration Table */}
                   
                </div>
            </section>
        </>
    );
};

export default About;
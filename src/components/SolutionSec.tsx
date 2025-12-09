"use client";
import React, { useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';
import Image from 'next/image';
import Intelligent1 from "../../public/Solution/IntelligentOffice.png";
import Intelligent2 from "../../public/Solution/IntelligentBussiness.png";
import Intelligent3 from "../../public/Solution/IntelligentEducation.png";
import Intelligent4 from "../../public/Solution/IntelligentHealthcare.png";

const categories = [
  {
    id: 1,
    title: "Intelligent Office",
    subtitle: "Smart Workplace Solutions",
    description: "Transform traditional offices into intelligent workspaces with AI-powered meeting systems, smart collaboration tools, and secure cloud-based platforms that enhance productivity and enable seamless hybrid work experiences.",
    image: Intelligent1,
    buttonText: "Explore Solutions",
    buttonLink: "/solution/it-office",
    alignLeft: true
  },
  {
    id: 2,
    title: "Intelligent Business",
    subtitle: "Digital Transformation for Enterprises",
    description: "Leverage cutting-edge technologies like cloud computing, big data, and AI to optimize business operations, enhance customer experiences, and drive innovation across retail, finance, and service industries.",
    image: Intelligent2,
    buttonText: "Discover More",
    buttonLink: "/solution/it-business",
    alignLeft: false
  },
  { 
    id: 3,
    title: "Intelligent Education",
    subtitle: "Next-Generation Learning Environments",
    description: "Create immersive, interactive learning experiences with smart classrooms, remote education platforms, and AI-assisted teaching tools that make education more accessible, engaging, and effective for students and educators alike.",
    image: Intelligent3,
    buttonText: "Learn More",
    buttonLink: "/solution/it-education",
    alignLeft: true
  },
  {
    id: 4,
    title: "Intelligent Healthcare",
    subtitle: "Digital Healthcare Transformation",
    description: "Revolutionize healthcare delivery with telemedicine platforms, AI-assisted diagnosis, smart hospital management systems, and connected medical devices that improve patient outcomes and optimize healthcare operations.",
    image: Intelligent4,
    buttonText: "View Solutions",
    buttonLink: "/solution/it-health",
    alignLeft: false
  }
];

const SolutionSec = () => {
  const shouldReduceMotion = useReducedMotion();
  
  // Refs for each category section
  const categoryRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  // Header ref and in-view detection
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  // Check if each category is in view
  const isInView1 = useInView(categoryRefs[0], { once: true, margin: "-50px" });
  const isInView2 = useInView(categoryRefs[1], { once: true, margin: "-50px" });
  const isInView3 = useInView(categoryRefs[2], { once: true, margin: "-50px" });
  const isInView4 = useInView(categoryRefs[3], { once: true, margin: "-50px" });
  
  const inViewStates = [isInView1, isInView2, isInView3, isInView4];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideVariants: Variants = {
    hidden: (alignLeft: boolean) => ({ 
      opacity: 0,
      x: alignLeft ? -100 : 100,
      scale: 0.95
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.1
      }
    }
  };

  const contentVariants: Variants = {
    hidden: (alignLeft: boolean) => ({ 
      opacity: 0,
      x: alignLeft ? -30 : 30
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay
      }
    })
  };

  // Header variants
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Simplified variants for reduced motion
  const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="bg-gradient-to-r from-red-900/80 to-transparent">
      <section className="py-16 bg-gray-50">
        <motion.div
          ref={headerRef}
          variants={shouldReduceMotion ? reducedMotionVariants : headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center max-w-6xl mx-auto px-6 mb-16"
        >
          <motion.h2
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            custom={0}
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Intelligent Solutions for Every Sector
          </motion.h2>
          
          <motion.p
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            custom={0.2}
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
            className="text-xl md:text-2xl text-red-700 font-medium mb-6"
          >
            Driving Digital Transformation Across Industries
          </motion.p>
          
          <motion.div
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            custom={0.4}
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Discover how our cutting-edge intelligent solutions are revolutionizing industries worldwide. 
              From smart offices to digital healthcare, we provide comprehensive technologies that empower 
              organizations to thrive in the digital age.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Leveraging AI, cloud computing, IoT, and big data analytics, our solutions are designed to 
              enhance efficiency, improve decision-making, and create exceptional experiences for your 
              customers and employees.
            </p>
          </motion.div>
        </motion.div>
        
        <div className="w-full flex flex-col gap-8">
          {categories.map((category, index) => {
            const isInView = inViewStates[index];

            return (
              <motion.div
                key={category.id}
                ref={categoryRefs[index]}
                custom={category.alignLeft}
                variants={shouldReduceMotion ? reducedMotionVariants : slideVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative bg-cover bg-center h-[70vh] w-full overflow-hidden"
              >
                {/* Background Image with Blackish Opacity */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full brightness-75 contrast-110"
                    priority={index === 0}
                  />
                </div>

                {/* Dark Overlay for additional blackish effect */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Gradient Overlay */}
                <motion.div
                  variants={shouldReduceMotion ? reducedMotionVariants : overlayVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`absolute inset-0 ${
                    index % 2 === 1 
                      ? 'bg-gradient-to-l from-black/70 to-transparent' 
                      : 'bg-gradient-to-r from-black/70 to-transparent'
                  }`}
                />

                {/* Content */}
                <motion.div
                  custom={category.alignLeft}
                  variants={shouldReduceMotion ? reducedMotionVariants : contentVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white ${
                    category.alignLeft ? 'items-start' : 'items-end text-right'
                  }`}
                >
                  <motion.h2
                    custom={shouldReduceMotion ? 0 : 0.3}
                    variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg"
                  >
                    {category.title}
                  </motion.h2>

                  <motion.p
                    custom={shouldReduceMotion ? 0 : 0.4}
                    variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-lg md:text-xl mb-3 text-gray-200"
                  >
                    {category.subtitle}
                  </motion.p>

                  <motion.p
                    custom={shouldReduceMotion ? 0 : 0.5}
                    variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-sm md:text-base mb-6 opacity-90 max-w-lg leading-relaxed text-gray-300"
                  >
                    {category.description}
                  </motion.p>

                  <motion.a
                    custom={shouldReduceMotion ? 0 : 0.6}
                    variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    href={category.buttonLink}
                    className="text-red-600 hover:text-red-400 text-lg font-medium transition-all duration-300 inline-block group drop-shadow-md"
                  >
                    {category.buttonText}
                    <span className="transition-transform duration-300 group-hover:translate-x-2 inline-block text-lg ml-2">→</span>
                  </motion.a>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SolutionSec;
"use client";
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Variants } from 'framer-motion';
import Smart from "../../public/stories/SmartCAm.png"
import Tech from "../../public/stories/Tech.png"
import Financial from "../../public/stories/Financial.png"
import Manufacturing from "../../public/stories/Manufacturing.png"
import Health from "../../public/stories/Health.png"
import Retail from "../../public/stories/Retail.png"

const Stories = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const stories = [
    {
      id: 1,
      title: "Huawei <span class='text-red-600'>eKit</span> Dubai Smart Campus",
      subtitle: "Deploying advanced eKit solutions to transform educational institutions across Dubai with cutting-edge digital infrastructure that enhances learning experiences and operational efficiency.",
      category: "Education",
      image: Smart
    },
    {
      id: 2,
      title: "Dubai Tech Innovation Hub with <span class='text-red-600'>eKit</span>",
      subtitle: "Huawei eKit's comprehensive digital infrastructure powering Dubai's innovation ecosystem with scalable cloud solutions and robust networking capabilities for sustainable growth.",
      category: "Technology",
      image: Tech
    },
    {
      id: 3,
      title: "Dubai Healthcare Digitalization with <span class='text-red-600'>eKit</span>",
      subtitle: "Huawei eKit smart medical solutions enhancing patient care and healthcare excellence across Dubai through innovative telemedicine platforms and secure data management systems.",
      category: "Healthcare",
      image: Health
    },
    {
      id: 4,
      title: "Dubai Financial Services <span class='text-red-600'>eKit</span> Solutions",
      subtitle: "Huawei eKit secure digital banking solutions transforming financial accessibility in Dubai with advanced cybersecurity measures and seamless digital payment infrastructure.",
      category: "Finance",
      image: Financial
    },
    {
      id: 5,
      title: "Dubai Manufacturing 4.0 with <span class='text-red-600'>eKit</span>",
      subtitle: "Huawei eKit IoT-driven smart factory solutions for Industry 4.0 transformation in Dubai, optimizing production processes and enabling real-time monitoring across manufacturing facilities.",
      category: "Manufacturing",
      image: Manufacturing,
    },
    {
      id: 6,
      title: "Dubai Retail Revolution with <span class='text-red-600'>eKit</span>",
      subtitle: "Huawei eKit next-generation retail technology enhancing customer experience in Dubai shopping centers with AI-powered analytics and smart inventory management systems.",
      category: "Retail",
      image: Retail
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-white"> {/* Added white background wrapper */}
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="mt-15 max-w-7xl mx-auto px-4 py-16"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Huawei <span className='text-red-600'>eKit </span>Dubai Success Stories</h2>
          <div className="w-16 h-1 bg-red-500 mx-auto"></div>
        </motion.div>

        {/* Slider Container */}
        <motion.div variants={itemVariants} className="relative group">
          {/* Main Slider */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  className="w-full flex-shrink-0"
                  initial="hidden"
                  animate={currentSlide === index ? "visible" : "hidden"}
                  variants={slideVariants}
                >
                  <div className="flex flex-col lg:flex-row min-h-[500px]">
                    {/* Image Section */}
                    <motion.div
                      className="w-full lg:w-1/2 flex items-center justify-center overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={story.image.src}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                      <motion.div
                        className="mb-4"
                        transition={{ duration: 0.2 }}
                      >
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full mb-4">
                          {story.category}
                        </span>
                      </motion.div>

                      <motion.h3
                        className="text-3xl font-bold text-gray-900 mb-4"
                        transition={{ duration: 0.3 }}
                        dangerouslySetInnerHTML={{ __html: story.title }}
                      />

                      <motion.p
                        className="text-gray-600 text-lg leading-relaxed mb-8"
                        initial={{ opacity: 0 }}
                        animate={currentSlide === index ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {story.subtitle}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-red-600" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-red-600" />
          </motion.button>
        </motion.div>

        {/* Scroll to Top Button */}
      </motion.div>
    </div>
  );
};

export default Stories;
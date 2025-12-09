"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Banners from '../../../public/Solution/Banner.jpg';
import SolutionSec from '@/components/SolutionSec';

const Solution = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Animation variants for staggered entrance
  const containerVariants : Variants= {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants : Variants= {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants : Variants= {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
    <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-end overflow-hidden">
      {/* Background Image with fade-in animation */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={Banners}
          alt="GITEX GLOBAL 2025 Conference"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        <div className="absolute inset-0 "></div>
      </motion.div>
      
     
    </section>
    <SolutionSec/>
    </>
  );
};

export default Solution;
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Variants } from 'framer-motion';

const categories = [
  {
    id: 1,
    title: "100 Intelligent Transformation <span class='text-red-600'>Stories</span>",
    subtitle: "Real Stories. Real Impact.",
    description: "Discover how organizations across industries are using intelligent technologies to drive innovation, boost efficiency, and create smarter futures.",
    image: "/intelligent/intelligent.png",
    buttonText: "Learn more ",
    buttonLink: "/stories/intelligent-transformation",
    alignLeft: true
  },
];

// Animation variants
const slideVariants: Variants = {
  hiddenLeft: { opacity: 0, x: -100, scale: 0.95 },
  hiddenRight: { opacity: 0, x: 100, scale: 0.95 },
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
  hiddenLeft: { opacity: 0, x: -30 },
  hiddenRight: { opacity: 0, x: 30 },
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
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3 + custom * 0.1
    }
  })
};

interface CategoryCardProps {
  category: typeof categories[0];
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = window.innerWidth <= 768 ? index * 100 : index * 150;
          setTimeout(() => {
            setIsInView(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [index]);

  const isLeftAligned = category.alignLeft;
  const gradientDirection = isLeftAligned ? 'to-r' : 'to-l';

  return (
    <motion.div
      ref={ref}
      variants={slideVariants}
      initial={isLeftAligned ? "hiddenLeft" : "hiddenRight"}
      animate={isInView ? "visible" : isLeftAligned ? "hiddenLeft" : "hiddenRight"}
      className="relative bg-cover bg-center h-[70vh] w-full"
      style={{ backgroundImage: `url('${category.image}')` }}
    >
      {/* Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`absolute inset-0 bg-gradient-${gradientDirection} from-black/70 via-black/50 to-transparent`}
      />

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial={isLeftAligned ? "hiddenLeft" : "hiddenRight"}
        animate={isInView ? "visible" : isLeftAligned ? "hiddenLeft" : "hiddenRight"}
        className={`absolute inset-0 flex flex-col justify-center px-12 text-white ${
          isLeftAligned ? 'items-start' : 'items-end text-right'
        }`}
      >
        <motion.h2
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-4xl font-bold mb-3 text-white drop-shadow-lg"
          dangerouslySetInnerHTML={{ __html: category.title }}
        />

        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="text-xl mb-3 text-gray-200"
        >
          {category.subtitle}
        </motion.p>

        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={2}
          className="text-base mb-6 opacity-90 max-w-lg leading-relaxed text-gray-300"
        >
          {category.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesSection() {
  return (
    <div className="bg-transparent">
      <section className="py-16 bg-gray-50">
        <div className="w-full flex flex-col gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
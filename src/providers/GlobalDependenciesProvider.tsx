import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pre-configured motion components for consistent usage
export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionSpan = motion.span;
export const MotionP = motion.p;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionImg = motion.img;
export const MotionSection = motion.section;
export const MotionArticle = motion.article;

// Export AnimatePresence for global use
export { AnimatePresence };

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
};

// Common transition settings
export const smoothTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

interface GlobalDependenciesProviderProps {
  children: React.ReactNode;
}

export const GlobalDependenciesProvider: React.FC<GlobalDependenciesProviderProps> = ({ children }) => {
  return (
    <div data-global-dependencies="true">
      {children}
    </div>
  );
};

// Global motion context for components that need it
export const MotionContext = React.createContext({
  motion,
  AnimatePresence,
  variants: {
    fadeInUp,
    scaleIn,
    slideInRight
  },
  transitions: {
    smooth: smoothTransition,
    spring: springTransition
  }
});

export const useMotion = () => {
  const context = React.useContext(MotionContext);
  if (!context) {
    return {
      motion,
      AnimatePresence,
      variants: { fadeInUp, scaleIn, slideInRight },
      transitions: { smooth: smoothTransition, spring: springTransition }
    };
  }
  return context;
};
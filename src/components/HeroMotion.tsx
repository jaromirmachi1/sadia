"use client";

import { motion, useReducedMotion } from "framer-motion";

type HeroMotionProps = {
  children: React.ReactNode;
};

export function HeroMotion({ children }: HeroMotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

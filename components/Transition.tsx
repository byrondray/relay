import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type TransitionProps = {
  children: ReactNode;
};

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw',
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: '100vw',
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const Transition = ({ children }: TransitionProps) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="flex justify-center items-center h-screen bg-gray-100"
  >
    {children}
  </motion.div>
);

export default Transition;

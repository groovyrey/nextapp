import React from 'react';
import Lottie from 'react-lottie';
import { motion } from 'framer-motion';
import animationData from '../../../public/loading_animation.json'; // Adjust path as needed
import styles from './LoadingMessage.module.css';

const LoadingMessage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const lottieVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
      },
    },
  };

  return (
    <motion.div
      className={`${styles.loadingMessageContainer} d-flex justify-content-center align-items-center`}
      style={{ height: '100vh' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="text-center"
        variants={lottieVariants}
        animate="pulse"
      >
        <Lottie options={defaultOptions} height={200} width={200} />
      </motion.div>
    </motion.div>
  );
};

export default LoadingMessage;

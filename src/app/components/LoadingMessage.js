import React from 'react';
import Lottie from 'react-lottie';
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

  return (
    <div className={`${styles.loadingMessageContainer} d-flex justify-content-center align-items-center`} style={{ height: '100vh' }}>
      <div className="text-center">
        <Lottie options={defaultOptions} height={200} width={200} />
        <p className="mt-3">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingMessage;

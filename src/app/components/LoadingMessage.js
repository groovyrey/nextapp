import React from 'react';
import styles from './LoadingMessage.module.css';

const LoadingMessage = () => {
  return (
    <div className={`${styles.loadingMessageContainer} d-flex justify-content-center align-items-center`} style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingMessage;

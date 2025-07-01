'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MessageCard({ message }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="card mb-4"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="card-body">
        <h5 className="card-title">From: {message.sender}</h5>
        <p className="card-text fs-5">{message.message}</p>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {new Date(message.timestamp.seconds * 1000).toLocaleString()}
          </small>
        </div>
      </div>
    </motion.div>
  );
}
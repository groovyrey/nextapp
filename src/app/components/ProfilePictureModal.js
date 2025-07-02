
'use client';

import React from 'react';
import styles from './ProfilePictureModal.module.css';
import { CldImage } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePictureModal({ imageUrl, onClose, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <button className={styles.closeButton} onClick={onClose}>&times;</button>
            <CldImage
              src={imageUrl}
              alt="Profile"
              width={500}
              height={500}
              crop="fit"
              className={styles.modalImage}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

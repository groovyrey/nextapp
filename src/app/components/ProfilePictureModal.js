
'use client';

import React from 'react';
import styles from './ProfilePictureModal.module.css';
import { CldImage } from 'next-cloudinary';

export default function ProfilePictureModal({ imageUrl, onClose, isOpen }) {
  if (!imageUrl || !isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <CldImage
          src={imageUrl}
          alt="Profile"
          width={500}
          height={500}
          crop="fit"
          className={styles.modalImage}
        />
      </div>
    </div>
  );
}

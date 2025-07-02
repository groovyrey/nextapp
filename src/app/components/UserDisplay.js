'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from './LoadingMessage';
import styles from './UserDisplay.module.css';
import { CldImage } from 'next-cloudinary';
import ProfilePictureModal from './ProfilePictureModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDisplay() {
  const router = useRouter();
  const { user, userData, loading, logout } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const optionsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);

  if (loading) {
    return <LoadingMessage />;
  }

  const handleViewProfile = () => {
    setShowOptions(false);
    router.push(`/user/${user.uid}`);
  };

  const handleEditProfile = () => {
    setShowOptions(false);
    router.push(`/user/edit`);
  };

  const handleLogout = () => {
    setShowOptions(false);
    logout();
  };

  return (
    <div
      className={`${styles.userDisplayContainer} card m-2 text-center shadow-lg rounded-3`}
    >
      {user ? (
        <div className="card-body">
          {userData && (userData.profilePictureUrl ? (
            <CldImage
              src={userData.profilePictureUrl}
              alt="Profile"
              width={100}
              height={100}
              crop="fill"
              className={`rounded-circle mb-3 border border-primary border-3`}
              style={{ objectFit: 'cover' }}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div
              className={`${styles.profilePicture} rounded-circle mb-3 border border-primary border-3 d-flex align-items-center justify-content-center`}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#e9ecef',
                cursor: 'not-allowed'
              }}
            >
              <i className="bi bi-person-fill" style={{ fontSize: '50px', color: '#adb5bd' }}></i>
            </div>
          ))}
          <p className="card-title">Logged in as: {user.email}</p>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between gap-2 gap-md-3">
            <button className={styles.optionsButton} onClick={() => setShowOptions(!showOptions)}>
              <i className="bi bi-three-dots"></i>
            </button>
          </div>
          <AnimatePresence>
            {showOptions && (
              <motion.div
                ref={optionsRef}
                className={styles.optionsMenu}
                variants={optionsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <button className={styles.optionButton} onClick={handleViewProfile}>
                  <i className="bi bi-person-vcard me-2"></i> View Profile
                </button>
                <button className={styles.optionButton} onClick={handleEditProfile}>
                  <i className="bi bi-pencil me-2"></i> Edit Profile
                </button>
                <button className={`${styles.optionButton} ${styles.deleteOptionButton}`} onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card-body">
          <p><i className="bi bi-person-slash me-2"></i>Not logged in.</p>
        </div>
      )}
    {showModal && (
      <ProfilePictureModal
        imageUrl={modalImageUrl}
        onClose={() => setShowModal(false)}
        isOpen={showModal}
      />
    )}
  </div>
)}
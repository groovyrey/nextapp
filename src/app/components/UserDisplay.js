'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from './LoadingMessage';
import styles from './UserDisplay.module.css';
import { CldImage } from 'next-cloudinary';
import ProfilePictureModal from './ProfilePictureModal';
import { motion } from 'framer-motion';

export default function UserDisplay() {
  const router = useRouter();
  const { user, userData, loading, logout } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <motion.div
      className={`${styles.userDisplayContainer} card m-2 text-center shadow-lg rounded-3`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h3><i className="bi bi-info-circle me-2"></i>User Information</h3>
      </div>
      {user ? (
        <div className="card-body">


          {userData && userData.profilePictureUrl && (
            <CldImage
              src={userData.profilePictureUrl}
              alt="Profile"
              width={100}
              height={100}
              crop="fill"
              className={`${styles.profilePicture} rounded-circle mb-3 border border-primary border-3`}
              style={{ objectFit: 'cover' }}
              onLoad={() => setImageLoaded(true)}
              onClick={() => {
                setModalImageUrl(userData.profilePictureUrl);
                setShowModal(true);
              }}
            />
          )}
          <p className="card-title">Logged in as: {user.email}</p>
          <div className="d-flex flex-column align-items-center gap-2 gap-sm-2 justify-content-sm-center">
            
            <button className="btn btn-primary w-100 w-sm-auto" onClick={() => router.push(`/user/${user.uid}`)}><i className="bi-person-vcard me-2"></i> View Profile</button>
            <button className="btn btn-secondary w-100 w-sm-auto" onClick={() => router.push(`/user/edit`)}><i className="bi-pencil me-2"></i> Edit Profile</button>
            <button className="btn btn-danger w-100 w-sm-auto" onClick={logout}><i className="bi-box-arrow-right me-2"></i> Logout</button>
          </div>
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
      />
    )}
  </motion.div>
)}}
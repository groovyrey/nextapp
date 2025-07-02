'use client';

import { useEffect, useState } from 'react';

import LoadingMessage from '../../../app/components/LoadingMessage';
import { CldImage } from 'next-cloudinary';
import dynamic from 'next/dynamic';
const ProfilePictureModal = dynamic(() => import('../../../app/components/ProfilePictureModal'), { ssr: false });
import { motion } from 'framer-motion';

import React from 'react';

export default function UserProfilePage({ params }) {
  const { id } = React.use(params);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        try {
          const res = await fetch(`/api/user/${id}`);
          if (res.ok) {
            const data = await res.json();
            setProfileData(data);
          } else {
            const errorData = await res.json();
            setError(errorData.error || 'Failed to fetch profile.');
          }
        } catch (err) {
          setError('An unexpected error occurred while fetching profile.');
        }
      };
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
    // Initialize tooltips after component mounts and data is loaded
    if (typeof document !== 'undefined') {
      import('bootstrap').then(bootstrap => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })
      })
    }
  }, [profileData]); // Re-initialize when profileData changes

  const AUTH_LEVEL_RANKS = {
    1: { title: "Lead Developer", icon: "bi-stars", color: "text-warning" },
    2: { title: "Developer", icon: "bi-code-slash", color: "text-info" },
    // Add more auth levels as needed
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  
  if (!profileData) {
  return <LoadingMessage />;
}

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  const authLevelInfo = AUTH_LEVEL_RANKS[profileData.authLevel];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <motion.div
        className="card m-2 shadow-lg rounded-3"
        style={{ maxWidth: '600px', width: '100%' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 display-6 fw-bold text-primary"><span className="bi-person-fill me-2"></span>User Profile</h2>
          {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}
          
          <div className="position-relative mx-auto mb-4" style={{ width: '150px', height: '150px' }}>
            {profileData.profilePictureUrl ? (
              <CldImage
                src={profileData.profilePictureUrl}
                alt="Profile"
                width={150}
                height={150}
                crop="fill"
                className="rounded-circle border border-primary border-3"
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(true)}
              />
            ) : (
              <div
                className="rounded-circle border border-primary border-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#e9ecef',
                  cursor: 'not-allowed'
                }}
              >
                <i className="bi bi-person-fill" style={{ fontSize: '75px', color: '#adb5bd' }}></i>
              </div>
            )}
            {authLevelInfo && (
              <div
                className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#28a745', /* Green for active status */
                  right: '-5px', /* Adjust for overlap */
                  bottom: '-5px', /* Adjust for overlap */
                  border: '2px solid #fff' /* White border for separation */
                }}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={authLevelInfo.title}
              >
                <i className={`${authLevelInfo.icon} ${authLevelInfo.color} fs-6`}></i>
              </div>
            )}
          </div>

          <div className="col-12 text-center mb-3">
              <h1 className="display-4 d-inline-block">{toTitleCase((profileData.firstName || '') + " " + (profileData.lastName || ''))}</h1>
            </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <p className="mb-1"><strong>Email:</strong></p>
              <p className="text-muted">{profileData.email.split('@')[0].substring(0, 3) + '***@' + profileData.email.split('@')[1]}</p>
            </div>
            <div className="col-12 col-md-6">
              <p className="mb-1"><strong>Age:</strong></p>
              <p className="text-muted">{profileData.age}</p>
            </div>
          </div>
          <div className="text-center mt-4 pt-3 border-top">
            <a href="/" className="btn btn-primary btn-lg"><i className="bi-house-door me-2"></i>Back to Home</a>
          </div>
        </div>
      </motion.div>

      

      {profileData.profilePictureUrl && (
        <ProfilePictureModal
          imageUrl={profileData.profilePictureUrl}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}
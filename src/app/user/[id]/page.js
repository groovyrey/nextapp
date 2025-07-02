'use client';

import { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap';
import LoadingMessage from '../../../app/components/LoadingMessage';
import { CldImage } from 'next-cloudinary';
import ProfilePictureModal from '../../../app/components/ProfilePictureModal';
import { motion } from 'framer-motion';

export default function UserProfilePage({ params }) {
  const { id } = params;
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
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    }
  }, [profileData]); // Re-initialize when profileData changes

  const AUTH_LEVEL_RANKS = {
    1: { title: "Lead Developer", icon: "bi-braces", color: "text-danger" },
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
          
          {profileData.profilePictureUrl ? (
            <CldImage
              src={profileData.profilePictureUrl}
              alt="Profile"
              width={150}
              height={150}
              crop="fill"
              className="rounded-circle mb-4 mx-auto d-block border border-primary border-3"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(true)}
            />
          ) : (
            <div
              className="rounded-circle mb-4 mx-auto border border-primary border-3 d-flex align-items-center justify-content-center"
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

          <div className="col-12 text-center mb-3 d-flex align-items-center justify-content-center">
              <h1 className="display-4 d-inline-block me-2">{toTitleCase((profileData.firstName || '') + " " + (profileData.lastName || ''))}</h1>
              {authLevelInfo && (
                <i className={`bi ${authLevelInfo.icon} ${authLevelInfo.color} align-middle fs-4`} data-bs-toggle="tooltip" data-bs-placement="top" title={authLevelInfo.title}></i>
              )}
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

      <motion.div
        className="card m-2 shadow-lg rounded-3 mt-4"
        style={{ maxWidth: '600px', width: '100%' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4 display-6 fw-bold text-primary"><span className="bi-list-ol me-2"></span>Auth Level Ranks</h3>
          <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            <code>{JSON.stringify(AUTH_LEVEL_RANKS, null, 2)}</code>
          </pre>
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
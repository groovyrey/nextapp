'use client';

import { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap';
import LoadingMessage from '../../../app/components/LoadingMessage';
import { CldImage } from 'next-cloudinary';
import { motion } from 'framer-motion';

export default function UserProfilePage({ params }) {
  const { id } = params;
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

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
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle mb-4 mx-auto border border-primary border-3 d-flex align-items-center justify-content-center"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#e9ecef',
              }}
            >
              <i className="bi bi-person-fill" style={{ fontSize: '75px', color: '#adb5bd' }}></i>
            </div>
          )}

          <div className="col-12 text-center mb-3 d-flex align-items-center justify-content-center">
              <h1 className="display-4 d-inline-block me-2">{toTitleCase((profileData.firstName || '') + " " + (profileData.lastName || ''))}</h1>
              {profileData.authLevel === 1 && (
                <i className="bi bi-star-fill text-warning align-middle" data-bs-toggle="tooltip" data-bs-placement="top" title="Owner"></i>
              )}
              {profileData.authLevel === 2 && (
                <i className="bi bi-code-slash text-info align-middle" data-bs-toggle="tooltip" data-bs-placement="top" title="Developer"></i>
              )}
            </div>
          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <p class="mb-1"><strong>Email:</strong></p>
              <p class="text-muted">{profileData.email.split('@')[0].substring(0, 3) + '***@' + profileData.email.split('@')[1]}</p>
            </div>
            <div class="col-12 col-md-6">
              <p class="mb-1"><strong>Age:</strong></p>
              <p class="text-muted">{profileData.age}</p>
            </div>
          </div>
          <div class="text-center mt-4 pt-3 border-top">
            <a href="/" class="btn btn-primary btn-lg"><i class="bi-house-door me-2"></i>Back to Home</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
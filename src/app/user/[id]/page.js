'use client';

import { useEffect, useState } from 'react';
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
          

          {profileData.profilePictureUrl && (
            <CldImage
              src={profileData.profilePictureUrl}
              alt="Profile"
              width={150}
              height={150}
              crop="fill"
              className="rounded-circle mb-4 mx-auto d-block border border-primary border-3"
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <p className="mb-1"><strong>First Name:</strong></p>
              <p className="text-muted">{profileData.firstName}</p>
            </div>
            <div className="col-12 col-md-6">
              <p className="mb-1"><strong>Last Name:</strong></p>
              <p className="text-muted">{profileData.lastName}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <p className="mb-1"><strong>Email:</strong></p>
              <p className="text-muted">{profileData.email}</p>
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
    </div>
  );
}
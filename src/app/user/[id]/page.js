'use client';

import { useEffect, useState } from 'react';
import LoadingMessage from '../../../app/components/LoadingMessage';

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
      <div className="card m-2" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4"><span className="bi-person-fill"></span>{" "}User Profile</h2>
          {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}
          {profileData.profilePictureUrl && (
            <div className="text-center mb-4">
              <img
                src={profileData.profilePictureUrl}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          )}
          <p><strong>First Name:</strong> {profileData.firstName}</p>
          <p><strong>Last Name:</strong> {profileData.lastName}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          <div className="text-center mt-4">
            <a href="/" className="btn btn-primary">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../app/context/UserContext';

export default function UserProfilePage({ params }) {
  const { id } = params;
  const { user, loading } = useUser();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && id) {
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
  }, [user, loading, id, router]);

  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="container">
      <div className="card m-2">
        <div className="card-body">
          <h2 className="card-title"><span className="bi-person-fill"></span>{" "}User Profile</h2>
          <p><strong>First Name:</strong> {profileData.firstName}</p>
          <p><strong>Last Name:</strong> {profileData.lastName}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          {user.uid==id?
          <button className="btn btn-primary" onClick={() => router.push('/user/edit')}>Edit Profile</button>:""}
          <p className="mt-3"><a href="/">Back to Home</a></p>
        </div>
      </div>
    </div>
  );
}
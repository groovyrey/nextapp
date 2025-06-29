'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../app/context/UserContext';

export default function EditUserPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Fetch current user data to pre-fill the form
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/user/${user.uid}`);
          if (res.ok) {
            const userData = await res.json();
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setAge(userData.age || '');
          } else {
            setError('Failed to fetch user data.');
          }
        } catch (err) {
          setError('An error occurred while fetching user data.');
        }
      };
      fetchUserData();
    }
  }, [user, loading, router]);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, firstName, lastName, age: parseInt(age) }),
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  import LoadingCard from '../../components/LoadingCard';

if (loading) {
    return <LoadingCard message="Loading..." />;
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container">
      <div className="card m-2">
        <div className="card-body">
          <h2 className="card-title"><span className="bi-person-fill-gear"></span>{" "}Edit Profile</h2>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <input type="text" className="form-control my-2" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input type="text" className="form-control my-2" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
          <input type="number" className="form-control my-2" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          <button className="btn btn-primary" onClick={handleUpdate}>Update Profile</button>
          <p className="mt-3"><a href="/">Back to Home</a></p>
        </div>
      </div>
    </div>
  );
}

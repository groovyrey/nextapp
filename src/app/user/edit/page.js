'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../app/context/UserContext';
import LoadingMessage from '../../../app/components/LoadingMessage';

export default function EditUserPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFetchingUserData, setIsFetchingUserData] = useState(true); // New state for data fetching

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      const fetchUserData = async () => {
        setIsFetchingUserData(true); // Start loading
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
        } finally {
          setIsFetchingUserData(false); // End loading
        }
      };
      fetchUserData();
    }
  }, [user, loading, router]);

  const [isUpdating, setIsUpdating] = useState(false); // New state for update loading

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    // Client-side validation
    if (!firstName.trim()) {
      setError('First Name cannot be empty.');
      return;
    }
    if (!lastName.trim()) {
      setError('Last Name cannot be empty.');
      return;
    }
    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    setIsUpdating(true); // Start update loading
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
    } finally {
      setIsUpdating(false); // End update loading
    }
  };

  if (loading || isFetchingUserData) { // Include isFetchingUserData in loading check
    return <LoadingMessage />;
  }

  if (!user) {
    return <LoadingMessage />;
  }

  return (
    <div className="container">
      <div className="card m-2">
        <div className="card-body">
          <h2 className="card-title"><span className="bi-person-fill-gear"></span>{" "}Edit Profile</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}
          <input type="text" className="form-control my-2" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isUpdating} />
          <input type="text" className="form-control my-2" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} disabled={isUpdating} />
          <input type="number" className="form-control my-2" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} disabled={isUpdating} />
          <button className="btn btn-primary" onClick={handleUpdate} disabled={isUpdating}><i className="bi-save"></i> Update Profile</button>
          <p className="mt-3"><a href="/">Back to Home</a></p>
        </div>
      </div>
    </div>
  );
}

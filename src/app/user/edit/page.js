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
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card m-2" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4"><span className="bi-person-fill-gear"></span>{" "}Edit Profile</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" id="firstName" className="form-control" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isUpdating} />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" id="lastName" className="form-control" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} disabled={isUpdating} />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input type="number" id="age" className="form-control" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} disabled={isUpdating} />
          </div>
          <button className="btn btn-primary w-100" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="bi-save"></i>
            )}{' '}{isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
          <div className="text-center mt-3">
            <a href="/" className="btn btn-link">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../app/context/UserContext';
import LoadingMessage from '../../../app/components/LoadingMessage';
import { CldImage } from 'next-cloudinary';

export default function EditUserPage() {
  const { user, loading, refreshUserData } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(null);
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
            if (userData.profilePictureUrl) {
              setProfilePicturePreviewUrl(userData.profilePictureUrl);
            }
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

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) {
      setError("Please select a file to upload.");
      return;
    }

    setError('');
    setSuccess('');
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("uid", user.uid);
    formData.append("file", profilePictureFile);

    try {
      const res = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess('Profile picture uploaded successfully!');
        await refreshUserData(); // Refresh user data in context
        const updatedUserData = await res.json();
        setProfilePicturePreviewUrl(updatedUserData.url);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to upload profile picture.');
      }
    } catch (err) {
      setError('An unexpected error occurred during file upload.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setError('');
    setSuccess('');
    setIsUpdating(true);

    try {
      const res = await fetch('/api/user/upload-profile-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (res.ok) {
        setSuccess('Profile picture removed successfully!');
        setProfilePicturePreviewUrl(null); // Clear preview
        setProfilePictureFile(null); // Clear file input
        await refreshUserData(); // Refresh user data in context
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to remove profile picture.');
      }
    } catch (err) {
      setError('An unexpected error occurred during profile picture removal.');
    } finally {
      setIsUpdating(false);
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
            <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
            <div className="mb-2 text-center">
              {profilePicturePreviewUrl ? (
                <CldImage
                  src={profilePicturePreviewUrl}
                  alt="Profile Preview"
                  width={100}
                  height={100}
                  crop="fill"
                  className="rounded-circle border border-primary border-3 mx-auto"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle border border-primary border-3 d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#e9ecef',
                    cursor: 'not-allowed'
                  }}
                >
                  <i className="bi bi-person-fill" style={{ fontSize: '50px', color: '#adb5bd' }}></i>
                </div>
              )}
            </div>
            <input type="file" id="profilePicture" className="form-control" onChange={e => {
              const file = e.target.files[0];
              setProfilePictureFile(file);
              if (file) {
                setProfilePicturePreviewUrl(URL.createObjectURL(file));
              } else {
                setProfilePicturePreviewUrl(null);
              }
            }} disabled={isUpdating} />
          </div>
          <div className="mb-2">
            <button className="btn btn-secondary w-100" onClick={handleProfilePictureUpload} disabled={isUpdating}>
              {isUpdating ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi-upload"></i>
              )}{' '}{isUpdating ? 'Uploading...' : 'Upload New Picture'}
            </button>
            <button className="btn btn-danger w-100 mt-2" onClick={handleRemoveProfilePicture} disabled={isUpdating}>
              <i className="bi-trash"></i> Remove Picture
            </button>
          </div>
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

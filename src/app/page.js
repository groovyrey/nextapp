"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import UserDisplay from './components/UserDisplay';
import { useUser } from './context/UserContext';

import LoadingMessage from './components/LoadingMessage';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setLogoutError(''); // Clear previous errors
    try {
      const res = await fetch('/api/logout');
      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        setLogoutError(`Failed to log out: ${errorData.message}`);
      }
    } catch (err) {
      setLogoutError('An unexpected error occurred during logout.');
    }
  };

  if (loading || !user) {
    return <LoadingMessage />;
  }

  return (
    <div className="min-h-screen flex flex-column align-items-center justify-content-center">
      {userData && <h1 className="display-4 mb-4">Welcome, {userData.firstName}!</h1>}
      <UserDisplay />
      {logoutError && <div className="alert alert-danger mt-3" role="alert">{logoutError}</div>}
    </div>
  );
}

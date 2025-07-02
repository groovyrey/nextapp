"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

import UserDisplay from './components/UserDisplay';
import { useUser } from './context/UserContext';

import LoadingMessage from './components/LoadingMessage';

export default function Home() {
  const router = useRouter();
  const { user, userData, loading } = useUser();
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

      {userData && (

        <motion.div
          className="card m-2 text-center shadow-lg rounded-3"
          style={{ maxWidth: '600px', width: '100%' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-header">
            <h3><i className="bi bi-house-door me-2"></i>Welcome</h3>
          </div>
          <div className="card-body p-4 text-center">
            <h1 className="display-4 mb-4">Welcome, {userData.firstName}!</h1>
          </div>
        </motion.div>
      )}
      <UserDisplay />
      {logoutError && <div className="alert alert-danger mt-3" role="alert">{logoutError}</div>}
    </div>
  );
}

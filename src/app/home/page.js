"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

import UserDisplay from '../components/UserDisplay';
import { useUser } from '../context/UserContext';

import LoadingMessage from '../components/LoadingMessage';

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
    <div className="min-h-screen d-flex flex-column align-items-center justify-content-center">
      {userData && (
        <motion.div
          className="greeting-text"
          style={{
            textAlign: 'center',
            background: 'linear-gradient(90deg, #000000, #f8f9fa, #000000, #f8f9fa, #000000)',
            backgroundSize: '200% 100%', // Adjusted background size for seamless repetition
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%'], // Animate from 0% to 100% for seamless loop
          }}
          transition={{
            duration: 5, // Adjusted duration for a smoother, less noticeable loop
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <h1>{`Welcome to Luloy, ${userData.firstName}!`}</h1>
        </motion.div>
      )}
      <UserDisplay />
      {logoutError && <div className="alert alert-danger mt-3" role="alert">{logoutError}</div>}
    </div>
  );
}

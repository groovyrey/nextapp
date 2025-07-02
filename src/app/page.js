"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

import UserDisplay from './components/UserDisplay';
import { useUser } from './context/UserContext';

import LoadingMessage from './components/LoadingMessage';

const Typewriter = ({ text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (infinite) {
      // Loop back to the beginning
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setCurrentText('');
      }, 1000); // Delay before restarting
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, infinite, text]);

  return <span>{currentText}</span>;
};

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
      {userData && <h1 className="display-4 mb-4"><Typewriter text={`Welcome, ${userData.firstName}!`} delay={100} infinite={true} /></h1>}
      <UserDisplay />
      {logoutError && <div className="alert alert-danger mt-3" role="alert">{logoutError}</div>}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import LoadingMessage from '../components/LoadingMessage';
import UserDisplay from '../components/UserDisplay';

export default function HomePage() {
  const { user, loading, userData } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.title = "Home";
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingMessage />;
  }

  if (!user) {
    return null; // Or a message like "Please log in to view this page."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen w-screen bg-background-color text-text-color p-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-5xl font-bold text-primary mb-6 text-center"
      >
        Welcome, {userData?.firstName || user?.email || 'User'}!
      </motion.h1>
      <UserDisplay />
    </motion.div>
  );
}
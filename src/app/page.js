'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingMessage from './components/LoadingMessage';

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.title = "Welcome to Luloy!";
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingMessage />;
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
        Welcome to Luloy!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-xl text-center max-w-2xl mb-8"
      >
        Connect with friends, share your thoughts, and explore a vibrant community.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="d-flex justify-content-center gap-3">
          <Link href="/login" className="btn btn-primary text-lg px-8 py-3">
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </Link>
          <Link href="/signup" className="btn btn-secondary text-lg px-8 py-3">
            <i className="bi bi-person-plus-fill me-2"></i>Sign Up
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

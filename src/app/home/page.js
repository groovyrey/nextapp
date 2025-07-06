'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import LoadingMessage from '../components/LoadingMessage';
import { gsap } from 'gsap';


export default function HomePage() {
  const { user, loading, userData } = useUser();
  const router = useRouter();
  const welcomeRef = useRef(null);

  useEffect(() => {
    document.title = "Home";
    if (!loading && !user) {
      router.push('/');
    }

    if (welcomeRef.current) {
      gsap.fromTo(
        welcomeRef.current,
        { opacity: 0, y: -50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" }
      );
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
      <h1
        ref={welcomeRef}
        className="text-5xl font-bold text-primary mb-6 text-center"
      >
        Welcome, {userData?.firstName || user?.email || 'User'}!
      </h1>
      <p className="lead text-muted mt-3 text-center">Your space to connect and share.</p>
      
    </motion.div>
  );
}
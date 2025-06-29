"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import UserDisplay from './components/UserDisplay';
import { useUser } from './context/UserContext';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Or a loading spinner, as the redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UserDisplay />
      {logoutError && <p className="text-danger">{logoutError}</p>}
    </div>
  );
}

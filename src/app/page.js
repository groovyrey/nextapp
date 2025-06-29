"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const res = await fetch('/api/auth');
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.isLogged);
        if (!data.isLogged) {
          router.push('/login');
        }
      } else {
        setIsLoggedIn(false);
        router.push('/login');
      }
    };
    checkLoginStatus();
  }, [router]);

  const handleLogout = async () => {
    const res = await fetch('/api/logout');
    if (res.ok) {
      setIsLoggedIn(false);
      router.push('/login');
    } else {
      alert('Failed to log out.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 py-16 text-center">
        <h1 className="text-4xl font-bold">Test webpage</h1>
        <p className="mt-4">test description</p>
        <button className="btn btn-primary mt-6 font-semibold rounded-lg">Learn More</button>
        {isLoggedIn && (
          <button className="btn btn-secondary mt-6 font-semibold rounded-lg ml-4" onClick={handleLogout}>Logout</button>
        )}
      </header>
    </div>
  );
}

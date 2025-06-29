"use client";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.from(headerRef.current, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header ref={headerRef} className="bg-blue-600 py-16 text-center" style={{ opacity: 0 }}>
        <h1 className="text-4xl font-bold">Test webpage</h1>
        <p className="mt-4">test description</p>
        <button className="btn btn-primary mt-6 font-semibold rounded-lg">Learn More</button>
      </header>
    </div>
  );
}

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to Reymart's site</h1>
        <p className="mt-4">Title</p>
        <button className="btn btn-primary mt-6 font-semibold rounded-lg">Learn More</button>
      </header>
    </div>
  );
}

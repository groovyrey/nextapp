import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to Your Website</h1>
        <p className="mt-4">A modern, clean, and fast landing page for your business.</p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg">Get Started</button>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-md">Feature 1</div>
          <div className="p-6 bg-white rounded-lg shadow-md">Feature 2</div>
          <div className="p-6 bg-white rounded-lg shadow-md">Feature 3</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6 text-center">
        <p>&copy; 2025 Your Website. All rights reserved.</p>
      </footer>
    </div>
  );
}

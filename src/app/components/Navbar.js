'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { user, logout } = useUser();

  return (
    <header className="navbar-grid">
      <div className="navbar-brand-container">
        <Link href="/">
          <i className="bi bi-house-door-fill"></i>Home
        </Link>
      </div>
      <div className="navbar-links">
        <ul>
          <li>
            <Link href="/messages/public">
              Public Messages
            </Link>
          </li>
          <li>
            <Link href="/messages/send">
              Send Message
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-actions">
        {user ? (
          <button onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <i className="bi bi-box-arrow-in-right"></i>Login
            </Link>
            <Link href="/signup">
              <i className="bi bi-person-plus-fill"></i>Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
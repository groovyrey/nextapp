'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <i className="bi bi-house-door-fill me-2"></i>Msgrey
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" href="/login">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light" href="/signup">
                    <i className="bi bi-person-plus-fill me-2"></i>Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
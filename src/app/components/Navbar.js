'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import styles from './Navbar.module.css';
import { gsap } from 'gsap';

export default function Navbar() {
  const { user, logout } = useUser();
  const navbarRef = useRef(null);

  useEffect(() => {
    gsap.from(navbarRef.current, { opacity: 0, y: -50, duration: 0.8, ease: "power3.out" });
  }, []);

  return (
    <header ref={navbarRef} className={styles.navbarGrid}>
      <div className={styles.navbarBrandContainer}>
        <Link href="/">
          <i className="bi bi-house-door-fill"></i>Home
        </Link>
      </div>
      <div className={styles.navbarLinks}>
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
      <div className={styles.navbarActions}>
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
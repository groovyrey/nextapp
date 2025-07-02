'use client';

import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when screen size changes from mobile to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.navbarGrid}>
      <div className={styles.navbarBrandContainer}>
        <Link href="/">
          <i className="bi bi-house-door-fill"></i>Home
        </Link>
        <button 
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.open : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
      <div className={`${styles.navMenu} ${isMobileMenuOpen ? styles.showMobileMenu : ''}`}>
        <div className={styles.navbarLinks}>
          <ul>
            <li>
              <Link href="/messages/public" onClick={() => setIsMobileMenuOpen(false)}>
                Public Messages
              </Link>
            </li>
            <li>
              <Link href="/messages/send" onClick={() => setIsMobileMenuOpen(false)}>
                Send Message
              </Link>
            </li>
            <li>
              <Link href="/user/search" onClick={() => setIsMobileMenuOpen(false)}>
                Search Users
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.navbarActions}>
          {user ? (
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
              <i className="bi bi-box-arrow-right"></i>Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-box-arrow-in-right"></i>Login
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-person-plus-fill"></i>Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
'use client';

import React from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from './LoadingMessage';
import styles from './UserDisplay.module.css';

export default function UserDisplay() {
  const router = useRouter();
  const { user, loading, logout } = useUser();

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <div className={`${styles.userDisplayContainer} card m-2 text-center`}>
      <div className="card-header">
        <h3><i className="bi bi-info-circle me-2"></i>User Information</h3>
      </div>
      {user ? (
        <div className="card-body">
          <p className="card-title">Logged in as: {user.email}</p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-primary" onClick={() => router.push(`/user/${user.uid}`)}><i className="bi-person-vcard me-2"></i> View Profile</button>
            <button className="btn btn-secondary" onClick={() => router.push(`/user/edit`)}><i className="bi-pencil me-2"></i> Edit Profile</button>
            <button className="btn btn-danger" onClick={logout}><i className="bi-box-arrow-right me-2"></i> Logout</button>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <p><i className="bi bi-person-slash me-2"></i>Not logged in.</p>
        </div>
      )}
    </div>
  );
}
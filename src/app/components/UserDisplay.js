'use client';

import React from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import LoadingMessage from './LoadingMessage';

export default function UserDisplay() {
  const router = useRouter();
  const { user, loading, logout } = useUser();

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <div className="card m-2">
      {user ? (
        <>
          <div className="card-body">
          <p className="card-title">Logged in as: {user.email}</p>
          <button className="btn btn-primary me-2" onClick={() => router.push(`/user/${user.uid}`)}><i className="bi-person-vcard"></i> View Profile</button>
          <button className="btn btn-secondary me-2" onClick={() => router.push(`/user/edit`)}><i className="bi-pencil"></i> Edit Profile</button>
          <button className="btn btn-danger" onClick={logout}><i className="bi-box-arrow-right"></i> Logout</button>
          </div>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
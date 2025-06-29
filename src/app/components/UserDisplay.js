'use client';

import React from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';

export default function UserDisplay() {
  const router = useRouter();
  const { user, loading, logout } = useUser();

  import LoadingCard from './LoadingCard';

if (loading) {
    return <LoadingCard message="Loading user..." />;
  }

  return (
    <div className="card m-2">
      {user ? (
        <>
          <div className="card-body">
          <p className="card-title">Logged in as: {user.email}</p>
          <button className="btn btn-primary me-2" onClick={() => router.push(`/user/${user.uid}`)}>View Profile</button>
          <button className="btn btn-secondary me-2" onClick={() => router.push(`/user/edit`)}>Edit Profile</button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
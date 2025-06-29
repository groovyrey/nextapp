'use client';

import React from 'react';
import { useUser } from '../context/UserContext';

export default function UserDisplay() {
  const { user, loading, logout } = useUser();

  if (loading) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="card m-2">
      {user ? (
        <>
          <div className="card-body">
          <p className="card-title">Logged in as: {user.email}</p>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
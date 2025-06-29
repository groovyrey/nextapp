'use client';

import React from 'react';
import { useUser } from '../context/UserContext';

export default function UserDisplay() {
  const { user, loading, logout } = useUser();

  if (loading) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
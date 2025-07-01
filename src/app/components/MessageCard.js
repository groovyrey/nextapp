'use client';

import React from 'react';

export default function MessageCard({ message }) {
  const { date, message: text, private: isPrivate, sender } = message;

  return (
    <div className="card m-2">
      <div className="card-body">
        <p className="card-title">From: {sender}</p>
        <p className="card-text">{text}</p>
        <p className="card-text"><small className="text-muted">{new Date(date.seconds * 1000).toLocaleString()}</small></p>
        {isPrivate && <span className="badge bg-danger">Private</span>}
      </div>
    </div>
  );
}

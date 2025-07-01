'use client';

import React from 'react';

export default function MessageCard({ message }) {
  const { date, message: text, private: isPrivate, sender } = message;

  const { date, message: text, private: isPrivate, sender } = message;

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - (timestamp.seconds * 1000)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " year" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " month" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " day" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hour" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minute" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
  };

  return (
    <div className="card m-2">
      <div className="card-body">
        <p className="card-title">From: {sender}</p>
        <p className="card-text">{text}</p>
        <p className="card-text"><small className="text-muted">{timeAgo(date)}</small></p>
        {isPrivate && <span className="badge bg-danger">Private</span>}
      </div>
    </div>
  );
}

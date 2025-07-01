'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MessageCard({ message }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="card mb-4"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="card-body">
        <h5 className="card-title"><i className="bi bi-person-circle me-2"></i>From: {message.sender==""?<span className="text-primary">?</span>:<span>{message.sender}</span>}</h5>
        <p className="card-text fs-5">{message.message}</p>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {message.date ? formatTimeAgo(message.date) : 'Date N/A'}
          </small>
        </div>
      </div>
    </motion.div>
  );
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function formatTimeAgo(dateString) {
  if (!isValidDate(dateString)) {
    return "Invalid Date";
  }

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000; // seconds in a year
  if (interval >= 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " year ago" : " years ago");
  }
  interval = seconds / 2592000; // seconds in a month
  if (interval >= 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " month ago" : " months ago");
  }
  interval = seconds / 86400; // seconds in a day
  if (interval >= 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
  }
  interval = seconds / 3600; // seconds in an hour
  if (interval >= 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
  }
  interval = seconds / 60; // seconds in a minute
  if (interval >= 1) {
    return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
  }
  return Math.floor(seconds) + (Math.floor(seconds) === 1 ? " second ago" : " seconds ago");
}
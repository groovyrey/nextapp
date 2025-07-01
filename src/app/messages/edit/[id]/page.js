'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function EditMessagePage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm">
        <h1 className="card-title text-center mb-4">Edit Message</h1>
        <p className="text-center text-muted mb-4">Editing message with ID: {id}</p>
        
        <form>
          <div className="mb-3">
            <label htmlFor="messageContent" className="form-label">Message Content</label>
            <textarea className="form-control" id="messageContent" rows="5" placeholder="Enter your message here..."></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="messageSender" className="form-label">Sender (Optional)</label>
            <input type="text" className="form-control" id="messageSender" placeholder="Anonymous" />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

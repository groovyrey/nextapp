'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EditMessagePage() {
  const params = useParams();
  const { id } = params;

  const [messageContent, setMessageContent] = useState('');
  const [messageSender, setMessageSender] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      console.log("Fetching message for ID:", id);
      try {
        const response = await fetch(`/api/messages/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched message data:", data);
        setMessageContent(data.message);
        setMessageSender(data.sender || ''); // Assuming sender might be null or undefined
      } catch (error) {
        console.error("Failed to fetch message:", error);
        // Optionally, handle error in UI, e.g., redirect or show a message
      }
    };

    if (id) {
      fetchMessage();
    }
  }, [id]);

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm">
        <h1 className="card-title text-center mb-4">Edit Message</h1>
        <p className="text-center text-muted mb-4">Editing message with ID: {id}</p>
        
        <form>
          <div className="mb-3">
            <label htmlFor="messageContent" className="form-label">Message Content</label>
            <textarea 
              className="form-control" 
              id="messageContent" 
              rows="5" 
              placeholder="Enter your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="messageSender" className="form-label">Sender (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              id="messageSender" 
              placeholder="Anonymous" 
              value={messageSender}
              onChange={(e) => setMessageSender(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

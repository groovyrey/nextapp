'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LoadingMessage from '../../../components/LoadingMessage';

export default function EditMessagePage() {
  const params = useParams();
  const { id } = params;

  const [messageContent, setMessageContent] = useState('');
  const [messageSender, setMessageSender] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/messages/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessageContent(data.message);
        setMessageSender(data.sender || '');
      } catch (error) {
        console.error("Failed to fetch message:", error);
        setError('Failed to load message.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMessage();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageContent, sender: messageSender }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('Message updated successfully!');
    } catch (error) {
      console.error("Failed to save message:", error);
      setError('Failed to save message.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <div className="text-danger text-center mt-5">Error: {error}</div>;
  }

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm">
        <h1 className="card-title text-center mb-4">Edit Message</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <p className="text-center text-muted mb-4">Editing message with ID: {id}</p>
        
        <form onSubmit={handleSave}>
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
          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSaving}>
            {isSaving ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              ''
            )}{' '}{isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

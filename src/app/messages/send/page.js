"use client";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useUser } from '../../context/UserContext';
import LoadingMessage from '../../components/LoadingMessage';

export default function SendMessage() {
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user, loading } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to send a message.');
      return;
    }
    setIsSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'maindata'), {
        sender: user.email,
        message: message,
        private: isPrivate,
        timestamp: new Date(),
      });
      setMessage('');
      setIsPrivate(false);
      alert('Message sent successfully!');
    } catch (error) {
      setError('Error sending message: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <div className="container">
      <div className="card m-2">
        <div className="card-body">
          <h2 className="card-title">Send a Message</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="sender" className="form-label">Sender</label>
              <input
                type="email"
                id="sender"
                className="form-control"
                value={user ? user.email : ''}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                className="form-control"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="privateSwitch"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="privateSwitch">Private</label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSending}>
              {isSending ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi-send"></i>
              )}{' '}
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
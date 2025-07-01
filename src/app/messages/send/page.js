"use client";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { motion } from 'framer-motion';

export default function SendMessage() {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'maindata'), {
        sender: sender,
        message: message,
        private: isPrivate,
        timestamp: new Date(),
      });
      setMessage('');
      setSender('');
      setIsPrivate(false);
      alert('Message sent successfully!');
    } catch (error) {
      setError('Error sending message: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '80vh' }}
    >
      <div className="card m-2" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-primary text-center mb-4">Send a Message</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="sender" className="form-label">Sender Email or Name</label>
              <input
                type="text"
                id="sender"
                className="form-control"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Your email or name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message Content</label>
              <textarea
                id="message"
                className="form-control"
                rows="5"
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
              <label className="form-check-label" htmlFor="privateSwitch">Private Message</label>
            </div>
            <motion.button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSending ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi-send"></i>
              )}{' '}
              {isSending ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

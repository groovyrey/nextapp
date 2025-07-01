
"use client";
import { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useUser } from '../../context/UserContext';

export default function SendMessage() {
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { user, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to send a message.');
      return;
    }
    try {
      await addDoc(collection(db, 'maindata'), {
        content: message,
        author: user.uid,
        isPublic: isPublic,
        timestamp: new Date(),
      });
      setMessage('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message.');
    }
  };

  return (
    <div>
      <h1>Send a Message</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          required
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public
        </label>
        <br />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

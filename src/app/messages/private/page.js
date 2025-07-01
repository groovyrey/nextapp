
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import MessageCard from '@/app/components/MessageCard';
import LoadingMessage from '@/app/components/LoadingMessage';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext'; // Import useUser

export default function PrivateMessagesPage() {
  const { user, loading: userLoading } = useUser(); // Get user from context
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCursors, setPageCursors] = useState([null]); // pageCursors[0] is for page 1 (no cursor)
  const [hasNextPage, setHasNextPage] = useState(true);

  if (userLoading) {
    return <LoadingMessage />;
  }

  // If user is not authenticated or authLevel is not 1, display unauthorized message
  if (!user || user.authLevel !== 1) {
    return (
      <div className="container text-center my-5">
        <h1 className="text-danger">Unauthorized Access</h1>
        <p>You are not authorized to view this page.</p>
        <Link href="/">Go to Home</Link>
      </div>
    );
  }

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "maindata"),
        where("private", "==", true),
        orderBy("date", "desc"),
        orderBy("__name__", "desc"),
        ...(pageCursors[page - 1] ? [startAfter(pageCursors[page - 1])] : []),
        limit(6) // Fetch one more to check if there is a next page
      );

      const documentSnapshots = await getDocs(q);
      const newMessages = documentSnapshots.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() }));
      
      setMessages(newMessages);

      if (documentSnapshots.docs.length > 5) {
        setHasNextPage(true);
        const nextCursor = documentSnapshots.docs[4];
        if (pageCursors.length <= page) {
            setPageCursors(prev => [...prev, nextCursor]);
        }
      } else {
        setHasNextPage(false);
      }

    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const handleNextPage = () => {
    if (hasNextPage) {
        setPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4 text-primary">Private Messages</h1>
      <div className="text-center my-4">
        <Link href="/messages/public" className="btn btn-outline-primary mx-2">Public</Link>
        <Link href="/messages/private" className="btn btn-primary mx-2">Private</Link>
        <Link href="/messages/send" className="btn btn-outline-primary mx-2">Send a Message</Link>
      </div>
      <div className="row">
        {messages.map(message => (
          <div className="col-md-6 col-lg-4" key={message.id}>
            <MessageCard message={message} />
          </div>
        ))}
      </div>
      {loading && <LoadingMessage />}
      <div className="d-flex justify-content-center my-4">
        <button className="btn btn-primary mx-2" onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <button className="btn btn-primary mx-2" onClick={handleNextPage} disabled={!hasNextPage}>Next</button>
      </div>
    </div>
  );
}

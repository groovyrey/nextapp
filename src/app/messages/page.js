'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import MessageCard from '../components/MessageCard';
import LoadingMessage from '../components/LoadingMessage';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const first = query(collection(db, "maindata"), orderBy("date", "desc"), limit(10));
      const documentSnapshots = await getDocs(first);
      const newMessages = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(newMessages);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
    setLoading(false);
  }, []);

  const fetchMoreMessages = useCallback(async () => {
    if (!lastVisible || loading) return;
    setLoading(true);
    try {
      const next = query(collection(db, "maindata"), orderBy("date", "desc"), startAfter(lastVisible), limit(10));
      const documentSnapshots = await getDocs(next);
      const newMessages = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(prevMessages => [...prevMessages, ...newMessages]);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching more messages: ", error);
    }
    setLoading(false);
  }, [lastVisible, loading]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreMessages();
      }
    }, { threshold: 1 });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, fetchMoreMessages]);

  return (
    <div className="container">
      <h1 className="text-center my-4">Messages</h1>
      <div className="row">
        {messages.map(message => (
          <div className="col-md-6 col-lg-4" key={message.id}>
            <MessageCard message={message} />
          </div>
        ))}
      </div>
      <div ref={loader}>{loading && <LoadingMessage />}</div>
    </div>
  );
}

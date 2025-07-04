
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { database } from '../../../lib/firebase';
import { ref, query, orderByChild, limitToLast, onValue, off, push, remove, update } from 'firebase/database';
import ChatMessage from '../components/ChatMessage';
import MessageSkeleton from '../components/MessageSkeleton';
import LoadingMessage from '../components/LoadingMessage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { initializeTooltips, disposeTooltips } from '../BootstrapClient';

export default function ChatPage() {
    const { user, loading: userLoading } = useUser();
    const [message, setMessage] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageOriginalText, setEditingMessageOriginalText] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();
    const messagesContainerRef = useRef(null);
    const oldestMessageTimestamp = useRef(null);

    const loadMoreMessages = useCallback(() => {
        if (!hasMore || !user) return;

        setMessagesLoading(true);
        const messagesRef = ref(database, 'messages');
        const messagesQuery = query(
            messagesRef,
            orderByChild('timestamp'),
            limitToLast(messages.length + 5)
        );

        onValue(messagesQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => a.timestamp - b.timestamp);

                if (loadedMessages.length === messages.length) {
                    setHasMore(false);
                }
                setMessages(loadedMessages);
            } else {
                setHasMore(false);
            }
            setMessagesLoading(false);
        }, { onlyOnce: true });
    }, [hasMore, user, messages.length]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        const handleScroll = () => {
            if (container.scrollTop === 0 && !messagesLoading) {
                loadMoreMessages();
            }
        };

        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [messagesLoading, loadMoreMessages]);

    useEffect(() => {
        const timer = setTimeout(() => {
            initializeTooltips();
        }, 100); // Small delay to ensure DOM is updated

        return () => {
            clearTimeout(timer);
            disposeTooltips();
        };
    }, [messages]);

    useEffect(() => {
        if (!userLoading && !user) {
            toast.error('You must be logged in to access the chat.');
            router.push('/login');
            return;
        }

        if (user) {
            // Load initial messages
            loadMoreMessages();

            // Setup listener for all messages to handle additions, deletions, and updates
            const messagesRef = ref(database, 'messages');
            const allMessagesQuery = query(messagesRef, orderByChild('timestamp'));

            const unsubscribe = onValue(allMessagesQuery, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const loadedMessages = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).sort((a, b) => a.timestamp - b.timestamp);
                    setMessages(loadedMessages);

                    // Scroll to bottom when new message arrives, but only if user is near bottom
                    if (messagesContainerRef.current) {
                        const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
                        // Only scroll if user is within 100px of the bottom
                        if (scrollHeight - scrollTop <= clientHeight + 100) {
                            messagesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }
                    }
                } else {
                    setMessages([]); // Clear messages if no data
                }
            });

            return () => {
                unsubscribe();
            };
        }
    }, [user, userLoading, router, loadMoreMessages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user || !message.trim()) return;

        if (editingMessageId) {
            // Save edited message
            try {
                await update(ref(database, `messages/${editingMessageId}`), { text: message, isEdited: true });
                toast.success('Message updated successfully!');
                setEditingMessageId(null);
                setEditingMessageOriginalText('');
                setMessage('');
            } catch (error) {
                console.error('Error updating message:', error);
                toast.error('Failed to update message.');
            }
        } else {
            // Send new message
            try {
                await push(ref(database, 'messages'), {
                    text: message,
                    senderId: user.uid,
                    senderName: user.displayName ? user.displayName.split(' ')[0] : user.email,
                    senderAuthLevel: user.authLevel || 'N/A',
                    timestamp: Date.now(),
                });
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
                toast.error('Failed to send message.');
            }
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await remove(ref(database, `messages/${messageId}`));
            toast.success('Message deleted successfully!');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message.');
        }
    };

    const handleEditMessage = (messageToEdit) => {
        setEditingMessageId(messageToEdit.id);
        setEditingMessageOriginalText(messageToEdit.text);
        setMessage(messageToEdit.text);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingMessageOriginalText('');
        setMessage('');
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card m-2" style={{ maxWidth: '600px', width: '100%', minHeight: '80vh' }}>
                <div className="d-flex flex-column flex-grow-1" style={{ overflowY: 'auto' }}>
                <div ref={messagesContainerRef} className="container chat-container py-4 flex-grow-1">
                    {messagesLoading && [...Array(5)].map((_, i) => <MessageSkeleton key={i} isMyMessage={i % 2 === 0} />)}
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            user={user}
                            onDelete={handleDeleteMessage}
                            onEdit={handleEditMessage}
                        />
                    ))}
                </div>
                <div className="p-3 bg-light">
                    {editingMessageId && (
                        <div className="d-flex align-items-center justify-content-between p-2 mb-2 bg-info-subtle rounded">
                            <small className="text-muted text-truncate me-2">
                                Editing: {editingMessageOriginalText}
                            </small>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Cancel edit"
                                onClick={handleCancelEdit}
                            ></button>
                        </div>
                    )}
                    <div className="container">
                        <form onSubmit={sendMessage}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={!user}
                                />
                                <button type="submit" className="btn btn-primary" disabled={!user || !message.trim()}>
                                    {editingMessageId ? <i className="bi bi-save"></i> : <i className="bi bi-send"></i>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

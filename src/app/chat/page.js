
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { database } from '../../../lib/firebase';
import { ref, query, orderByChild, limitToLast, onValue, off, push, remove, update, endBefore, onChildAdded, onChildChanged, onChildRemoved, get } from 'firebase/database';
import ChatMessage from '../components/ChatMessage';
import MessageSkeleton from '../components/MessageSkeleton';
import LoadingMessage from '../components/LoadingMessage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { initializeTooltips, disposeTooltips } from '../BootstrapClient';
import ChatInput from '../components/ChatInput';
import styles from './chat.module.css';

export default function ChatPage() {
    const { user, loading: userLoading, refreshUserData } = useUser();
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageOriginalText, setEditingMessageOriginalText] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();
    const messagesContainerRef = useRef(null);
    const oldestMessageTimestamp = useRef(null);

    const INITIAL_MESSAGE_LOAD_COUNT = 8;
    const LOAD_MORE_COUNT = 5;

    const loadMoreMessages = useCallback(() => {
        if (!hasMore || !user || messagesLoading) return;

        setMessagesLoading(true);
        const messagesRef = ref(database, 'messages');
        const messagesQuery = query(
            messagesRef,
            orderByChild('timestamp'),
            endBefore(oldestMessageTimestamp.current),
            limitToLast(LOAD_MORE_COUNT)
        );

        // Store current scroll state before fetching new messages
        const oldScrollHeight = messagesContainerRef.current?.scrollHeight;
        const oldScrollTop = messagesContainerRef.current?.scrollTop;

        onValue(messagesQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newOlderMessages = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => a.timestamp - b.timestamp);

                if (newOlderMessages.length < LOAD_MORE_COUNT) {
                    setHasMore(false);
                }

                if (newOlderMessages.length > 0) {
                    oldestMessageTimestamp.current = newOlderMessages[0].timestamp;
                }

                setMessages(prevMessages => [...newOlderMessages, ...prevMessages]);

                // After messages are rendered, adjust scroll position
                // Use a setTimeout to ensure DOM has updated
                setTimeout(() => {
                    if (messagesContainerRef.current && oldScrollHeight !== undefined && oldScrollTop !== undefined) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight;
                        messagesContainerRef.current.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
                    }
                }, 0);

            } else {
                setHasMore(false);
            }
            setMessagesLoading(false);
        }, { onlyOnce: true });
    }, [hasMore, user, messagesLoading]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        const handleScroll = () => {
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5 && !messagesLoading && hasMore) {
                loadMoreMessages();
            }
        };

        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [messagesLoading, loadMoreMessages, hasMore]);

    useEffect(() => {
        const timer = setTimeout(() => {
            initializeTooltips();
        }, 100);

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

        if (!userLoading && user) {
            refreshUserData(); // Ensure authLevel is fresh
        }

        const getMessagesFromCache = () => {
            try {
                const cachedMessages = localStorage.getItem('chatMessages');
                return cachedMessages ? JSON.parse(cachedMessages) : [];
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return [];
            }
        };

        const saveMessagesToCache = (messagesToSave) => {
            try {
                localStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
            } catch (error) {
                console.error('Error writing to localStorage:', error);
            }
        };

        if (user) {
            const messagesRef = ref(database, 'messages');

            // Load from cache first
            const cached = getMessagesFromCache();
            if (cached.length > 0) {
                setMessages(cached);
                setMessagesLoading(false);
                if (cached.length > 0) {
                    oldestMessageTimestamp.current = cached[0].timestamp;
                }
            } else {
                setMessagesLoading(true);
            }

            // Initial Load from Firebase
            const initialQuery = query(
                messagesRef,
                orderByChild('timestamp'),
                limitToLast(INITIAL_MESSAGE_LOAD_COUNT)
            );

            const unsubscribeInitial = onValue(initialQuery, (snapshot) => {
                const data = snapshot.val();
                let firebaseMessages = [];
                if (data) {
                    firebaseMessages = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).sort((a, b) => a.timestamp - b.timestamp);
                }

                // Merge cached and firebase messages, prioritizing firebase
                const mergedMessages = [...cached, ...firebaseMessages].reduce((acc, msg) => {
                    if (!acc.some(existingMsg => existingMsg.id === msg.id)) {
                        acc.push(msg);
                    }
                    return acc;
                }, []).sort((a, b) => a.timestamp - b.timestamp);

                setMessages(mergedMessages);
                saveMessagesToCache(mergedMessages); // Save merged messages to cache

                if (mergedMessages.length > 0) {
                    oldestMessageTimestamp.current = mergedMessages[0].timestamp;
                }
                setTimeout(() => {
                    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 0);
                setMessagesLoading(false);
            }, { onlyOnce: true });

            const onChildAddedListener = onChildAdded(messagesRef, (snapshot) => {
                const newMessage = { id: snapshot.key, ...snapshot.val() };
                setMessages(prevMessages => {
                    if (prevMessages.some(msg => msg.id === newMessage.id)) {
                        return prevMessages;
                    }
                    const updatedMessages = [...prevMessages, newMessage].sort((a, b) => a.timestamp - b.timestamp);
                    saveMessagesToCache(updatedMessages); // Update cache on add
                    if (messagesContainerRef.current) {
                        const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
                        // Only scroll if user is within 100px of the bottom (which is scrollTop 0 in flex-column-reverse)
                        if (scrollTop <= 100) {
                            messagesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                    return updatedMessages;
                });
            });

            const onChildChangedListener = onChildChanged(messagesRef, (snapshot) => {
                const updatedMessage = { id: snapshot.key, ...snapshot.val() };
                setMessages(prevMessages => {
                    const newMessages = prevMessages.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg));
                    saveMessagesToCache(newMessages); // Update cache on change
                    return newMessages;
                });
            });

            const onChildRemovedListener = onChildRemoved(messagesRef, (snapshot) => {
                const deletedMessageId = snapshot.key;
                setMessages(prevMessages => {
                    const newMessages = prevMessages.filter(msg => msg.id !== deletedMessageId);
                    saveMessagesToCache(newMessages); // Update cache on remove
                    return newMessages;
                });
            });

            return () => {
                unsubscribeInitial();
                off(messagesRef, 'child_added', onChildAddedListener);
                off(messagesRef, 'child_changed', onChildChangedListener);
                off(messagesRef, 'child_removed', onChildRemovedListener);
            };
        }
    }, [user, userLoading, router]);

    const handleDeleteMessage = async (messageId) => {
        try {
            await remove(ref(database, `messages/${messageId}`));
            toast.success('Message deleted successfully!');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message.');
        }
    };

    const [replyingToMessage, setReplyingToMessage] = useState(null);

    const handleEditMessage = (messageToEdit) => {
        setEditingMessageId(messageToEdit.id);
        setEditingMessageOriginalText(messageToEdit.text);
        setReplyingToMessage(null); // Cancel reply when editing
    };

    const handleReplyToMessage = (messageToReplyTo) => {
        setReplyingToMessage(messageToReplyTo);
        setEditingMessageId(null); // Cancel edit when replying
    };

    const handleReactToMessage = async (messageId, emoji) => {
        if (!user) {
            toast.error('You must be logged in to react.');
            return;
        }
        const messageRef = ref(database, `messages/${messageId}/reactions`);
        const userId = user.uid;

        try {
            const snapshot = await get(messageRef);
            const currentReactions = snapshot.val() || {};
            const newReactions = { ...currentReactions };

            if (!newReactions[emoji]) {
                newReactions[emoji] = {};
            }

            if (newReactions[emoji][userId]) {
                // User already reacted with this emoji, so remove it
                delete newReactions[emoji][userId];
                if (Object.keys(newReactions[emoji]).length === 0) {
                    delete newReactions[emoji];
                }
            } else {
                // Add user's reaction
                newReactions[emoji][userId] = true;
            }

            await update(ref(database, `messages/${messageId}`), { reactions: newReactions });
        } catch (error) {
            console.error('Error reacting to message:', error);
            toast.error('Failed to add/remove reaction.');
        }
    };

    return (
        <div className="d-flex flex-column vh-100 align-items-center justify-content-center">
            <div className="card m-2" style={{ maxWidth: '600px', width: '100%', height: '800px' }}>
                <div className="d-flex flex-column h-100">
                <div ref={messagesContainerRef} className="container chat-container flex-grow-1 d-flex flex-column-reverse pt-10 pb-3" style={{ overflowY: 'auto' }}>
                    {messagesLoading && [...Array(5)].map((_, i) => <MessageSkeleton key={i} isMyMessage={i % 2 === 0} />)}
                    {messages.slice().reverse().map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            message={msg}
                            user={user}
                            onDelete={handleDeleteMessage}
                            onEdit={handleEditMessage}
                            onReply={handleReplyToMessage}
                            onReact={handleReactToMessage}
                        />
                    ))}
                </div>
                <div className="p-3 bg-light">
                    <ChatInput
                        user={user}
                        editingMessageId={editingMessageId}
                        editingMessageOriginalText={editingMessageOriginalText}
                        setEditingMessageId={setEditingMessageId}
                        setEditingMessageOriginalText={setEditingMessageOriginalText}
                        replyingToMessage={replyingToMessage}
                        setReplyingToMessage={setReplyingToMessage}
                    />
                </div>
            </div>
            </div>
        </div>
    );
}

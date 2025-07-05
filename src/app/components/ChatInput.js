'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { database } from '../../../lib/firebase';
import { useUser } from '../context/UserContext';
import { ref, push, update } from 'firebase/database';
import { capitalizeName } from '../utils/capitalizeName';

export default function ChatInput({ editingMessageId, editingMessageOriginalText, setEditingMessageId, setEditingMessageOriginalText, replyingToMessage, setReplyingToMessage }) {
    const { user, userData } = useUser();
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false); // New state for sending status
    const messageInputRef = useRef(null);

    useEffect(() => {
        if (editingMessageId && editingMessageOriginalText) {
            setMessage(editingMessageOriginalText);
            if (messageInputRef.current) {
                messageInputRef.current.focus();
            }
        } else {
            setMessage('');
        }
    }, [editingMessageId, editingMessageOriginalText]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user || !message.trim() || isSending) return; // Prevent sending if already sending

        setIsSending(true); // Set sending state to true

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
            } finally {
                setIsSending(false); // Reset sending state
            }
        } else {
            // Send new message
            try {
                const senderName = user.displayName ? capitalizeName(user.displayName.split(' ')[0]) : capitalizeName(user.email.split('@')[0]);
                const newMessage = {
                    text: message,
                    senderId: user.uid,
                    senderName: senderName,
                    senderAuthLevel: userData.authLevel || 'N/A',
                    timestamp: Date.now(),
                };

                if (replyingToMessage) {
                    newMessage.replyTo = {
                        id: replyingToMessage.id,
                        senderName: replyingToMessage.senderName,
                        text: replyingToMessage.text,
                    };
                }

                await push(ref(database, 'messages'), newMessage);
                setMessage('');
                setReplyingToMessage(null);
            } catch (error) {
                console.error('Error sending message:', error);
                toast.error('Failed to send message.');
            } finally {
                setIsSending(false); // Reset sending state
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingMessageOriginalText('');
        setMessage('');
        setReplyingToMessage(null); // Clear replying state
    };

    const handleCancelReply = () => {
        setReplyingToMessage(null);
        setMessage('');
    };

    return (
        <div className="py-4 px-3 bg-light">
            {(editingMessageId || replyingToMessage) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="d-flex align-items-center justify-content-between p-2 mb-2 bg-info-subtle rounded"
                >
                    <small className="text-muted text-truncate me-2">
                        {editingMessageId ? `Editing: ${editingMessageOriginalText}` : `Replying to: ${replyingToMessage?.senderName || 'Unknown'}: "${replyingToMessage?.text}"`}
                    </small>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label={editingMessageId ? "Cancel edit" : "Cancel reply"}
                        onClick={editingMessageId ? handleCancelEdit : handleCancelReply}
                    ></button>
                </motion.div>
            )}
            <div className="container">
                <form onSubmit={sendMessage}>
                    <div className="text-end text-muted mb-1">
                        <small>{message.length}/500</small> {/* Character counter */}
                    </div>
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!user || isSending} // Disable input while sending
                            ref={messageInputRef}
                            rows="3" // Allow multiple lines
                            style={{ resize: 'none' }} // Prevent manual resizing
                            maxLength={500} // Character limit
                        ></textarea>
                    </div>
                    <div className="d-grid gap-2 mt-2">
                        <button type="submit" className="btn btn-primary" disabled={!user || !message.trim() || isSending}> {/* Disable button while sending */}
                            {isSending ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : editingMessageId ? (
                                <i className="bi bi-save"></i>
                            ) : (
                                <i className="bi bi-send"></i>
                            )}
                            {isSending ? ' Sending...' : editingMessageId ? ' Save' : ' Send'} {/* Change button text */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
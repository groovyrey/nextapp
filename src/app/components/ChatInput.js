'use client';

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { database } from '../../../lib/firebase';
import { useUser } from '../context/UserContext';
import { ref, push, update } from 'firebase/database';
import { capitalizeName } from '../utils/capitalizeName';

export default function ChatInput({ editingMessageId, editingMessageOriginalText, setEditingMessageId, setEditingMessageOriginalText, replyingToMessage, setReplyingToMessage }) {
    const { user, userData } = useUser();
    const [message, setMessage] = useState('');
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
                <div className="d-flex align-items-center justify-content-between p-2 mb-2 bg-info-subtle rounded">
                    <small className="text-muted text-truncate me-2">
                        {editingMessageId ? `Editing: ${editingMessageOriginalText}` : `Replying to: ${replyingToMessage?.senderName || 'Unknown'}: "${replyingToMessage?.text}"`}
                    </small>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label={editingMessageId ? "Cancel edit" : "Cancel reply"}
                        onClick={editingMessageId ? handleCancelEdit : handleCancelReply}
                    ></button>
                </div>
            )}
            <div className="container">
                <form onSubmit={sendMessage}>
                    <div className="text-end text-muted mb-1">
                        <small>{message.length}/500</small> {/* Character counter */}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!user}
                            ref={messageInputRef}
                            maxLength={500} // Added character limit
                        />
                    </div>
                    <div className="d-grid gap-2 mt-2">
                        <button type="submit" className="btn btn-primary" disabled={!user || !message.trim()}>
                            {editingMessageId ? <i className="bi bi-save"></i> : <i className="bi bi-send"></i>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
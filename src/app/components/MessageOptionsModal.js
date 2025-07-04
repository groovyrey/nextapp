'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import MyChatMessage from './MyChatMessage';
import OtherChatMessage from './OtherChatMessage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


import styles from './MessageOptionsModal.module.css';

export default function MessageOptionsModal({ show, onHide, onDelete, onEdit, message, user, showDeleteEdit = true }) {
    const router = useRouter();

    const handleEditClick = () => {
        onEdit(message);
        onHide();
    };

    const handleCopyClick = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(message.text);
                toast.success('Message copied to clipboard!');
            } else {
                // Fallback for browsers that do not support navigator.clipboard
                const textarea = document.createElement('textarea');
                textarea.value = message.text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                toast.success('Message copied to clipboard (fallback)!');
            }
        } catch (err) {
            console.error('Failed to copy message:', err);
            toast.error('Failed to copy message.');
        }
        onHide();
    };

    const handleViewProfileClick = () => {
        if (message && message.senderId) {
            router.push(`/user/${message.senderId}`);
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered contentClassName="bg-white border-0 shadow-sm rounded-3">
            <Modal.Body className="p-3">
                {message && (
                    <div className="mb-3">
                        {message.senderId === user.uid ? (
                            <MyChatMessage message={message} user={user} />
                        ) : (
                            <OtherChatMessage message={message} user={user} />
                        )}
                    </div>
                )}
                {message && (
                    <small className="text-muted text-center d-block mt-2">
                        Sent: {new Date(message.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </small>
                )}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-around align-items-stretch p-2">
                {showDeleteEdit && (
                    <Button variant="danger" size="sm" onClick={() => { onDelete(message.id); onHide(); }} className={`flex-fill mx-1 ${styles.roundedButton}`}>
                        <i className="bi bi-trash me-2"></i>Delete
                    </Button>
                )}
                {showDeleteEdit && (
                    <Button variant="primary" size="sm" onClick={handleEditClick} className={`flex-fill mx-1 ${styles.roundedButton}`}>
                        <i className="bi bi-pencil me-2"></i>Edit
                    </Button>
                )}
                {!showDeleteEdit && (
                    <Button size="sm" onClick={handleViewProfileClick} className={`flex-fill mx-1 ${styles.roundedButton} ${styles.transparentButton}`}>
                        <i className="bi bi-person-circle me-2"></i>View Profile
                    </Button>
                )}
                <Button variant="secondary" size="sm" onClick={handleCopyClick} className={`flex-fill mx-1 ${styles.roundedButton}`}>
                    <i className="bi bi-copy me-2"></i>Copy
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
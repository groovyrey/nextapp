'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

import { motion } from 'framer-motion';
import { AUTH_LEVEL_RANKS } from '../utils/AuthRankSystem';
import MessageOptionsModal from './MessageOptionsModal';
import { capitalizeName } from '../utils/capitalizeName';
import styles from './ChatMessage.module.css';

export default function MyChatMessage({ message, user, onDelete, onEdit, onReact }) {
    const messageCardRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const holdTimeoutRef = useRef(null);

    const handleTouchStart = (e) => {
        e.preventDefault(); // Prevent default to avoid text selection on long press
        holdTimeoutRef.current = setTimeout(() => {
            setShowModal(true);
        }, 1000); // 1000ms for a "hold"
    };

    const handleTouchEnd = () => {
        clearTimeout(holdTimeoutRef.current);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <motion.div
            className={`d-flex justify-content-end mb-1 position-relative`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 1.05 }} // Slightly increase size while holding
        >
            <div
                ref={messageCardRef}
                className={`${styles.messageCard} ${styles.myMessage}`}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseLeave={handleTouchEnd} // Clear timeout if mouse leaves while holding
                >
                <div className="d-flex flex-column">
                    {message.replyTo && (
                        <div className="border-start border-info ps-2 mb-2">
                            <small className="text-info fw-bold">Replying to {message.replyTo.senderName}:</small>
                            <p className="text-muted mb-0 small text-truncate">{message.replyTo.text}</p>
                        </div>
                    )}
                    <small className="fw-bold mb-1">
                        {capitalizeName(message.senderName)} {AUTH_LEVEL_RANKS[message.senderAuthLevel] && <i className={`${AUTH_LEVEL_RANKS[message.senderAuthLevel].icon} ${AUTH_LEVEL_RANKS[message.senderAuthLevel].color}`}></i>}
                    </small>
                    <p className="mb-0">{message.text} {message.isEdited && <small className="text-muted">(Edited)</small>}</p>
                    {message.reactions && (
                        <div className="d-flex mt-2">
                            {Object.entries(message.reactions).map(([emoji, users]) => (
                                <span key={emoji} className="badge bg-light text-dark me-1" style={{ cursor: 'pointer' }}>
                                    {emoji} {Object.keys(users).length}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
            <MessageOptionsModal
                show={showModal}
                onHide={handleCloseModal}
                onDelete={onDelete}
                onEdit={onEdit}
                message={message}
                user={user}
                onReact={onReact}
            />
        </motion.div>
    );
}
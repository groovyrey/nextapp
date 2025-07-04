'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AUTH_LEVEL_RANKS } from '../utils/AuthRankSystem';
import MessageOptionsModal from './MessageOptionsModal';
import styles from './ChatMessage.module.css';

export default function MyChatMessage({ message, user, onDelete, onEdit }) {
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
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd} // Clear timeout if mouse leaves while holding
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={messageCardRef}
                className={`${styles.messageCard} ${styles.myMessage}`}
                >
                <div className="d-flex flex-column">
                    <small className="fw-bold mb-1">
                        {message.senderName} {AUTH_LEVEL_RANKS[message.senderAuthLevel] && <i className={`${AUTH_LEVEL_RANKS[message.senderAuthLevel].icon} ${AUTH_LEVEL_RANKS[message.senderAuthLevel].color}`}></i>}
                    </small>
                    <p className="mb-0">{message.text} {message.isEdited && <small className="text-muted">(Edited)</small>}</p>
                </div>
            </div>
            <MessageOptionsModal
                show={showModal}
                onHide={handleCloseModal}
                onDelete={onDelete}
                onEdit={onEdit}
                message={message}
                user={user}
            />
        </motion.div>
    );
}
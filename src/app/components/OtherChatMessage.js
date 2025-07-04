'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AUTH_LEVEL_RANKS } from '../utils/AuthRankSystem';
import styles from './ChatMessage.module.css';

export default function OtherChatMessage({ message }) {
    const messageCardRef = useRef(null);

    return (
        <motion.div
            className={`d-flex justify-content-start mb-1`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}>
            <div
                ref={messageCardRef}
                className={`${styles.messageCard} ${styles.otherMessage}`}
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={(() => {
                    const messageDate = new Date(message.timestamp);
                    const now = new Date();
                    const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);
                    return messageDate.getTime() > twentyFourHoursAgo
                        ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : messageDate.toLocaleString();
                })()}>
                <div className="d-flex flex-column">
                    <small className="fw-bold mb-1">
                        {message.senderName} {AUTH_LEVEL_RANKS[message.senderAuthLevel] && <i className={`${AUTH_LEVEL_RANKS[message.senderAuthLevel].icon}`}></i>}
                    </small>
                    <p className="mb-0">{message.text}</p>
                </div>
            </div>
        </motion.div>
    );
}
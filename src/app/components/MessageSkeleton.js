
'use client';

import React from 'react';
import styles from './MessageSkeleton.module.css';

const MessageSkeleton = () => {
    return (
        <div className={styles.skeletonContainer}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonTextContainer}>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
            </div>
        </div>
    );
};

export default MessageSkeleton;

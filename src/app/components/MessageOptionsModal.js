'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import MyChatMessage from './MyChatMessage';
import OtherChatMessage from './OtherChatMessage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


import styles from './MessageOptionsModal.module.css';

export default function MessageOptionsModal({ show, onHide, onDelete, onEdit, message, user, showDeleteEdit = true, onReply, onReact }) {
    const router = useRouter();
    const [showReactions, setShowReactions] = useState(false);
    const [reactedUsers, setReactedUsers] = useState({});
    const [userReactionEmoji, setUserReactionEmoji] = useState(null);

    useEffect(() => {
        if (user && message && message.reactions) {
            let foundEmoji = null;
            for (const [emoji, userIdsObject] of Object.entries(message.reactions)) {
                if (userIdsObject && userIdsObject[user.uid]) {
                    foundEmoji = emoji;
                    break;
                }
            }
            setUserReactionEmoji(foundEmoji);
        } else {
            setUserReactionEmoji(null);
        }
    }, [message, user]);

    useEffect(() => {
        const fetchReactedUsers = async () => {
            if (show && message && message.reactions) {
                const allUserIds = new Set();
                Object.values(message.reactions).forEach(reactionValue => {
                    if (Array.isArray(reactionValue)) {
                        reactionValue.forEach(id => allUserIds.add(String(id)));
                    } else if (typeof reactionValue === 'object' && reactionValue !== null) {
                        Object.keys(reactionValue).forEach(userId => allUserIds.add(String(userId)));
                    }
                });

                const usersData = {};
                for (const userId of Array.from(allUserIds)) {
                    try {
                        const response = await fetch(`/api/user/${userId}`);
                        if (response.ok) {
                            const userData = await response.json();
                            const userProfile = userData.user || userData; // Assume userData might be nested under a 'user' key
                            usersData[userId] = {
                                firstName: userProfile.firstName || '',
                                lastName: userProfile.lastName || '',
                                displayName: userProfile.displayName || `User ${userId}`,
                            };
                        } else {
                            console.error(`Failed to fetch user ${userId}:`, response.statusText);
                            usersData[userId] = { displayName: `User ${userId}` }; // Fallback
                        }
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error);
                        usersData[userId] = { displayName: `User ${userId}` }; // Fallback
                    }
                }
                setReactedUsers(usersData);
            }
        };

        fetchReactedUsers();
    }, [show, message]);





    

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
                            <MyChatMessage message={message} user={user} onReact={onReact} isPreview={true} />
                        ) : (
                            <OtherChatMessage message={message} user={user} onReact={onReact} isPreview={true} />
                        )}
                    </div>
                )}
                {message && (
                    <small className="text-muted text-center d-block mt-2">
                        Sent: {new Date(message.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </small>
                )}
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column align-items-stretch p-2">
                <div className="dropup-center dropup w-100 mb-2">
                    <button className="btn btn-link text-start w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-emoji-smile me-2"></i>{userReactionEmoji ? `Reacted: ${userReactionEmoji}` : 'React'}
                    </button>
                    <ul className="dropdown-menu w-100">
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '👍'); onHide(); }}>👍 Like</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '❤️'); onHide(); }}>❤️ Love</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '😂'); onHide(); }}>😂 Laugh</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '😮'); onHide(); }}>😮 Wow</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '😢'); onHide(); }}>😢 Sad</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => { onReact(message.id, '😡'); onHide(); }}>😡 Angry</a></li>
                    </ul>
                </div>
                {showDeleteEdit && (
                    <button className="btn btn-link text-danger text-start w-100 mb-2" onClick={() => { onDelete(message.id); onHide(); }}>
                        <i className="bi bi-trash me-2"></i>Delete
                    </button>
                )}
                {showDeleteEdit && (
                    <button className="btn btn-link text-primary text-start w-100 mb-2" onClick={handleEditClick}>
                        <i className="bi bi-pencil me-2"></i>Edit
                    </button>
                )}
                {!showDeleteEdit && (
                    <button className="btn btn-link text-primary text-start w-100 mb-2" onClick={handleViewProfileClick}>
                        <i className="bi bi-person-circle me-2"></i>View Profile
                    </button>
                )}
                <button className="btn btn-link text-primary text-start w-100 mb-2" onClick={() => { onReply(message); onHide(); }}>
                    <i className="bi bi-reply-fill me-2"></i>Reply
                </button>
                <button className="btn btn-link text-primary text-start w-100 mb-2" onClick={handleCopyClick}>
                    <i className="bi bi-copy me-2"></i>Copy
                </button>
                {message && message.reactions && Object.keys(message.reactions).length > 0 && (
                    <button className="btn btn-link text-primary text-start w-100" onClick={() => setShowReactions(!showReactions)}>
                        <i className="bi bi-emoji-heart-eyes me-2"></i>View Reactions ({Object.keys(message.reactions).length})
                    </button>
                )}
            </Modal.Footer>
            {showReactions && message && message.reactions && Object.keys(message.reactions).length > 0 && (
                <Modal.Body className="p-3 border-top">
                    <h5>Reactions:</h5>
                    {Object.entries(message.reactions).map(([emoji, userIds]) => (
                        <div key={emoji} className="d-flex align-items-center mb-2">
                            <span className="me-2 fs-5">{emoji}</span>
                            <span className="badge bg-primary rounded-pill me-2">{userIds.length}</span>
                            <div className="d-flex flex-wrap ms-2">
                                {((Array.isArray(userIds) ? userIds : Object.keys(userIds)).map(id => {
                                    const processedId = typeof id === 'object' && id !== null && id.id ? id.id : id;
                                    return String(processedId); // Ensure it's a string
                                })).map((userId, index, arr) => {
                                    const userProfile = reactedUsers[userId];
                                    let userDisplayName = `User ${userId}`;

                                    if (userProfile) {
                                        if (userProfile.firstName && userProfile.lastName) {
                                            userDisplayName = `${userProfile.firstName} ${userProfile.lastName}`;
                                        } else if (userProfile.displayName) {
                                            userDisplayName = userProfile.displayName;
                                        } else if (userProfile.name) {
                                            userDisplayName = userProfile.name;
                                        }
                                    }
                                    return (
                                        <small key={userId} className="text-muted me-2">
                                            {userDisplayName}
                                            {index < arr.length - 1 ? ',' : ''}
                                        </small>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </Modal.Body>
            )}
        </Modal>
    );
}
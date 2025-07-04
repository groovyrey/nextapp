'use client';

import React from 'react';
import MyChatMessage from './MyChatMessage';
import OtherChatMessage from './OtherChatMessage';

export default function ChatMessage({ message, user, onDelete, onEdit }) {
    const isMyMessage = user && message.senderId === user.uid;

    if (isMyMessage) {
        return <MyChatMessage message={message} user={user} onDelete={onDelete} onEdit={() => onEdit(message)} />;
    } else {
        return <OtherChatMessage message={message} />;
    }
}
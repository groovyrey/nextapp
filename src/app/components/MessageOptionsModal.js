'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import MyChatMessage from './MyChatMessage';


export default function MessageOptionsModal({ show, onHide, onDelete, onEdit, message, user }) {

    const handleEditClick = () => {
        onEdit(message);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered contentClassName="bg-white border-0 shadow-sm rounded-3">
            <Modal.Body className="p-3">
                {message && user && (
                    <div className="mb-3">
                        <MyChatMessage message={message} user={user} />
                    </div>
                )}
                {message && (
                    <small className="text-muted text-center d-block mt-2">
                        Sent: {new Date(message.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </small>
                )}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-around p-2">
                <Button variant="danger" size="sm" onClick={() => { onDelete(message.id); onHide(); }}>
                    <i className="bi bi-trash me-2"></i>Delete
                </Button>
                <Button variant="primary" size="sm" onClick={handleEditClick}>
                    <i className="bi bi-pencil me-2"></i>Edit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
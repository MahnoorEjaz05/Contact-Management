import React, { useState } from 'react';
import axios from '../../axiosSetup';

interface DeleteContactModalProps {
  contact: any;
  onConfirm: (contactId: number) => void;
  onClose: () => void;
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({ contact, onConfirm, onClose }) => {
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    try {
      await axios.delete(`/contacts/${contact.id}`);
      onConfirm(contact.id);
    } catch (err: any) {
      setError('Failed to delete contact. Try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Delete Contact</h3>
        <p>Are you sure you want to delete {contact.firstName} {contact.lastName}?</p>

        <button onClick={handleDelete} className="primary">Yes, Delete</button>
        <button onClick={onClose} className="secondary">Cancel</button>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default DeleteContactModal;

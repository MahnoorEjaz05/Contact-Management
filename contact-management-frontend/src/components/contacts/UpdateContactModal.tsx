import React, { useState, useEffect } from 'react';
import axios from '../../axiosSetup';

interface UpdateContactModalProps {
  contact: any;
  onSave: (contact: any) => void;
  onClose: () => void;
}

const UpdateContactModal: React.FC<UpdateContactModalProps> = ({ contact, onSave, onClose }) => {
  const [updatedContact, setUpdatedContact] = useState(contact);
  const [error, setError] = useState('');

  useEffect(() => {
    setUpdatedContact(contact); // Update state if contact changes
  }, [contact]);

  const handleSave = async () => {
    setError('');
    try {
      const response = await axios.put(`/contacts/${updatedContact.id}`, updatedContact);
      onSave(response.data);
    } catch (err: any) {
      setError('Failed to update contact. Try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Update Contact</h3>

        <input
          type="text"
          placeholder="First Name"
          value={updatedContact.firstName}
          onChange={(e) => setUpdatedContact({ ...updatedContact, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={updatedContact.lastName}
          onChange={(e) => setUpdatedContact({ ...updatedContact, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={updatedContact.email}
          onChange={(e) => setUpdatedContact({ ...updatedContact, email: e.target.value })}
        />

        <button onClick={handleSave} className="primary">Save</button>
        <button onClick={onClose} className="secondary">Cancel</button>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default UpdateContactModal;

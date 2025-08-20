import React, { useState } from 'react';
import axios from '../../axiosSetup';

interface CreateContactModalProps {
  onSave: (contact: any) => void;
  onClose: () => void;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({ onSave, onClose }) => {
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    try {
      const response = await axios.post('/contacts', contact);
      onSave(response.data); // Pass newly created contact back to Dashboard
    } catch (err: any) {
      setError('Failed to create contact. Try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create Contact</h3>

        <input
          type="text"
          placeholder="First Name"
          value={contact.firstName}
          onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={contact.lastName}
          onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />

        <button onClick={handleSave} className="primary">Save</button>
        <button onClick={onClose} className="secondary">Cancel</button>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default CreateContactModal;

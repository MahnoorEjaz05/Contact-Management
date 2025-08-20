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
      onSave(response.data);
    } catch (err: any) {
      setError('Failed to create contact. Try again.');
    }
  };

  return (
    <>
      {/* quick styles (scoped to this component instance) */}
      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .cm-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.45);
            display: flex; align-items: center; justify-content: center;
            padding: 16px; z-index: 1000;
          }
          .cm-modal {
            width: 100%; max-width: 520px;
            background: #ffffff;
            border-radius: 14px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.25);
            animation: modalFadeIn 160ms ease-out;
            overflow: hidden;
          }
          .cm-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 18px;
            border-bottom: 1px solid #eef0f5;
            background: linear-gradient(135deg, #f7f9ff, #ffffff);
          }
          .cm-title {
            margin: 0; font-size: 18px; font-weight: 700; color: #1e3c72;
          }
          .cm-close {
            appearance: none; border: none; background: transparent;
            width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center;
          }
          .cm-close:hover { background: #f2f4fa; }
          .cm-body {
            padding: 18px;
          }
          .cm-field {
            display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;
          }
          .cm-label {
            font-size: 13px; color: #334; font-weight: 600;
          }
          .cm-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d7dce9; border-radius: 8px;
            outline: none; font-size: 14px;
          }
          .cm-input:focus {
            border-color: #6f8cff;
            box-shadow: 0 0 0 3px rgba(111,140,255,0.25);
          }
          .cm-footer {
            display: flex; gap: 10px; justify-content: flex-end;
            padding: 16px 18px; border-top: 1px solid #eef0f5;
            background: #fafbff;
          }
          .cm-btn {
            padding: 10px 14px; border-radius: 8px; cursor: pointer;
            font-weight: 600; font-size: 14px;
          }
          .cm-btn.primary {
            background: #1e3c72; color: #fff; border: none;
            box-shadow: 0 2px 8px rgba(30,60,114,0.25);
          }
          .cm-btn.primary:hover { filter: brightness(1.05); }
          .cm-btn.secondary {
            background: #f5f7ff; color: #1e3c72;
            border: 1px solid #cdd6f6;
          }
          .cm-btn.secondary:hover { background: #eef1ff; }
          .cm-error {
            margin: 8px 18px 0;
            background: #ffe6e6; color: #a40000;
            border: 1px solid #ffb3b3; border-radius: 8px;
            padding: 10px 12px;
          }
        `}
      </style>

      <div className="cm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cm-header">
            <h3 className="cm-title">Create Contact</h3>
            <button className="cm-close" aria-label="Close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="cm-body">
            <div className="cm-field">
              <label className="cm-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                className="cm-input"
                type="text"
                placeholder="e.g. Ahsan"
                value={contact.firstName}
                onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
              />
            </div>

            <div className="cm-field">
              <label className="cm-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                className="cm-input"
                type="text"
                placeholder="e.g. Khan"
                value={contact.lastName}
                onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
              />
            </div>

            <div className="cm-field">
              <label className="cm-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="cm-input"
                type="email"
                placeholder="name@example.com"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>

            {error && <div className="cm-error">{error}</div>}
          </div>

          {/* Footer */}
          <div className="cm-footer">
            <button className="cm-btn secondary" onClick={onClose}>Cancel</button>
            <button className="cm-btn primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateContactModal;

import React from 'react';

// Defining the types for the props
interface ContactModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;  // Function that takes no arguments and returns nothing
  children: React.ReactNode;  // To render the content dynamically
}

const ContactModal: React.FC<ContactModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;  // If the modal is not open, don't render it

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}  {/* Render the dynamic content passed to the modal */}
        <button className="secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ContactModal;

import React, { useState, useEffect } from 'react';
import axios from '../../axiosSetup';
import UserProfile from './UserProfile';
import ChangePasswordModal from './ChangePasswordModal';
import CreateContactModal from '../contacts/CreateContactModal';
import UpdateContactModal from '../contacts/UpdateContactModal';
import DeleteContactModal from '../contacts/DeleteContactModal';

const UserDashboard: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Fetch user-specific contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/contacts/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(response.data);
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      }
    };
    fetchContacts();
  }, []);

  const handleCreateContact = (newContact: any) => {
    setContacts([...contacts, newContact]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateContact = (updatedContact: any) => {
    setContacts(
      contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
    setIsUpdateModalOpen(false);
  };

  const handleDeleteContact = (deletedContactId: number) => {
    setContacts(contacts.filter((c) => c.id !== deletedContactId));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="user-dashboard-container">
      <h2>My Dashboard</h2>

      <div className="dashboard-actions">
        <button onClick={() => setIsProfileModalOpen(true)}>My Profile</button>
        <button onClick={() => setIsChangePasswordModalOpen(true)}>Change Password</button>
        <button onClick={() => setIsCreateModalOpen(true)}>Add Contact</button>
      </div>

      <ul className="contact-list">
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName} - {contact.email}
            <button onClick={() => { setSelectedContact(contact); setIsUpdateModalOpen(true); }}>
              Edit
            </button>
            <button onClick={() => { setSelectedContact(contact); setIsDeleteModalOpen(true); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Modals */}
      {isProfileModalOpen && (
        <UserProfile {...({ onClose: () => setIsProfileModalOpen(false) } as any)} />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal {...({ onClose: () => setIsChangePasswordModalOpen(false) } as any)} />
      )}
      {isCreateModalOpen && (
        <CreateContactModal
          {...({
            onSave: handleCreateContact,
            onClose: () => setIsCreateModalOpen(false),
          } as any)}
        />
      )}
      {isUpdateModalOpen && selectedContact && (
        <UpdateContactModal
          {...({
            contact: selectedContact,
            onSave: handleUpdateContact,
            onClose: () => setIsUpdateModalOpen(false),
          } as any)}
        />
      )}
      {isDeleteModalOpen && selectedContact && (
        <DeleteContactModal
          {...({
            contact: selectedContact,
            onConfirm: handleDeleteContact,
            onClose: () => setIsDeleteModalOpen(false),
          } as any)}
        />
      )}
    </div>
  );
};

export default UserDashboard;

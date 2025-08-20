import React, { useState, useEffect } from 'react';
import axios from '../../axiosSetup'; // centralized axios instance
import CreateContactModal from './CreateContactModal';
import UpdateContactModal from './UpdateContactModal';
import DeleteContactModal from './DeleteContactModal';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>('/contacts');
        setContacts(response.data);
      } catch (err) {
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleCreateContact = async (newContact: Omit<Contact, 'id'>) => {
    try {
      const response = await axios.post<Contact>('/contacts', newContact);
      setContacts([...contacts, response.data]);
      setIsCreateModalOpen(false);
    } catch {
      setError('Failed to create contact');
    }
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      const response = await axios.put<Contact>(`/contacts/${updatedContact.id}`, updatedContact);
      setContacts(
        contacts.map((c) => (c.id === updatedContact.id ? response.data : c))
      );
      setIsUpdateModalOpen(false);
    } catch {
      setError('Failed to update contact');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      await axios.delete(`/contacts/${contactId}`);
      setContacts(contacts.filter((c) => c.id !== contactId));
      setIsDeleteModalOpen(false);
    } catch {
      setError('Failed to delete contact');
    }
  };

  if (loading) return <div>Loading contacts...</div>;

  return (
    <div className="dashboard-container">
      <h2>Contacts Dashboard</h2>
      {error && <div className="error-message">{error}</div>}

      <button onClick={() => setIsCreateModalOpen(true)}>Create Contact</button>
      <input type="text" placeholder="Search" />

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName} - {contact.email}
            <button onClick={() => { setSelectedContact(contact); setIsUpdateModalOpen(true); }}>
              Update
            </button>
            <button onClick={() => { setSelectedContact(contact); setIsDeleteModalOpen(true); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isCreateModalOpen && (
        <CreateContactModal
          onSave={handleCreateContact}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && selectedContact && (
        <UpdateContactModal
          contact={selectedContact}
          onSave={handleUpdateContact}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedContact && (
        <DeleteContactModal
          contact={selectedContact}
          onConfirm={handleDeleteContact}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

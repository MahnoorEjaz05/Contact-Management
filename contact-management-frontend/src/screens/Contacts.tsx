import React, { useEffect, useMemo, useState } from 'react';
import axios from '../axiosSetup';
import CreateContactModal from '../components/contacts/CreateContactModal';
import UpdateContactModal from '../components/contacts/UpdateContactModal';
import DeleteContactModal from '../components/contacts/DeleteContactModal';
import { Link } from 'react-router-dom'; // ✅ added

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // cards per page

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('/contacts', { headers: getAuthHeaders() });
        setContacts(res.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data || 'Failed to fetch contacts. Make sure you are logged in.');
      }
    };
    fetchContacts();
  }, []);

  // Filter (client-side)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const values = [
        c.firstName, c.lastName, c.email, c.phone, c.company, c.notes
      ].filter(Boolean).join(' ').toLowerCase();
      return values.includes(q);
    });
  }, [contacts, query]);

  // Pagination (client-side)
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  // Handlers for CRUD
  const handleCreateContact = async (newContact: any) => {
    try {
      const res = await axios.post('/contacts', newContact, { headers: getAuthHeaders() });
      setContacts((prev) => [...prev, res.data]);
      setIsCreateModalOpen(false);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Failed to create contact.');
    }
  };

  const handleUpdateContact = async (updatedContact: any) => {
    try {
      const res = await axios.put(`/contacts/${updatedContact.id}`, updatedContact, {
        headers: getAuthHeaders(),
      });
      setContacts((prev) => prev.map((c) => (c.id === updatedContact.id ? res.data : c)));
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Failed to update contact.');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      await axios.delete(`/contacts/${contactId}`, { headers: getAuthHeaders() });
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
      setIsDeleteModalOpen(false);
      setPage((p) => Math.min(p, Math.max(1, Math.ceil((total - 1) / pageSize))));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Failed to delete contact.');
    }
  };

  // Reset to page 1 whenever filter or page size changes
  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          padding: '24px',
        }}
      >
        {/* Header & Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto', // ⬅️ space for Profile button
            gap: '12px',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: '#1e3c72' }}>Contact Management System</h1>
            <p style={{ margin: '6px 0 0', color: '#555' }}>Contacts</p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: '#1e3c72',
              color: '#fff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(30,60,114,0.3)',
              height: '42px',
            }}
          >
            + Create Contact
          </button>

          {/* ✅ New: Profile navigation */}
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              border: '1px solid #cdd6f6',
              background: '#f4f6ff',
              color: '#1e3c72',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              height: '42px',
            }}
            title="Go to your profile"
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#1e3c72',
                display: 'inline-block',
              }}
            />
            Profile
          </Link>
        </div>

        {/* Search + Page size */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts (name, email, phone, company...)"
            style={{
              flex: '1 1 320px',
              minWidth: '240px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="pagesize" style={{ color: '#333', fontSize: 14 }}>
              Page size
            </label>
            <select
              id="pagesize"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#fff',
              }}
            >
              {[6, 9, 12, 18, 24].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#ffe6e6',
              color: '#a40000',
              border: '1px solid #ffb3b3',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* List / Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            minHeight: '120px',
          }}
        >
          {pageItems.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '24px',
                color: '#666',
                border: '1px dashed #ddd',
                borderRadius: '12px',
              }}
            >
              {contacts.length === 0
                ? 'No contacts yet. Click “Create Contact” to add your first one.'
                : 'No results for your search.'}
            </div>
          ) : (
            pageItems.map((contact) => (
              <div
                key={contact.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e3c72' }}>
                    {(contact.firstName || contact.firstname || '')}{' '}
                    {(contact.lastName || contact.lastname || '')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
                    {contact.email}
                  </div>
                </div>

                {contact.phone && (
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    📞 {contact.phone}
                  </div>
                )}
                {contact.company && (
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    🏢 {contact.company}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                    marginTop: '12px',
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsUpdateModalOpen(true);
                    }}
                    style={{
                      background: '#f4f6ff',
                      color: '#1e3c72',
                      border: '1px solid #b9c5ff',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsDeleteModalOpen(true);
                    }}
                    style={{
                      background: '#fff5f5',
                      color: '#b00020',
                      border: '1px solid #ffcccc',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '18px',
          }}
        >
          <div style={{ color: '#555', fontSize: 14 }}>
            Showing{' '}
            <strong>
              {total === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, total)}
            </strong>{' '}
            of <strong>{total}</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                background: currentPage <= 1 ? '#f5f5f5' : '#fff',
                color: '#333',
                borderRadius: '8px',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ◀ Prev
            </button>
            <div
              style={{
                padding: '8px 12px',
                border: '1px solid #eee',
                borderRadius: '8px',
                background: '#fafafa',
                minWidth: 90,
                textAlign: 'center',
              }}
            >
              Page <strong>{currentPage}</strong> / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                background: currentPage >= totalPages ? '#f5f5f5' : '#fff',
                color: '#333',
                borderRadius: '8px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateContactModal onSave={handleCreateContact} onClose={() => setIsCreateModalOpen(false)} />
      )}
      {isUpdateModalOpen && (
        <UpdateContactModal contact={selectedContact} onSave={handleUpdateContact} onClose={() => setIsUpdateModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <DeleteContactModal contact={selectedContact} onConfirm={handleDeleteContact} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
};

export default Contacts;

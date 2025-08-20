import React, { useEffect, useState } from 'react';
import axios from '../axiosSetup';
import { useNavigate } from 'react-router-dom';

type UserProfile = {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Change-password modal state
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/profile', { headers: authHeaders() });
        setProfile(res.data || {});
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      setSuccess('');
      await axios.put(
        '/users/change-password',
        { currentPassword, newPassword },
        { headers: authHeaders() }
      );
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setShowPwdModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error changing password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        fontFamily: 'Arial, sans-serif',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '32px',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '520px',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8, color: '#1e3c72' }}>
          Contact Management System
        </h1>
        <h2 style={{ marginTop: 0, color: '#333' }}>User Profile</h2>

        {loading ? (
          <div style={{ color: '#555' }}>Loading profile…</div>
        ) : (
          <>
            {/* Alerts */}
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
            {success && (
              <div
                style={{
                  background: '#e9f9ee',
                  color: '#0b6b2e',
                  border: '1px solid #b9e5c8',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                {success}
              </div>
            )}

            {/* Profile card */}
            <div
              style={{
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ marginBottom: 8, fontSize: 16, color: '#1e3c72', fontWeight: 700 }}>
                {profile.firstname || profile.lastname
                  ? `${profile.firstname || ''} ${profile.lastname || ''}`.trim()
                  : profile.username || '—'}
              </div>
              <div style={{ color: '#555', marginBottom: 6 }}>
                <strong>Username:</strong> {profile.username || '—'}
              </div>
              <div style={{ color: '#555' }}>
                <strong>Email:</strong> {profile.email || '—'}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setShowPwdModal(true);
                  setSuccess('');
                  setError('');
                }}
                style={{
                  backgroundColor: '#1e3c72',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(30,60,114,0.3)',
                }}
              >
                Change Password
              </button>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#fff5f5',
                  color: '#b00020',
                  border: '1px solid #ffcccc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Password Change Modal */}
      {showPwdModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
          onClick={() => setShowPwdModal(false)} // click outside to close
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 12,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()} // prevent overlay close on inner click
          >
            <h3 style={{ marginTop: 0, color: '#1e3c72' }}>Change Password</h3>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPwdModal(false)}
                style={{
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                style={{
                  background: '#1e3c72',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

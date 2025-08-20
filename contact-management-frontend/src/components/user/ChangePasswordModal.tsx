import React, { useState } from 'react';
import axios from '../../axiosSetup';

const ChangePasswordModal: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/users/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setMessage('Current password is incorrect.');
      } else {
        setMessage('Failed to change password. Try again.');
      }
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {message && <div className="message">{message}</div>}

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default ChangePasswordModal;

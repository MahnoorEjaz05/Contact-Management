import React, { useEffect, useState } from 'react';
import axios from '../../axiosSetup';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {message && <div className="message">{message}</div>}

      <input
        type="text"
        placeholder="Username"
        value={profile.username}
        disabled={!editMode}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={profile.email}
        disabled={!editMode}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />

      {editMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default UserProfile;

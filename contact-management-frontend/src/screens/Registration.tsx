import React, { useState } from 'react';
import axios from '../axiosSetup';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/users/register', { username, email, password });
      const message = response.data?.message || 'Registration successful! Please log in.';
      setSuccess(message);

      setUsername('');
      setEmail('');
      setPassword('');
      setError('');

      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const backendError =
        err.response?.data?.message ||
        'Registration failed. Username or email may already exist.';
      setError(backendError);
      setSuccess('');
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
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '10px', color: '#1e3c72' }}>
          Contact Management System
        </h1>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          className="primary"
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '10px',
            marginLeft: '-2px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#1e3c72',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>

        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

        <p style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1e3c72', fontWeight: 'bold' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

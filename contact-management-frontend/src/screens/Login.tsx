import React, { useState } from 'react';
import axios from '../axiosSetup';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/contacts');
    } catch (err) {
      setError('Invalid credentials or server error');
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
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#1e3c72',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            marginLeft:'-2px'
          }}
        >
          Login
        </button>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
        )}

        <p style={{ marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1e3c72', fontWeight: 'bold' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axiosSetup'; // Using centralized axios instance

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('/api/users/login', { username, password });
      
      // Extract token from response
      const token = response.data.replace('Bearer ', '');
      localStorage.setItem('token', token); // Save JWT in localStorage

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Server error, please try again later');
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary" onClick={handleLogin}>
        Login
      </button>

      {error && <div className="error-message">{error}</div>}

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;

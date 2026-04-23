import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    Brukernavn: '',
    Passord: '',
    Rolle: 'user', // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      if (response.data.success) {
        login(response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Brukernavn">Username:</label>
            <input
              type="text"
              id="Brukernavn"
              name="Brukernavn"
              value={formData.Brukernavn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Passord">Password:</label>
            <input
              type="password"
              id="Passord"
              name="Passord"
              value={formData.Passord}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Rolle">Role:</label>
            <select
              id="Rolle"
              name="Rolle"
              value={formData.Rolle}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
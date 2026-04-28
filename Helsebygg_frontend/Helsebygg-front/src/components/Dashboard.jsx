import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { avvikAPI } from '../services/api';

const Dashboard = () => {
  const [avvik, setAvvik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchAvvik();
  }, [user, navigate]);

  const fetchAvvik = async () => {
    try {
      const response = await avvikAPI.getAll();
      setAvvik(response.data);
    } catch (err) {
      setError('Failed to fetch avvik');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Helsebygg Avvik</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/create-avvik')} className="btn-primary">
            Create New Avvik
          </button>
          <button onClick={() => navigate('/statistics')} className="btn-secondary">
            View Statistics
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        <div className="avvik-list">
          <h2>Avvik List</h2>
          {avvik.length === 0 ? (
            <p>No avvik found.</p>
          ) : (
            <div className="avvik-grid">
              {avvik.map((item) => (
                <div key={item.Avvik_id} className="avvik-card">
                  <h3>{item.Tittel}</h3>
                  <p><strong>Description:</strong> {item.Beskrivelse}</p>
                  <p><strong>Date:</strong> {new Date(item.Dato).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {item.Status}</p>
                  <p><strong>Priority:</strong> {item.Prioritering}</p>
                  <p><strong>Category:</strong> {item.Kategori}</p>
                  <p><strong>Department:</strong> {item.Avdeling}</p>
                  <button
                    onClick={() => navigate(`/avvik/${item.Avvik_id}`)}
                    className="btn-details"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
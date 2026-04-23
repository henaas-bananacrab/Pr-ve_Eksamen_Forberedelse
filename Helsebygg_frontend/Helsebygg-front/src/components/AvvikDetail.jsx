import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { avvikAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AvvikDetail = () => {
  const [avvik, setAvvik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAvvikDetail();
  }, [id]);

  const fetchAvvikDetail = async () => {
    try {
      const response = await avvikAPI.getById(id);
      setAvvik(response.data);
    } catch (err) {
      setError('Failed to fetch avvik details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatusId) => {
    setUpdatingStatus(true);
    try {
      await avvikAPI.updateStatus(id, newStatusId);
      // Refresh the avvik data
      await fetchAvvikDetail();
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!avvik) {
    return <div className="error-message">Avvik not found</div>;
  }

  return (
    <div className="avvik-detail">
      <header className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>{avvik.Tittel}</h1>
      </header>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Description</h2>
          <p>{avvik.Beskrivelse}</p>
        </div>

        <div className="detail-section">
          <h2>Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Date:</strong> {new Date(avvik.Dato).toLocaleDateString()}
            </div>
            <div className="detail-item">
              <strong>Status:</strong> {avvik.Status || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Priority:</strong> {avvik.Prioritering || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Category:</strong> {avvik.Kategori || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Department:</strong> {avvik.Avdeling || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Admin functionality to update status */}
        {user && (
          <div className="detail-section">
            <h2>Update Status</h2>
            <div className="status-update">
              <select
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={updatingStatus}
                defaultValue=""
              >
                <option value="" disabled>Select new status</option>
                <option value={1}>Open</option>
                <option value={2}>In Progress</option>
                <option value={3}>Closed</option>
              </select>
              {updatingStatus && <span>Updating...</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvvikDetail;
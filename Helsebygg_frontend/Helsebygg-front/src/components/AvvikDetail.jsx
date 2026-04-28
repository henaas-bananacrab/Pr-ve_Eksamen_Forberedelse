import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { avvikAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const statusLabels = {
  1: 'sent',
  2: 'aktiv',
  3: 'løst'
};

const priorityLabels = {
  1: 'lav',
  2: 'middels',
  3: 'høy'
};

const categoryLabels = {
  1: 'Pasient problemer',
  2: 'Utstyrsproblemer',
  3: 'Forespørsel om nytt utstyr'
};

const departmentLabels = {
  1: 'etarse 1',
  2: 'etarse 2',
  3: 'etarse 3',
  4: 'etarse 4',
  5: 'etarse 5'
};

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
              <strong>Status:</strong> {avvik.Status || statusLabels[avvik.Status_Status_id] || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Priority:</strong> {avvik.Prioritering || priorityLabels[avvik.Prioritering_Prioritering_id] || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Category:</strong> {avvik.Kategori || categoryLabels[avvik.Kategori_Kategori_id] || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Department:</strong> {avvik.Avdeling || departmentLabels[avvik.Avdeling_Avdeling_id] || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Admin functionality to update status */}
        {user && (
          <div className="detail-section">
            <h2>Update Status</h2>
            <div className="status-update">
              <select
                value={avvik.Status_Status_id || ''}
                onChange={(e) => handleStatusUpdate(Number(e.target.value))}
                disabled={updatingStatus}
              >
                <option value="" disabled>Select new status</option>
                <option value={1}>Open</option>
                <option value={2}>Aktiv</option>
                <option value={3}>Løst</option>
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
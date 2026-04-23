import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { avvikAPI } from '../services/api';

const CreateAvvik = () => {
  const [formData, setFormData] = useState({
    Tittel: '',
    Beskrivelse: '',
    Dato: new Date().toISOString().split('T')[0], // Today's date
    Status_Status_id: 1, // Default status ID
    Prioritering_Prioritering_id: 1, // Default priority ID
    Kategori_Kategori_id: 1, // Default category ID
    Avdeling_Avdeling_id: 1, // Default department ID
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await avvikAPI.create(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create avvik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-avvik-container">
      <div className="create-avvik-form">
        <h2>Create New Avvik</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Tittel">Title:</label>
            <input
              type="text"
              id="Tittel"
              name="Tittel"
              value={formData.Tittel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Beskrivelse">Description:</label>
            <textarea
              id="Beskrivelse"
              name="Beskrivelse"
              value={formData.Beskrivelse}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Dato">Date:</label>
            <input
              type="date"
              id="Dato"
              name="Dato"
              value={formData.Dato}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Status_Status_id">Status:</label>
            <select
              id="Status_Status_id"
              name="Status_Status_id"
              value={formData.Status_Status_id}
              onChange={handleChange}
            >
              <option value={1}>Open</option>
              <option value={2}>In Progress</option>
              <option value={3}>Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Prioritering_Prioritering_id">Priority:</label>
            <select
              id="Prioritering_Prioritering_id"
              name="Prioritering_Prioritering_id"
              value={formData.Prioritering_Prioritering_id}
              onChange={handleChange}
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Kategori_Kategori_id">Category:</label>
            <select
              id="Kategori_Kategori_id"
              name="Kategori_Kategori_id"
              value={formData.Kategori_Kategori_id}
              onChange={handleChange}
            >
              <option value={1}>Technical</option>
              <option value={2}>Safety</option>
              <option value={3}>Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Avdeling_Avdeling_id">Department:</label>
            <select
              id="Avdeling_Avdeling_id"
              name="Avdeling_Avdeling_id"
              value={formData.Avdeling_Avdeling_id}
              onChange={handleChange}
            >
              <option value={1}>General</option>
              <option value={2}>Emergency</option>
              <option value={3}>Surgery</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Avvik'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAvvik;
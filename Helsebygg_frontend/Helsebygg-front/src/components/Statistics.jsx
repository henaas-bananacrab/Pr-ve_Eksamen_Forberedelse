import React, { useState, useEffect } from 'react';
import { avvikAPI } from '../services/api';

const Statistics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await avvikAPI.getMonthlyAvvik();
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Group stats by month
  const groupedByMonth = stats.reduce((acc, item) => {
    if (!acc[item.month]) {
      acc[item.month] = [];
    }
    acc[item.month].push(item);
    return acc;
  }, {});

  // Sort months in descending order
  const sortedMonths = Object.keys(groupedByMonth).sort().reverse();

  if (loading) {
    return <div className="statistics-container"><p>Loading statistics...</p></div>;
  }

  if (error) {
    return <div className="statistics-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="statistics-container">
      <h2>Avvik Statistics by Category and Month</h2>
      
      {sortedMonths.length === 0 ? (
        <p>No statistics available</p>
      ) : (
        <div className="statistics-table-wrapper">
          {sortedMonths.map((month) => (
            <div key={month} className="month-section">
              <h3>{month}</h3>
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByMonth[month].map((item, index) => (
                    <tr key={index}>
                      <td>{item.kategori}</td>
                      <td className="total-cell">{item.total}</td>
                    </tr>
                  ))}
                  <tr className="month-total-row">
                    <td className="month-total-label">Total</td>
                    <td className="month-total-value">
                      {groupedByMonth[month].reduce((sum, item) => sum + item.total, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Statistics;

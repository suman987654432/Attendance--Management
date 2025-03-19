import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Search by name or date
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!searchName && !searchDate) {
        setMessage('Please provide either a name or date to search');
        setLoading(false);
        return;
      }

      if (!searchName && searchDate) {
        // Search by date only
        const { data } = await axios.get(
          `http://localhost:5000/api/student/attendance?date=${searchDate}`
        );
        setSearchResults(data);
        if (data.length === 0) {
          setMessage('No attendance records found for this date');
        }
      } else {
        // Search by name (with optional date)
        let url = `http://localhost:5000/api/student/search?name=${searchName}`;
        
        // Add date to search if provided
        if (searchDate) {
          url += `&date=${searchDate}`;
        }
        
        const { data } = await axios.get(url);
        setSearchResults(data);
        if (data.length === 0) {
          setMessage('No students found with this name');
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      setMessage(error.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Students</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <div className="form-group">
            <label>Search by Student Name:</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter student name"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Date (Optional for name search):</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {searchResults.length > 0 && (
        <div className="results-container">
          <h3>Search Results {searchDate && `(Date: ${searchDate})`}</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Attendance Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.rollNo}>
                  <td>{result.rollNo}</td>
                  <td>{result.name}</td>
                  <td>{result.className}</td>
                  <td>{result.email}</td>
                  <td>
                    <span className={`status-badge ${result.status?.toLowerCase() || 'not-marked'}`}>
                      {result.status || 'Not Marked'}
                    </span>
                  </td>
                  <td>{formatDate(result.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .search-container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafb;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 25px;
          font-weight: 600;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        .search-form {
          margin-bottom: 30px;
          padding: 25px;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .search-form:hover {
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        .search-inputs {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          flex: 1;
        }
        label {
          display: block;
          margin-bottom: 8px;
          color: #34495e;
          font-weight: 500;
        }
        .form-control {
          width: 100%;
          padding: 12px;
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          margin-top: 5px;
          font-size: 15px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .form-control:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
        .search-button {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .search-button:hover:not(:disabled) {
          background-color: #43a047;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .search-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .search-button:disabled {
          background-color: #a5d6a7;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .results-container {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-top: 30px;
        }
        h3 {
          color: #2c3e50;
          padding: 20px;
          margin: 0;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        .results-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .results-table th, .results-table td {
          border: none;
          border-bottom: 1px solid #e9ecef;
          padding: 15px 20px;
          text-align: left;
        }
        .results-table th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
          white-space: nowrap;
        }
        .results-table tr:last-child td {
          border-bottom: none;
        }
        .results-table tr:hover {
          background-color: #f8f9fa;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 30px;
          font-weight: 500;
          font-size: 14px;
          text-align: center;
          min-width: 100px;
        }
        .present {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        .absent {
          background-color: #ffebee;
          color: #c62828;
        }
        .not-marked {
          background-color: #f3f4f6;
          color: #64748b;
        }
        .message {
          padding: 16px;
          background-color: #f8f9fa;
          border-left: 4px solid #4CAF50;
          margin-bottom: 25px;
          color: #2c3e50;
          border-radius: 0 4px 4px 0;
        }
        @media (max-width: 768px) {
          .search-inputs {
            flex-direction: column;
            gap: 15px;
          }
          .search-container {
            padding: 15px;
          }
          .results-table th, .results-table td {
            padding: 10px 15px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;
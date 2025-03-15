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
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .search-form {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .search-inputs {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        .form-group {
          flex: 1;
        }
        .form-control {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-top: 5px;
        }
        .search-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .search-button:disabled {
          background-color: #cccccc;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
        }
        .results-table th, .results-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .results-table th {
          background-color: #f2f2f2;
        }
        .status-badge {
          padding: 5px 10px;
          border-radius: 3px;
          font-weight: bold;
        }
        .present {
          background-color: #dff0d8;
          color: #3c763d;
        }
        .absent {
          background-color: #f2dede;
          color: #a94442;
        }
        .not-marked {
          background-color: #fcf8e3;
          color: #8a6d3b;
        }
        .message {
          padding: 10px;
          background-color: #f8f8f8;
          border-left: 4px solid #ccc;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Search;
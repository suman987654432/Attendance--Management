import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Fetch students with attendance status
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/student/all');
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Mark attendance with date input
  const markAttendance = async (id, status) => {
    if (!attendanceDate) {
      alert('Please select a date first.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/student/attendance/${id}`, {
        status,
        date: attendanceDate,
      });

      // Update local attendance status state
      setAttendanceStatus(prev => ({
        ...prev,
        [id]: status
      }));

    } catch (error) {
      console.error('Failed to update attendance:', error);
      alert('Failed to update attendance.');
    }
  };

  // Fetch attendance by date
  const fetchAttendanceByDate = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/student/attendance?date=${selectedDate}`
      );
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      alert('Failed to fetch attendance.');
    }
  };

  // Update attendance status when date changes
  useEffect(() => {
    if (attendanceDate) {
      // Reset attendance status when date changes
      setAttendanceStatus({});
    }
  }, [attendanceDate]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading students data...</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Student Attendance Management</h2>
      </div>
      
      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No Students Found</h3>
          <p>There are no students in the database. Add some students first.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h3>Mark Attendance</h3>
            </div>
            <div className="card-body">
              <div className="date-picker">
                <label htmlFor="attendance-date">Select Date for Attendance:</label>
                <input
                  id="attendance-date"
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student._id}>
                        <td>{index + 1}</td>
                        <td>{student.rollNo}</td>
                        <td>{student.name}</td>
                        <td>{student.className}</td>
                        <td>{student.email}</td>
                        <td className="action-buttons">
                          <button
                            onClick={() => markAttendance(student._id, 'Present')}
                            className={`btn btn-present ${attendanceStatus[student._id] === 'Present' ? 'active' : ''}`}
                            disabled={!attendanceDate}
                            title={!attendanceDate ? "Select a date first" : ""}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'Absent')}
                            className={`btn btn-absent ${attendanceStatus[student._id] === 'Absent' ? 'active' : ''}`}
                            disabled={!attendanceDate}
                            title={!attendanceDate ? "Select a date first" : ""}
                          >
                            Absent
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card mt-20">
            <div className="card-header">
              <h3>View Attendance Records</h3>
            </div>
            <div className="card-body">
              <div className="search-attendance">
                <div className="date-picker">
                  <label htmlFor="view-date">Select Date to View:</label>
                  <input
                    id="view-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                <button onClick={fetchAttendanceByDate} className="btn btn-primary" disabled={!selectedDate}>
                  View Records
                </button>
              </div>

              {attendanceRecords.length > 0 ? (
                <div className="table-container mt-20">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record.rollNo}>
                          <td>{record.rollNo}</td>
                          <td>{record.name}</td>
                          <td>{record.className}</td>
                          <td>
                            <span className={`status-badge ${record.status.toLowerCase()}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedDate ? (
                <div className="empty-state small">
                  <p>No attendance records found for this date.</p>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
      
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .page-header {
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 15px;
        }
        
        .page-header h2 {
          color: #333;
          font-size: 28px;
          margin: 0;
        }
        
        .card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .card-header {
          background:rgb(36, 124, 212);
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .card-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }
        
        .card-body {
          padding: 20px;
        }
        
        .date-picker {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .date-picker label {
          margin-right: 15px;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .date-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        
        .date-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }
        
        .table-container {
          width: 100%;
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        
        .data-table th, .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e9ecef;
          text-align: left;
        }
        
        .data-table th {
          background-color:rgb(36, 120, 204);
          font-weight: 600;
          color: #333;
        }
        
        .data-table tr:hover {
          background-color: #f8f9fa;
        }
        
        .data-table tr:last-child td {
          border-bottom: none;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 5px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn:disabled {
          // opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-present {
          background-color:white;
          color:rgb(0, 12, 0);
          border: 1px solid #4CAF50;
        }
        
        .btn-present.active, .btn-present:not(:disabled):hover {
          background-color: #4CAF50;
          color: white;
        }
        
        .btn-absent {
          background-color: #f0f0f0;
          color: #f44336;
          border: 1px solid #f44336;
        }
        
        .btn-absent.active, .btn-absent:not(:disabled):hover {
          background-color: #f44336;
          color: white;
        }
        
        .btn-primary {
          background-color: #2196F3;
          color: white;
          margin-bottom: 20px;
        }
        
        .btn-primary:not(:disabled):hover {
          background-color: #0b7dda;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .search-attendance {
          display: flex;
          gap: 15px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        
        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
          display: inline-block;
        }
        
        .status-badge.present {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .status-badge.absent {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .status-badge.not-marked {
          background-color: #f5f5f5;
          color: #757575;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: #f9f9f9;
          border-radius: 10px;
        }
        
        .empty-state.small {
          padding: 20px;
        }
        
        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        
        .empty-state h3 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .empty-state p {
          color: #777;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }
        
        .loading-spinner {
          border: 5px solid #f3f3f3;
          border-radius: 50%;
          border-top: 5px solid #4CAF50;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .mt-20 {
          margin-top: 20px;
        }
        
        @media (max-width: 768px) {
          .date-picker {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .date-picker label {
            margin-bottom: 8px;
          }
          
          .date-input {
            width: 100%;
          }
          
          .action-buttons {
            flex-direction: column;
            gap: 5px;
          }
          
          .search-attendance {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DisplayPage;

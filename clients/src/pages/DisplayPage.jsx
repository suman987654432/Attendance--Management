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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="student-display-container">
      <h2>Student List</h2>
      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <>
          {/* Attendance Date Input */}
          <div>
            <label>Select Date for Attendance:</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          {/* Student Table */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class Name</th>
                <th>Email</th>
                <th>Action</th>
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
                  <td>
                    <button
                      onClick={() => markAttendance(student._id, 'Present')}
                      style={{
                        backgroundColor:
                          attendanceStatus[student._id] === 'Present'
                            ? '#4CAF50'
                            : '#f0f0f0',
                        color:
                          attendanceStatus[student._id] === 'Present'
                            ? '#fff'
                            : '#000',
                        padding: '5px 10px',
                        marginRight: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(student._id, 'Absent')}
                      style={{
                        backgroundColor:
                          attendanceStatus[student._id] === 'Absent'
                            ? '#f44336'
                            : '#f0f0f0',
                        color:
                          attendanceStatus[student._id] === 'Absent'
                            ? '#fff'
                            : '#000',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* View Attendance by Date */}
          <div>
            <h3>View Attendance by Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button onClick={fetchAttendanceByDate}>View</button>

            {attendanceRecords.length > 0 ? (
              <ul>
                {attendanceRecords.map((record) => (
                  <li key={record.rollNo}>
                    {record.name} ({record.rollNo}) - {record.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attendance records found for this date.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayPage;

import React, { useState } from 'react';
import axios from 'axios';
import "../css/add.css";

const AddStudent = () => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/student/add',
        { rollNo, name, className, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Student added successfully');
      setRollNo('');
      setName('');
      setClassName('');
      setEmail('');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add student');
    }
  };

  return (
    <div className="student-container">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          placeholder="Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Class"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;

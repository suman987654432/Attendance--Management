const express = require('express');
const router = express.Router();
const { addStudent, getStudents, markAttendance, getAttendanceByDate, searchStudents } = require('../controllers/studentController');

router.post('/add', addStudent);
router.get('/all', getStudents);
router.put('/attendance/:id', markAttendance); 
router.get('/attendance', getAttendanceByDate);
router.get('/search', searchStudents); // New route for searching students

module.exports = router;

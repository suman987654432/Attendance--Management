const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    className: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true
        },
        status: {
          type: String,
          enum: ['Present', 'Absent'],
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  start: {
    type: Date,
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  repeat: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    default: 'once'
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)

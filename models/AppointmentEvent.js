const mongoose = require('mongoose')

const appointmentEventSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Appointment'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('AppointmentEvent', appointmentEventSchema)

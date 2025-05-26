const mongoose = require('mongoose')

const periodSchema = new mongoose.Schema({
  period: { type: String, required: true },
  members: { type: [String], default: [] }
})


module.exports = mongoose.model('Period', periodSchema)

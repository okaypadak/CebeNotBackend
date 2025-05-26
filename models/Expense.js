const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  note: String,
  category: String,
  period: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Expense', expenseSchema)

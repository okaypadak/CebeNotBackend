const express = require('express')
const Expense = require('../models/Expense')
const router = express.Router()
const authorize = require('./authMiddleware')

router.post('/', authorize('admin'), async (req, res) => {
  const { amount, note, category, date, period } = req.body

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      amount,
      note,
      category,
      period,
      date: date || Date.now()
    })

    await newExpense.save()
    res.status(201).json(newExpense)
  } catch (err) {
    console.error('Gider ekleme hatası:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

router.get('/', authorize('admin'), async (req, res) => {
  const { period } = req.query
  const query = { userId: req.user.id }

  if (period) {
    query.period = period
  }

  try {
    const expenses = await Expense.find(query).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    console.error('Gider verileri alınamadı:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    // Gider bulunamazsa
    if (!expense) {
      return res.status(404).json({ error: 'Gider bulunamadı' })
    }

    // Kullanıcıya ait değilse
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Bu gideri silme yetkiniz yok' })
    }

    await expense.deleteOne()

    res.sendStatus(204) // No Content
  } catch (err) {
    console.error('Gider silme hatası:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


module.exports = router

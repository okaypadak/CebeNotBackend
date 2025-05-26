const express = require('express')
const router = express.Router()
const AppointmentEvent = require('../models/AppointmentEvent')
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
  try {
    // Tüm event'leri tarih sırasına göre getir
    const events = await AppointmentEvent.find().sort({ date: 1 })

    res.status(200).json(events)
  } catch (err) {
    console.error('📛 Event verisi alınamadı:', err)
    res.status(500).json({ message: 'Sunucu hatası', error: err.message })
  }
})


module.exports = router

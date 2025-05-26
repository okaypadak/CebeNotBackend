const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Appointment = require('../models/Appointment')
const AppointmentEvent = require('../models/AppointmentEvent')


router.get('/', async (req, res) => {
  try {
    const cycles = await Cycle.find({ userId: req.user.id }).sort({ start: -1 }) // en yenisi önce

    if (!cycles || cycles.length === 0) {
      return res.status(200).json([])  // boş liste döndür
    }

    res.json(cycles)

  } catch (err) {
    console.error('Dönem verisi alınamadı:', err)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})


router.post('/', async (req, res) => {
  const { userId, start, durationDays, explanation, repeat } = req.body;

  if (!start || !durationDays) {
    return res.status(400).json({ message: 'Başlangıç ve süre (gün) zorunludur' });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const createdCycles = await createAppointmentWithEvents({
      userId,
      startDate,
      durationDays,
      explanation,
      repeat,
      endDate
    });

    res.status(201).json({ message: `${createdCycles.length} dönem kaydedildi`, cycles: createdCycles });
  } catch (err) {
    console.error('Dönem ekleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

async function createAppointmentWithEvents({ userId, startDate, durationDays, explanation, repeat, endDate }) {

  const appointment = new Appointment({
    userId,
    start: new Date(startDate),
    durationDays,
    explanation,
    repeat
  })

  await appointment.save()
  console.log("📌 Appointment oluşturuldu:", appointment._id)

  // 2. Eğer tekrar yoksa (once) sadece tek bir AppointmentEvent oluştur
  if (repeat === 'once') {
    const start = new Date(startDate)
    const endDate = new Date(start)
    endDate.setDate(endDate.getDate() + durationDays)
  
    const singleEvent = new AppointmentEvent({
      appointmentId: appointment._id,
      userId,
      date: endDate,
      explanation
    })
  
    await singleEvent.save()
    console.log("📤 Tekil AppointmentEvent kaydedildi.")
    return { message: "Tek seferlik randevu oluşturuldu." }
  }

  // 3. Tekrarlı randevular için event'leri oluştur
  const intervalDays = {
    daily: 1,
    weekly: 7,
    monthly: 30
  }[repeat]

  const events = []
  let currentDate = new Date(startDate)
  const finalDate = new Date(endDate)

  while (currentDate <= finalDate) {
    events.push({
      appointmentId: appointment._id,
      userId,
      date: new Date(currentDate),
      explanation
    })

    currentDate.setDate(currentDate.getDate() + intervalDays)
  }

  await AppointmentEvent.insertMany(events)
  console.log(`📤 ${events.length} adet AppointmentEvent kaydedildi.`)

  return { message: `${events.length} randevu olayı başarıyla oluşturuldu.` }
}


router.delete('/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findOneAndDelete({
      _id: req.params.id
    })

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı veya size ait değil' })
    }

    await AppointmentEvent.deleteMany({ appointmentId: req.params.id })

    res.json({ message: 'Randevu ve ilişkili eventler silindi' })
  } catch (err) {
    console.error('Silme hatası:', err)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

module.exports = router

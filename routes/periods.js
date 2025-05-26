const express = require('express');
const router = express.Router();
const Period = require('../models/Period');
const authorize = require('./authMiddleware')

router.get('/', authorize('admin'), async (req, res) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({ error: 'userId eksik' })
    }

    const periods = await Period.find({
      members: userId
    })

    res.json(periods)
  } catch (err) {
    console.error('Dönemler alınırken hata:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


router.post('/', authorize('admin'), async (req, res) => {
  const { period, members } = req.body;

  if (!period || !members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: 'Period ve en az bir member zorunludur.' });
  }

  try {
    const newPeriod = new Period({ period, members });
    await newPeriod.save();
    res.status(201).json(newPeriod);
  } catch (err) {
    res.status(500).json({ error: 'Kaydetme hatası' });
  }
});


router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const deleted = await Period.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Period bulunamadı' });
    }
    res.json({ message: 'Silindi', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Silme hatası' });
  }
});

module.exports = router;

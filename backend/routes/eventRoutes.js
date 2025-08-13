const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// simple auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// create event
router.post('/', auth, async (req, res) => {
  const { type, details } = req.body;
  try {
    const ev = new Event({ userId: req.user.userId, type, details });
    await ev.save();
    res.json({ message: 'Saved', event: ev });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get events for user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId }).sort({ timestamp: -1 }).limit(200);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// clear user events
router.delete('/', auth, async (req, res) => {
  try {
    await Event.deleteMany({ userId: req.user.userId });
    res.json({ message: 'Cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

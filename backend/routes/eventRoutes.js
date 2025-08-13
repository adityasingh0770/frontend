const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const eventsFile = path.join(__dirname, '../events.json');
const usersFile = path.join(__dirname, '../users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function readEvents() {
  if (!fs.existsSync(eventsFile)) return [];
  return JSON.parse(fs.readFileSync(eventsFile));
}

function writeEvents(events) {
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
}

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile));
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Save event
router.post('/', auth, (req, res) => {
  const { type, data } = req.body;
  if (!type) return res.status(400).json({ message: 'Event type is required' });

  const events = readEvents();
  events.push({ userId: req.user.id, type, data, timestamp: new Date().toISOString() });
  writeEvents(events);

  res.json({ message: 'Event saved successfully' });
});

// Get events for logged-in user
router.get('/', auth, (req, res) => {
  const events = readEvents().filter(e => e.userId === req.user.id);
  res.json(events);
});

module.exports = router;

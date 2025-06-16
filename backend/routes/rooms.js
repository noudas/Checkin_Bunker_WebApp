const express = require('express');
const router = express.Router();
const roomService = require('../services/roomService');

// POST /rooms - Create a room
router.post('/', async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).json({ error: 'roomId is required' });

  await roomService.createRoom(roomId);
  res.status(201).json({ message: `Room ${roomId} created.` });
});

// GET /rooms - List all rooms
router.get('/', async (req, res) => {
  const rooms = await roomService.listRooms();
  res.json({ rooms });
});

// GET /rooms/:roomId - Get all user statuses in room
router.get('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const exists = await roomService.roomExists(roomId);

  if (!exists) return res.status(404).json({ error: 'Room not found' });

  const users = await roomService.getRoomStatus(roomId);
  res.json({ roomId, users });
});

module.exports = router;

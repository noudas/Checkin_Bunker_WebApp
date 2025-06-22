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

router.post('/:roomId/status', async (req, res) => {
  const { status, name } = req.body;
  const roomId = req.params.roomId;
  const userId = name;

  console.log('SET STATUS:', { roomId, userId, status, name });

  if (!userId || !status || !name) {
    return res.status(400).json({ error: 'userId, status, and name required' });
  }

  const exists = await roomService.roomExists(roomId);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  await roomService.setUserStatus(roomId, userId, status, name);
  res.status(201).json({ message: 'Status set', userId });
});


// PUT /rooms/:roomId/status - Update user's status
router.put('/:roomId/status', async (req, res) => {
  const { userId, status, name } = req.body;
  const roomId = req.params.roomId;

  console.log('SET STATUS:', { roomId, userId, status, name });

  if (!userId || !status || !name) {
    return res.status(400).json({ error: 'userId, status, and name required' });
  }

  const exists = await roomService.roomExists(roomId);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  const updated = await roomService.updateUserStatus(roomId, userId, status, name);
  if (!updated) return res.status(404).json({ error: 'User not found in room' });

  res.json({ message: 'Status updated successfully' });
});


router.delete('/:roomId/quit', async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query' });
  }

  try {
    await roomService.removeUser(roomId, userId);
    res.json({ message: `User ${userId} removed from room ${roomId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove user from room' });
  }
});

router.get('/:roomId/status/:userId', async (req, res) => {
  const { roomId, userId } = req.params;

  const exists = await roomService.roomExists(roomId);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  const user = await roomService.getUserStatus(roomId, userId);
  if (!user) return res.status(404).json({ error: 'User not found in room' });

  res.json(user);
});

router.get('/:roomId/users', async (req, res) => {
  const roomId = req.params.roomId;

  const exists = await roomService.roomExists(roomId);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  const users = await roomService.getUsersInRoom(roomId);
  res.json({ roomId, users });
});

// DELETE /rooms/:roomId - Delete a room completely
router.delete('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;

  const exists = await roomService.roomExists(roomId);
  if (!exists) return res.status(404).json({ error: 'Room not found' });

  await roomService.deleteRoom(roomId);
  res.json({ message: `Room ${roomId} deleted successfully.` });
});


module.exports = router;

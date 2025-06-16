const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('./client/redisClient');
const roomRoutes = require('./routes/rooms');
const roomService = require('./services/roomService');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middleware
app.use(express.json());

// Routes
app.use('/rooms', roomRoutes);

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', async ({ roomId }) => {
    socket.join(roomId);
    await roomService.createRoom(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendStatus', async ({ roomId, userId, status, name }) => {
    await roomService.setUserStatus(roomId, userId, status, name);
    io.to(roomId).emit('statusUpdate', { userId, name, status });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

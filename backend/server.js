const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('./client/redisClient');
const roomRoutes = require('./routes/rooms');
const roomService = require('./services/roomService');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/rooms', roomRoutes);

app.use((req, res, next) => {
  if (!req.cookies.userId) {
    const newId = crypto.randomUUID(); // or shortid or nanoid
    res.cookie('userId', newId, { httpOnly: true, sameSite: 'Lax' });
    req.userId = newId;
  } else {
    req.userId = req.cookies.userId;
  }
  next();
});

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

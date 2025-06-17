import React, { useState, useEffect } from 'react';
import RoomList from './components/RoomList';
import JoinRoomForm from './components/JoinRoomForm';
import RoomUsers, { type UserStatus } from './components/RoomUsers';

import * as api from './services/api';
import * as socketService from './services/socket';

function App() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [roomUsers, setRoomUsers] = useState<UserStatus[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof socketService.connectSocket> | null>(null);

  // Load rooms
  async function loadRooms() {
    const rooms = await api.fetchRooms();
    setRooms(rooms);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function handleCreateRoom(roomId: string) {
    await api.createRoom(roomId);
    await loadRooms();
  }

  async function handleJoinRoom(roomId: string, userIdParam: string, userNameParam: string, status: string) {
    setUserId(userIdParam);
    setUserName(userNameParam);

    const socket = socketService.connectSocket();
    setSocket(socket);

    socket.on('connect', async () => {
      console.log('Socket connected', socket.id);
      await api.joinRoomStatus(roomId, status, userNameParam);
      setJoinedRoom(roomId);
      const users = await api.fetchRoomUsers(roomId);
      setRoomUsers(users);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  async function handleLeaveRoom() {
    if (!joinedRoom || !userId) return;
    await api.leaveRoom(joinedRoom, userId);
    socketService.disconnectSocket();
    setSocket(null);
    setJoinedRoom(null);
    setRoomUsers([]);
    setUserId('');
    setUserName('');
    await loadRooms();
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Rooms</h1>

      <RoomList rooms={rooms} onCreateRoom={handleCreateRoom} disabled={!!joinedRoom} />

      {!joinedRoom && (
        <JoinRoomForm onJoin={handleJoinRoom} disabled={!!joinedRoom} />
      )}

      {joinedRoom && (
        <div>
          <h2>Room: {joinedRoom}</h2>
          <button onClick={handleLeaveRoom}>Leave Room</button>
          <RoomUsers users={roomUsers} />
        </div>
      )}
    </div>
  );
}

export default App;

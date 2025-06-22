import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import RoomUsers, { type UserStatus } from '../components/RoomUsers';
import * as api from '../services/api';
import * as socketService from '../services/socket';

export default function RoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userName, status: initialStatus } = location.state || {};

  const [roomUsers, setRoomUsers] = useState<UserStatus[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof socketService.connectSocket> | null>(null);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (!roomId || !userId || !userName || !initialStatus) {
      navigate('/');
      return;
    }

    const socket = socketService.connectSocket();
    setSocket(socket);

    socket.on('connect', async () => {
      console.log('Socket connected');
      await api.joinRoomStatus(roomId, initialStatus, userName);
      const users = await api.fetchRoomUsers(roomId);
      setRoomUsers(users);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketService.disconnectSocket();
    };
  }, [roomId]);

  async function handleLeaveRoom() {
    if (!roomId || !userId) return;
    await api.leaveRoom(roomId, userId);
    navigate('/');
  }

  async function handleStatusChange(newStatus: string) {
    if (!roomId || !userName) return;
    await api.joinRoomStatus(roomId, newStatus, userName);
    setStatus(newStatus);
    const updatedUsers = await api.fetchRoomUsers(roomId);
    setRoomUsers(updatedUsers);
  }

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <p>Your Status: <strong>{status}</strong></p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => handleStatusChange('Going to Bunker')}>Going to Bunker</button>
        <button onClick={() => handleStatusChange('In Bunker')}>In Bunker</button>
        <button onClick={() => handleStatusChange('Leaving Bunker')}>Leaving Bunker</button>
        <button onClick={() => handleStatusChange('All Ok')}>All Ok</button>
      </div>

      <button onClick={handleLeaveRoom}>Leave Room</button>
      <RoomUsers users={roomUsers} />
    </div>
  );
}

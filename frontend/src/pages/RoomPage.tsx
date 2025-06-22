import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import RoomUsers, { type UserStatus } from '../components/RoomUsers';
import * as api from '../services/api';
import * as socketService from '../services/socket';

export default function RoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userName, status } = location.state || {};

  const [roomUsers, setRoomUsers] = useState<UserStatus[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof socketService.connectSocket> | null>(null);

  useEffect(() => {
    if (!roomId || !userId || !userName || !status) {
      navigate('/');
      return;
    }

    const socket = socketService.connectSocket();
    setSocket(socket);

    socket.on('connect', async () => {
      console.log('Socket connected');
      await api.joinRoomStatus(roomId, status, userName);
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

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      <RoomUsers users={roomUsers} />
    </div>
  );
}

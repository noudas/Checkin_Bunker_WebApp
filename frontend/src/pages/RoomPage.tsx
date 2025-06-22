import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import RoomUsers, { type UserStatus } from '../components/RoomUsers';
import * as api from '../services/api';
import * as socketService from '../services/socket';
import './RoomPage.css';

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
  <div className='room-page'>
    <div className='room-header'>
      <h1>Room: {roomId}</h1>
      <p>Your Status: <strong>{status}</strong></p>
    </div>

    <div className='room-main'>
      <div className='room-left'>
        <RoomUsers users={roomUsers} />
      </div>

      <div className='room-right'>
        <div className='status-buttons'>
          <button onClick={() => handleStatusChange('Going to Bunker')} className='going-to-bunker'>
            🏃‍♂️ Going to Bunker
          </button>
          <button onClick={() => handleStatusChange('In Bunker')} className='in-bunker'>
            🛡️ In Bunker
          </button>
          <button onClick={() => handleStatusChange('Leaving Bunker')} className='leaving-bunker'>
            🚪 Leaving Bunker
          </button>
          <button onClick={() => handleStatusChange('All Ok')} className='all-ok'>
            ✅ All Ok
          </button>
        </div>
      </div>
    </div>

    <div className='room-footer'>
      <button onClick={handleLeaveRoom}>
        👋 Leave Room
      </button>
    </div>
  </div>
);
}
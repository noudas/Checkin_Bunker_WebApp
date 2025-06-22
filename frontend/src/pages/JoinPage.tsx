import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomList from '../components/RoomList';
import JoinRoomForm from '../components/JoinRoomForm';
import * as api from '../services/api';

export default function JoinPage() {
  const [rooms, setRooms] = useState<string[]>([]);
  const navigate = useNavigate();

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

  function handleJoin(roomId: string, userId: string, userName: string, status: string) {
    navigate(`/room/${roomId}`, { state: { userId, userName, status } });
  }

  return (
    <div>
      <h1>Create or Join a Room</h1>
      <RoomList rooms={rooms} onCreateRoom={handleCreateRoom} />
      <JoinRoomForm onJoin={handleJoin} />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomList from '../components/RoomList';
import JoinRoomForm from '../components/JoinRoomForm';
import * as api from '../services/api';
import './JoinPage.css'

export default function JoinPage() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomCreatedMessage, setRoomCreatedMessage] = useState('');
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

    // Show a temporary success message
    setRoomCreatedMessage(`Room "${roomId}" was successfully created!`);
    setTimeout(() => {
      setRoomCreatedMessage('');
    }, 3000); // clear after 3 seconds
  }

  function handleJoin(roomId: string, userId: string, userName: string, status: string) {
    navigate(`/room/${roomId}`, { state: { userId, userName, status } });
  }

return (
  <div className="join-page">
    <h1>Create or Join a Room</h1>

    {roomCreatedMessage && (
      <div className="room-created-message">
        {roomCreatedMessage}
      </div>
    )}

    <div className="join-content">
      <div className="room-list">
        <h1>Create a Room</h1>
        <RoomList rooms={rooms} onCreateRoom={handleCreateRoom} />
      </div>
      <div className="join-room-form">
        <h1>Join a Room</h1>
        <p>Enter the Room ID and your Name to join an existing room.</p>
        <JoinRoomForm onJoin={handleJoin} />
      </div>
    </div>
  </div>
);
}

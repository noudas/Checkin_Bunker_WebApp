import React, { useState } from 'react';

interface RoomListProps {
  rooms: string[];
  onCreateRoom: (roomId: string) => void;
  disabled?: boolean;
}

export default function RoomList({ rooms, onCreateRoom, disabled }: RoomListProps) {
  const [newRoomId, setNewRoomId] = useState('');

  function handleCreate() {
    if (newRoomId.trim()) {
      onCreateRoom(newRoomId.trim());
      setNewRoomId('');
    }
  }

  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New room ID"
        value={newRoomId}
        onChange={(e) => setNewRoomId(e.target.value)}
        disabled={disabled}
      />
      <button onClick={handleCreate} disabled={disabled || !newRoomId.trim()}>
        Create Room
      </button>
    </div>
  );
}

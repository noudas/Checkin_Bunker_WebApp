import React, { useState } from 'react';

interface JoinRoomFormProps {
  onJoin: (roomId: string, userId: string, userName: string, status: string) => void;
  disabled?: boolean;
}

export default function JoinRoomForm({ onJoin, disabled }: JoinRoomFormProps) {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('');

  function handleJoin() {
    if (!roomId || !userId || !userName) {
      alert('Please fill in Room ID, User ID and Name');
      return;
    }
    onJoin(roomId, userId, userName, status);
  }

  return (
    <div>
      <h2>Join Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={disabled}
      />
      <button onClick={handleJoin} disabled={disabled}>
        Join Room
      </button>
    </div>
  );
}

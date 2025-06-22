import React, { useState } from 'react';

interface JoinRoomFormProps {
  onJoin: (roomId: string, userId: string, userName: string, status: string) => void;
  disabled?: boolean;
}

export default function JoinRoomForm({ onJoin, disabled }: JoinRoomFormProps) {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const userId = userName; // userId is always equal to userName
  const status = 'joining'; // default status

  function handleJoin() {
    if (!roomId || !userName) {
      alert('Please fill in Room ID and Name');
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
        placeholder="Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        disabled={disabled}
      />
      <button onClick={handleJoin} disabled={disabled}>
        Join Room
      </button>
    </div>
  );
}

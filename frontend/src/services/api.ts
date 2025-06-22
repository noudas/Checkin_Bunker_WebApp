const BASE_URL = 'http://localhost:3000';

export async function fetchRooms(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/rooms`);
  const data = await res.json();
  return data.rooms;
}

export async function createRoom(roomId: string) {
    console.log(`Creating room with ID: ${roomId}`);
    
  await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId }),
  });
}

export async function joinRoomStatus(roomId: string, status: string, name: string) {
  await fetch(`${BASE_URL}/rooms/${roomId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, name }),
  });
}

export async function fetchRoomUsers(roomId: string) {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}`);
  const data = await res.json();
  return data.users;
}

export async function leaveRoom(roomId: string, userId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/quit?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to leave room');
  }
}
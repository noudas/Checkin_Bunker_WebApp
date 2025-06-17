import React from 'react';

export interface UserStatus {
  userId: string;
  name: string;
  status: string;
}

interface RoomUsersProps {
  users: UserStatus[];
}

export default function RoomUsers({ users }: RoomUsersProps) {
  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.userId}>
            {u.name} ({u.userId}): {u.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

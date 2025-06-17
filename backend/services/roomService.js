const redis = require('../client/redisClient');

const getRoomKey = (roomId) => `room:${roomId}`;
const getStatusKey = (roomId) => `${getRoomKey(roomId)}:statuses`;
const getNameKey = (roomId) => `${getRoomKey(roomId)}:usernames`;
const getUsersKey = (roomId) => `${getRoomKey(roomId)}:users`;

/**
 * Create a room
 */
async function createRoom(roomId) {
  return await redis.sAdd('rooms', roomId);
}

/**
 * Check if a room exists
 */
async function roomExists(roomId) {
  return await redis.sIsMember('rooms', roomId);
}

/**
 * List all rooms
 */
async function listRooms() {
  return await redis.sMembers('rooms');
}

/**
 * Set user status and name
 */
async function setUserStatus(roomId, userId, status, name) {
  if (!status || !name) {
    throw new Error('Both status and name are required');
  }

  const statusKey = getStatusKey(roomId);
  const nameKey = getNameKey(roomId);
  const usersKey = getUsersKey(roomId);

  await Promise.all([
    redis.hSet(statusKey, { [userId]: status }),
    redis.hSet(nameKey, { [userId]: name }),
    redis.sAdd(usersKey, userId), // Track active users
  ]);
}


/**
 * Get all statuses + names in a room
 */
async function getRoomStatus(roomId) {
  const [statuses, names] = await Promise.all([
    redis.hGetAll(getStatusKey(roomId)),
    redis.hGetAll(getNameKey(roomId)),
  ]);

  return Object.entries(statuses).map(([userId, status]) => ({
    userId,
    name: names[userId] || userId,
    status,
  }));
}

/**
 * Remove user from room
 */
async function removeUser(roomId, userId) {
  const statusKey = getStatusKey(roomId);
  const nameKey = getNameKey(roomId);
  const usersKey = getUsersKey(roomId);

  await Promise.all([
    redis.hDel(statusKey, userId),
    redis.hDel(nameKey, userId),
    redis.sRem(usersKey, userId),
  ]);

  const remaining = await redis.sCard(usersKey);
  if (remaining === 0) {
    // Set a TTL (Time-To-Live) for cleanup in 5 mins
    await Promise.all([
      redis.expire(statusKey, 300), // 5 minutes
      redis.expire(nameKey, 300),
      redis.expire(usersKey, 300),
    ]);
  }
}

async function cleanRooms() {
  const rooms = await redis.sMembers('rooms');
  for (const roomId of rooms) {
    const exists = await redis.exists(getStatusKey(roomId));
    if (!exists) {
      await redis.sRem('rooms', roomId); // Remove from known room list
    }
  }
}

module.exports = {
  createRoom,
  roomExists,
  listRooms,
  setUserStatus,
  getRoomStatus,
  removeUser,
  cleanRooms,
};

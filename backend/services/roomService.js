const redis = require('../client/redisClient');

const getRoomKey = (roomId) => `room:${roomId}`;
const getStatusKey = (roomId) => `${getRoomKey(roomId)}:statuses`;
const getNameKey = (roomId) => `${getRoomKey(roomId)}:usernames`;

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
  const statusKey = getStatusKey(roomId);
  const nameKey = getNameKey(roomId);
  await Promise.all([
    redis.hSet(statusKey, userId, status),
    redis.hSet(nameKey, userId, name),
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
  await Promise.all([
    redis.hDel(getStatusKey(roomId), userId),
    redis.hDel(getNameKey(roomId), userId),
  ]);
}

module.exports = {
  createRoom,
  roomExists,
  listRooms,
  setUserStatus,
  getRoomStatus,
  removeUser,
};

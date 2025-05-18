import WebSocket from 'ws';
import { players } from './playerManager';

interface Room {
  roomId: string;
  users: { name: string; ws: WebSocket; index: string }[];
}

export const rooms: Room[] = [];

let roomCounter = 1;

export function handleCreateRoom(ws: WebSocket) {
  const player = Array.from(players.values()).find(p => p.ws === ws);
  if (!player) return;

  const roomId = `room-${roomCounter++}`;
  const newRoom: Room = {
    roomId,
    users: [{ name: player.name, ws, index: player.id }]
  };

  rooms.push(newRoom);
  broadcastRoomUpdate();
}

export function handleAddUserToRoom(ws: WebSocket, data: any) {
  const room = rooms.find(r => r.roomId === data.indexRoom);
  const player = Array.from(players.values()).find(p => p.ws === ws);
  if (!room || !player) return;

  room.users.push({ name: player.name, ws, index: player.id });
  broadcastRoomUpdate();

  // Start game here
  for (const u of room.users) {
    u.ws.send(JSON.stringify({
      type: "create_game",
      data: { idGame: room.roomId, idPlayer: u.index },
      id: 0
    }));
  }
}

export function broadcastRoomUpdate() {
  const availableRooms = rooms
    .filter(room => room.users.length === 1)
    .map(room => ({
      roomId: room.roomId,
      roomUsers: room.users.map(u => ({ name: u.name, index: u.index }))
    }));

  for (const p of players.values()) {
    p.ws.send(JSON.stringify({
      type: "update_room",
      data: availableRooms,
      id: 0
    }));
  }
}

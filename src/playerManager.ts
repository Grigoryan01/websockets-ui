import WebSocket from 'ws';
import { Player } from './type';

export const players: Map<string, Player> = new Map();

export function handleReg(ws: WebSocket, data: any) {
  const { name, password } = data;
  const existing = players.get(name);

  if (existing && existing.password !== password) {
    ws.send(JSON.stringify({
      type: "reg",
      data: { name, index: "", error: true, errorText: "Wrong password" },
      id: 0
    }));
    return;
  }

  const id = `${name}-${Date.now()}`;
  const player: Player = { name, password, ws, wins: 0, id };
  players.set(name, player);

  ws.send(JSON.stringify({
    type: "reg",
    data: { name, index: id, error: false, errorText: "" },
    id: 0
  }));

  // Optionally send update_room and update_winners here
}

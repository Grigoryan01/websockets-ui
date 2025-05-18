// src/types.ts
import type { WebSocket } from 'ws';

export interface Player {
  name: string;
  password: string;
  ws: WebSocket;
  wins: number;
  id: string;
}

export interface Room {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface GamePlayer {
  id: string;
  ships: Ship[];
  hits: { x: number; y: number }[];
  misses: { x: number; y: number }[];
}

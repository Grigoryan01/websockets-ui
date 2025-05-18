import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { handleReg } from './playerManager';
import { handleCreateRoom, handleAddUserToRoom } from './roomManager';

dotenv.config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 3000 });

wss.on('connection', ws => {
  ws.on('message', message => {
    try {
      const msg = JSON.parse(message.toString());
      console.log('Received:', msg);

      switch (msg.type) {
        case 'reg':
          handleReg(ws, msg.data);
          break;
        case 'create_room':
          handleCreateRoom(ws);
          break;
        case 'add_user_to_room':
          handleAddUserToRoom(ws, msg.data);
          break;
        default:
          console.log('Unknown type:', msg.type);
      }
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on ws://localhost:${process.env.PORT || 3000}`);

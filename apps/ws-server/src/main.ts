import { createServer } from "http";
// import { readFileSync } from "fs";
import { WebSocketServer } from "ws";
import {
  heartbeat,
  ExtWebSocket,
  pingInterval,
} from "./connections/pingInterval.js";

interface Player {
  id: string;
  name: string;
}

type Row = [string, string, string, string];

type Board = [Row, Row, Row, Row];

interface Room {
  id: string;
  name: string;
  player1: Player | null;
  player2: Player | null;
  // history: []; // if need regret chess
  current: Board;
  lastPlayer: Player | null;
}

const room: Room[] = [];

interface Received {
  type: "join" | "create" | "leave" | "start" | "restart" | "go";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

const server = createServer({
  // cert: readFileSync("/path/to/cert.pem"),
  // key: readFileSync("/path/to/key.pem"),
});
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(webSocket) {
  const ws = webSocket as ExtWebSocket;
  ws.isAlive = true;

  ws.on("error", console.error);

  ws.on("pong", heartbeat);

  ws.on("message", function message(data) {
    let received: Received | null = null;
    try {
      received = JSON.parse(data as unknown as string) as unknown as Received;
    } catch (error) {
      console.log(error);
    }
    if (!received) {
      return;
    }

    const { type, playerId, current, playerName, roomId, roomName } = received;

    switch (type) {
      case "create": {
        const player = { id: playerId, name: playerName };

        room.push({
          id: roomId,
          name: roomName,
          player1: player,
          player2: null,
          current,
          lastPlayer: player,
        });
        break;
      }
      case "join":
        break;
      case "leave":
        break;
      case "restart":
        break;
      case "start":
        break;

      default:
        break;
    }

    console.log("received: %s", data);
    ws.send(JSON.stringify({ room }));
  });

  ws.send(JSON.stringify({ room }));
});

// to detect and close broken connections
const interval = pingInterval(wss);

wss.on("close", function close() {
  clearInterval(interval);
});

server.listen(8888);

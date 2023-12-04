import { createServer } from "http";
import { parse } from "url";
// import { readFileSync } from "fs";
import { WebSocketServer } from "ws";
import {
  heartbeat,
  ExtWebSocket,
  pingInterval,
} from "./connections/pingInterval.js";
import {
  ClientMessage,
  Room,
  RoomsWithConnectPlayerRoom,
} from "@repo/core/room";
import { v4 as uuidv4 } from "uuid";

const rooms: Room[] = [];

const server = createServer({
  // cert: readFileSync("/path/to/cert.pem"),
  // key: readFileSync("/path/to/key.pem"),
});
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(webSocket, req) {
  const { query } = parse(req.url ?? "", true);

  console.log(query);
  const ws = webSocket as ExtWebSocket;
  ws.isAlive = true;
  const clientID = uuidv4();
  ws.clientID = clientID;

  ws.on("error", console.error);

  ws.on("pong", heartbeat);

  ws.on("message", function message(data) {
    let received: ClientMessage | null = null;
    try {
      received = JSON.parse(
        data as unknown as string,
      ) as unknown as ClientMessage;
    } catch (error) {
      console.log(error);
    }
    if (!received) {
      return;
    }

    console.log("received: %s", received);

    const { type, playerId, current, playerName, roomId, roomName } = received;

    switch (type) {
      case "createRoom": {
        const newRoomId = uuidv4();
        const player = {
          id: playerId,
          name: playerName,
          roomId: newRoomId,
          roomName,
        };

        const createRoom = {
          id: newRoomId,
          name: roomName,
          player1: player,
          player2: null,
          current,
          lastPlayer: player,
        };

        rooms.push(createRoom);

        const createRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: createRoom,
          rooms,
        };

        ws.send(JSON.stringify(createRoomData));
        break;
      }
      case "joinRoom":
        break;
      case "leaveRoom":
        // TODO
        break;
      case "restartGame":
        break;
      case "startGame":
        break;

      default:
        break;
    }
  });

  const initConnectData: RoomsWithConnectPlayerRoom = {
    player: {
      id: clientID,
      name: "name" + clientID,
      roomId: null,
      roomName: null,
    },
    room: null,
    rooms,
  };

  ws.send(JSON.stringify(initConnectData));
});

// to detect and close broken connections
const interval = pingInterval(wss);

wss.on("close", function close() {
  clearInterval(interval);
});

server.listen(8888);

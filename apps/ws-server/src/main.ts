import { createServer } from "http";
import { parse } from "url";
// import { readFileSync } from "fs";
import { WebSocketServer } from "ws";
import { heartbeat, pingInterval } from "./connections/pingInterval.js";
import { ExtWebSocket } from "./types/extWebSocket.js";
import {
  ClientMessage,
  Player,
  QueryOfWS,
  Room,
  RoomsWithConnectPlayerRoom,
} from "@repo/core/room";
import { v4 as uuidv4 } from "uuid";
import { broadcastToOtherClient } from "./connections/broadcastToOtherClient.js";
const port = 8888;
let rooms: Room[] = [];
let players: Player[] = [];

// TODO : need send message to other player, need send new rooms info to not start game player

const server = createServer({
  // cert: readFileSync("/path/to/cert.pem"),
  // key: readFileSync("/path/to/key.pem"),
});
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(webSocket, req) {
  // const { query } = parse(req.url ?? "", true);
  const query = parse(req.url ?? "", true).query as unknown as QueryOfWS;

  console.log(query);
  const ws = webSocket as ExtWebSocket;
  ws.isAlive = true;
  const findPlayer = players.find((player) => player.id === query.id);
  const isReconnect = Boolean(query.id) && Boolean(findPlayer);
  const clientID = isReconnect ? query.id : uuidv4();
  ws.clientID = clientID;
  const clientName = query.name ?? "name" + clientID;

  const initPlayer: Player = {
    id: clientID,
    name: clientName,
    roomId: null,
    roomName: null,
  };

  let initConnectData: RoomsWithConnectPlayerRoom = {
    player: initPlayer,
    room: null,
    rooms,
    winner: null,
  };

  if (isReconnect) {
    //check if have room
    const playerRoom = rooms.find(({ id }) => id === query.roomId) ?? null;

    if (playerRoom) {
      initConnectData = {
        ...initConnectData,
        room: playerRoom,
        player: {
          ...initConnectData.player,
          name: clientName,
          roomId: playerRoom.id,
          roomName: playerRoom.name,
        },
      };
    }
  } else {
    players.push(initPlayer);
  }

  ws.send(JSON.stringify(initConnectData));

  // events write down here
  ws.on("error", console.error);

  ws.on("pong", heartbeat);

  ws.on("ping", () => {
    console.log("uuuu");
    ws.send(JSON.stringify("pong"));
  });

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
        const newRoomName = roomName ?? `roomName-${newRoomId}`;

        const player = {
          id: playerId,
          name: playerName,
          roomId: newRoomId,
          roomName: newRoomName,
        };

        const createRoom = {
          id: newRoomId,
          name: newRoomName,
          player1: player,
          player2: null,
          current,
          lastPlayer: player,
        };

        rooms.push(createRoom);

        players = players.map((playerData) =>
          playerData.id === playerId ? player : playerData,
        );

        const createRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: createRoom,
          rooms,
          winner: null,
        };

        broadcastToOtherClient(wss, ws, rooms, players);

        ws.send(JSON.stringify(createRoomData));
        break;
      }
      case "joinRoom": {
        const player = {
          id: playerId,
          name: playerName,
          roomId,
          roomName,
        };

        rooms = rooms.reduce<Room[]>((acc, cur) => {
          if (cur.id !== roomId) {
            acc.push(cur);
            return acc;
          }

          const isJoinPlayer1 = cur.player1 === null;

          acc.push({
            ...cur,
            ...(isJoinPlayer1 ? { player1: player } : { player2: player }),
          });

          return acc;
        }, []);

        players = players.map((playerData) =>
          playerData.id === playerId ? player : playerData,
        );

        const joinRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: rooms.find((room) => room.id === roomId) ?? null,
          rooms,
          winner: null,
        };

        broadcastToOtherClient(wss, ws, rooms, players);

        ws.send(JSON.stringify(joinRoomData));
        break;
      }
      case "leaveRoom": {
        rooms = rooms.reduce<Room[]>((acc, cur) => {
          if (cur.id !== roomId) {
            acc.push(cur);
            return acc;
          }

          if (cur.player1 && cur.player2) {
            const isPlayer1 = cur.player1.id === playerId;

            acc.push({
              ...cur,

              ...(isPlayer1 ? { player1: null } : { player2: null }),
            });
          }

          return acc;
        }, []);

        const player = {
          id: playerId,
          name: playerName,
          roomId: null,
          roomName: null,
        };

        players = players.map((playerData) =>
          playerData.id === playerId ? player : playerData,
        );

        const leaveRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: null,
          rooms,
          winner: null,
        };

        broadcastToOtherClient(wss, ws, rooms, players);

        ws.send(JSON.stringify(leaveRoomData));
        break;
      }
      case "restartGame": {
        // the new current board is send from client
        const player = {
          id: playerId,
          name: playerName,
          roomId,
          roomName,
        };

        rooms = rooms.reduce<Room[]>((acc, cur) => {
          if (cur.id !== roomId) {
            acc.push(cur);
            return acc;
          }

          const isPlayer1Start = playerId === cur.player1?.id;

          acc.push({
            ...cur,
            current,
            lastPlayer: isPlayer1Start ? cur.player1 : cur.player2,
          });

          return acc;
        }, []);

        const joinRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: rooms.find((room) => room.id === roomId) ?? null,
          rooms,
          winner: null,
        };

        ws.send(JSON.stringify(joinRoomData));
        break;
      }
      case "startGame": {
        // the new current board is send from client
        const player = {
          id: playerId,
          name: playerName,
          roomId,
          roomName,
        };

        rooms = rooms.reduce<Room[]>((acc, cur) => {
          if (cur.id !== roomId) {
            acc.push(cur);
            return acc;
          }

          const isPlayer1Start = playerId === cur.player1?.id;

          acc.push({
            ...cur,
            current,
            lastPlayer: isPlayer1Start ? cur.player1 : cur.player2,
          });

          return acc;
        }, []);

        const joinRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: rooms.find((room) => room.id === roomId) ?? null,
          rooms,
          winner: null,
        };

        ws.send(JSON.stringify(joinRoomData));
        break;
        break;
      }
      case "go": {
        // the new current board is send from client
        const player = {
          id: playerId,
          name: playerName,
          roomId,
          roomName,
        };

        rooms = rooms.reduce<Room[]>((acc, cur) => {
          if (cur.id !== roomId) {
            acc.push(cur);
            return acc;
          }

          acc.push({
            ...cur,
            current,
            lastPlayer: player,
          });

          return acc;
        }, []);

        const joinRoomData: RoomsWithConnectPlayerRoom = {
          player,
          room: rooms.find((room) => room.id === roomId) ?? null,
          rooms,
          winner: null, // TODO: there should check winner, if no winner return null
        };

        ws.send(JSON.stringify(joinRoomData));
        break;
      }
      default: {
        // other message like ping
        console.log("pong");
        ws.send(JSON.stringify("pong"));
        break;
      }
    }
  });
});

// to detect and close broken connections
const interval = pingInterval(wss);

wss.on("close", function close() {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
});

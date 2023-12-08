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
import { createRoom } from "./connections/message/createRoom.js";
import { leaveRoom } from "./connections/message/leaveRoom.js";
import { joinRoom } from "./connections/message/joinRoom.js";
import { restartGame } from "./connections/message/restartGame.js";
import { startGame } from "./connections/message/startGame.js";
import { nextMove } from "./connections/message/nextMove.js";
const port = 8888; //should be in .env
const rooms: Room[] = [];
const players: Player[] = [];

// TODO : need send message to other player, need send new rooms info to not start game player

const server = createServer({
  // cert: readFileSync("/path/to/cert.pem"),
  // key: readFileSync("/path/to/key.pem"),
});
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(webSocket, req) {
  // const { query } = parse(req.url ?? "", true);
  const query = parse(req.url ?? "", true).query as unknown as QueryOfWS;
  // console.log(query);
  // console.log("players", JSON.stringify(players));
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

  ws.on("message", function message(data) {
    let clientMessage: ClientMessage | null = null;
    try {
      clientMessage = JSON.parse(
        data as unknown as string,
      ) as unknown as ClientMessage;
    } catch (error) {
      console.log(error);
    }
    if (!clientMessage) {
      return;
    }

    console.log("received clientMessage: %s", clientMessage);

    switch (clientMessage.type) {
      case "createRoom": {
        const { responseData } = createRoom({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: { to: "InLobby" },
        });

        ws.send(JSON.stringify(responseData));
        break;
      }
      case "joinRoom": {
        const { responseData, opponentPlayer } = joinRoom({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: {
            to: "InLobbyAndOpponentPlayer",
            OpponentPlayerID: opponentPlayer?.id ?? "",
          },
        });

        ws.send(JSON.stringify(responseData));
        break;
      }
      case "leaveRoom": {
        const { responseData, opponentPlayer } = leaveRoom({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: {
            to: "InLobbyAndOpponentPlayer",
            OpponentPlayerID: opponentPlayer?.id ?? "",
          },
        });

        ws.send(JSON.stringify(responseData));
        break;
      }
      case "restartGame": {
        const { responseData, opponentPlayer } = restartGame({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: {
            to: "OpponentPlayer",
            OpponentPlayerID: opponentPlayer?.id ?? "",
          },
        });

        ws.send(JSON.stringify(responseData));
        break;
      }
      case "startGame": {
        const { responseData, opponentPlayer } = startGame({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: {
            to: "OpponentPlayer",
            OpponentPlayerID: opponentPlayer?.id ?? "",
          },
        });

        ws.send(JSON.stringify(responseData));
        break;
        break;
      }
      case "nextMove": {
        const { responseData, opponentPlayer } = nextMove({
          wss,
          ws,
          rooms,
          players,
          clientMessage,
        });

        broadcastToOtherClient({
          wss,
          broadcastWs: ws,
          rooms,
          players,
          broadcast: {
            to: "OpponentPlayer",
            OpponentPlayerID: opponentPlayer?.id ?? "",
          },
        });

        ws.send(JSON.stringify(responseData));
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

import {
  CreateRoomClientMessage,
  Player,
  Room,
  RoomsWithConnectPlayerRoom,
} from "@repo/core/room";
import { ExtWebSocket, Wss } from "../../types/extWebSocket.js";
import { v4 as uuidv4 } from "uuid";

export interface Param {
  wss: Wss;
  ws: ExtWebSocket;
  rooms: Room[];
  players: Player[];
  clientMessage: CreateRoomClientMessage;
}

export const createRoom = ({
  // wss,
  // ws,
  rooms,
  players,
  clientMessage,
}: Param) => {
  const { playerId, current, playerName, roomName } = clientMessage;

  const newRoomId = uuidv4();
  const newRoomName = roomName ?? `roomName-${newRoomId}`;

  const player: Player = {
    id: playerId,
    name: playerName,
    roomId: newRoomId,
    roomName: newRoomName,
  };

  const createdRoom: Room = {
    id: newRoomId,
    name: newRoomName,
    player1: player,
    player2: null,
    current,
    lastPlayer: player,
    winner: null,
  };

  rooms.push(createdRoom);

  const nextPlayers = players.map((playerData) =>
    playerData.id === playerId ? player : playerData,
  );

  players.splice(0, Infinity, ...nextPlayers);

  const responseData: RoomsWithConnectPlayerRoom = {
    player,
    room: createdRoom,
    rooms,
  };

  return {
    responseData,
  };
};

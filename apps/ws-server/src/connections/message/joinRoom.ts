import {
  JoinRoomClientMessage,
  Player,
  Room,
  RoomsWithConnectPlayerRoom,
} from "@repo/core/room";
import { ExtWebSocket, Wss } from "../../types/extWebSocket.js";

export interface Param {
  wss: Wss;
  ws: ExtWebSocket;
  rooms: Room[];
  players: Player[];
  clientMessage: JoinRoomClientMessage;
}

export const joinRoom = ({
  // wss,
  // ws,
  rooms,
  players,
  clientMessage,
}: Param) => {
  const { playerId, playerName, roomId, roomName /* current, roomName */ } =
    clientMessage;

  let opponentPlayer: Player | null = null;

  const player = {
    id: playerId,
    name: playerName,
    roomId,
    roomName,
  };

  const nextRooms = rooms.reduce<Room[]>((acc, cur) => {
    if (cur.id !== roomId) {
      acc.push(cur);
      return acc;
    }

    const isJoinToPlayer1 = cur.player1 === null;

    opponentPlayer = isJoinToPlayer1 ? cur.player2 : cur.player1;

    acc.push({
      ...cur,
      ...(isJoinToPlayer1 ? { player1: player } : { player2: player }),
    });

    return acc;
  }, []);

  rooms.splice(0, Infinity, ...nextRooms);

  const nextPlayers = players.map((playerData) =>
    playerData.id === playerId ? player : playerData,
  );

  players.splice(0, Infinity, ...nextPlayers);

  const responseData: RoomsWithConnectPlayerRoom = {
    player,
    room: rooms.find((room) => room.id === roomId) ?? null,
    rooms,
  };

  return {
    responseData,
    opponentPlayer: opponentPlayer as unknown as Player | null,
  };
};

import {
  LeaveRoomClientMessage,
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
  clientMessage: LeaveRoomClientMessage;
}

export const leaveRoom = ({
  // wss,
  // ws,
  rooms,
  players,
  clientMessage,
}: Param) => {
  const { playerId, playerName, roomId /* current, roomName */ } =
    clientMessage;

  let opponentPlayer: Player | null = null;

  const nextRooms = rooms.reduce<Room[]>((acc, cur) => {
    if (cur.id !== roomId) {
      acc.push(cur);
      return acc;
    }

    if (cur.player1 && cur.player2) {
      const isPlayer1 = cur.player1.id === playerId;

      opponentPlayer = isPlayer1 ? cur.player2 : cur.player1;

      acc.push({
        ...cur,
        // current, // if need reset board
        ...(isPlayer1 ? { player1: null } : { player2: null }),
        lastPlayer: null,
      });
    }

    return acc;
  }, []);

  rooms.splice(0, Infinity, ...nextRooms);

  const player = {
    id: playerId,
    name: playerName,
    roomId: null,
    roomName: null,
  };

  const nextPlayers = players.map((playerData) =>
    playerData.id === playerId ? player : playerData,
  );

  players.splice(0, Infinity, ...nextPlayers);

  const responseData: RoomsWithConnectPlayerRoom = {
    player,
    room: null,
    rooms,
  };

  return {
    responseData,
    opponentPlayer: opponentPlayer as unknown as Player | null,
  };
};

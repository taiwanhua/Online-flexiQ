import {
  NextMoveClientMessage,
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
  clientMessage: NextMoveClientMessage;
}

export const nextMove = ({
  // wss,
  // ws,
  rooms,
  // players,
  clientMessage,
}: Param) => {
  const { playerId, playerName, roomId, roomName, current } = clientMessage;

  let opponentPlayer: Player | null = null;

  // the new current board is send from client
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

    opponentPlayer = playerId === cur.player1?.id ? cur.player2 : cur.player1;

    acc.push({
      ...cur,
      current,
      lastPlayer: player,
    });

    return acc;
  }, []);

  rooms.splice(0, Infinity, ...nextRooms);

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

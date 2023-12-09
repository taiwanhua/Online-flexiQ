import {
  StartGameClientMessage,
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
  clientMessage: StartGameClientMessage;
}

export const startGame = ({
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

    const isPlayer1Start = playerId === cur.player1?.id; // who send startGame, will be first player

    opponentPlayer = isPlayer1Start ? cur.player2 : cur.player1;

    acc.push({
      ...cur,
      current,
      lastPlayer: isPlayer1Start ? cur.player2 : cur.player1,
      winner: null,
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

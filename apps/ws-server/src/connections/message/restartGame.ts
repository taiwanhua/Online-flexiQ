import {
  RestartGameClientMessage,
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
  clientMessage: RestartGameClientMessage;
}

export const restartGame = ({
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

    const isPlayer1Restart = playerId === cur.player1?.id; // who send restartGame, will be second player

    opponentPlayer = isPlayer1Restart ? cur.player2 : cur.player1;

    acc.push({
      ...cur,
      current,
      player1: isPlayer1Restart ? cur.player2 : cur.player1,
      player2: isPlayer1Restart ? cur.player1 : cur.player2,
      lastPlayer: isPlayer1Restart ? cur.player1 : cur.player2,
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

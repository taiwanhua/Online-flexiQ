import {
  RotateMoveClientMessage,
  Player,
  Room,
  RoomsWithConnectPlayerRoom,
  Winner,
} from "@repo/core/room";
import { ExtWebSocket, Wss } from "../../types/extWebSocket.js";
import { checkWinner } from "../../utils/checkboard/checkWinner.js";

export interface Param {
  wss: Wss;
  ws: ExtWebSocket;
  rooms: Room[];
  players: Player[];
  clientMessage: RotateMoveClientMessage;
}

export const rotateMove = ({
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

    if (!cur.player1 || !cur.player2) {
      return acc; //never happened, just for ts type check
    }

    opponentPlayer = playerId === cur.player1.id ? cur.player2 : cur.player1;

    const winnerResult = checkWinner(current);

    let winner: Winner = null;

    if (winnerResult === "tie") {
      winner = [cur.player1, cur.player2];
    }
    if (winnerResult === "b") {
      winner = [cur.player1];
    }

    if (winnerResult === "w") {
      winner = [cur.player2];
    }

    acc.push({
      ...cur,
      current,
      lastPlayer: player,
      winner,
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

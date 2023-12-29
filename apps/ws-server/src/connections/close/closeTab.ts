import { Player, Room } from "@repo/core/room";
import { ExtWebSocket } from "../../types/extWebSocket.js";

export interface Param {
  // wss: Wss;
  ws: ExtWebSocket;
  rooms: Room[];
  players: Player[];
  // clientMessage: LeaveRoomClientMessage;
}

export const closeTab = ({
  // wss,
  ws,
  rooms,
  players, // clientMessage,
}: Param) => {
  let opponentPlayer: Player | null = null;

  const nextRooms = rooms.reduce<Room[]>((acc, cur) => {
    if (
      cur.player1 &&
      cur.player2 &&
      (cur.player1.id === ws.clientID || cur.player2.id === ws.clientID)
    ) {
      const isPlayer1 = cur.player1.id === ws.clientID;

      opponentPlayer = isPlayer1 ? cur.player2 : cur.player1;

      acc.push({
        ...cur,
        // current, // if need reset board
        ...(isPlayer1 ? { player1: null } : { player2: null }),
        lastPlayer: null,
      });
    }

    if (cur.player1?.id === ws.clientID || cur.player2?.id === ws.clientID) {
      return acc;
    }

    acc.push(cur);
    return acc;
  }, []);

  rooms.splice(0, Infinity, ...nextRooms);

  const nextPlayers = players.filter(({ id }) => id !== ws.clientID);

  players.splice(0, Infinity, ...nextPlayers);

  // const responseData: RoomsWithConnectPlayerRoom = {
  //   player,
  //   room: null,
  //   rooms,
  // };

  return {
    // responseData,
    opponentPlayer: opponentPlayer as unknown as Player | null,
  };
};

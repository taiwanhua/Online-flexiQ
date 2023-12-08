import { Player, Room, RoomsWithConnectPlayerRoom } from "@repo/core/room";
import { ExtWebSocket, Wss } from "../types/extWebSocket.js";

export const broadcastToOtherClient = (
  wss: Wss,
  broadcastWs: ExtWebSocket,
  rooms: Room[],
  players: Player[],
) => {
  // A client WebSocket broadcasting to every other connected WebSocket clients, excluding itself.
  wss.clients.forEach(function each(clientWS) {
    // const broadcastWsClientID = broadcastWs.clientID;
    const client = clientWS as ExtWebSocket;
    const clientPlayer = players.find(
      (player) => player.id === client.clientID,
    );

    if (client !== broadcastWs && client.readyState === 1 && clientPlayer) {
      //WebSocket.OPEN = 1

      const clientRoom =
        rooms.find(
          (room) =>
            room.player1?.id === clientPlayer.id ||
            room.player2?.id === clientPlayer.id,
        ) ?? null;

      const leaveRoomClientData: RoomsWithConnectPlayerRoom = {
        player: clientPlayer,
        room: clientRoom,
        rooms,
        winner: null,
      };

      client.send(JSON.stringify(leaveRoomClientData));
    }
  });
};

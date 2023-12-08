import { Player, Room, RoomsWithConnectPlayerRoom } from "@repo/core/room";
import { ExtWebSocket, Wss } from "../types/extWebSocket.js";

interface Broadcast {
  to: "All" | "InLobby";
}

interface BroadcastWithOpponentPlayer {
  to: "InLobbyAndOpponentPlayer" | "OpponentPlayer";
  OpponentPlayerID: string; // if have viewPlayer in future, there should be string[] type
}

export interface Param {
  wss: Wss;
  broadcastWs: ExtWebSocket;
  rooms: Room[];
  players: Player[];
  broadcast: Broadcast | BroadcastWithOpponentPlayer;
}

export const broadcastToOtherClient = ({
  wss,
  broadcastWs,
  rooms,
  players,
  broadcast,
}: Param) => {
  // A client WebSocket broadcasting to every other connected WebSocket clients, excluding itself.
  wss.clients.forEach(function each(clientWS) {
    // const broadcastWsClientID = broadcastWs.clientID;
    const client = clientWS as ExtWebSocket;
    const clientPlayer = players.find(
      (player) => player.id === client.clientID,
    );

    if (client === broadcastWs || client.readyState !== 1 || !clientPlayer) {
      //WebSocket.OPEN = 1
      return;
    }
    if (
      broadcast.to === "OpponentPlayer" &&
      broadcast.OpponentPlayerID !== client.clientID
    ) {
      return;
    }

    const clientRoom: Room | null =
      rooms.find(
        (room) =>
          room.player1?.id === clientPlayer.id ||
          room.player2?.id === clientPlayer.id,
      ) ?? null;

    if (broadcast.to === "InLobby" && clientRoom) {
      return;
    }

    if (
      broadcast.to === "InLobbyAndOpponentPlayer" &&
      broadcast.OpponentPlayerID !== client.clientID &&
      clientRoom
    ) {
      return;
    }

    const responseData: RoomsWithConnectPlayerRoom = {
      player: clientPlayer,
      room: clientRoom,
      rooms,
    };

    client.send(JSON.stringify(responseData));
  });
};

import { Player, Room } from "@repo/core/room";
import { ExtWebSocket, WebSocket, Wss } from "../types/extWebSocket.js";
import { broadcastToOtherClient } from "./broadcastToOtherClient.js";
import { closeTab } from "./close/closeTab.js";

// to detect and close broken connections
export const pingInterval = (wss: Wss, rooms: Room[], players: Player[]) =>
  setInterval(function ping() {
    wss.clients.forEach(function each(webSocket) {
      const ws = webSocket as ExtWebSocket;
      console.log("client id :", ws.clientID);
      if (ws.isAlive === false) {
        const { opponentPlayer } = closeTab({ ws, rooms, players });

        if (opponentPlayer) {
          broadcastToOtherClient({
            wss,
            broadcastWs: ws,
            rooms,
            players,
            broadcast: {
              to: "InLobbyAndOpponentPlayer",
              OpponentPlayerID: opponentPlayer?.id ?? "",
            },
          });
        } else {
          broadcastToOtherClient({
            wss,
            broadcastWs: ws,
            rooms,
            players,
            broadcast: { to: "InLobby" },
          });
        }

        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 10000);

export function heartbeat(this: WebSocket) {
  (this as ExtWebSocket).isAlive = true;
}

import { ExtWebSocket, WebSocket, Wss } from "../types/extWebSocket.js";

// to detect and close broken connections
export const pingInterval = (wss: Wss) =>
  setInterval(function ping() {
    wss.clients.forEach(function each(webSocket) {
      const ws = webSocket as ExtWebSocket;
      console.log("client id :", ws.clientID);
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 10000);

export function heartbeat(this: WebSocket) {
  (this as ExtWebSocket).isAlive = true;
}

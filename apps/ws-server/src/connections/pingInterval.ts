import type { IncomingMessage } from "http";
import WebSocket from "ws";
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20780
export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  clientID: string;
}

// to detect and close broken connections
export const pingInterval = (
  wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
) =>
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
  }, 3000);

export function heartbeat(this: WebSocket) {
  (this as ExtWebSocket).isAlive = true;
}

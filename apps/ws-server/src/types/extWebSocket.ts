import type { IncomingMessage } from "http";
import WebSocket from "ws";
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20780
export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  clientID: string;
}

export type Wss = WebSocket.Server<typeof WebSocket, typeof IncomingMessage>;

export { WebSocket };

export interface Player {
  id: string;
  name: string;
  roomId: string | null;
  roomName: string | null;
}

export type Row = [string, string, string, string];

export type Board = [Row, Row, Row, Row];

export interface Room {
  id: string;
  name: string;
  player1: Player | null;
  player2: Player | null;
  // history: []; // if need regret chess
  current: Board;
  lastPlayer: Player | null;
}

export interface RoomsWithConnectPlayerRoom {
  rooms: Room[];
  player: Player;
  room: Room | null;
  winner: Player | null;
}

export interface ClientMessage {
  type:
    | "joinRoom"
    | "createRoom"
    | "leaveRoom"
    | "startGame"
    | "restartGame"
    | "go";
  roomId: string | null;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface QueryOfWS {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
}

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
  winner: Player | null;
}

export interface RoomsWithConnectPlayerRoom {
  rooms: Room[];
  player: Player;
  room: Room | null;
}

export type ClientMessageType =
  | "joinRoom"
  | "createRoom"
  | "leaveRoom"
  | "startGame"
  | "restartGame"
  | "nextMove";

export interface JoinRoomClientMessage {
  type: "joinRoom";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface CreateRoomClientMessage {
  type: "createRoom";
  roomId: null;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface LeaveRoomClientMessage {
  type: "leaveRoom";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface StartGameClientMessage {
  type: "startGame";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface RestartGameClientMessage {
  type: "restartGame";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export interface NextMoveClientMessage {
  type: "nextMove";
  roomId: string;
  roomName: string;
  playerId: string;
  playerName: string;
  current: Board;
}

export type ClientMessage =
  | JoinRoomClientMessage
  | CreateRoomClientMessage
  | LeaveRoomClientMessage
  | StartGameClientMessage
  | RestartGameClientMessage
  | NextMoveClientMessage;

export interface QueryOfWS {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
}

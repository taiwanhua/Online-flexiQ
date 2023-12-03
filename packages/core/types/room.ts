export interface Player {
  id: string;
  name: string;
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

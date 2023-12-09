import { Board } from "@repo/core/room";

export function rotate(board: Board) {
  const outside = board[0][0];
  const inside = board[1][1];
  for (let c = 0; c < 3; c++) {
    board[0][c] = board[0][c + 1];
  }
  for (let r = 0; r < 3; r++) {
    board[r][3] = board[r + 1][3];
  }
  for (let c = 3; c > 0; c--) {
    board[3][c] = board[3][c - 1];
  }
  for (let r = 3; r > 0; r--) {
    board[r][0] = board[r - 1][0];
  }
  board[1][0] = outside;
  board[1][1] = board[1][2];
  board[1][2] = board[2][2];
  board[2][2] = board[2][1];
  board[2][1] = inside;
}

import { Board, Tile } from "@repo/core/room";

type WinnerResult = Tile | "tie";

export function checkWinner(board: Board): WinnerResult {
  const winners: Tile[] = [];
  for (let i = 0; i < 4; i++) {
    if (board[i][0] !== "") {
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][2] === board[i][3]
      ) {
        winners.push(board[i][0]);
      }
    }
    if (board[0][i] !== "") {
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[2][i] === board[3][i]
      ) {
        winners.push(board[0][i]);
      }
    }
  }
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[2][2] === board[3][3]
  ) {
    winners.push(board[0][0]);
  }
  if (
    board[0][3] !== "" &&
    board[0][3] === board[1][2] &&
    board[1][2] === board[2][1] &&
    board[2][1] === board[3][0]
  ) {
    winners.push(board[0][3]);
  }

  if (winners.length === 2) {
    return winners[0] === winners[1] ? winners[0] : "tie";
  }
  if (winners.length === 1) {
    return winners[0];
  }

  return "";
}

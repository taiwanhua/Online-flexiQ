let board;
let rows = 4;
let columns = 4;
const BlackPlayer = "b";
const WhitePlayer = "w";
let currentPlayer = BlackPlayer;
let nowSelectPiece = [];
let gameOver = false;
let checkTimes = 0;

let winner = document.getElementById("winner");

let blackPieces = document.getElementsByClassName("blackPiece");
let whitePieces = document.getElementsByClassName("whitePiece");
let tiles = document.getElementsByClassName("tile");
let reStart = document.getElementById("restart");

reStart.addEventListener("click", newGame);

function newGame() {
  location.reload();
}

window.onload = function () {
  setGame();
};

function setGame() {
  board = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = "t" + r.toString() + "-" + c.toString();
      tile.className = "tile";
      tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
  }
}

function updateTile(tile, num) {
  tile.innerHTML = null;
  let piece = document.createElement("div");
  piece.id = tile.id.slice(1);
  if (num === "b") {
    piece.classList.add("blackPiece");
    tile.append(piece);
  } else if (num === "w") {
    piece.classList.add("whitePiece");
    tile.append(piece);
  }
}

function setPiece() {
  if (nowSelectPiece.length || gameOver) {
    return;
  }
  let coord = this.id.slice(1).split("-");
  let r = parseInt(coord[0]);
  let c = parseInt(coord[1]);
  if (!this.innerHTML) {
    if (currentPlayer === BlackPlayer) {
      board[r][c] = BlackPlayer;
      updateTile(this, board[r][c]);
      setTimeout(rotate, 100);
      currentPlayer = WhitePlayer;

      setTimeout(() => {
        if (!gameOver) {
          changeSelect(blackPieces, whitePieces);
        }
      }, 110);
    } else {
      board[r][c] = WhitePlayer;
      updateTile(this, board[r][c]);
      setTimeout(rotate, 100);
      currentPlayer = BlackPlayer;
      setTimeout(() => {
        if (!gameOver) {
          changeSelect(whitePieces, blackPieces);
        }
      }, 110);
    }
  }
  function changeSelect(add, remove) {
    for (let piece of add) {
      piece.addEventListener("click", selectPiece);
    }
    for (let piece of remove) {
      piece.removeEventListener("click", selectPiece);
    }
  }
  setTimeout(() => {
    if (
      document.querySelectorAll(".blackPiece,.whitePiece").length === 16 &&
      !gameOver
    ) {
      document.getElementById("checkWinner").style.display = "block";
      document
        .getElementById("checkWinner")
        .addEventListener("click", checkFiveTimes);
    }
  }, 110);

  document.getElementById("player").innerText =
    currentPlayer === BlackPlayer ? "黑棋" : "白棋";
}

function checkFiveTimes() {
  if (checkTimes !== 4) {
    rotate();
    checkTimes += 1;
  } else {
    gameOver = true;
    winner.innerHTML = "平手";
  }
}

function rotate() {
  let outside = board[0][0];
  let inside = board[1][1];
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
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(
        "t" + r.toString() + "-" + c.toString()
      );
      updateTile(tile, board[r][c]);
    }
  }
  checkWinner();
}

function checkWinner() {
  let winners = [];
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
    winner.innerHTML =
      winners[0] === winners[1]
        ? winners[0] === "b"
          ? "黑棋勝"
          : "白棋勝"
        : "平手";
    gameOver = true;
    document
      .getElementById("checkWinner")
      .removeEventListener("click", checkFiveTimes);
  } else if (winners.length === 1) {
    winners[0] === "b"
      ? (winner.innerHTML = "黑棋勝")
      : (winner.innerHTML = "白棋勝");
    gameOver = true;
    document
      .getElementById("checkWinner")
      .removeEventListener("click", checkFiveTimes);
  }
}

function selectPiece() {
  let coord = this.id.split("-");
  let r = parseInt(coord[0]);
  let c = parseInt(coord[1]);

  if (nowSelectPiece.length && nowSelectPiece[0] === this) {
    removeGetAround();
  } else if (nowSelectPiece.length) {
    removeGetAround();
    this.classList.add("select");
    nowSelectPiece.push(this);
    getAround();
  } else {
    nowSelectPiece.push(this);
    this.classList.add("select");
    getAround();
  }

  function getAround() {
    if (r >= 0 && r < 3) {
      around(r + 1, c);
    }
    if (r <= 3 && r > 0) {
      around(r - 1, c);
    }
    if (c >= 0 && c < 3) {
      around(r, c + 1);
    }
    if (c <= 3 && c > 0) {
      around(r, c - 1);
    }
  }
  function around(tRow, tColumn) {
    let tile = document.getElementById(
      "t" + tRow.toString() + "-" + tColumn.toString()
    );
    if (!tile.innerHTML) {
      tile.classList.add("around");
      tile.addEventListener("click", movePiece);
    }
  }
}

function removeGetAround() {
  for (let tile of tiles) {
    tile.removeEventListener("click", movePiece);
    tile.classList.remove("around");
  }
  nowSelectPiece[0].classList.remove("select");
  nowSelectPiece.pop();
}

function movePiece() {
  let coordT = this.id.slice(1).split("-");
  let rT = parseInt(coordT[0]);
  let cT = parseInt(coordT[1]);
  let coordP = nowSelectPiece[0].id.split("-");
  let rP = parseInt(coordP[0]);
  let cP = parseInt(coordP[1]);
  board[rT][cT] = board[rP][cP];
  board[rP][cP] = "";
  let tile = document.getElementById("t" + nowSelectPiece[0].id);
  updateTile(this, board[rT][cT]);
  updateTile(tile, board[rP][cP]);
  removeGetAround();
  document.querySelectorAll(".blackPiece,.whitePiece").forEach((piece) => {
    piece.removeEventListener("click", selectPiece);
  });
}

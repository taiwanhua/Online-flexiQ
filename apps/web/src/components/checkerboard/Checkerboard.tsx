import { memo, useMemo, useCallback } from "react";
import Rule from "@/components/rule/Rule";
import { useConnectStore } from "@/zustand/useConnectStore";
import Board from "./board/Board";
import {
  Player,
  RestartGameClientMessage,
  // StartGameClientMessage,
  Tile,
} from "@repo/core/room";
import { board } from "@/constant/board";

function Checkerboard(): JSX.Element {
  const { connectStore, connectionStatus, sendJsonMessage } = useConnectStore();

  const restartGame = useCallback(() => {
    if (!connectStore || !connectStore.room) {
      return;
    }

    sendJsonMessage<RestartGameClientMessage>({
      type: "restartGame",
      roomId: connectStore.room.id,
      roomName: connectStore.room.name,
      playerId: connectStore.player.id,
      playerName: connectStore.player.name,
      current: board,
    });
  }, [connectStore, sendJsonMessage]);

  // const startGame = useCallback(() => {
  //   if (!connectStore || !connectStore.room) {
  //     return;
  //   }

  //   sendJsonMessage<StartGameClientMessage>({
  //     type: "startGame",
  //     roomId: connectStore.room.id,
  //     roomName: connectStore.room.name,
  //     playerId: connectStore.player.id,
  //     playerName: connectStore.player.name,
  //     current: board,
  //   });
  // }, [connectStore, sendJsonMessage]);

  const isCanPlay = useMemo(
    () =>
      connectStore?.room?.lastPlayer !== null &&
      connectStore?.room?.lastPlayer?.id !== connectStore?.player?.id &&
      connectStore?.room?.winner === null,
    [
      connectStore?.player?.id,
      connectStore?.room?.lastPlayer,
      connectStore?.room?.winner,
    ],
  );

  const { playerPieceColor, opponentPlayerPieceColor } = useMemo<
    Record<string, Exclude<Tile, ""> | null>
  >(() => {
    if (!connectStore || !connectStore.room?.player1) {
      return { playerPieceColor: null, opponentPlayerPieceColor: null };
    }
    const isPlayerBlack =
      connectStore.player.id === connectStore.room.player1.id;

    return {
      playerPieceColor: isPlayerBlack ? "b" : "w",
      opponentPlayerPieceColor: isPlayerBlack ? "w" : "b",
    };
  }, [connectStore]);

  const opponentPlayer: Player | null = useMemo(() => {
    if (!connectStore || !connectStore.room?.player1) {
      return null;
    }
    return connectStore.player.id === connectStore.room.player1.id
      ? connectStore.room.player2
      : connectStore.room.player1;
  }, [connectStore]);

  if (!connectionStatus) {
    return <span>The WebSocket is currently {connectionStatus}</span>;
  }

  return (
    <div className="checker_board">
      <h1>黑白轉轉棋</h1>
      <hr />
      <h2 id="winner">
        輪到： <span id="player">{isCanPlay ? "你" : "對手"}</span>
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {connectStore?.room?.winner ? (
          <button
            className="btn"
            id="restart"
            onClick={restartGame}
            type="button"
          >
            {connectStore.room.winner.length === 2
              ? "平手了，"
              : `${connectStore.room.winner[0].name} 獲勝，`}
            重新
          </button>
        ) : null}
        {/* <button className="btn" id="start" onClick={startGame} type="button">
         開始 
        </button> */}
        {/* <!-- <div id="undo" className="btn">悔棋</div> --> */}
        {/* <div className="btn" id="checkWinner">
          旋轉
        </div> */}
      </div>

      <Board
        isCanPlay={isCanPlay}
        opponentPlayerPieceColor={opponentPlayerPieceColor}
        playerPieceColor={playerPieceColor}
      />

      <div>
        <h2 id="you">
          Player 1(你 {playerPieceColor === "b" ? "黑棋" : "白棋"}) :
          {connectStore?.player?.name ?? "尚未加入"}
        </h2>

        <h2>VS</h2>
        <h2 id="opponent">
          Player 2(對手 {playerPieceColor === "b" ? "白棋" : "黑棋"}) :
          {opponentPlayer?.name ?? "尚未加入"}
        </h2>

        <Rule />
      </div>
    </div>
  );
}

export default memo(Checkerboard);

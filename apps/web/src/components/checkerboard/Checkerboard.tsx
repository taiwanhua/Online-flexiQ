import { useCallback, memo, useMemo } from "react";
import Rule from "@/components/rule/Rule";
import { board } from "@/constant/board";
import { useConnectStore } from "@/zustand/useConnectStore";

function Checkerboard(): JSX.Element {
  const { connectStore, sendJsonMessage, connectionStatus } = useConnectStore();

  const handleClickSendCreate = useCallback(() => {
    sendJsonMessage({
      type: "create",
      playerId: "playerId",
      current: board,
      playerName: "playerName",
      roomId: "roomId",
      roomName: "roomName",
    });
  }, [sendJsonMessage]);

  const whoCanPlay = useMemo(
    () =>
      connectStore?.room?.lastPlayer?.id === connectStore?.room?.player1?.id
        ? "player2"
        : "player1",
    [connectStore?.room?.lastPlayer?.id, connectStore?.room?.player1?.id],
  );

  if (!connectionStatus) {
    return <span>The WebSocket is currently {connectionStatus}</span>;
  }

  return (
    <div className="checker_board">
      <h1>黑白轉轉棋</h1>
      <hr />
      <h2 id="winner">
        輪到： <span id="player">黑棋</span>
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* <div id="restart" className="btn">
          重新
        </div> */}
        {/* <!-- <div id="undo" className="btn">悔棋</div> --> */}
        <div className="btn" id="checkWinner">
          旋轉
        </div>
      </div>

      <div id="board" />
      <div>
        <button
          disabled={connectionStatus !== "Open"}
          onClick={handleClickSendCreate}
          type="button"
        >
          Click create
        </button>

        <div>Player 1:{connectStore?.room?.player1?.name}</div>
        <div>VS</div>
        <div>Player 2:{connectStore?.room?.player2?.name}</div>
        <div> {whoCanPlay}, Please move the chess</div>

        <Rule />
      </div>
    </div>
  );
}

export default memo(Checkerboard);

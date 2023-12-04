import { useState, useEffect, useCallback, memo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Rule from "@/components/rule/Rule";
import { board } from "@/constant/board";

function Checkerboard(): JSX.Element {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState("ws://localhost:8888?");
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: (event) => console.log("opened", event),
    },
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
    }
  }, [lastJsonMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("ws://localhost:8888?ss=1"),
    [],
  );

  const handleClickSendMessage = useCallback(
    () => sendJsonMessage("Hello"),
    [],
  );

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

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

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
        <div id="checkWinner" className="btn">
          旋轉
        </div>
      </div>

      <div id="board" />
      <div>
        <button onClick={handleClickChangeSocketUrl}>
          Click Me to change Socket Url
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>

        <button
          onClick={handleClickSendCreate}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click create
        </button>
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastJsonMessage ? (
          <span>Last message: {JSON.stringify(lastJsonMessage)}</span>
        ) : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? JSON.stringify(message) : null}</span>
          ))}
        </ul>
        {readyState}
      </div>
      <Rule />
    </div>
  );
}

export default memo(Checkerboard);

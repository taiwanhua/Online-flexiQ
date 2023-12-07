import { useNavigate } from "react-router-dom";
import Checkerboard from "../checkerboard/Checkerboard";
import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import { ClientMessage, Player } from "@repo/core/room";
import { useConnect } from "@/hooks/useConnect";
import { board } from "@/constant/board";
import { sleep } from "@/utils/sleep";
import { useCallback } from "react";

function Room() {
  const [playerNameSession] = useSessionStorageState<Player | null>(
    "playerName",
    null,
  );
  const [playerInfoSession, setPlayerInfoSession] =
    useSessionStorageState<Player | null>("playerInfo", null);

  const { sendJsonMessage, lastJsonMessage } = useConnect({
    url: `ws://localhost:8888?name=${playerNameSession}&id=${playerInfoSession?.id}&roomId=${playerInfoSession?.roomId}&roomName=${playerInfoSession?.roomName}`,
  });

  const navigate = useNavigate();

  const leaveRoom = useCallback(async () => {
    if (!playerInfoSession) {
      return;
    }
    sendJsonMessage<ClientMessage>({
      type: "leaveRoom",
      roomId: playerInfoSession?.roomId,
      roomName: playerInfoSession?.roomName ?? "",
      playerId: playerInfoSession.id,
      playerName: playerInfoSession.name,
      current: board,
    });

    await sleep();

    navigate("/lobby");
  }, [navigate, playerInfoSession, sendJsonMessage]);

  return (
    <div>
      <button onClick={leaveRoom} type="button">
        回大廳
      </button>
      <Checkerboard />
    </div>
  );
}

export default Room;

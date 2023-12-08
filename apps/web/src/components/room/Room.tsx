import { useNavigate } from "react-router-dom";
import { ClientMessage } from "@repo/core/room";
import { board } from "@/constant/board";
import { useCallback } from "react";
import { useConnectStore } from "@/zustand/useConnectStore";

function Room() {
  const { connectStore, sendJsonMessage } = useConnectStore();

  const navigate = useNavigate();

  const leaveRoom = useCallback(async () => {
    if (!connectStore?.player) {
      return;
    }

    sendJsonMessage<ClientMessage>({
      type: "leaveRoom",
      roomId: connectStore.player?.roomId ?? "",
      roomName: connectStore.player?.roomName ?? "",
      playerId: connectStore.player.id,
      playerName: connectStore.player.name,
      current: board,
    });

    // await sleep();

    navigate("/lobby");
  }, [connectStore?.player, navigate, sendJsonMessage]);

  return (
    <div>
      <button onClick={leaveRoom} type="button">
        回大廳
      </button>
      {JSON.stringify(connectStore?.room?.player1)}
      {JSON.stringify(connectStore?.room?.player2)}

      {/* <Checkerboard /> */}
    </div>
  );
}

export default Room;

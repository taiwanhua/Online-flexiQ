import { ClientMessage, Player } from "@repo/core/room";
import RoomItem from "../room/roomList/RoomItem";
import { useCallback, useEffect } from "react";
import { board } from "@/constant/board";
import { useConnect } from "@/hooks/useConnect";
import { useNavigate } from "react-router-dom";
import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import { isEqual } from "lodash-es";
import { sleep } from "@/utils/sleep";

function Lobby() {
  const [playerNameSession] = useSessionStorageState<Player | null>(
    "playerName",
    null,
  );
  const [playerInfoSession, setPlayerInfoSession] =
    useSessionStorageState<Player | null>("playerInfo", null);

  const { sendJsonMessage, lastJsonMessage } = useConnect({
    url: `ws://localhost:8888?name=${playerNameSession}&id=${
      playerInfoSession?.id ?? ""
    }&roomId=${playerInfoSession?.roomId ?? ""}&roomName=${
      playerInfoSession?.roomName ?? ""
    }`,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (
      lastJsonMessage &&
      !isEqual(lastJsonMessage.player, playerInfoSession)
    ) {
      setPlayerInfoSession(lastJsonMessage.player);
    }
  }, [
    lastJsonMessage,
    playerInfoSession,
    playerInfoSession?.id,
    setPlayerInfoSession,
  ]);

  const createRoom = useCallback(async () => {
    if (!lastJsonMessage) {
      return;
    }

    const newRoomName = prompt("請輸入房間名稱:");

    switch (newRoomName) {
      case null:
        return;
      case "":
        alert("房名不能為空!");
        return;
      default:
        sendJsonMessage<ClientMessage>({
          type: "createRoom",
          roomId: null,
          roomName: newRoomName,
          playerId: lastJsonMessage.player.id,
          playerName: lastJsonMessage.player.name,
          current: board,
        });

        await sleep();

        // console.log("new room created!");
        navigate("/room");
    }
    // if (newRoomId === null) return;
  }, [lastJsonMessage, navigate, sendJsonMessage]);
  return (
    <div>
      <h1>遊戲大廳</h1>
      <h3>房間列表</h3>
      <button onClick={createRoom} type="button">
        創建房間
      </button>
      <ul>
        {lastJsonMessage?.rooms.map(({ id, name }) => (
          <RoomItem key={id} roomId={id} roomName={name} />
        ))}
      </ul>
    </div>
  );
}

export default Lobby;

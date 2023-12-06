import { ClientMessage } from "@repo/core/room";
import RoomItem from "../room/roomList/RoomItem";
import { useConnectStore } from "@/zustand/useConnectStore";
import { useCallback } from "react";
import { board } from "@/constant/board";
import { useConnect } from "@/hooks/useConnect";

function Lobby() {
  useConnect({ url: "ws://localhost:8888" });

  const { sendJsonMessage, connectStore } = useConnectStore();

  const createRoom = useCallback(() => {
    if (!connectStore) {
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
          playerId: connectStore.player.id,
          playerName: connectStore.player.name,
          current: board,
        });
      // console.log("new room created!");
    }
    // if (newRoomId === null) return;
  }, [connectStore, sendJsonMessage]);
  return (
    <div>
      <h1>遊戲大廳</h1>
      <h3>房間列表</h3>
      <button onClick={createRoom} type="button">
        創建房間
      </button>
      <ul>
        {connectStore?.rooms.map(({ id, name }) => (
          <RoomItem key={id} roomName={name} />
        ))}
      </ul>
    </div>
  );
}

export default Lobby;

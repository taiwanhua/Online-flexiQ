import { ClientMessage } from "@repo/core/room";
import RoomList from "@/components/lobby/roomList/RoomList";
import { useCallback } from "react";
import { board } from "@/constant/board";
import { useNavigate } from "react-router-dom";
import { useConnectStore } from "@/zustand/useConnectStore";

function Lobby() {
  const { connectStore, sendJsonMessage } = useConnectStore();

  const navigate = useNavigate();

  const createRoom = useCallback(async () => {
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
        console.log("sendJsonMessage", sendJsonMessage);
        sendJsonMessage<ClientMessage>({
          type: "createRoom",
          roomId: null,
          roomName: newRoomName,
          playerId: connectStore.player.id,
          playerName: connectStore.player.name,
          current: board,
        });

        // await sleep();

        // console.log("new room created!");
        navigate("/room");
    }
  }, [connectStore, navigate, sendJsonMessage]);

  return (
    <div>
      <h1>遊戲大廳</h1>
      <h3>房間列表</h3>
      <button onClick={createRoom} type="button">
        創建房間
      </button>

      <RoomList roomList={connectStore?.rooms ?? []} />
    </div>
  );
}

export default Lobby;

import { memo } from "react";
import { RoomList } from "./roomList/RoomList";
import { board } from "@/constant/board";
import { useConnectStore } from "@/zustand/useConnectStore";
import { ClientMessage } from "@repo/core/room";

function RoomsBar() {
  const { sendJsonMessage, connectStore } = useConnectStore();

  const createRoom = () => {
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
  };

  return (
    <div className="rooms_bar">
      <button
        className="create_room_btn"
        disabled={Boolean(connectStore?.room)} // TODO: disabled 樣式沒做
        onClick={createRoom}
        type="button"
      >
        Create Room
      </button>
      <RoomList roomList={connectStore?.rooms ?? []} />
    </div>
  );
}

export default memo(RoomsBar);

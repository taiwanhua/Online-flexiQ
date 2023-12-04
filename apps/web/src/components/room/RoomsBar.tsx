import { memo, useCallback, useMemo } from "react";
import { RoomList } from "./roomList/RoomList";
import { board } from "@/constant/board";
import { useConnectStore } from "@/zustand/useConnectStore";
import { ClientMessage } from "@repo/core/room";

function RoomsBar() {
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

  const leaveRoom = useCallback(() => {
    if (!connectStore) {
      return;
    }

    if (!connectStore.room) {
      return;
    }

    const { id: playerId, name: playerName } = connectStore.player;
    const { name: roomName, id: roomId, current } = connectStore.room;

    sendJsonMessage<ClientMessage>({
      type: "leaveRoom",
      roomId: roomId,
      roomName,
      playerId: playerId,
      playerName: playerName,
      current,
    });
  }, [connectStore, sendJsonMessage]);

  const isHaveRoom = useMemo(
    () => Boolean(connectStore?.room),
    [connectStore?.room],
  );

  return (
    <div className="rooms_bar">
      <button
        className="create_room_btn"
        disabled={isHaveRoom}
        onClick={isHaveRoom ? leaveRoom : createRoom}
        type="button"
      >
        {isHaveRoom ? "Leave Room" : "Create Room"}
      </button>
      <RoomList roomList={connectStore?.rooms ?? []} />
    </div>
  );
}

export default memo(RoomsBar);

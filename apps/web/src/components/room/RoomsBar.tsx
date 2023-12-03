import { useState } from "react";
import { RoomList } from "./roomList/RoomList";
import { Room } from "@repo/core/types/room";
import { board } from "@/constant/board";

const roomListData: Room[] = [
  {
    id: "Jush's room",
    name: "Jush's room",
    player1: null,
    player2: null,
    current: board,
    lastPlayer: null,
  },
];

function RoomsBar() {
  const [roomList, setRoomList] = useState<Room[]>(roomListData);

  const createRoom = () => {
    const newRoomId = prompt("請輸入房間名稱:");
    switch (newRoomId) {
      case null:
        return;
      case "":
        alert("房名不能為空!");
        return;
      default:
        setRoomList((prev) => [
          ...prev,
          {
            id: newRoomId,
            name: newRoomId,
            player1: null,
            player2: null,
            current: board,
            lastPlayer: null,
          },
        ]);
        console.log("new room created!");
    }
    // if (newRoomId === null) return;
  };

  return (
    <div className="rooms_bar">
      <button onClick={createRoom} className="create_room_btn">
        Create Room
      </button>
      <RoomList roomList={roomList} />
    </div>
  );
}

export default RoomsBar;

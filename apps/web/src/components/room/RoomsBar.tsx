import { useState } from "react";
import RoomLists from "./RoomLists";

const roomList = [
  {
    roomId: "Jush's room",
  },
];

function RoomsBar() {
  const [roomLists, setRoomLists] = useState(roomList);

  const createRoom = () => {
    const newRoomId = prompt("請輸入房間名稱:");
    switch (newRoomId) {
      case null:
        return;
      case "":
        alert("房名不能為空!");
        return;
      default:
        setRoomLists((prev) => [...prev, { roomId: newRoomId }]);
        console.log("new room created!");
    }
    // if (newRoomId === null) return;
  };

  return (
    <div className="rooms_bar">
      <button onClick={createRoom} className="create_room_btn">
        Create Room
      </button>
      <RoomLists roomLists={roomLists} />
    </div>
  );
}

export default RoomsBar;

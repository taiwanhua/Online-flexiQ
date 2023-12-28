import { ClientMessage } from "@repo/core/room";
import RoomList from "@/components/lobby/roomList/RoomList";
import { useCallback, useState } from "react";
import { board } from "@/constant/board";
import { useNavigate } from "react-router-dom";
import { useConnectStore } from "@/zustand/useConnectStore";

function Lobby() {
  const { connectStore, sendJsonMessage } = useConnectStore();
  const [showDialog, setShowDialog] = useState(false);
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  const createRoom = useCallback(() => {
    if (!connectStore) {
      return;
    }

    // const newRoomName = prompt("請輸入房間名稱:");

    switch (roomName) {
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
          roomName: roomName,
          playerId: connectStore.player.id,
          playerName: connectStore.player.name,
          current: board,
        });

        // await sleep();

        // console.log("new room created!");
        navigate("/room");
    }
  }, [connectStore, navigate, sendJsonMessage, roomName]);

  return (
    <>
      <h2 className="lobby_title">遊戲大廳</h2>
      <hr />
      <div className="lobby_container">
        <h3 className="room_list_title">房間列表</h3>
        <button
          className="create_room_btn"
          onClick={() => setShowDialog(true)}
          type="button"
        >
          創建房間
        </button>

        <RoomList roomList={connectStore?.rooms ?? []} />

        {!!showDialog && (
          <div id="mask" className="mask" onClick={() => setShowDialog(false)}>
            <div className="roomName_box" onClick={(e) => e.stopPropagation()}>
              <p className="roomName_title">請輸入房間名稱:</p>
              <input
                className="roomName_input"
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="房間名稱"
                type="text"
                value={roomName}
              />
              <button
                className="inline-block btn"
                onClick={createRoom}
                type="button"
              >
                進入遊戲
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Lobby;

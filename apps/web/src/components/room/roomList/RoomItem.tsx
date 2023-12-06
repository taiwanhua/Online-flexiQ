import { board } from "@/constant/board";
import { useConnectStore } from "@/zustand/useConnectStore";
import { ClientMessage } from "@repo/core/room";
import { memo } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export interface RoomItemProps {
  roomName: string;
}

export const RoomItem: FC<RoomItemProps> = ({ roomName }) => {
  const navigate = useNavigate();

  const { connectStore, sendJsonMessage } = useConnectStore();

  const connectRoom = () => {
    if (!connectStore) {
      return;
    }

    sendJsonMessage<ClientMessage>({
      type: "leaveRoom",
      roomId: connectStore.room?.id ?? "",
      roomName: connectStore.room?.name ?? "",
      playerId: connectStore.player.id,
      playerName: connectStore.player.name,
      current: connectStore.room?.current ?? board,
    });

    navigate("/room");
  };

  return (
    <li className="room">
      <button className="room_btn" onClick={connectRoom} type="button">
        {roomName}
      </button>
    </li>
  );
};

export default memo(RoomItem);

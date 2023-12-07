import { board } from "@/constant/board";
import { sleep } from "@/utils/sleep";
import { useConnectStore } from "@/zustand/useConnectStore";
import { ClientMessage } from "@repo/core/room";
import { memo, useCallback } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export interface RoomItemProps {
  roomId: string;
  roomName: string;
}

export const RoomItem: FC<RoomItemProps> = ({ roomId, roomName }) => {
  const navigate = useNavigate();

  const { connectStore, sendJsonMessage } = useConnectStore();

  const connectRoom = useCallback(async () => {
    if (!connectStore) {
      return;
    }

    sendJsonMessage<ClientMessage>({
      type: "joinRoom",
      roomId: roomId,
      roomName: roomName,
      playerId: connectStore.player.id,
      playerName: connectStore.player.name,
      current: connectStore.room?.current ?? board,
    });

    await sleep();

    navigate("/room");
  }, [connectStore, navigate, roomId, roomName, sendJsonMessage]);

  return (
    <li className="room">
      <button className="room_btn" onClick={connectRoom} type="button">
        {roomName}
      </button>
    </li>
  );
};

export default memo(RoomItem);

import { board } from "@/constant/board";
import { useConnectStore } from "@/zustand/useConnectStore";
import { ClientMessage } from "@repo/core/room";
import { memo, useCallback } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export interface RoomItemProps {
  roomId: string;
  roomName: string;
  isFull: boolean;
}

export const RoomItem: FC<RoomItemProps> = ({ roomId, roomName, isFull }) => {
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

    // await sleep();

    navigate("/room");
  }, [connectStore, navigate, roomId, roomName, sendJsonMessage]);

  return (
    <button
      disabled={isFull}
      onClick={isFull ? undefined : connectRoom}
      className="room"
    >
      <li className="flex justify-between">
        {roomName}
        {isFull ? " (Room is full)" : null}
      </li>
    </button>
  );
};

export default memo(RoomItem);

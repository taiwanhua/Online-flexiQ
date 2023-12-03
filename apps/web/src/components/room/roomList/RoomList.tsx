import type { FC } from "react";
import { RoomItem } from "./RoomItem";
import { Room } from "@repo/core/types/room";

export interface RoomListProps {
  roomList: Room[];
}

export const RoomList: FC<RoomListProps> = ({ roomList }) => {
  return (
    <nav>
      <ul>
        {roomList.map(({ id }) => (
          <RoomItem key={id} roomId={id} />
        ))}
      </ul>
    </nav>
  );
};

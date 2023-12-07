import { memo, type FC } from "react";
import { RoomItem } from "./RoomItem";
import { Room } from "@repo/core/room";

export interface RoomListProps {
  roomList: Room[];
}

export const RoomList: FC<RoomListProps> = ({ roomList }) => {
  return (
    <nav>
      <ul>
        {roomList.map(({ id, name }) => (
          <RoomItem key={id} roomId={id} roomName={name} />
        ))}
      </ul>
    </nav>
  );
};

export default memo(RoomList);

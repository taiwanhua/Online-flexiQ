import { memo, type FC } from "react";
import { RoomItem } from "./RoomItem";
import { Room } from "@repo/core/room";

export interface RoomListProps {
  roomList: Room[];
}

export const RoomList: FC<RoomListProps> = ({ roomList }) => {
  return (
    <nav className="roomList">
      {roomList.map(({ id, name, player1, player2 }) => (
        <RoomItem
          isFull={Boolean(player1 && player2)}
          key={id}
          roomId={id}
          roomName={name}
        />
      ))}
    </nav>
  );
};

export default memo(RoomList);

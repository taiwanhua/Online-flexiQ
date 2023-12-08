import { memo, type FC } from "react";
import { RoomItem } from "./RoomItem";
import { Room } from "@repo/core/room";

export interface RoomListProps {
  roomList: Room[];
}

export const RoomList: FC<RoomListProps> = ({ roomList }) => {
  return (
    <ul>
      {roomList.map(({ id, name, player1, player2 }) => (
        <RoomItem
          isFull={Boolean(player1 && player2)}
          key={id}
          roomId={id}
          roomName={name}
        />
      ))}
    </ul>
  );
};

export default memo(RoomList);

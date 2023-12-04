import { memo } from "react";
import type { FC } from "react";

export interface RoomItemProps {
  roomName: string;
}

export const RoomItem: FC<RoomItemProps> = ({ roomName }) => {
  const connectRoom = () => {
    console.log("Connect Room!");
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

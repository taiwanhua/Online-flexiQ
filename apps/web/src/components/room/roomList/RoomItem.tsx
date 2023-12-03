import type { FC } from "react";

export interface RoomItemProps {
  roomId: string;
}

export const RoomItem: FC<RoomItemProps> = ({ roomId }) => {
  const connectRoom = () => {
    console.log("Connect Room!");
  };

  return (
    <li className="room">
      <button onClick={connectRoom} className="room_btn">
        {roomId}
      </button>
    </li>
  );
};

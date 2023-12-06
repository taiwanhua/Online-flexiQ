import { memo } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export interface RoomItemProps {
  roomName: string;
}

export const RoomItem: FC<RoomItemProps> = ({ roomName }) => {
  const navigate = useNavigate();

  const connectRoom = () => {
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

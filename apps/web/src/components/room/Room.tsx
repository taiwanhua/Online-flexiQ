import { useNavigate } from "react-router-dom";
import Checkerboard from "../checkerboard/Checkerboard";

function Room() {
  const navigate = useNavigate();

  const leaveRoom = () => {
    navigate("/lobby");
  };
  return (
    <div>
      <button onClick={leaveRoom} type="button">
        回大廳
      </button>
      <Checkerboard />
    </div>
  );
}

export default Room;

export default function RoomLists({ roomLists }) {
  return (
    <nav>
      <ul>
        {roomLists.map((list) => (
          <Room key={list.roomId} roomId={list.roomId} />
        ))}
      </ul>
    </nav>
  );
}

function Room({ roomId }) {
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
}

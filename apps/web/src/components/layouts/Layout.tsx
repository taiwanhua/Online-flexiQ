import Checkerboard from "@/components/checkerboard/Checkerboard";
import RoomsBar from "@/components/room/RoomsBar";

function Layout() {
  return (
    <div className="container">
      <RoomsBar />
      <Checkerboard />
    </div>
  );
}

export default Layout;

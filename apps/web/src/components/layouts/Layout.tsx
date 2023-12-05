import { memo } from "react";
import Checkerboard from "@/components/checkerboard/Checkerboard";
import RoomsBar from "@/components/room/RoomsBar";
import { useConnect } from "@/hooks/useConnect";

function Layout() {
  useConnect({ url: "ws://localhost:8888" });
  return (
    <div className="container">
      <RoomsBar />
      <Checkerboard />
    </div>
  );
}

export default memo(Layout);

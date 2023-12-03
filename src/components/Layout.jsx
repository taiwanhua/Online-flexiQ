import CheckerBoard from "./CheckerBoard";
import RoomsBar from "./RoomsBar";

function Layout() {
  return (
    <div className="container">
      <RoomsBar />
      <CheckerBoard />
    </div>
  );
}

export default Layout;

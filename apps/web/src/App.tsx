import "./App.css";
// import Layout from "@/components/layouts/Layout";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Lobby from "./components/lobby/Lobby";
import Room from "./components/room/Room";

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<Login />} index />
      <Route element={<Lobby />} path="/lobby" />
      <Route element={<Room />} path="/room" />
    </Routes>
  );
}

export default App;

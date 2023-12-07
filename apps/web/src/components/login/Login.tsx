import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import { sleep } from "@/utils/sleep";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [, setPlayerNameSession] = useSessionStorageState<string>(
    "playerName",
    "",
  );
  const logIn = async () => {
    if (name === "") {
      alert("請輸入暱稱!");
      return;
    }
    if (typeof Storage !== "undefined") {
      setPlayerNameSession(name);
    }

    await sleep();

    navigate("/lobby");
  };
  return (
    <div>
      輸入暱稱
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
      />
      <button onClick={logIn} type="button">
        進入遊戲
      </button>
    </div>
  );
}

export default Login;

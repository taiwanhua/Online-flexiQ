import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useConnectStore } from "@/zustand/useConnectStore";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const { connectStore, setConnectStore } = useConnectStore();

  const logIn = useCallback(async () => {
    if (name === "") {
      alert("請輸入暱稱!");
      return;
    }
    if (typeof Storage !== "undefined" && connectStore) {
      setConnectStore({
        ...connectStore,
        player: { ...connectStore.player, name },
      });
    }

    // await sleep();

    navigate("/lobby");
  }, [connectStore, name, navigate, setConnectStore]);

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

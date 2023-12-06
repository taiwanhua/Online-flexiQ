import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const logIn = () => {
    if (name === "") {
      alert("請輸入暱稱!");
      return;
    }
    if (typeof Storage !== "undefined") {
      sessionStorage.setItem("playerName", name);
    }
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

import { useCallback, useState } from "react";

export default function Rule(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  return (
    <>
      <div>
        <button className="accordion" onClick={toggleHandler} type="button">
          詳細規則
        </button>
      </div>
      <div className={isOpen ? "panel" : "panel_close"}>
        <div className="rule">
          <h2>遊戲目標</h2>
          <p>先讓4顆棋子連線(水平、垂直、對角)即獲勝。</p>
          <h2>遊戲玩法</h2>
          <p>
            兩位玩家選擇自己的顏色，由黑棋先手，兩位玩家輪流將自己的一顆棋子放到棋盤上，每次擺放包含三個步驟：
          </p>
          <p>
            步驟一、可以選擇是否要將對手的一顆棋子移動到鄰近的空格上，可以選擇是否進行這個步驟，或是不去移動對手的棋子。
          </p>
          <p>
            步驟二、將自己的一顆棋子放到棋盤的任一空格，放好後就不能再移動。
          </p>
          <p>
            步驟三、每次擺放棋子後，棋盤上的棋子將會逆時針轉動一格，連線必須發生在轉動之後才算獲勝。
          </p>
          <h2>遊戲結束</h2>
          <p>
            每次棋子轉動後，先讓4顆棋子完成水平、垂直或對角連線的玩家即獲勝！如果轉動後同時連線則平手；如果棋盤上已放滿棋子但沒有人完成連線，此時，再點擊旋轉按鈕五次，若當中有其中一方先連線，則獲得勝利，若五次後都無人連線則算平手，若同時連線也算平手。
          </p>
        </div>
      </div>
    </>
  );
}

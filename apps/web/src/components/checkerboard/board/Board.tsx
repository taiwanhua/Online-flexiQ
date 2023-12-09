import { useConnectStore } from "@/zustand/useConnectStore";
import { memo, type FC, useCallback, useState, useMemo } from "react";
import Tile from "../pieces/Tile";
import WhitePiece from "../pieces/WhitePiece";
import BlackPiece from "../pieces/BlackPiece";
import {
  NextMoveClientMessage,
  Position,
  RotateMoveClientMessage,
  Tile as TileType,
} from "@repo/core/room";
import { getAround } from "@/utils/checkboard/getAround";
import { rotate } from "@/utils/checkboard/rotate";
import { isEqual } from "lodash-es";
import { getClassName } from "@/utils/getClassName";
import { sleep } from "@/utils/sleep";

export interface BoardProps {
  isCanPlay: boolean;
  playerPieceColor: Exclude<TileType, ""> | null;
  opponentPlayerPieceColor: Exclude<TileType, ""> | null;
}

export const Board: FC<BoardProps> = ({
  isCanPlay: isCanPlayFromParent,
  playerPieceColor,
  opponentPlayerPieceColor,
}) => {
  const { connectStore, sendJsonMessage } = useConnectStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMovedOpponentPiece, setIsMovedOpponentPiece] =
    useState<boolean>(false);
  const [nowSelectPieces, setNowSelectPieces] = useState<Position[]>([]);
  const [aroundPositions, setAroundPositions] = useState<Position[]>([]);

  const isCanPlay = useMemo(
    () => isCanPlayFromParent && !isLoading,
    [isCanPlayFromParent, isLoading],
  );

  const resetState = useCallback(() => {
    setNowSelectPieces([]);
    setAroundPositions([]);
    setIsMovedOpponentPiece(false);
  }, []);

  // bind in b & w Piece
  const selectPiece = useCallback(
    (position: Position) => () => {
      if (nowSelectPieces.length && isEqual(nowSelectPieces[0], position)) {
        resetState();
        return;
      }

      const nextAround = getAround(position);
      setNowSelectPieces([position]);
      setAroundPositions(nextAround);
    },
    [nowSelectPieces, resetState],
  );

  // bind in tile
  const setPiece = useCallback(
    (position: Position) => async () => {
      const { rowIndex, columnIndex } = position;
      if (
        nowSelectPieces.length &&
        !aroundPositions.some((aroundPosition) =>
          isEqual(aroundPosition, position),
        )
      ) {
        // 剔除已經選了別人的旗子 又下在不能下的地方的情況
        return;
      }

      if (
        !connectStore ||
        !connectStore.room?.current ||
        !playerPieceColor ||
        !opponentPlayerPieceColor
      ) {
        return;
      }

      setIsLoading(true);

      const board = connectStore.room.current;

      if (nowSelectPieces.length && !isMovedOpponentPiece) {
        board[nowSelectPieces[0].rowIndex][nowSelectPieces[0].columnIndex] = "";
        board[rowIndex][columnIndex] = opponentPlayerPieceColor;
        setIsMovedOpponentPiece(true);
        setAroundPositions([]);
        setNowSelectPieces([]);
        setIsLoading(false);
        sendJsonMessage<NextMoveClientMessage>({
          type: "nextMove",
          roomId: connectStore.room.id,
          roomName: connectStore.room.name,
          playerId: connectStore.player.id,
          playerName: connectStore.player.name,
          current: board,
        });
        return;
      }

      board[rowIndex][columnIndex] = playerPieceColor;

      await sleep(1000);

      rotate(board);

      resetState();

      sendJsonMessage<RotateMoveClientMessage>({
        type: "rotateMove",
        roomId: connectStore.room.id,
        roomName: connectStore.room.name,
        playerId: connectStore.player.id,
        playerName: connectStore.player.name,
        current: board,
      });

      setIsLoading(false);
      //   checkWinner(board); // do it in server
    },
    [
      aroundPositions,
      connectStore,
      isMovedOpponentPiece,
      nowSelectPieces,
      opponentPlayerPieceColor,
      playerPieceColor,
      resetState,
      sendJsonMessage,
    ],
  );

  if (!connectStore) {
    return <div id="board" />;
  }

  return (
    <>
      <div id="board">
        {connectStore.room?.current.flatMap((row, rowIndex) => {
          return row.map((column, columnIndex) => {
            const position = { rowIndex, columnIndex };
            const isSelect = isEqual(nowSelectPieces[0], position);

            const key = `${column}-${rowIndex}-${columnIndex}`;
            if (column === "b") {
              return (
                <Tile
                  className={getClassName(["tile", isSelect ? "select" : ""])}
                  key={key}
                >
                  <BlackPiece
                    className={getClassName(["blackPiece"])}
                    onClick={
                      isCanPlay &&
                      playerPieceColor === "w" &&
                      !isMovedOpponentPiece
                        ? selectPiece(position)
                        : undefined
                    }
                  />
                </Tile>
              );
            }

            if (column === "w") {
              return (
                <Tile
                  className={getClassName(["tile", isSelect ? "select" : ""])}
                  key={key}
                >
                  <WhitePiece
                    className={getClassName(["whitePiece"])}
                    key={key}
                    onClick={
                      isCanPlay &&
                      playerPieceColor === "b" &&
                      !isMovedOpponentPiece
                        ? selectPiece(position)
                        : undefined
                    }
                  />
                </Tile>
              );
            }

            const isAroundTile = aroundPositions.some((aroundPosition) =>
              isEqual(aroundPosition, position),
            );

            return (
              <Tile
                className={getClassName(["tile", isAroundTile ? "around" : ""])}
                key={key}
                onClick={isCanPlay ? setPiece(position) : undefined}
              />
            );
          });
        })}
      </div>
      {isMovedOpponentPiece
        ? "請放棋子到棋盤任一空格"
        : "請移動對手棋子或放棋子到棋盤任一空格"}
    </>
  );
};

export default memo(Board);

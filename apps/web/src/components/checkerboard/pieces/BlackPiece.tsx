import { memo, type FC, MouseEventHandler, KeyboardEventHandler } from "react";

export interface BlackPieceProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
}

export const BlackPiece: FC<BlackPieceProps> = ({
  className = "blackPiece",
  onClick,
  onKeyUp,
}) => {
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="button"
      tabIndex={-1}
    />
  );
};

export default memo(BlackPiece);

import { memo, type FC, MouseEventHandler, KeyboardEventHandler } from "react";

export interface WhitePieceProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
}

export const WhitePiece: FC<WhitePieceProps> = ({
  className = "whitePiece",
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

export default memo(WhitePiece);

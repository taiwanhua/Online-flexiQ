import {
  memo,
  type FC,
  PropsWithChildren,
  MouseEventHandler,
  KeyboardEventHandler,
} from "react";

export interface TileProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
}

export const Tile: FC<PropsWithChildren<TileProps>> = ({
  className = "tile",
  onClick,
  onKeyUp,
  children,
}) => {
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="button"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default memo(Tile);

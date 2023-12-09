import { Position } from "@repo/core/room";

export function getAround({ rowIndex, columnIndex }: Position) {
  const result = [];
  if (rowIndex >= 0 && rowIndex < 3) {
    // down
    result.push({ rowIndex: rowIndex + 1, columnIndex });
  }
  if (rowIndex <= 3 && rowIndex > 0) {
    // up
    result.push({ rowIndex: rowIndex - 1, columnIndex });
  }
  if (columnIndex >= 0 && columnIndex < 3) {
    // right
    result.push({ rowIndex, columnIndex: columnIndex + 1 });
  }
  if (columnIndex <= 3 && columnIndex > 0) {
    // left
    result.push({ rowIndex, columnIndex: columnIndex - 1 });
  }
  return result;
}

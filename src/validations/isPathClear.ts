import { Cell } from "@/widgets/chess/types";

function isPathClear(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (Cell | null)[][]
): boolean {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) {
      return false; 
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  return true;
}

export default isPathClear;

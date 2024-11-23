import { Cell } from "@/widgets/chess/types";
import isPathClear from "./isPathClear";
function isValidBishopMove(

    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    board: (Cell | null)[][]
  ): boolean {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
      return false;
    }
    if (isPathClear(fromRow, fromCol, toRow, toCol, board)) {
      return true;
    }
    return false;
  }

export default isValidBishopMove;
  
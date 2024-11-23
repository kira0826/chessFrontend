import { Cell } from "@/widgets";
import isPathClear from "./isPathClear";


//ToDo:  validate castling moves.

function isValidRookMove(

    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    board: (Cell | null)[][]
  ): boolean {
    if (fromRow !== toRow && fromCol !== toCol) {
      return false;
    }
    if (isPathClear(fromRow, fromCol, toRow, toCol, board)) {
      return true;
    }   
    return false;
  }

export default isValidRookMove;
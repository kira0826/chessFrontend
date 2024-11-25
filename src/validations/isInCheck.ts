
import { Cell } from "@/widgets/chess/types";
import { PieceType } from "@/widgets";
import isValidMove from "./isValidMove";

function wouldKingBeInCheck(
    board: (Cell | null)[][],
    isWhite: boolean
  ): boolean {
    let kingRow = -1;
    let kingCol = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell?.piece?.type === PieceType.KING && cell.piece.isWhite === isWhite) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
    }
  
    if (kingRow === -1) {
      return true; // King is missing
    }
  
    // Verificar si el rey está bajo ataque
    return isSquareUnderAttack(kingRow, kingCol, isWhite, board);
  }



  export function areSquaresUnderAttack(
    squares: { row: number; col: number }[],
    isWhite: boolean,
    board: (Cell | null)[][]
  ): boolean {
    // Iterate over all enemy pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell && cell.piece && cell.piece.isWhite !== isWhite) {
          const piece = cell.piece;
          for (const target of squares) {
            if (
              isValidMove(
                piece,
                r,
                c,
                target.row,
                target.col,
                board,
                null,
                true, 
                true,
              )
            ) {
              return true; 
            }
          }
        }
      }
    }
    return false; // None of the squares is under attack
  }
  
  export function isSquareUnderAttack(
    row: number,
    col: number,
    isWhite: boolean,
    board: (Cell | null)[][]
  ): boolean {
    return areSquaresUnderAttack([{ row, col }], isWhite, board);
  }
  
  export default wouldKingBeInCheck;
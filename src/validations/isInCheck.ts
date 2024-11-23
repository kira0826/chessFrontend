
import { Cell } from "@/widgets";
import { PieceType } from "@/widgets";
import { isSquareUnderAttack } from "./isValidKingMove";

function wouldKingBeInCheck(
    board: (Cell | null)[][],
    isWhite: boolean
  ): boolean {
    // Encontrar la posición del rey
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
  
  export default wouldKingBeInCheck;
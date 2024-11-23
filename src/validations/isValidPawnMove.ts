import { Cell, type LastMove } from "@/widgets";
import { PieceType, Piece } from "@/widgets";

function isValidPawnMove(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (Cell | null)[][],
  lastMove: LastMove | null,
  isCheckingAttack: boolean = false
): boolean {
  const direction = piece.isWhite ? -1 : 1;
  const startRow = piece.isWhite ? 6 : 1;

  if (isCheckingAttack) {
    // Solo consideramos las capturas en diagonal
    if (
      toRow === fromRow + direction &&
      (toCol === fromCol + 1 || toCol === fromCol - 1)
    ) {
      return true;
    }
    return false;
  }

  // Movimiento hacia adelante sin captura
  if (fromCol === toCol) {
    // Un cuadro hacia adelante
    if (toRow === fromRow + direction && !board[toRow][toCol]) {
      return true;
    }
    // Dos cuadros desde la posición inicial
    if (
      fromRow === startRow &&
      toRow === fromRow + 2 * direction &&
      !board[toRow][toCol] &&
      !board[fromRow + direction][toCol]
    ) {
      return true;
    }
  }

  // Captura en diagonal
  if (
    toRow === fromRow + direction &&
    (toCol === fromCol + 1 || toCol === fromCol - 1)
  ) {
    const targetCell = board[toRow][toCol];
    // Captura normal
    if (
      targetCell?.piece &&
      targetCell.piece.isWhite !== piece.isWhite
    ) {
      return true;
    }

    // Captura al paso
    const lastMovedPiece = lastMove?.piece;
    if (
      lastMovedPiece &&
      lastMovedPiece.type === PieceType.PAWN &&
      lastMovedPiece.isWhite !== piece.isWhite &&
      lastMove.toRow === fromRow &&
      lastMove.toCol === toCol &&
      Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
      fromRow === (piece.isWhite ? 3 : 4)
    ) {
      return true;
    }
  }

  return false;
}

export default isValidPawnMove

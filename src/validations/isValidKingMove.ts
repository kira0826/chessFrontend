import { Piece, Cell, PieceType } from "@/widgets";
import isValidMove from "./isValidMove";

function isValidKingMove(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (Cell | null)[][],
  ignoreKingSafety: boolean = false
): boolean {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = toCol - fromCol;

  // Movimiento normal del rey
  if (rowDiff <= 1 && Math.abs(colDiff) <= 1) {
    if (ignoreKingSafety) {
      return true;
    }
    if (isSquareUnderAttack(toRow, toCol, piece.isWhite, board)) {
      return false;
    }
    return true;
  }

  // Enroque
  if (rowDiff === 0 && Math.abs(colDiff) === 2) {
    const cell = board[fromRow][fromCol];
    if (cell?.hasMoved) {
      return false; // El rey ya se ha movido
    }

    const direction = colDiff > 0 ? 1 : -1;
    const rookCol = colDiff > 0 ? 7 : 0;
    const rookCell = board[fromRow][rookCol];

    if (
      !rookCell ||
      rookCell.piece?.type !== PieceType.ROOK ||
      rookCell.hasMoved
    ) {
      return false; // La torre no está o ya se ha movido
    }

    // Verificar que no haya piezas entre el rey y la torre
    for (let c = fromCol + direction; c !== rookCol; c += direction) {
      if (board[fromRow][c]?.piece) {
        return false; // Hay una pieza bloqueando el enroque
      }
    }

    if (ignoreKingSafety) {
      return true;
    }

    const squaresToCheck = [
      { row: fromRow, col: fromCol },
      { row: fromRow, col: fromCol + direction },
      { row: fromRow, col: fromCol + 2 * direction },
    ];

    // Para enroque largo, verificar una casilla adicional
    if (direction === -1) {
      squaresToCheck.push({ row: fromRow, col: fromCol + 3 * direction });
    }

    // Verificar si alguna de las casillas está bajo ataque
    if (areSquaresUnderAttack(squaresToCheck, piece.isWhite, board)) {
      return false; // No se puede enrocar porque una casilla está bajo ataque
    }

    return true; // El enroque es válido
  }

  return false;
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
        // Verify if this piece can attack any of the target squares
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
              true, // Ignore king safety
              true
            )
          ) {
            return true; // One of the squares is under attack
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

export default isValidKingMove;

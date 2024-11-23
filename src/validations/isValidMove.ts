import { PieceType, Cell, Piece, type LastMove } from "@/widgets";
import isValidRookMove from "./isValidRookMove";
import isValidKnightMove from "./isValidKnightMove";
import isValidBishopMove from "./isValidBishop";
import isValidKingMove from "./isValidKingMove";
import isValidPawnMove from "./isValidPawnMove";

function isValidMove(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (Cell | null)[][],
  lastMove: LastMove | null,
  ignoreKingSafety: boolean = false,
  isCheckingAttack: boolean = false
): boolean {
  // Movement inside the board
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false;
  }

  if (fromRow === toRow && fromCol === toCol) {
    return false; // Can not move to the same cell
  }

  const destinationCell = board[toRow][toCol];
  if (
    destinationCell &&
    destinationCell.piece &&
    destinationCell.piece.isWhite === piece.isWhite
  ) {
    return false; // Can not consume a piece of the same color
  }

  if (
    destinationCell &&
    destinationCell.piece &&
    destinationCell.piece.type === PieceType.KING
  ) {
    return false; // Can not consume the king
  }

  switch (piece.type) {
    case PieceType.PAWN:
      return isValidPawnMove(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        board,
        lastMove,
        isCheckingAttack
      );
    case PieceType.ROOK:
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.KNIGHT:
      return isValidKnightMove(fromRow, fromCol, toRow, toCol);
    case PieceType.BISHOP:
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.KING:
      return isValidKingMove(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        board,
        ignoreKingSafety
      );
    case PieceType.QUEEN:
      return (
        isValidBishopMove(fromRow, fromCol, toRow, toCol, board) ||
        isValidRookMove(fromRow, fromCol, toRow, toCol, board)
      );

    default:
      return false;
  }
}

export default isValidMove;

import { PieceType, Piece } from "@/widgets";
import { Cell } from "@/widgets/chess/types";
import { type LastMove } from "@/widgets/chess/types";
import isValidRookMove from "./isValidRookMove";
import isValidKnightMove from "./isValidKnightMove";
import isValidBishopMove from "./isValidBishop";
import isValidKingMove from "./isValidKingMove";
import isValidPawnMove from "./isValidPawnMove";
import doesMoveProtectKing from "./doesProtectKing";

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
  // Movimiento dentro del tablero
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false;
  }

  if (fromRow === toRow && fromCol === toCol) {
    return false; 
  }

  const destinationCell = board[toRow][toCol];
  if (
    destinationCell &&
    destinationCell.piece &&
    destinationCell.piece.isWhite === piece.isWhite
  ) {
    return false; 
  }

 

  let isValid: boolean;
  switch (piece.type) {
    case PieceType.PAWN:
      isValid = isValidPawnMove(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        board,
        lastMove,
        isCheckingAttack
      );
      break;
    case PieceType.ROOK:
      isValid = isValidRookMove(fromRow, fromCol, toRow, toCol, board);
      break;
    case PieceType.KNIGHT:
      isValid = isValidKnightMove(fromRow, fromCol, toRow, toCol);
      break;
    case PieceType.BISHOP:
      isValid = isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
      break;
    case PieceType.KING:
      isValid = isValidKingMove(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        board,
        ignoreKingSafety
      );
      break;
    case PieceType.QUEEN:
      isValid =
        isValidBishopMove(fromRow, fromCol, toRow, toCol, board) ||
        isValidRookMove(fromRow, fromCol, toRow, toCol, board);
      break;
    default:
      isValid = false;
  }

  if (!isValid) {
    return false;
  }


  const isKingProtected = doesMoveProtectKing(piece, fromRow, fromCol, toRow, toCol, board); 

  console.log("isKingProtected", isKingProtected);

  return isKingProtected
}

export default isValidMove;

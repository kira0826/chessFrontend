import { Cell } from "@/widgets/chess/types";
import {  Piece } from "@/widgets";
import wouldKingBeInCheck from "./isInCheck";

function cloneBoard(board: (Cell | null)[][]): (Cell | null)[][] {
  return board.map(row =>
    row.map(cell =>
      cell ? { ...cell, piece: cell.piece ? { ...cell.piece } : null } : null
    )
  );
}

/**
 * Verifica si un movimiento deja al rey fuera de jaque o lo protege si ya estaba en jaque.
 */
function doesMoveProtectKing(
  piece: Piece, 
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: (Cell | null)[][],
): boolean {

  const simulatedBoard = cloneBoard(board);

  // Simular el movimiento
  simulatedBoard[toRow][toCol] = { ...simulatedBoard[fromRow][fromCol], piece: simulatedBoard[fromRow][fromCol]?.piece || null };
  simulatedBoard[fromRow][fromCol] = null;

  const isWhite = piece.isWhite;
  const wasKingInCheck = wouldKingBeInCheck(board, isWhite);

  const isKingStillInCheck = wouldKingBeInCheck(simulatedBoard, isWhite);

  if (wasKingInCheck && isKingStillInCheck) {
    return false;
  }

  if (!wasKingInCheck && isKingStillInCheck) {
    return false;
  }

  return true;
}

export default doesMoveProtectKing;

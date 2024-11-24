import { Cell } from "@/widgets/chess/types";
import { Piece } from "@/widgets";
import {
    movePiece,
    handleCastling,
    handleEnPassantCapture,
    updateEnPassantEligibility
  } from "@/widgets/chess/boardAuxFunctions";

export const performMove = (
    board: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): (Cell | null)[][] => {
    let newBoard = board.map((boardRow) => boardRow.slice());

    // Mover la pieza
    newBoard = movePiece(newBoard, fromRow, fromCol, toRow, toCol, piece);

    // Manejar captura al paso
    newBoard = handleEnPassantCapture   (newBoard, piece, fromCol, toRow, toCol);

    // Actualizar elegibilidad de en passant
    newBoard = updateEnPassantEligibility(
      newBoard,
      piece,
      fromRow,
      toRow,
      toCol
    );

    // Manejar enroque
    newBoard = handleCastling(newBoard, piece, fromCol, toRow, toCol);

    return newBoard;
  };
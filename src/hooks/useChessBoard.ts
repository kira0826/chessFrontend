import { useState } from "react";
import { Cell, LastMove } from "@/widgets/chess/types";
import { Piece, PieceType } from "@/widgets";
import {
  movePiece,
  handleCastling,
  handleEnPassantCapture,
  updateEnPassantEligibility,
  isKingInCheck,
  isPromotion,
  initialBoardSetup,
} from "@/widgets/chess/boardAuxFunctions";
import isValidMove from "@/validations/isValidMove";

interface PromotionState {
  board: (Cell | null)[][];
  piece: Piece;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

interface UseChessBoardReturn {
  boardSetup: (Cell | null)[][];
  openCoronation: boolean;
  handleDragStart: (row: number, col: number) => void;
  handleDrop: (row: number, col: number) => void;
  handlePromotion: (promotedPieceType: PieceType) => void;
  setOpenCoronation: (open: boolean) => void;
  // Added missing functions to the interface
  resetBoard: () => void;
  performMove: (
    board: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => (Cell | null)[][];
  updateBoardState: (
    newBoard: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => void;
}

export function useChessBoard(): UseChessBoardReturn {
  const [boardSetup, setBoardSetup] = useState<(Cell | null)[][]>(
    initialBoardSetup()
  );
  const [openCoronation, setOpenCoronation] = useState<boolean>(false);
  const [pendingPromotion, setPendingPromotion] = useState<PromotionState | null>(
    null
  );
  const [draggedPiece, setDraggedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const updateBoardState = (
    newBoard: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    setBoardSetup(newBoard);
    setLastMove({
      piece,
      fromRow,
      fromCol,
      toRow,
      toCol,
    });
  };

  const performMove = (
    board: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): (Cell | null)[][] => {
    let newBoard = board.map((boardRow) => boardRow.slice());

    newBoard = movePiece(newBoard, fromRow, fromCol, toRow, toCol, piece);
    newBoard = handleEnPassantCapture(newBoard, piece, fromCol, toRow, toCol);
    newBoard = updateEnPassantEligibility(
      newBoard,
      piece,
      fromRow,
      toRow,
      toCol
    );
    newBoard = handleCastling(newBoard, piece, fromCol, toRow, toCol);

    return newBoard;
  };

  const handleDragStart = (row: number, col: number) => {
    setDraggedPiece({ row, col });
  };

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      const fromRow = draggedPiece.row;
      const fromCol = draggedPiece.col;
      const toRow = row;
      const toCol = col;

      const piece = boardSetup[fromRow][fromCol]?.piece;

      if (
        piece &&
        isValidMove(piece, fromRow, fromCol, toRow, toCol, boardSetup, lastMove)
      ) {
        const newBoard = performMove(
          boardSetup,
          piece,
          fromRow,
          fromCol,
          toRow,
          toCol
        );

        if (isKingInCheck(newBoard, piece.isWhite)) {
          console.log("Movimiento inválido: no puedes dejar al rey en jaque");
          setDraggedPiece(null);
          return;
        }

        if (isPromotion(piece, toRow)) {
          setOpenCoronation(true);
          setPendingPromotion({
            board: newBoard,
            piece,
            fromRow,
            fromCol,
            toRow,
            toCol,
          });
        } else {
          updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);
        }
      } else {
        console.log("Movimiento inválido");
      }
      setDraggedPiece(null);
    }
  };

  const handlePromotion = (promotedPieceType: PieceType) => {
    if (pendingPromotion) {
      const { board, piece, fromRow, fromCol, toRow, toCol } = pendingPromotion;

      const newBoard = board.map((boardRow) => boardRow.slice());
      newBoard[toRow][toCol] = {
        piece: {
          isWhite: piece.isWhite,
          type: promotedPieceType,
        },
        hasMoved: true,
      };

      updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);
      setPendingPromotion(null);
      setOpenCoronation(false);
    }
  };

  // Added reset board function
  const resetBoard = () => {
    setBoardSetup(initialBoardSetup());
    setLastMove(null);
    setPendingPromotion(null);
    setOpenCoronation(false);
    setDraggedPiece(null);
  };

  return {
    boardSetup,
    openCoronation,
    handleDragStart,
    handleDrop,
    handlePromotion,
    setOpenCoronation,
    // Added missing functions to the return object
    resetBoard,
    performMove,
    updateBoardState,
  };
}
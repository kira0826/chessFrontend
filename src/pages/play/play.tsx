import Board from "@/widgets/chess/board";
import MatchInfo from "@/widgets/chess/matchInfo";
import { Cell } from "@/widgets/chess/types";
import { useState } from "react";
import { initialBoardSetup } from "@/widgets/chess/boardAuxFunctions";
import Coronation from "@/widgets/chess/coronation";
import { Piece } from "@/widgets";
import { LastMove } from "@/widgets/chess/types";
import { PieceType } from "@/widgets";
import {
  movePiece,
  handleCastling,
  handleEnPassantCapture,
  updateEnPassantEligibility,
  isKingInCheck,
  isPromotion,
} from "@/widgets/chess/boardAuxFunctions";
import isValidMove from "@/validations/isValidMove";

export function Play() {


  //------------------States--------------------------

  const [boardSetup, setBoardSetup] = useState<(Cell | null)[][]>(
    initialBoardSetup()
  );

  const [openCoronation, setOpenCoronation] = useState<boolean>(false);

  const [pendingPromotion, setPendingPromotion] = useState<{
    board: (Cell | null)[][];
    piece: Piece;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  } | null>(null);

  const [draggedPiece, setDraggedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [lastMove, setLastMove] = useState<LastMove | null>(null);


  //------------------Perform move--------------------------

  const updateBoardState = (
    newBoard: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    // Actualizar el estado del tablero y el último movimiento
    setBoardSetup(newBoard);
    setLastMove({
      piece: piece,
      fromRow: fromRow,
      fromCol: fromCol,
      toRow: toRow,
      toCol: toCol,
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

    // Mover la pieza
    newBoard = movePiece(newBoard, fromRow, fromCol, toRow, toCol, piece);

    // Manejar captura al paso
    newBoard = handleEnPassantCapture(newBoard, piece, fromCol, toRow, toCol);

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

  const handlePromotion = (promotedPieceType: PieceType) => {
    if (pendingPromotion) {
      const { board, piece, fromRow, fromCol, toRow, toCol } = pendingPromotion;

      // Actualizar la pieza en la casilla de promoción
      const newBoard = board.map((boardRow) => boardRow.slice());
      newBoard[toRow][toCol] = {
        piece: {
          isWhite: piece.isWhite,
          type: promotedPieceType,
        },
        hasMoved: true,
      };

      // Actualizar el estado del tablero
      updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);

      // Reiniciar la promoción pendiente
      setPendingPromotion(null);

      // Cerrar el modal de promoción
      setOpenCoronation(false);
    }
  };


  //------------------Board handlers on select and drop--------------------------

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
        // Realizar el movimiento
        const newBoard = performMove(
          boardSetup,
          piece,
          fromRow,
          fromCol,
          toRow,
          toCol
        );

        // Verificar si el movimiento deja al rey en jaque
        if (isKingInCheck(newBoard, piece.isWhite)) {
          console.log("Movimiento inválido: no puedes dejar al rey en jaque");
          setDraggedPiece(null);
          return;
        }

        // Verificar promoción
        if (isPromotion(piece, toRow)) {
          // Abrir el modal de promoción
          setOpenCoronation(true);
          // Guardar la promoción pendiente
          setPendingPromotion({
            board: newBoard,
            piece,
            fromRow,
            fromCol,
            toRow,
            toCol,
          });
        } else {
          // Actualizar el estado del tablero
          updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);
        }
      } else {
        console.log("Movimiento inválido");
      }
      setDraggedPiece(null);
    }
  };

  return (
    <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
      <main className="flex flex-col justify-center items-center h-5/6  w-2/4 space-y-2  ">
        <MatchInfo username="AleLonber" elo={1200} profilePicture="" />

        <Board
          boardRepesentation={boardSetup}
          openCoronation={openCoronation}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
        />

        <MatchInfo username="Zai0826" elo={300} profilePicture="" />
      </main>

      <section className="flex flex-col h-5/6 w-1/3 bg-gray-200"></section>

      {openCoronation && (
        <Coronation
          isWhite={true}
          setCoronationPiece={handlePromotion}
          setOpen={setOpenCoronation}
          open={openCoronation}
        />
      )}
    </div>
  );
}

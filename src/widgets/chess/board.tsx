import React, { useState } from "react";
import ChessCell from "./cell";
import { PieceType } from "./pieceType";
import type { Piece } from "./piece";
import isValidMove from "@/validations/isValidMove";
import wouldKingBeInCheck from "@/validations/isInCheck";
import Coronation from "./coronation";
import { Play } from "@/models/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
//---------------------- Tipos ----------------------

export interface BoardProps {
  isWhite: boolean;
  plays?: Play[];
  currentMoveIndex?: number;
  onMoveSelect?: (index: number) => void;
}

export interface Cell {
  piece: Piece | null;
  hasMoved?: boolean;
  enPassantEligible?: boolean;
}

export interface LastMove {
  piece: Piece;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

//---------------------- Configuración Inicial del Tablero ----------------------

const initialBoardSetup = () => {
  const board: (Cell | null)[][] = Array.from({ length: 8 }, () =>
    Array(8).fill(null)
  );

  const whitePieces = [
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.ROOK,
  ];

  const blackPieces = [...whitePieces];

  for (let col = 0; col < 8; col++) {
    // Piezas negras
    board[0][col] = {
      piece: { isWhite: false, type: blackPieces[col] },
      hasMoved: false,
    };
    board[1][col] = {
      piece: { isWhite: false, type: PieceType.PAWN },
      hasMoved: false,
    };

    // Piezas blancas
    board[6][col] = {
      piece: { isWhite: true, type: PieceType.PAWN },
      hasMoved: false,
    };
    board[7][col] = {
      piece: { isWhite: true, type: whitePieces[col] },
      hasMoved: false,
    };
  }

  return board;
};

const Board: React.FC<BoardProps> = ({   isWhite = false, 
  plays = [], 
  currentMoveIndex = -1, 
  onMoveSelect = () => {} }) => {
  //---------------------- Estados ----------------------
  const [boardHistory, setBoardHistory] = useState<(Cell | null)[][][]>([initialBoardSetup()]);

  const [openCoronation, setOpenCoronation] = useState<boolean>(false);

  const [pendingPromotion, setPendingPromotion] = useState<{
    board: (Cell | null)[][];
    piece: Piece;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  } | null>(null);

  const [boardSetup, setBoardSetup] = useState<(Cell | null)[][]>(
    initialBoardSetup()
  );

  const [draggedPiece, setDraggedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  //---------------------- Funciones Auxiliares ----------------------

  const algebraicToCoords = (position: string): [number, number] => {
    const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(position[1]);
    return [row, col];
  };

  const goToMove = (index: number) => {
    if (index >= -1 && index < plays.length) {
      onMoveSelect(index);
    }
  };

  React.useEffect(() => {
    const newBoardHistory = [initialBoardSetup()];
    
    plays.forEach((play, index) => {
      const [fromRow, fromCol] = algebraicToCoords(play.origin);
      const [toRow, toCol] = algebraicToCoords(play.destination);
      const currentBoard = newBoardHistory[index];
      const piece = currentBoard[fromRow][fromCol]?.piece;
      
      if (piece) {
        const newBoard = performMove(
          currentBoard,
          piece,
          fromRow,
          fromCol,
          toRow,
          toCol
        );
        newBoardHistory.push(newBoard);
      }
    });
    
    setBoardHistory(newBoardHistory);
  }, [plays]);

  const movePiece = (
    board: (Cell | null)[][],
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    piece: Piece
  ) => {
    const newBoard = board.map((boardRow) => boardRow.slice());
    const movedCell: Cell = {
      piece: piece,
      hasMoved: true,
    };
    newBoard[toRow][toCol] = movedCell;
    newBoard[fromRow][fromCol] = null;
    return newBoard;
  };

  const handleEnPassantCapture = (
    board: (Cell | null)[][],
    piece: Piece,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {

    const newBoard = board.map((boardRow) => boardRow.slice());

    console.log("Info del tablero en handleEnPassantCapture: "," - board: ", !board[toRow][toCol] ," - piece: ", piece.type === PieceType.PAWN ," - toCol: ", toCol !== fromCol);
    console.log("Get on board: ", board[toRow][toCol]);
    if (      
      piece.type === PieceType.PAWN &&
      toCol !== fromCol 
    ) {

      console.log("Captura al paso adentro del if");
      const direction = piece.isWhite ? 1 : -1;
      newBoard[toRow + direction][toCol] = null; // Delete the captured pawn
    }
    return newBoard;
  };

  const updateEnPassantEligibility = (
    board: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    toRow: number,
    toCol: number
  ) => {
    const newBoard = board.map((boardRow) => boardRow.slice());
    // Reiniciar enPassantEligible para todos los peones
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = newBoard[r][c];
        if (cell && cell.piece?.type === PieceType.PAWN) {
          cell.enPassantEligible = false;
        }
      }
    }

    if (
      piece.type === PieceType.PAWN &&
      Math.abs(toRow - fromRow) === 2
    ) {
      if (newBoard[toRow][toCol]) {
        newBoard[toRow][toCol]!.enPassantEligible = true;
      }
    }

    return newBoard;
  };

  const handleCastling = (
    board: (Cell | null)[][],
    piece: Piece,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    const newBoard = board.map((boardRow) => boardRow.slice());
    if (
      piece.type === PieceType.KING &&
      Math.abs(toCol - fromCol) === 2
    ) {
      const direction = toCol - fromCol > 0 ? 1 : -1;
      const rookStartCol = direction > 0 ? 7 : 0;
      const rookEndCol = fromCol + direction;

      const rookCell = newBoard[toRow][rookStartCol];
      if (rookCell && rookCell.piece?.type === PieceType.ROOK) {
        newBoard[toRow][rookEndCol] = {
          piece: rookCell.piece,
          hasMoved: true,
        };
        newBoard[toRow][rookStartCol] = null;
      }
    }
    return newBoard;
  };

  const isPromotion = (piece: Piece, toRow: number) => {
    return (
      piece.type === PieceType.PAWN &&
      (toRow === 0 || toRow === 7)
    );
  };

  const isKingInCheck = (board: (Cell | null)[][], isWhite: boolean) => {
    return wouldKingBeInCheck(board, isWhite);
  };

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
    newBoard = handleEnPassantCapture(
      newBoard,
      piece,
      fromCol,
      toRow,
      toCol
    );

    // Actualizar elegibilidad de en passant
    newBoard = updateEnPassantEligibility(
      newBoard,
      piece,
      fromRow,
      toRow,
      toCol
    );

    // Manejar enroque
    newBoard = handleCastling(newBoard, piece,  fromCol, toRow, toCol);

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

  //---------------------- Manejadores ----------------------

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
        isValidMove(
          piece,
          fromRow,
          fromCol,
          toRow,
          toCol,
          boardSetup,
          lastMove
        )
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
    <>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
      {(plays.length > 0 ? boardHistory[currentMoveIndex + 1] : boardSetup).flat().map((cell, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const isDarkCell = (row + col) % 2 === 1;
          const backgroundColor = isDarkCell ? "bg-gray-600" : "bg-gray-200";
          
          const isFromSquare = lastMove !== null && 
            row === lastMove.fromRow && 
            col === lastMove.fromCol;
            
          const isToSquare = lastMove !== null && 
            row === lastMove.toRow && 
            col === lastMove.toCol;

          return (
            <div
              key={index}
              onDrop={() => handleDrop(row, col)}
              onDragOver={(e) => e.preventDefault()}
            >
              <ChessCell
                isSelected={false}
                isCheck={false}
                isPreviousMove={isFromSquare || isToSquare}
                isAvailableMove={false}
                piece={cell ? cell.piece : null}
                backgroundColor={backgroundColor}
                onDragStart={() => handleDragStart(row, col)}
              />
            </div>
          );
        })}
      </div>



      {openCoronation && (
        <Coronation
          isWhite={isWhite}
          setCoronationPiece={handlePromotion}
          setOpen={setOpenCoronation}
          open={openCoronation}
        />
      )}
    </>
  );
};
export default Board;

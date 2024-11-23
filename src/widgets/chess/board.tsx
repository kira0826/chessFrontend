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

const Board: React.FC<BoardProps> = ({ isWhite = false,
  plays = [],
  currentMoveIndex = -1,
  onMoveSelect = () => { } }) => {
  //---------------------- Estados ----------------------
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
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

  const [draggedPiecePos, setDraggedPiecePos] = useState<{
    row: number;
    col: number;
  } | null>(null);

  
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: Piece;
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

    console.log("Info del tablero en handleEnPassantCapture: ", " - board: ", !board[toRow][toCol], " - piece: ", piece.type === PieceType.PAWN, " - toCol: ", toCol !== fromCol);
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
    fromRow: number,
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
    newBoard = handleCastling(newBoard, piece, fromRow, fromCol, toRow, toCol);

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

  const calculateValidMoves = (
    piece: Piece,
    fromRow: number,
    fromCol: number,
    board: (Cell | null)[][],
    lastMove: LastMove | null
  ): { row: number; col: number }[] => {
    const validMoves: { row: number; col: number }[] = [];

    const isInBoard = (row: number, col: number) => {
      return row >= 0 && row < 8 && col >= 0 && col < 8;
    };

    const isOccupiedBySameColor = (row: number, col: number) => {
      const targetCell = board[row][col];
      return targetCell?.piece?.isWhite === piece.isWhite;
    };

    // Movimientos del peón
    if (piece.type === PieceType.PAWN) {
      const direction = piece.isWhite ? -1 : 1;
      const startRow = piece.isWhite ? 6 : 1;

      // Movimiento hacia adelante
      if (isInBoard(fromRow + direction, fromCol) && !board[fromRow + direction][fromCol]) {
        validMoves.push({ row: fromRow + direction, col: fromCol });

        // Movimiento doble desde la posición inicial
        if (
          fromRow === startRow &&
          !board[fromRow + direction * 2][fromCol]
        ) {
          validMoves.push({ row: fromRow + direction * 2, col: fromCol });
        }
      }

      // Capturas diagonales
      [-1, 1].forEach(offset => {
        const newCol = fromCol + offset;
        if (isInBoard(fromRow + direction, newCol)) {
          const targetCell = board[fromRow + direction][newCol];
          if (targetCell?.piece && targetCell.piece.isWhite !== piece.isWhite) {
            validMoves.push({ row: fromRow + direction, col: newCol });
          }
        }
      });

      // Captura al paso
      if (lastMove && lastMove.piece.type === PieceType.PAWN) {
        const enPassantRow = piece.isWhite ? 3 : 4;
        if (
          fromRow === enPassantRow &&
          Math.abs(lastMove.toCol - fromCol) === 1 &&
          Math.abs(lastMove.fromRow - lastMove.toRow) === 2
        ) {
          validMoves.push({ row: fromRow + direction, col: lastMove.toCol });
        }
      }
    }

    // Movimientos del caballo
    if (piece.type === PieceType.KNIGHT) {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];

      knightMoves.forEach(([rowOffset, colOffset]) => {
        const newRow = fromRow + rowOffset;
        const newCol = fromCol + colOffset;

        if (isInBoard(newRow, newCol) && !isOccupiedBySameColor(newRow, newCol)) {
          validMoves.push({ row: newRow, col: newCol });
        }
      });
    }

    // Movimientos del alfil
    if (piece.type === PieceType.BISHOP || piece.type === PieceType.QUEEN) {
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

      directions.forEach(([rowDir, colDir]) => {
        let newRow = fromRow + rowDir;
        let newCol = fromCol + colDir;

        while (isInBoard(newRow, newCol)) {
          if (board[newRow][newCol]) {
            if (!isOccupiedBySameColor(newRow, newCol)) {
              validMoves.push({ row: newRow, col: newCol });
            }
            break;
          }
          validMoves.push({ row: newRow, col: newCol });
          newRow += rowDir;
          newCol += colDir;
        }
      });
    }

    // Movimientos de la torre
    if (piece.type === PieceType.ROOK || piece.type === PieceType.QUEEN) {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

      directions.forEach(([rowDir, colDir]) => {
        let newRow = fromRow + rowDir;
        let newCol = fromCol + colDir;

        while (isInBoard(newRow, newCol)) {
          if (board[newRow][newCol]) {
            if (!isOccupiedBySameColor(newRow, newCol)) {
              validMoves.push({ row: newRow, col: newCol });
            }
            break;
          }
          validMoves.push({ row: newRow, col: newCol });
          newRow += rowDir;
          newCol += colDir;
        }
      });
    }

    // Movimientos del rey
    if (piece.type === PieceType.KING) {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];

      kingMoves.forEach(([rowOffset, colOffset]) => {
        const newRow = fromRow + rowOffset;
        const newCol = fromCol + colOffset;

        if (isInBoard(newRow, newCol) && !isOccupiedBySameColor(newRow, newCol)) {
          validMoves.push({ row: newRow, col: newCol });
        }
      });

      // Enroque
      const isStartPosition = piece.isWhite ? fromRow === 7 : fromRow === 0;
      if (isStartPosition && fromCol === 4 && !board[fromRow][fromCol]?.hasMoved) {
        // Enroque corto
        if (
          !board[fromRow][5] &&
          !board[fromRow][6] &&
          board[fromRow][7]?.piece?.type === PieceType.ROOK &&
          !board[fromRow][7]?.hasMoved
        ) {
          validMoves.push({ row: fromRow, col: 6 });
        }
        // Enroque largo
        if (
          !board[fromRow][3] &&
          !board[fromRow][2] &&
          !board[fromRow][1] &&
          board[fromRow][0]?.piece?.type === PieceType.ROOK &&
          !board[fromRow][0]?.hasMoved
        ) {
          validMoves.push({ row: fromRow, col: 2 });
        }
      }
    }

    // Filtrar movimientos que dejarían al rey en jaque
    return validMoves.filter(move => {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = { piece, hasMoved: true };
      newBoard[fromRow][fromCol] = null;
      return !wouldKingBeInCheck(newBoard, piece.isWhite);
    });
  };

  //---------------------- Manejadores ----------------------

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    const cell = boardSetup[row][col];
    if (cell?.piece) {
      e.dataTransfer.setData("text/plain", `${row},${col}`);
      setDraggedPiecePos({ row, col });
      const moves = calculateValidMoves(cell.piece, row, col, boardSetup, lastMove);
      setValidMoves(moves);
      setSelectedPiece({ piece: cell.piece, row, col });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  const handleCellClick = (row: number, col: number) => {
    const cell = boardSetup[row][col];

    // Si ya hay una pieza seleccionada...
    if (selectedPiece) {
      // Si se hace clic en la misma pieza, deseleccionar
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }

      // Si se hace clic en un movimiento válido, realizar el movimiento
      if (validMoves.some(move => move.row === row && move.col === col)) {
        handleMove(selectedPiece.row, selectedPiece.col, row, col);
        return;
      }

      // Si se hace clic en otra pieza del mismo color, seleccionarla
      if (cell?.piece?.isWhite === selectedPiece.piece.isWhite) {
        const moves = calculateValidMoves(cell.piece, row, col, boardSetup, lastMove);
        setValidMoves(moves);
        setSelectedPiece({ piece: cell.piece, row, col });
        return;
      }
    }

    // Si no hay pieza seleccionada y se hace clic en una pieza
    if (cell?.piece) {
      const moves = calculateValidMoves(cell.piece, row, col, boardSetup, lastMove);
      setValidMoves(moves);
      setSelectedPiece({ piece: cell.piece, row, col });
    }
  };

  const handleMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = boardSetup[fromRow][fromCol]?.piece;
    
    if (piece && isValidMove(piece, fromRow, fromCol, toRow, toCol, boardSetup, lastMove)) {
      const newBoard = performMove(boardSetup, piece, fromRow, fromCol, toRow, toCol);

      if (isKingInCheck(newBoard, piece.isWhite)) {
        console.log("Movimiento inválido: no puedes dejar al rey en jaque");
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

      // Limpiar la selección después del movimiento
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };



  const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
    e.preventDefault();
    if (draggedPiecePos) {
      const { row: fromRow, col: fromCol } = draggedPiecePos;
      handleMove(fromRow, fromCol, targetRow, targetCol);
      setDraggedPiecePos(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedPiecePos(null);
    if (!selectedPiece) {
      setValidMoves([]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {(plays.length > 0 ? boardHistory[currentMoveIndex + 1] : boardSetup)
          .flat()
          .map((cell, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const isDarkCell = (row + col) % 2 === 1;
            const backgroundColor = isDarkCell ? "bg-gray-600" : "bg-gray-200";

            const isFromSquare =
              lastMove !== null &&
              row === lastMove.fromRow &&
              col === lastMove.fromCol;

            const isToSquare =
              lastMove !== null &&
              row === lastMove.toRow &&
              col === lastMove.toCol;

            const isSelected =
              selectedPiece !== null &&
              row === selectedPiece.row &&
              col === selectedPiece.col;

            const isAvailableMove = validMoves.some(
              (move) => move.row === row && move.col === col
            );

            return (
              <div
                key={index}
                className="w-full h-full"
                onClick={() => handleCellClick(row, col)}
                draggable={cell?.piece != null}
                onDragStart={(e) => handleDragStart(e, row, col)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, row, col)}
                onDragEnd={handleDragEnd}
              >
                <ChessCell
                  isSelected={isSelected}
                  isCheck={false}
                  isPreviousMove={isFromSquare || isToSquare}
                  isAvailableMove={isAvailableMove}
                  piece={cell ? cell.piece : null}
                  backgroundColor={backgroundColor}
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

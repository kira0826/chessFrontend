import { Cell } from "./types";
import { PieceType } from "./pieceType";
import { Piece } from "./piece";
import wouldKingBeInCheck from "@/validations/isInCheck";
export const initialBoardSetup = () => {
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


export const parsePosition = (position: string): { row: number; col: number } => {
  const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(position[1]);
  return { row, col };
};

export const determinePieceColor = (moveIndex: number): boolean => {
  // En ajedrez, blancas mueven primero, así que los movimientos pares son negras
  // y los impares son blancas
  return moveIndex % 2 === 0;
};

export const getPieceFromPosition = (board: (Cell | null)[][], row: number, col: number): Piece | null => {
  return board[row][col]?.piece || null;
};

export const movePiece = (
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

export const handleEnPassantCapture = (
  board: (Cell | null)[][],
  piece: Piece,
  fromCol: number,
  toRow: number,
  toCol: number
) => {
  const newBoard = board.map((boardRow) => boardRow.slice());

  console.log(
    "Info del tablero en handleEnPassantCapture: ",
    " - board: ",
    !board[toRow][toCol],
    " - piece: ",
    piece.type === PieceType.PAWN,
    " - toCol: ",
    toCol !== fromCol
  );
  console.log("Get on board: ", board[toRow][toCol]);
  if (piece.type === PieceType.PAWN && toCol !== fromCol) {
    console.log("Captura al paso adentro del if");
    const direction = piece.isWhite ? 1 : -1;
    newBoard[toRow + direction][toCol] = null; // Delete the captured pawn
  }
  return newBoard;
};

export const parsePosition = (position: string): { row: number; col: number } => {
  const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(position[1]);
  return { row, col };
};

export const determinePieceColor = (moveIndex: number): boolean => {
  // En ajedrez, blancas mueven primero, así que los movimientos pares son negras
  // y los impares son blancas
  return moveIndex % 2 === 0;
};

export const getPieceFromPosition = (board: (Cell | null)[][], row: number, col: number): Piece | null => {
  return board[row][col]?.piece || null;
};


export const updateEnPassantEligibility = (
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

  if (piece.type === PieceType.PAWN && Math.abs(toRow - fromRow) === 2) {
    if (newBoard[toRow][toCol]) {
      newBoard[toRow][toCol]!.enPassantEligible = true;
    }
  }

  return newBoard;
};

export const handleCastling = (
  board: (Cell | null)[][],
  piece: Piece,
  fromCol: number,
  toRow: number,
  toCol: number
) => {
  const newBoard = board.map((boardRow) => boardRow.slice());
  if (piece.type === PieceType.KING && Math.abs(toCol - fromCol) === 2) {
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

export const isPromotion = (piece: Piece, toRow: number) => {
  return piece.type === PieceType.PAWN && (toRow === 0 || toRow === 7);
};

export const isKingInCheck = (board: (Cell | null)[][], isWhite: boolean) => {
  return wouldKingBeInCheck(board, isWhite);
};

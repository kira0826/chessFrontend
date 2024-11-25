import { Cell } from "@/widgets/chess/types";
import { Piece } from "@/widgets";
import {
  movePiece,
  handleCastling,
  handleEnPassantCapture,
  updateEnPassantEligibility,
} from "@/widgets/chess/boardAuxFunctions";
import { PieceDTO, type PlayDTO } from "./types";
import { PieceType } from "@/widgets";

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
  newBoard = handleEnPassantCapture(newBoard, piece, fromCol, toRow, toCol);

  // Actualizar elegibilidad de en passant
  newBoard = updateEnPassantEligibility(newBoard, piece, fromRow, toRow, toCol);

  // Manejar enroque
  newBoard = handleCastling(newBoard, piece, fromCol, toRow, toCol);

  return newBoard;
};


//Based on movements got from websocket,  update the board with the new positions.

export function updateBoardWithChanges(
  currentBoard: (Cell | null)[][],
  matchDataMap: Map<string, PieceDTO>,
  lastPlay: PlayDTO
): (Cell | null)[][] {
  // Extraer la posición destino de la jugada
  const { destination } = lastPlay;

  return currentBoard.map((row, rowIndex) =>
    row.map((currentCell, colIndex) => {
      // Convertir índices a notación de ajedrez (a1, b2, etc.)
      const position = String.fromCharCode(97 + colIndex) + (8 - rowIndex);

      // Obtener la pieza nueva para esta posición
      const newPiece = matchDataMap.get(position);

      if (!newPiece) {
        // Si no hay pieza en matchData para esta posición, la celda queda vacía
        return null;
      }

      // Crear el objeto Piece actualizado
      const updatedPiece: Piece = {
        isWhite: newPiece.color === "W",
        type: newPiece.type as PieceType,
      };

      // Verificar si esta celda es el destino de la última jugada
      const isDestination = position === destination;

      return {
        piece: updatedPiece,
        hasMoved: currentCell?.hasMoved || false, // Preservar hasMoved anterior si aplica
        enPassantEligible: currentCell?.enPassantEligible || false, // Preservar enPassant
        hasChanged: isDestination, // Solo marcar hasChanged si es el destino
      };
    })
  );
}


export function matrixToChessNotation(row: number, col: number): string {
  const file = String.fromCharCode(97 + col); // Convierte 0->'a', 1->'b', ..., 7->'h'
  const rank = 8 - row; // Invierte las filas para el tablero de ajedrez
  return `${file}${rank}`;
}

export const pieceTypeToNumberMap: Record<PieceType, number> = {
  [PieceType.KING]: 1,
  [PieceType.QUEEN]: 2,
  [PieceType.ROOK]: 3,
  [PieceType.BISHOP]: 4,
  [PieceType.KNIGHT]: 5,
  [PieceType.PAWN]: 6,
};

// Función para obtener el número asociado a un PieceType
export function getPieceTypeNumber(pieceType: PieceType | null): number | null {
  if (pieceType === null) {
    return null;
  }
  return pieceTypeToNumberMap[pieceType];
}

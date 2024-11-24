import { Piece } from "./piece";

export interface Play {
  id: number;
  origin: string;
  destination: string;
  sequenceNumber: number;
  timestamp: string;
  gain: number;
  matchId: number;
  chessCardId: number;
}

export interface BoardProps {
  boardRepesentation: (Cell | null)[][];
  openCoronation: boolean;
  handleDrop: (row: number, col: number) => void;
  handleDragStart: (row: number, col: number) => void;
  possibleMoves: { row: number; col: number }[] | null;
  disableBoard: boolean;
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

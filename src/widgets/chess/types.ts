import { Piece } from "./piece";


export interface BoardProps {
  boardRepesentation: (Cell | null)[][];
  openCoronation: boolean;
  handleDrop: (row: number, col: number) => void | null;
  handleDragStart: (row: number, col: number) => void | null;
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

export interface Match {
  id: number;
  createdDate: string;
  gameModeName: string;
  usernames: string[];
  plays: Play[];
}

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
import React from 'react';
import { PieceType } from './pieceType';
import { pieceImages } from './pieceImages';
//This is the interface that defines the Piece, used to define external props of a cell
export interface Piece {
  isWhite: boolean;
  type: PieceType;
}     

interface PieceProps {
  isWhite: boolean;
  type: PieceType;
}

export const Piece: React.FC<PieceProps> = ({ isWhite, type }) => {
  const color = isWhite ? "white" : "black";
  return <img src={pieceImages[color][type]} alt={type} className="w-full h-full object-contain" />;
};

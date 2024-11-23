import { PieceType } from "./pieceType";

export const pieceImages = {
    white: {
      [PieceType.KING]: "public/chessPieces/king_white.png",
      [PieceType.QUEEN]: "public/chessPieces/queen_white.png",
      [PieceType.ROOK]: "public/chessPieces/rook_white.png",
      [PieceType.BISHOP]: "public/chessPieces/bishop_white.png",
      [PieceType.KNIGHT]: "public/chessPieces/knight_white.png",
      [PieceType.PAWN]: "public/chessPieces/pawn_white.png",
    },
    black: {
      [PieceType.KING]: "public/chessPieces/king_black.png",
      [PieceType.QUEEN]: "public/chessPieces/queen_black.png",
      [PieceType.ROOK]: "public/chessPieces/rook_black.png",
      [PieceType.BISHOP]: "public/chessPieces/bishop_black.png",
      [PieceType.KNIGHT]: "public/chessPieces/knight_black.png",
      [PieceType.PAWN]: "public/chessPieces/pawn_black.png",
    },
  };
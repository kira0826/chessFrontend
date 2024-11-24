import { PieceType } from "./pieceType";

export const pieceImages = {
  white: {
    [PieceType.KING]: "/chessFront/chessPieces/king_white.png",
    [PieceType.QUEEN]: "/chessFront/chessPieces/queen_white.png",
    [PieceType.ROOK]: "/chessFront/chessPieces/rook_white.png",
    [PieceType.BISHOP]: "/chessFront/chessPieces/bishop_white.png",
    [PieceType.KNIGHT]: "/chessFront/chessPieces/knight_white.png",
    [PieceType.PAWN]: "/chessFront/chessPieces/pawn_white.png",
  },
  black: {
    [PieceType.KING]: "/chessFront/chessPieces/king_black.png",
    [PieceType.QUEEN]: "/chessFront/chessPieces/queen_black.png",
    [PieceType.ROOK]: "/chessFront/chessPieces/rook_black.png",
    [PieceType.BISHOP]: "/chessFront/chessPieces/bishop_black.png",
    [PieceType.KNIGHT]: "/chessFront/chessPieces/knight_black.png",
    [PieceType.PAWN]: "/chessFront/chessPieces/pawn_black.png",
  },
};

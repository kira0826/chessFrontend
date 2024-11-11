import type React from "react";
import { PieceType } from "./pieceType";
import { Piece } from "./piece";

interface CoronationProps {
  isWhite: boolean;
  setCoronationPiece: (piece: PieceType) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}

const Coronation: React.FC<CoronationProps> = ({
  isWhite,
  setCoronationPiece,
  setOpen,
  open,
}) => {
  const piecesTypesToShow = [
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.BISHOP,
    PieceType.KNIGHT,
  ];

  return (
    <>

      {/* Condicional para mostrar el pop-up */}
      {open && (
        <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-4 z-10 w-20 h-auto">
          <div className="flex flex-col gap-2">
            {piecesTypesToShow.map((pieceType) => (
              <div
                key={pieceType}
                onClick={() => {
                  setCoronationPiece(pieceType);
                  setOpen(false); // Close Pop-up when a piece is selected
                }}
                className="cursor-pointer"
              >
                <Piece isWhite={isWhite} type={pieceType} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Coronation;

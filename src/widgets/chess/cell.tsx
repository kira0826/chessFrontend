import React from 'react';
import type { Piece } from './piece'; 
import { Piece as ChessPiece } from './piece'; 

interface CellProps {
    isSelected: boolean;
    isCheck: boolean;
    isPreviousMove: boolean;
    isAvailableMove: boolean | null;
    piece: Piece | null; 
    backgroundColor?: string; 
    onDragStart: () => void; // Agrega el evento onDragStart
}

const ChessCell: React.FC<CellProps> = ({
    isSelected,
    isCheck,
    isPreviousMove,
    isAvailableMove,
    piece,
    backgroundColor,
    onDragStart
}) => {
    let cellClasses = "h-full w-full flex items-center justify-center cursor-pointer ";

    if (isSelected) {
        cellClasses += " bg-yellow-400"; 
    }
    if (isCheck) {
        cellClasses += " bg-red-400"; 
    }
    if (isPreviousMove) {
        cellClasses += " bg-yellow-200";
    }
    if (isAvailableMove) {
        cellClasses += " bg-green-300"; 
    }

    return (
        <div className={`${cellClasses} ${backgroundColor} border p-2`} draggable={!!piece} onDragStart={onDragStart}>
            {piece ? <ChessPiece isWhite={piece.isWhite} type={piece.type} /> : null}
        </div>
    );
};

export default ChessCell;

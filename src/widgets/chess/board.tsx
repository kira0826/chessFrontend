import ChessCell from "./cell";
import { BoardProps } from "./types";

const Board: React.FC<BoardProps> = ({
  boardRepesentation,
  handleDrop,
  handleDragStart,
  possibleMoves,
}) => {
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
      {boardRepesentation.flat().map((cell, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const isDarkCell = (row + col) % 2 === 1;
        const backgroundColor = isDarkCell ? "bg-gray-600" : "bg-gray-200";
        const isAvailableMove = possibleMoves.some(
          (move) => move.row === row && move.col === col
        );

        return (
          <div
            key={index}
            onDrop={() => handleDrop(row, col)}
            onDragOver={(e) => e.preventDefault()}
          >
            <ChessCell
              isSelected={false}
              isCheck={false}
              isPreviousMove={false}
              isAvailableMove={isAvailableMove}
              piece={cell ? cell.piece : null}
              backgroundColor={backgroundColor}
              onDragStart={() => handleDragStart(row, col)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Board;
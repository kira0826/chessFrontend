import { useState } from "react";
import Board from "@/widgets/chess/board";
import MatchInfo from "@/widgets/chess/matchInfo";
import MoveNavigation from "@/components/MoveNavigation";
import { Cell, Play } from "@/widgets/chess/types";
import {
  isKingInCheck,
  initialBoardSetup,
  parsePosition,
  getPieceFromPosition,
  determinePieceColor,
  movePiece,
  handleEnPassantCapture,
  updateEnPassantEligibility,
  handleCastling
} from "@/widgets/chess/boardAuxFunctions";
import { Piece } from "@/widgets/chess/piece";


export function Recreation({ matchPlays=[], player1= "Player 1", player2="Player 2" }: { matchPlays?: Play[], player1?:string, player2?:string}) {
  

  const [plays] = useState<Play[]>(matchPlays);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
  const [boardSetup, setBoardSetup] = useState<(Cell | null)[][]>(
    initialBoardSetup()

  );
  const updateBoardState = (
    newBoard: (Cell | null)[][]
  ) => {
    setBoardSetup(newBoard);
  };
  
  const resetBoard = () => {
    setBoardSetup(initialBoardSetup());
  };

  const performMove = (
    board: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): (Cell | null)[][] => {
    let newBoard = board.map((boardRow) => boardRow.slice());

    newBoard = movePiece(newBoard, fromRow, fromCol, toRow, toCol, piece);
    newBoard = handleEnPassantCapture(newBoard, piece, fromCol, toRow, toCol);
    newBoard = updateEnPassantEligibility(
      newBoard,
      piece,
      fromRow,
      toRow,
      toCol
    );
    newBoard = handleCastling(newBoard, piece, fromCol, toRow, toCol);

    return newBoard;
  };

  const handleMoveSelect = (index: number) => {
    if (index < -1 || index >= plays.length) return;
    if (index === -1) {
      resetBoard();
      setCurrentMoveIndex(-1);
      return;
    }
    let currentBoard = initialBoardSetup();
    for (let i = 0; i <= index; i++) {
      const move = plays[i];
      const from = parsePosition(move.origin);
      const to = parsePosition(move.destination);
      const isWhite = determinePieceColor(i);
      const piece = getPieceFromPosition(currentBoard, from.row, from.col);
      if (piece && piece.isWhite === isWhite) {
        currentBoard = performMove(
          currentBoard,
          piece,
          from.row,
          from.col,
          to.row,
          to.col
        );

        if (isKingInCheck(currentBoard, piece.isWhite)) {
          console.log("Invalid move: king would be in check");
          return;
        }

        if (i === index) {
          updateBoardState(
            currentBoard,
          );
        }
      }
    }

    setCurrentMoveIndex(index);
  };


  return (
    <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
      <main className="flex flex-col justify-center items-center h-5/6 w-2/4 space-y-2">
        <MatchInfo username={player1} elo={1200} profilePicture="" />

        <Board
          boardRepesentation={boardSetup}
          openCoronation={false}
          possibleMoves={[]}
          handleDrop={() => { } }
          handleDragStart={() => { } }
          isWhitePlayer={true} 
          disableBoard={false}        />

        <MatchInfo username={player2} elo={1000} profilePicture="" />
      </main>
      <section className="flex flex-col h-5/6 w-1/3 bg-gray-200">
        <MoveNavigation
          plays={plays}
          currentMoveIndex={currentMoveIndex}
          onMoveSelect={handleMoveSelect}
        />
      </section>
    </div>
  );
}
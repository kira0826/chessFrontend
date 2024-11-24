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


export function Recreation() {
  
  const samplePlays: Play[] = [
    {
      id: 1,
      origin: "e2",
      destination: "e4",
      sequenceNumber: 1,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 6,
    },
    {
      id: 2,
      origin: "e7",
      destination: "e5",
      sequenceNumber: 2,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 7,
    },
    {
      id: 3,
      origin: "g1",
      destination: "f3",
      sequenceNumber: 3,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 8,
    },
    {
      id: 4,
      origin: "b8",
      destination: "c6",
      sequenceNumber: 4,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 9,
    },
    {
      id: 5,
      origin: "f1",
      destination: "c4",
      sequenceNumber: 5,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 10,
    },
    {
      id: 6,
      origin: "g8",
      destination: "f6",
      sequenceNumber: 6,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 11,
    },
    {
      id: 7,
      origin: "d2",
      destination: "d3",
      sequenceNumber: 7,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 12,
    },
    {
      id: 8,
      origin: "d7",
      destination: "d6",
      sequenceNumber: 8,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 13,
    },
    {
      id: 9,
      origin: "e1",
      destination: "g1",
      sequenceNumber: 9,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 14,
    },
    {
      id: 10,
      origin: "e8",
      destination: "g8",
      sequenceNumber: 10,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 15,
    },
    {
      id: 11,
      origin: "c2",
      destination: "c3",
      sequenceNumber: 11,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 16,
    },
    {
      id: 12,
      origin: "f8",
      destination: "g7",
      sequenceNumber: 12,
      timestamp: "2024-11-17",
      gain: 0,
      matchId: 2,
      chessCardId: 17,
    }
  ];

  const [plays] = useState<Play[]>(samplePlays);
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
        <MatchInfo username="Player 1" elo={1200} profilePicture="" />

        <Board
          boardRepesentation={boardSetup}
          openCoronation={false}
          possibleMoves={[]}
          handleDrop={() => { } }
          handleDragStart={() => { } }
          isWhitePlayer={true} 
          disableBoard={false}        />

        <MatchInfo username="Player 2" elo={1000} profilePicture="" />
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
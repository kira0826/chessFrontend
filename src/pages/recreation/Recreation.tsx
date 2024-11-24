
import MatchInfo from "@/widgets/chess/matchInfo";
import { Play } from "../../models/types";
import { useState } from "react";
import MoveNavigation from "@/widgets/chess/moveNavigation";

export function Recreation() {
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);

const plays: Play[] = [
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

const handleMoveSelect = (index: number) => {
  setCurrentMoveIndex(index);
};

return (
  <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
    <main className="flex flex-col justify-center items-center h-5/6 w-2/4 space-y-2">
      <MatchInfo username="AleLonber" elo={1200} profilePicture=""/>
      <MatchInfo username="Zai0826" elo={300} profilePicture=""/>
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
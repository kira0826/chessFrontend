import Board from "@/widgets/chess/board";
import MatchInfo from "@/widgets/chess/matchInfo";
import Coronation from "@/widgets/chess/coronation";
import { useChessBoard } from "@/hooks/useChessBoard"; // Asegúrate de ajustar la ruta de importación

export function Play() {
  const {
    boardSetup,
    openCoronation,
    handleDragStart,
    handleDrop,
    handlePromotion,
    setOpenCoronation,
    possibleMoves
  } = useChessBoard();

  return (
    <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
      <main className="flex flex-col justify-center items-center h-5/6 w-2/4 space-y-2">
        <MatchInfo username="AleLonber" elo={1200} profilePicture="" />

        <Board
          boardRepesentation={boardSetup}
          openCoronation={openCoronation}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          possibleMoves={possibleMoves}
        />

        <MatchInfo username="Zai0826" elo={300} profilePicture="" />
      </main>

      <section className="flex flex-col h-5/6 w-1/3 bg-gray-200"></section>

      {openCoronation && (
        <Coronation
          isWhite={true}
          setCoronationPiece={handlePromotion}
          setOpen={setOpenCoronation}
          open={openCoronation}
        />
      )}
    </div>
  );
}
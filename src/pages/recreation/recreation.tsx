
import MatchInfo from "@/widgets/chess/matchInfo";
export function Recreation() {

  return (
    <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
      <main className="flex flex-col justify-center items-center h-5/6 w-2/4 space-y-2">
        <MatchInfo username="Player 1" elo={1200} profilePicture="" />

        
        <MatchInfo username="Player 2" elo={1000} profilePicture="" />
      </main>
    <section className="flex flex-col h-5/6 w-1/3 bg-gray-200">
    </section>
  </div>
);
}
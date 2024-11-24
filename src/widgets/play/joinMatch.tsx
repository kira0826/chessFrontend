import apiClient from "@/service/apiClient";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";


interface JoinMatchProps {
    setUsernames: (usernames: string[]) => void;
    setPlays: (plays: any[]) => void;
    setMatchData: (matchData: Map<string, any>) => void;
    setMatchId: (id: number | null) => void;
}

export function JoinMatch({
    setUsernames,
    setPlays,
    setMatchData,
    setMatchId,

}: JoinMatchProps) {
    const [_matchId, _setMatchId] = useState<number|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinMatch = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.patch("/api/matches", null, {
                params: { id: _matchId },
            });

            const data = response.data;
            console.log(data);

            setMatchId(data.id);
            setUsernames(data.usernames || []);
            setPlays(data.plays || []);
            setMatchData(new Map(Object.entries(data.matchData || {})));

        } catch (err) {
            setError("Ocurrió un error al crear la partida.");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Join to match</h2>
            <Input
                type="number"
                placeholder="id play"
                id="id"
                name="id"
                required
                value={_matchId || ''}
                onChange={(e) => _setMatchId(Number(e.target.value) || null)}
                className="pl-10 mb-2"
            />

            <Button className="mb-2" onClick={handleJoinMatch} disabled={isLoading}>{isLoading ? "Joining..." : "Join to match"}</Button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

    );
}
import { useState } from "react";
import GameModeDropdown, { GameMode } from "./gameModeDropdown";
import apiClient from "@/service/apiClient";
import { Button } from "../../components/ui/button";

interface CreateMatchProps {
    selectedGameMode: GameMode | null;
    onGameModeSelect: (mode: GameMode | null) => void;

    setUsernames: (usernames: string[]) => void;
    setMatchId: (id: number | null) => void;
    setIsWhitePiece: (isWhitePiece: boolean) => void;
}

export function CreateMatch(
    {
        selectedGameMode,
        onGameModeSelect,
        setUsernames,
        setMatchId,
        setIsWhitePiece

    }: CreateMatchProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleCreateMatch = async () => {
        if (!selectedGameMode) {
            setError("Debes seleccionar un modo de juego.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post("/api/matches", null, {
                params: { gamemodeId: selectedGameMode.id },
            });

            const data = response.data;
            console.log(data);

            setMatchId(data.id);
            setUsernames(data.usernames || []);
            setIsWhitePiece(true);

        } catch (error) {
            setError("Ocurrió un error al crear la partida: ",);
            console.error("Error al crear la partida: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Create Match</h2>

            {selectedGameMode && (
                <div className="mt-4 mb-2">
                    <p>{selectedGameMode.description}</p>
                </div>
            )}

            <GameModeDropdown onSelect={onGameModeSelect} />

            <div className="mb-2"></div>

            <Button className="mb-2" onClick={handleCreateMatch} disabled={isLoading}>{isLoading ? "Creando..." : "Create match"}</Button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

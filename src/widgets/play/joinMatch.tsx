import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";

export function JoinMatch() {
    const [idPlay, setIdPlay] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinMatch = async () => {

    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Join to match</h2>
            <Input
                type="text"
                placeholder="id play"
                id="id"
                name="id"
                required
                value={idPlay}
                onChange={(e) => setIdPlay(e.target.value)}
                className="pl-10 mb-2"
            />

            <Button className="mb-2" onClick={handleJoinMatch} disabled={isLoading}>{isLoading ? "Joining..." : "Join to match"}</Button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

    );
}
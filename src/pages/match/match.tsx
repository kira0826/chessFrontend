import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/service/apiClient";
import { Card } from "@/components/ui/card";
import type { Match } from "../../widgets/chess/types";


export function Match() {
    const { matchId } = useParams<{ matchId: string }>();
    const [match, setMatch] = useState<Match | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        if (matchId) {
            const _matchId = parseInt(matchId, 10);
            const fetchMatchData = async () => {

                try {
                    const response = await apiClient.get(`api/matches/${_matchId}`);
                    setMatch(response.data);
                } catch (error) {
                    console.error("Failed to fetch match data:", error);
                }
            };

            fetchMatchData();
        }
    });

    return (

        <div className="container mx-auto p-4">

<button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate(-1)}
            >
                Back to profile
            </button>

                <h3 className="text-xl font-semibold mb-4">Match History</h3>
                <div className="space-y-4">
                    {match &&
                        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        <strong>Date:</strong> {match.createdDate}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Game Mode:</strong> {match.gameModeName}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Players:</strong> {match.usernames.join(", ")}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    }
                </div>
            </div>
    );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/service/apiClient";
import type { Match } from "../../widgets/chess/types";
import { Recreation } from "@/widgets/chess/recreation";
import { ChevronLeft } from "lucide-react";

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
    }, [matchId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors mr-4"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Match Details</h1>
                </div>

                {match ? (
                    <div className="space-y-6">
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                        Match Context
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <span className="w-24 text-gray-500 font-medium">Date:</span>
                                            <span>{formatDate(match.createdDate)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-24 text-gray-500 font-medium">Mode:</span>
                                            <span>{match.gameModeName}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-24 text-gray-500 font-medium">Players:</span>
                                            <span>{match.usernames.join(" vs ")}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                                        Match Result
                                    </h2>
                                    {/* Add match result logic here */}
                                    <p className="text-gray-500">
                                        Result details to be implemented
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <Recreation 
                                matchPlays={match.plays} 
                                player1={match.usernames[0]} 
                                player2={match.usernames[1]} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading match details...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Match;
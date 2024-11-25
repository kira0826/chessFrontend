import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/service/apiClient";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  Gamepad as GamepadIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Match } from "../../widgets/chess/types";

export function Match() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <button
        className="group mb-8 px-4 py-2 flex items-center space-x-2 text-sm font-medium 
    bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors duration-200"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to profile</span>
      </button>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-primary/90 flex items-center space-x-3">
          <Clock className="w-6 h-6" />
          <span>Match History</span>
        </h3>

        <div className="space-y-4">
          {match && (
            <Card className="overflow-hidden border border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary/60" />
                      <span className="font-medium">Date:</span>
                      <span className="text-muted-foreground">
                        {match.createdDate}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <GamepadIcon className="w-4 h-4 text-primary/60" />
                      <span className="font-medium">Game Mode:</span>
                      <span className="text-muted-foreground">
                        {match.gameModeName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-primary/60" />
                      <span className="font-medium">Players:</span>
                      <span className="text-muted-foreground">
                        {match.usernames.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

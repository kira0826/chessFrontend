import apiClient from "./apiClient";
import { PlayDTO } from "@/pages/play/types";
import { ValidatorResponse } from "@/pages/play/types";

const updateMatchData = async (
  id: number,
  playDTO: PlayDTO,
  pieceType?: string
): Promise<ValidatorResponse> => {
  try {
 
    const response = await apiClient.patch<ValidatorResponse>(
      `api/matches/${id}`,
      playDTO,
      {
        params: { pieceType },
      }
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating match data:", error);
    throw error;
  }
};

export default updateMatchData;

// Representación de PieceType (puede ajustarse según la implementación en Java)
export type PieceTypeDTO =
  | "KING"
  | "QUEEN"
  | "ROOK"
  | "BISHOP"
  | "KNIGHT"
  | "PAWN";

export interface PieceDTO {
  type: PieceTypeDTO;
  color: string;
}

export interface PlayDTO {
  origin: string;
  destination: string;
  sequenceNumber: number;
  timestamp: string;
  gain: number;
  matchId: number;
  chessCardId: number;
}

export interface MatchDTO {
  id: number;
  createdDate: string;
  matchData: { [key: string]: PieceDTO };
  gameModeName: string;
  usernames: string[];
  plays: PlayDTO[];
}

export interface ValidatorResponse {
  isValid: boolean;
  validationIdentifier: string;
}

export function isMessageType1(data: unknown): data is { message: string } {
  return typeof data === "object" && data !== null && "message" in data;
}

export function isMessageType2(
  data: unknown
): data is { match: MatchDTO; validatorResponse: ValidatorResponse } {
  return (
    typeof data === "object" &&
    data !== null &&
    "match" in data &&
    "validatorResponse" in data
  );
}

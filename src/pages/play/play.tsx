import Board from "@/widgets/chess/board";
import MatchInfo from "@/widgets/chess/matchInfo";
import { Cell } from "@/widgets/chess/types";
import { useEffect, useState } from "react";
import { initialBoardSetup } from "@/widgets/chess/boardAuxFunctions";
import Coronation from "@/widgets/chess/coronation";
import { Piece } from "@/widgets";
import { LastMove } from "@/widgets/chess/types";
import { PieceType } from "@/widgets";
import { isKingInCheck, isPromotion } from "@/widgets/chess/boardAuxFunctions";
import isValidMove from "@/validations/isValidMove";
import StompService from "@/service/webSocketService";
import {
  getPieceTypeNumber,
  matrixToChessNotation,
  performMove,
  updateBoardWithChanges,
} from "./playAux";
import { GameMode } from "@/widgets/play/gameModeDropdown";
import { CreateMatch } from "@/widgets/play/createMatch";
import { JoinMatch } from "@/widgets/play/joinMatch";
import { ShareCodeDialog } from "@/widgets/play/shareCodeDialog";
import {
  isMessageType1,
  isMessageType2,
  type MatchDTO,
  type PieceDTO,
  type ValidatorResponse,
} from "./types";
import updateMatchData from "@/service/apiConsumer";

export function Play() {
  //------------------States--------------------------

  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [disableBoard, setDisableBoard] = useState<boolean>(true);
  const [sequenceNumber, setSequenceNumber] = useState<number>(0);
  const [boardSetup, setBoardSetup] = useState<(Cell | null)[][]>(
    initialBoardSetup()
  );
  const [isWhitePiece, setIsWhitePiece] = useState<boolean>(true);

  //Suscribe to topic based on matchId

  useEffect(() => {
    console.log("Connecting to websocket");
    console.log("Token: ", sessionStorage.getItem("token"));
    const service = new StompService();

    if (matchId) {
      service.connect("/ws-connect-js", () => {
        console.log("Connect using vite proxy");

        service.subscribe(`/playTo/${matchId}`, (message) => {
          //------------------Handle message from topic--------------------------

          console.log("Received message on suscribre function: ", message);

          //------------------Handle message type #1--------------------------

          if (isMessageType1(message)) {
            const castedMessage = message as { message: string };
            console.log("Message Type 1: ", castedMessage.message);

            if (castedMessage.message) {
              setUsernames(castedMessage.message.split(","));
              setDisableBoard(false);
            }
          }

          console.log("Is message type 2: ", isMessageType2(message));

          //------------------Handle message type #2--------------------------

          if (isMessageType2(message)) {
            console.log("On message type 2: ", message);

            const { match: matchData, validatorResponse } = message as {
              match: MatchDTO;
              validatorResponse: ValidatorResponse;
            } as {
              match: MatchDTO;
              validatorResponse: ValidatorResponse;
            };

            console.log("Match Data: ", matchData);

            //Match data is a map with the position of the pieces

            const matchDataMap = new Map<string, PieceDTO>(
              Object.entries(matchData.matchData)
            );

            //get last play sequence number from matchData
            const lastPlay: number =
              matchData.plays[matchData.plays.length - 1].sequenceNumber;

            setSequenceNumber(lastPlay);

            setBoardSetup(
              updateBoardWithChanges(
                boardSetup,
                matchDataMap,
                matchData.plays[matchData.plays.length - 1]
              )
            );

            console.log("Validator Response: ", validatorResponse);

            if (validatorResponse.isValid) {
              console.log(
                `Validation succeeded: ${validatorResponse.validationIdentifier}`
              );
            } else {
              console.error(
                `Validation failed: ${validatorResponse.validationIdentifier}`
              );
            }
          }
        });
      });
    }

    return () => {
      service.disconnect();
    };
  }, [matchId]);

  const [openCoronation, setOpenCoronation] = useState<boolean>(false);

  const [pendingPromotion, setPendingPromotion] = useState<{
    board: (Cell | null)[][];
    piece: Piece;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  } | null>(null);

  const [draggedPiece, setDraggedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const [possibleMoves, setPossibleMoves] = useState<
    { row: number; col: number }[]
  >([]);

  //------------------Perform move--------------------------

  const updateBoardState = (
    newBoard: (Cell | null)[][],
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    setBoardSetup(newBoard);
    setLastMove({
      piece: piece,
      fromRow: fromRow,
      fromCol: fromCol,
      toRow: toRow,
      toCol: toCol,
    });
  };

  //------------------Promotion handlers--------------------------

  const handlePromotion = (promotedPieceType: PieceType) => {
    if (pendingPromotion) {
      const { board, piece, fromRow, fromCol, toRow, toCol } = pendingPromotion;

      // Actualizar la pieza en la casilla de promoción
      const newBoard = board.map((boardRow) => boardRow.slice());
      newBoard[toRow][toCol] = {
        piece: {
          isWhite: piece.isWhite,
          type: promotedPieceType,
        },
        hasMoved: true,
      };

      // Actualizar el estado del tablero
      updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);

      // Reiniciar la promoción pendiente
      setPendingPromotion(null);

      // Cerrar el modal de promoción
      setOpenCoronation(false);
    }
  };

  //------------------Board handlers on select and drop--------------------------

  const handleDragStart = (row: number, col: number) => {
    setDraggedPiece({ row, col });
    setPossibleMoves(calculatePossibleMoves(row, col));
  };

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      const fromRow = draggedPiece.row;
      const fromCol = draggedPiece.col;
      const toRow = row;
      const toCol = col;

      const piece = boardSetup[fromRow][fromCol]?.piece;

      if (
        piece &&
        isValidMove(piece, fromRow, fromCol, toRow, toCol, boardSetup, lastMove)
      ) {
        const cardType: PieceType | undefined =
          boardSetup[fromRow][fromCol]?.piece?.type;

        let chessCardId: number | null = 0;

        if (cardType) {
          chessCardId = getPieceTypeNumber(cardType);
        }

        const newBoard = performMove(
          boardSetup,
          piece,
          fromRow,
          fromCol,
          toRow,
          toCol
        );

        // Verificar si el movimiento deja al rey en jaque
        if (isKingInCheck(newBoard, piece.isWhite)) {
          console.log("Movimiento inválido: no puedes dejar al rey en jaque");
          setDraggedPiece(null);
          return;
        }

        // Verificar promoción
        if (isPromotion(piece, toRow)) {
          //Patch match data based on the move with promotion

          setOpenCoronation(true);
          setPendingPromotion({
            board: newBoard,
            piece,
            fromRow,
            fromCol,
            toRow,
            toCol,
          });
        } else {
          //Patch match data based on the move
          const now = new Date();
          if (matchId !== null && chessCardId !== null) {
            const result = updateMatchData(matchId, {
              origin: matrixToChessNotation(fromRow, fromCol),
              destination: matrixToChessNotation(toRow, toCol),
              sequenceNumber: sequenceNumber + 1,
              timestamp: now.toISOString(),
              gain: 0,
              matchId: matchId,
              chessCardId: chessCardId,
            });

            setSequenceNumber((prev) => prev + 1);
            console.log("Result on patch: ", result);
          }

          updateBoardState(newBoard, piece, fromRow, fromCol, toRow, toCol);
        }
      } else {
        console.log("Movimiento inválido");
      }
      setPossibleMoves([]);
      setDraggedPiece(null);
    }
  };

  //------------------Calculate possible moves--------------------------

  const calculatePossibleMoves = (row: number, col: number) => {
    const piece = boardSetup[row][col]?.piece;
    if (!piece) return [];

    const moves: { row: number; col: number }[] = [];

    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(piece, row, col, toRow, toCol, boardSetup, lastMove)) {
          const newBoard = performMove(
            boardSetup,
            piece,
            row,
            col,
            toRow,
            toCol
          );
          if (!isKingInCheck(newBoard, piece.isWhite)) {
            moves.push({ row: toRow, col: toCol });
          }
        }
      }
    }


    return moves;
  };

  return (
    <div className="flex flex-row justify-center mx-auto items-center h-full w-11/12 space-x-12">
      <main className="flex flex-col justify-center items-center h-5/6 w-2/4 space-y-2">
        <MatchInfo username="AleLonber" elo={1200} profilePicture="" />

        <Board
          disableBoard={disableBoard}
          boardRepesentation={boardSetup}
          openCoronation={openCoronation}
          handleDrop={handleDrop}
          handleDragStart={((isWhitePiece && sequenceNumber % 2 == 0 )|| (!isWhitePiece && sequenceNumber % 2 != 0)) ?  handleDragStart : () => {}}
          possibleMoves={possibleMoves}
          isWhitePlayer={isWhitePiece}
        />

        <MatchInfo username="Zai0826" elo={300} profilePicture="" />
      </main>

      <section className="flex flex-col h-5/6 w-1/3 ">
        <div className="p-8">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {isWhitePiece ? "You're white player, yeahh" : "You're black as shit joe"} 
          </h3>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {`Sequenece Number: ${sequenceNumber}`}
          </h3>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {`Turn of: ` + (sequenceNumber % 2 === 0 ? "White" : "Black")}
          </h3>

          {!matchId && (
            <div>
              <CreateMatch
                selectedGameMode={gameMode}
                onGameModeSelect={setGameMode}
                setUsernames={setUsernames}
                setMatchId={setMatchId}
                setIsWhitePiece={setIsWhitePiece}
              />

              <JoinMatch
                setUsernames={setUsernames}
                setMatchId={setMatchId}
                setDisableBoard={setDisableBoard}
                setIsWhitePiece={setIsWhitePiece}
              />
            </div>
          )}

          {matchId && (
            <div>
              <h2>Match #{matchId}</h2>
              <p>Players: {usernames.join(", ")}</p>
              {usernames.length != 2 && <ShareCodeDialog code={matchId} />}
            </div>
          )}
        </div>
      </section>

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


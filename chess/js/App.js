// import { ChessBoard } from "./ChessBoardt.js";
import { ButtonControlInit } from "./ButtonsControl.js";
import { GameEvents } from "./GameEvents.js";

import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
import { selectElement } from "./Helpers/utilitesFun.js";
import { movePawnToOtherPile } from "./pawnsMovment/pawnMovementHelpers.js";

export const gameStateInital = {
  boardDir: 1,
  playerTurns: [0, 0],
  activePlayer: "white",
  kingState: {
    white: {
      stateCheck: "",

      threats: [],
      relativeMoves: [],
      possibleMoves: [],
      newPossibleMoves: [],
    },
    black: {
      stateCheck: "",

      threats: [],
      relativeMoves: [],
      possibleMoves: [],
      newPossibleMoves: [],
    },
  },
  points: [0, 0],
  eatenPawns: {
    player1: [],
    player2: [],
  },
  lastPossibleMove: [],
};

const stateM = new state();

const gameManageState = stateM.useState({ ...gameStateInital });
const [getGameState, setGameState] = gameManageState;
const chess = new ChessBoard();
const gameEvents = new GameEvents();

const changeDirOfBoard = () => {
  chess.changeDirBoard([getGameState, setGameState]);
  chess.render(false);
};

// ButtonControlInit(changeDirOfBoard);

gameEvents.initEvents(
  chess.tdBoardChess,
  [getGameState, setGameState],
  [changeDirOfBoard, chess.render.bind(chess)]
);
// movePawnToOtherPile("52-pawn-4-white-0", [4, 4]);
// movePawnToOtherPile("59-queen-3-white", [5, 5]);
// movePawnToOtherPile("61-bishop-5-white", [4, 2]);
// movePawnToOtherPile("52-pawn-4-white-0", [4, 4]);

import { ButtonControlInit } from "./ButtonsControl.js";
import { GameEvents } from "./GameEvents.js";
import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
import { objDeepCopy } from "./Helpers/utilitesFun.js";
import { gameStateInital } from "./gameState.js";
import { movePawnToOtherPile } from "./pawnsMovment/pawnMovementHelpers.js";
import { CapturePawnsList } from "./CapturePawnsList.js";

const initApp = (reRender = false) => {
  const chess = new ChessBoard();
  const gameEvents = new GameEvents();
  const stateM = new state();

  const [getGameState, setGameState] = stateM.useState(
    objDeepCopy(gameStateInital)
  );
  const capturePawnsList = new CapturePawnsList([getGameState, setGameState]);
  gameEvents.initEvents(
    chess.tdBoardChess,
    [getGameState, setGameState],
    [
      chess.changeDirBoard.bind(chess),
      capturePawnsList.render.bind(capturePawnsList),
      initApp,
    ]
  );
  reRender && chess.changeDirBoard(getGameState());
};

initApp();

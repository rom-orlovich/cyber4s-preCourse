import { ButtonControlInit } from "./ButtonsControl.js";
import { GameEvents } from "./GameEvents.js";
import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
import { objDeepCopy } from "./Helpers/utilitesFun.js";
import { gameStateInital } from "./gameState.js";

const initApp = (reRender = false) => {
  const chess = new ChessBoard();
  const gameEvents = new GameEvents();
  const stateM = new state();
  const [getGameState, setGameState] = stateM.useState(
    objDeepCopy(gameStateInital)
  );

  gameEvents.initEvents(
    chess.tdBoardChess,
    [getGameState, setGameState],
    [chess.changeDirBoard.bind(chess), initApp]
  );
  reRender && chess.changeDirBoard(getGameState());
};

initApp();

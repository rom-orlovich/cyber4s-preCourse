import { GameEvents } from "./GameEvents.js";
import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
import { objDeepCopy } from "./Helpers/utilitesFun.js";
import { gameStateInital } from "./gameState.js";
import { CapturePawnsList } from "./CapturePawnsList.js";
import { MemoryButtons } from "./MemoryButtons.js";

const initApp = (reRender = false) => {
  const stateM = new state();
  const chess = new ChessBoard();
  const gameEvents = new GameEvents();

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
  const memoryButtons = new MemoryButtons(
    [getGameState, setGameState],
    chess.changeDirBoard.bind(chess),
    capturePawnsList.render.bind(capturePawnsList)
  );
  reRender && chess.changeDirBoard(getGameState());
};

initApp();

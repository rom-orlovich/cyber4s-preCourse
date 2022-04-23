import { ButtonControlInit } from "./ButtonsControl.js";
import { GameEvents } from "./GameEvents.js";
import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
import { objDeepCopy } from "./Helpers/utilitesFun.js";
import { gameStateInital } from "./gameState.js";

const stateM = new state();
const gameManageState = stateM.useState(objDeepCopy(gameStateInital));
const chess = new ChessBoard();
const gameEvents = new GameEvents();

const initApp = () => {
  chess.render();
  const [getGameState, setGameState] = gameManageState;
  console.log(getGameState());
  gameEvents.initEvents(
    chess.tdBoardChess,
    [getGameState, setGameState],
    [chess.changeDirBoard.bind(chess), initApp]
  );
};

initApp();

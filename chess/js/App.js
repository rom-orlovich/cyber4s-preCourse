// import { ChessBoard } from "./ChessBoardt.js";
import { ButtonControlInit } from "./ButtonsControl.js";
import { GameEvents } from "./GameEvents.js";

import { ChessBoard } from "./ChessBoard.js";
import { state } from "./State.js";
const gameState = {
  boardDir: 1,
  playerTurns: [0, 0],
  points: [0, 0],
  eatenPawns: {
    player1: [],
    player2: [],
  },
};

const stateM = new state();
const gameManageState = stateM.useState(gameState);

const chess = new ChessBoard();
const gameEvents = new GameEvents();

const changeDirOfBoard = (color) => {
  chess.changeDirBoard(color, gameManageState);
  chess.render(false);
};

// ButtonControlInit(changeDirOfBoard);

gameEvents.initAddEvent(chess.tdBoardChess, gameManageState, changeDirOfBoard);

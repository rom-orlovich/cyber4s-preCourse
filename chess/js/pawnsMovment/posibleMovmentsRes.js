import { makeArray } from "../Helpers/utilitesFun.js";
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  rookMove,
} from "./pawnDirMovments.js";

export const posibleMovementsObj = (pawnType, arrTd, gameState) => {
  const pawnTypeArr = pawnType.split("-");
  const [index, type, _, color] = pawnTypeArr;
  const pawnMoves = pawnTypeArr[4];
  const { boardDir, kingState, playerTurns, points, eatenPawns } = gameState;
  const Index = index * 1;
  const [row] = arrTd[Index]?.dataset.indexPos.split(",");
  const Row = row * 1;

  const res = {
    pawn: [...pawnMove({ type, pawnMoves }, Index, arrTd, boardDir, color)],

    rook: [
      ...rookMove(type, 8, Index, -1, arrTd, color),
      ...rookMove(type, 8, Index, 1, arrTd, color),
      ...rookMove(type, 8, Index, 8, arrTd, color),
      ,
      ...rookMove(type, 8, Index, -8, arrTd, color),
    ],

    knight: [
      ...knightMove(type, Index, [10, 17], arrTd, color),
      ...knightMove(type, Index, [6, 15], arrTd, color),
      ...knightMove(type, Index, [-6, -15], arrTd, color),
      ...knightMove(type, Index, [-10, -17], arrTd, color),
    ],

    bishop: [
      ...bishopMove(type, 8, Index, -9, arrTd, color),
      ...bishopMove(type, 8, Index, -7, arrTd, color),
      ...bishopMove(type, 8, Index, 9, arrTd, color),
      ...bishopMove(type, 8, Index, 7, arrTd, color),
    ],

    queen: [
      ...bishopMove(type, 8, Index, -9, arrTd, color),
      ...bishopMove(type, 8, Index, -7, arrTd, color),
      ...bishopMove(type, 8, Index, 9, arrTd, color),
      ...bishopMove(type, 8, Index, 7, arrTd, color),
      ...rookMove(type, 8, Index, -1, arrTd, color),
      ...rookMove(type, 8, Index, 1, arrTd, color),
      ...rookMove(type, 8, Index, 8, arrTd, color),
      ,
      ...rookMove(type, 8, Index, -8, arrTd, color),
    ],

    king: [
      ...kingMove(pawnTypeArr, [-9], arrTd, kingState),
      ...kingMove(pawnTypeArr, [-7], arrTd, kingState),
      ...kingMove(pawnTypeArr, [9], arrTd, kingState),
      ,
      ...kingMove(pawnTypeArr, [7], arrTd, kingState),
      ...kingMove(pawnTypeArr, [-1], arrTd, kingState),
      ,
      ...kingMove(pawnTypeArr, [1], arrTd, kingState),
      ...kingMove(pawnTypeArr, [8], arrTd, kingState),
      ,
      ...kingMove(pawnTypeArr, [-8], arrTd, kingState),
    ],
  };

  return res[type];
};

import { makeArray, makeArrayToSet } from "../Helpers/utilitesFun.js";
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  rookMove,
} from "./pawnDirMovments.js";

export const posibleMovementsObj = (
  pawnType,
  arrTd,
  gameManageState,
  relativeMoves = false
) => {
  const pawnTypeArr = pawnType.split("-");
  const [index, type, _, color] = pawnTypeArr;
  const pawnMoves = pawnTypeArr[4];
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  const { boardDir } = gameState;
  const Index = index * 1;
  const [row] = arrTd[Index]?.dataset.indexPos.split(",");

  const res = {
    pawn: [
      ...pawnMove(
        { type, pawnMoves },
        Index,
        arrTd,
        boardDir,
        color,
        relativeMoves
      ),
    ],

    rook: [
      ...rookMove(type, 8, Index, -1, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, 1, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, 8, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, -8, arrTd, color, relativeMoves),
    ],

    knight: [
      ...knightMove(type, Index, [10, 17], arrTd, color, relativeMoves),
      ...knightMove(type, Index, [6, 15], arrTd, color, relativeMoves),
      ...knightMove(type, Index, [-6, -15], arrTd, color, relativeMoves),
      ...knightMove(type, Index, [-10, -17], arrTd, color, relativeMoves),
    ],

    bishop: [
      ...bishopMove(type, 8, Index, -9, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, -7, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, 9, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, 7, arrTd, color, relativeMoves),
    ],

    queen: [
      ...bishopMove(type, 8, Index, -9, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, -7, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, 9, arrTd, color, relativeMoves),
      ...bishopMove(type, 8, Index, 7, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, -1, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, 1, arrTd, color, relativeMoves),
      ...rookMove(type, 8, Index, 8, arrTd, color, relativeMoves),

      ...rookMove(type, 8, Index, -8, arrTd, color, relativeMoves),
    ],

    king: kingMove(pawnTypeArr, arrTd, gameManageState, relativeMoves),
  };

  return [...res[type]];
};

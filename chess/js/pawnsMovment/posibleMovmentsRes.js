import { makeArray } from "../Helpers/utilitesFun.js";
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  rookMove,
} from "./pawnDirMovments.js";
import {
  cheakBoardDir,
  checkIligalePos,
  checkNumMovesOfPawn,
} from "./pawnMovementHelpers.js";

export const posibleMovementsObj = (pawnType, arrTd, gameState) => {
  const pawnTypeArr = pawnType.split("-");
  const [index, type, _, color] = pawnTypeArr;
  const pawnMoves = pawnTypeArr[4];
  const { boardDir, kingState, playerTurns, points, eatenPawns } = gameState;
  const Index = index * 1;
  const [row] = arrTd[Index]?.dataset.indexPos.split(",");
  const Row = row * 1;

  const res = {
    pawn: {
      normalMove: {
        obliqueLeftFoward: undefined,
        obliqueRightFoward: undefined,
        obliqueLeftBackWard: undefined,
        obliqueRightBackWard: undefined,
        left: undefined,
        right: undefined,
        foward: pawnMove({ type, pawnMoves }, Index, arrTd, boardDir, color),
        backward: undefined,
      },
    },

    rook: {
      normalMove: {
        obliqueLeftFoward: undefined,
        obliqueRightFoward: undefined,
        obliqueLeftBackWard: undefined,
        obliqueRightBackWard: undefined,
        left: rookMove(type, 8, Index, -1, arrTd, color),
        right: rookMove(type, 8, Index, 1, arrTd, color),
        foward: rookMove(type, 8, Index, 8, arrTd, color),
        backward: rookMove(type, 8, Index, -8, arrTd, color),
      },
    },
    knight: {
      normalMove: {
        obliqueLeftFoward: knightMove(type, Index, [10, 17], arrTd, color),
        obliqueRightFoward: knightMove(type, Index, [6, 15], arrTd, color),
        obliqueLeftBackWard: knightMove(type, Index, [-6, -15], arrTd, color),
        obliqueRightBackWard: knightMove(type, Index, [-10, -17], arrTd, color),
        left: undefined,
        right: undefined,
        foward: undefined,
        backward: undefined,
      },
    },
    bishop: {
      normalMove: {
        obliqueLeftFoward: bishopMove(type, 8, Index, -9, arrTd, color),
        obliqueRightFoward: bishopMove(type, 8, Index, -7, arrTd, color),
        obliqueLeftBackWard: bishopMove(type, 8, Index, 9, arrTd, color),
        obliqueRightBackWard: bishopMove(type, 8, Index, 7, arrTd, color),
        left: undefined,
        right: undefined,
        foward: undefined,
        backward: undefined,
      },
    },
    queen: {
      normalMove: {
        obliqueLeftFoward: bishopMove(type, 8, Index, -9, arrTd, color),
        obliqueRightFoward: bishopMove(type, 8, Index, -7, arrTd, color),
        obliqueLeftBackWard: bishopMove(type, 8, Index, 9, arrTd, color),
        obliqueRightBackWard: bishopMove(type, 8, Index, 7, arrTd, color),
        left: rookMove(type, 8, Index, -1, arrTd, color),
        right: rookMove(type, 8, Index, 1, arrTd, color),
        foward: rookMove(type, 8, Index, 8, arrTd, color),
        backward: rookMove(type, 8, Index, -8, arrTd, color),
      },
    },
    king: {
      normalMove: {
        obliqueLeftFoward: kingMove(type, Index, [-9], arrTd, color, kingState),
        obliqueRightFoward: kingMove(
          type,
          Index,
          [-7],
          arrTd,
          color,
          kingState
        ),
        obliqueLeftBackWard: kingMove(
          type,
          Index,
          [9],
          arrTd,
          color,
          kingState
        ),
        obliqueRightBackWard: kingMove(
          type,
          Index,
          [7],
          arrTd,
          color,
          kingState
        ),
        left: kingMove(type, Index, [-1], arrTd, color, kingState),
        right: kingMove(type, Index, [1], arrTd, color, kingState),
        foward: kingMove(type, Index, [8], arrTd, color, kingState),
        backward: kingMove(type, Index, [-8], arrTd, color, kingState),
      },
    },
  };

  return res[type];
};

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
  const [index, type, number, color] = pawnTypeArr;

  const { boardDir, playerTurns, points, eatenPawns } = gameState;
  const Index = index * 1;
  const [row, column] = arrTd[Index]?.dataset.indexPos.split(",");
  const Row = row * 1;
  let numMovesPawn =
    type === "pawn" ? checkNumMovesOfPawn(pawnTypeArr[4]) : [0];

  const res = {
    pawn: {
      normalMove: {
        obliqueLeftFoward: undefined,
        obliqueRightFoward: undefined,
        obliqueLeftBackWard: undefined,
        obliqueRightBackWard: undefined,
        left: undefined,
        right: undefined,
        foward: pawnMove(type, Index, numMovesPawn, arrTd, boardDir, color),
        backward: undefined,
      },

      eatMove: {
        obliqueLeftFoward: [],
        // pawnMove(type, Index, [7], arrTd, boardDir, color),
        obliqueRightFoward: [],
        // pawnMove(type, Index, [9], arrTd, boardDir, color),
        obliqueLeftBackWard: undefined,
        obliqueRightBackWard: undefined,
        left: undefined,
        right: undefined,
        foward: undefined,
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

      eatMove: {
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

      eatMove: {
        obliqueLeftFoward: [6, 15],
        obliqueRightFoward: [8, 17],
        obliqueLeftBackWard: [-6, -15],
        obliqueRightBackWard: [-8, -17],
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

      eatMove: {
        obliqueLeftFoward: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightFoward: bishopMove(type, Row, Index, -7, arrTd, color),
        obliqueLeftBackWard: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightBackWard: bishopMove(type, Row, Index, 7, arrTd, color),
        left: undefined,
        right: undefined,
        foward: undefined,
        backward: undefined,
      },
    },
    queen: {
      normalMove: {
        obliqueLeftFoward: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightFoward: bishopMove(type, Row, Index, -7, arrTd, color),
        obliqueLeftBackWard: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightBackWard: bishopMove(type, Row, Index, 7, arrTd, color),
        left: rookMove(type, 8, Index, -1, arrTd, color),
        right: rookMove(type, 8, Index, 1, arrTd, color),
        foward: rookMove(type, 8, Index, 8, arrTd, color),
        backward: rookMove(type, 8, Index, -8, arrTd, color),
      },

      eatMove: {
        obliqueLeftFoward: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightFoward: bishopMove(type, Row, Index, -7, arrTd, color),
        obliqueLeftBackWard: bishopMove(type, Row, Index, -9, arrTd, color),
        obliqueRightBackWard: bishopMove(type, Row, Index, 7, arrTd, color),
        left: makeArray(8, (i) => -i),
        right: makeArray(8, (i) => i),
        foward: makeArray(8, (i) => i * 8),
        backward: makeArray(8, (i) => -i * 8),
      },
    },
    king: {
      normalMove: {
        obliqueLeftFoward: kingMove(type, Index, [-9], arrTd, color),
        obliqueRightFoward: kingMove(type, Index, [-7], arrTd, color),
        obliqueLeftBackWard: kingMove(type, Index, [9], arrTd, color),
        obliqueRightBackWard: kingMove(type, Index, [7], arrTd, color),
        left: kingMove(type, Index, [-1], arrTd, color),
        right: kingMove(type, Index, [1], arrTd, color),
        foward: kingMove(type, Index, [8], arrTd, color),
        backward: kingMove(type, Index, [-8], arrTd, color),
      },

      eatMove: {
        obliqueLeftFoward: [-9],
        obliqueRightFoward: [-7],
        obliqueLeftBackWard: [9],
        obliqueRightBackWard: [7],
        left: [-1],
        right: [1],
        foward: [8],
        backward: [-8],
      },
    },
  };

  return res[type];
};

import { makeArray } from "./Helpers/utilitesFun.js";
import {
  cheakBoardDir,
  checkIligalePos,
  checkNumMovesOfPawn,
  getDataFromDataSet,
  getNextPileChild,
  movePawnToOtherPile,
} from "./Helpers/pawnMovementHelpers.js";

const obliquePossibleMovment = (change, curIndex, arr, color) => {
  const newIndex = checkIligalePos(curIndex + change, curIndex, arr);
  const [row, coulmn] = arr[curIndex]?.dataset.indexPos.split(",");
  const [rowNext, coulmnNext] = arr[newIndex]?.dataset.indexPos.split(",");

  if (Math.abs(rowNext - row) !== Math.abs(coulmnNext - coulmn)) {
    return 0;
  }
  const firstChildEl = getNextPileChild(newIndex, curIndex, arr);
  if (firstChildEl && firstChildEl.dataset.typePawn?.split("-")[3] === color)
    return 0;
  return change;
};

const verticalPossibleMovment = (change, curIndex, arr, color) => {
  const newIndex = checkIligalePos(curIndex + change, curIndex, arr);
  const [row, column] = arr[curIndex]?.dataset.indexPos.split(",");
  const [rowNext, columnNext] = arr[newIndex]?.dataset.indexPos.split(",");

  if (
    !(
      (rowNext !== row && column === columnNext) ||
      (rowNext === row && column !== columnNext)
    )
  ) {
    return 0;
  }
  const firstChildEl = getNextPileChild(newIndex, curIndex, arr);
  if (firstChildEl && firstChildEl.dataset.typePawn?.split("-")[3] === color)
    return 0;

  return change;
};

const breakLoop = (change, curIndex, arrTd, color) => {
  const newPos = change + curIndex;
  const nextPileChild = getNextPileChild(newPos, curIndex, arrTd);
  if (!nextPileChild) return;
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return getColorDataSet !== color || getColorDataSet === color;
};

const bishopMove = (type, lengthLoop, curIndex, change, arrTd, color) => {
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return getColorDataSet === color || type !== "bishop"
    ? []
    : makeArray(
        lengthLoop,
        (i) => obliquePossibleMovment(i * change, curIndex, arrTd, color),
        (i) => breakLoop(i * change, curIndex, arrTd, color)
      );
};

const rookMove = (type, lengthLoop, curIndex, change, arrTd, color) => {
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);

  return getColorDataSet === color || type !== "rook"
    ? []
    : makeArray(
        lengthLoop,
        (i) => verticalPossibleMovment(i * change, curIndex, arrTd, color),
        (i) => breakLoop(i * change, curIndex, arrTd, color)
      );
};

//add the options to move twice in the first turn
const pawnMove = (type, curIndex, change, arrTd, boardDir, color) => {
  const changeDir = cheakBoardDir(boardDir, color, change);

  const nextPileChild = getNextPileChild(
    curIndex + changeDir[0],
    curIndex,
    arrTd
  );
  const colorDataSet = getDataFromDataSet(nextPileChild, 3);
  return colorDataSet === color && type !== "pawn" ? [] : changeDir;
};

export const posibleMovementsObj = (pawnType, arrTd, gameState) => {
  const pawnTypeArr = pawnType.split("-");
  const [index, type, number, color] = pawnTypeArr;

  let numMovesPawn =
    type === "pawn" ? checkNumMovesOfPawn(pawnTypeArr[4]) : [0];

  const { boardDir, playerTurns, points, eatenPawns } = gameState;

  const Index = index * 1;
  // console.log(rookMove(8, Index, -8, arrTd, color));

  const [row, column] = arrTd[Index]?.dataset.indexPos.split(",");
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
        foward: pawnMove(type, Index, numMovesPawn, arrTd, boardDir, color),
        backward: undefined,
      },

      eatMove: {
        obliqueLeftFoward: pawnMove(type, Index, [7], arrTd, boardDir, color),
        obliqueRightFoward: pawnMove(type, Index, [9], arrTd, boardDir, color),
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
        obliqueLeftFoward: [6, 15],
        obliqueRightFoward: [8, 17],
        obliqueLeftBackWard: [-6, -15],
        obliqueRightBackWard: [-8, -17],
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
        left: makeArray(8, (i) => -i),
        right: makeArray(8, (i) => i),
        foward: makeArray(8, (i) => i * 8),
        backward: makeArray(8, (i) => -i * 8),
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
        obliqueLeftFoward: [-9],
        obliqueRightFoward: [-7],
        obliqueLeftBackWard: [9],
        obliqueRightBackWard: [7],
        left: [-1],
        right: [1],
        foward: [8],
        backward: [-8],
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

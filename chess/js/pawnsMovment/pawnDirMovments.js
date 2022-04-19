import { makeArray } from "../Helpers/utilitesFun.js";
import {
  cheakBoardDir,
  getNextPileChild,
  getDataFromDataSet,
  checkIligalePos,
} from "./pawnMovementHelpers.js";

export const breakLoop = (change, curIndex, arrTd, color) => {
  const newPos = change + curIndex;
  const nextPileChild = getNextPileChild(newPos, curIndex, arrTd);
  if (!nextPileChild) return;
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return getColorDataSet !== color || getColorDataSet === color;
};
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

export const bishopMove = (
  type,
  lengthLoop,
  curIndex,
  change,
  arrTd,
  color
) => {
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return getColorDataSet === color || (type !== "bishop" && type !== "queen")
    ? []
    : makeArray(
        lengthLoop,
        (i) => obliquePossibleMovment(i * change, curIndex, arrTd, color),
        (i) => breakLoop(i * change, curIndex, arrTd, color)
      );
};

export const rookMove = (type, lengthLoop, curIndex, change, arrTd, color) => {
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);

  return getColorDataSet === color || (type !== "rook" && type !== "queen")
    ? []
    : makeArray(
        lengthLoop,
        (i) => verticalPossibleMovment(i * change, curIndex, arrTd, color),
        (i) => breakLoop(i * change, curIndex, arrTd, color)
      );
};

export const pawnMove = (type, curIndex, changes, arrTd, boardDir, color) => {
  const changeDir = cheakBoardDir(boardDir, color, changes);
  const nextPileChild = getNextPileChild(
    curIndex + changeDir[0],
    curIndex,
    arrTd
  );

  const colorDataSet = getDataFromDataSet(nextPileChild, 3);
  return colorDataSet === color || type !== "pawn" ? [] : changeDir;
};

export const knightMove = (type, curIndex, changes, arrTd, color) => {
  const nextShortPileChild = getNextPileChild(
    curIndex + changes[0],
    curIndex,
    arrTd
  );
  const nextPileLongChild = getNextPileChild(
    curIndex + changes[1],
    curIndex,
    arrTd
  );

  const colorDataSetShort = getDataFromDataSet(nextShortPileChild, 3);

  const colorDataSetLong = getDataFromDataSet(nextPileLongChild, 3);
  if (
    type !== "knight" ||
    (colorDataSetShort === color && colorDataSetLong === color)
  )
    return [];

  if (colorDataSetShort === color && colorDataSetLong !== color)
    return [changes[1]];
  if (colorDataSetShort !== color && colorDataSetLong === color)
    return [changes[0]];
  else return changes;
};

export const kingMove = (type, curIndex, changes, arrTd, color) => {
  const nextPileChild = getNextPileChild(
    curIndex + changes[0],
    curIndex,
    arrTd
  );

  const colorDataSet = getDataFromDataSet(nextPileChild, 3);

  return colorDataSet === color || type !== "king" ? [] : [changes[0]];
};

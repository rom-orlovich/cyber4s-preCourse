import { makeArray } from "../Helpers/utilitesFun.js";
import {
  cheakBoardDir,
  getNextPileChild,
  getDataFromDataSet,
  checkIligalePos,
  checkNumMovesOfPawn,
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
  if (type !== "bishop" && type !== "queen") return [];
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
  if (type !== "rook" && type !== "queen") return [];
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);

  return getColorDataSet === color
    ? []
    : makeArray(
        lengthLoop,
        (i) => verticalPossibleMovment(i * change, curIndex, arrTd, color),
        (i) => breakLoop(i * change, curIndex, arrTd, color)
      );
};

export const pawnMove = (
  pawnType,
  curIndex = curIndex * 1,
  arrTd,
  boardDir,
  color
) => {
  if (pawnType.type !== "pawn") return [];
  let numMovesPawn = checkNumMovesOfPawn(pawnType.pawnMoves);
  let arrChanges = cheakBoardDir(boardDir, color, [7, 9, ...numMovesPawn]);
  const arr = arrChanges.map((change) => {
    const newIndex = checkIligalePos(curIndex + change, curIndex, arrTd);
    const checkOblique =
      newIndex - 7 === curIndex ||
      newIndex + 7 === curIndex ||
      newIndex - 9 === curIndex ||
      newIndex + 9 === curIndex;
    const td = arrTd[newIndex];
    if (!td) return 0;
    const img = td?.firstElementChild;
    if (!img && !checkOblique) return change;

    if (img && getDataFromDataSet(img, 3) !== color && checkOblique)
      return change;
    if (img && getDataFromDataSet(img, 3) === color) return 0;
    return 0;
  });
  return arr;
};

const checKnightMove = (curIndex, newIndex, arr) => {
  if (!arr[newIndex]) return;
  const [row, column] = arr[curIndex]?.dataset.indexPos?.split(",");
  const [rowNext, columnNext] = arr[newIndex].dataset?.indexPos?.split(",");
  if (
    Math.abs(rowNext - row) * 2 === Math.abs(column - columnNext) ||
    Math.abs(rowNext - row) === Math.abs(column - columnNext) * 2
  )
    return arr[newIndex];
};

export const knightMove = (type, curIndex, changes, arrTd, color) => {
  if (type !== "knight") return [];
  return changes.map((change) => {
    const newIndex = checkIligalePos(curIndex + change, curIndex, arrTd);
    const checkNextPileChild = checKnightMove(curIndex, newIndex, arrTd);
    if (!checkNextPileChild) return 0;
    const img = checkNextPileChild.firstElementChild;
    if (!img) return change;
    const colorDataSet = getDataFromDataSet(img, 3);
    if (colorDataSet !== color) return change;
    else return 0;
  });
};

export const kingMove = (type, curIndex, changes, arrTd, color, kingState) => {
  const nextPileChild = getNextPileChild(
    curIndex + changes[0],
    curIndex,
    arrTd
  );

  const colorDataSet = getDataFromDataSet(nextPileChild, 3);

  return colorDataSet === color || type !== "king" ? [] : [changes[0]];
};

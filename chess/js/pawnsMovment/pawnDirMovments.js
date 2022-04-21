import {
  editDataSet,
  makeArray,
  selectElement,
} from "../Helpers/utilitesFun.js";
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
  const CurIndex = curIndex * 1;
  const newIndex = checkIligalePos(CurIndex + change, CurIndex, arr);
  const [row, coulmn] = arr[CurIndex]?.dataset.indexPos.split(",");
  const [rowNext, coulmnNext] = arr[newIndex]?.dataset.indexPos.split(",");

  if (Math.abs(rowNext - row) !== Math.abs(coulmnNext - coulmn)) {
    return CurIndex;
  }

  const firstChildEl = getNextPileChild(newIndex, curIndex, arr);
  if (firstChildEl && firstChildEl.dataset.typePawn?.split("-")[3] === color)
    return CurIndex;
  return newIndex;
};

const verticalPossibleMovment = (change, curIndex, arr, color) => {
  const CurIndex = curIndex * 1;
  const newIndex = checkIligalePos(CurIndex + change, CurIndex, arr);
  const [row, column] = arr[CurIndex]?.dataset.indexPos.split(",");
  const [rowNext, columnNext] = arr[newIndex]?.dataset.indexPos.split(",");
  if (
    !(
      (rowNext !== row && column === columnNext) ||
      (rowNext === row && column !== columnNext)
    )
  ) {
    return CurIndex;
  }
  const firstChildEl = getNextPileChild(newIndex, CurIndex, arr);
  if (firstChildEl && firstChildEl.dataset.typePawn?.split("-")[3] === color)
    return CurIndex;

  return newIndex;
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
    if (!td) return curIndex;
    const img = td?.firstElementChild;

    if (
      !img &&
      !checkOblique &&
      (!arrTd[curIndex + 8].firstElementChild ||
        !arrTd[curIndex - 8].firstElementChild)
    )
      return newIndex;
    if (img) {
      const colorDataSet = getDataFromDataSet(img, 3);
      if (colorDataSet !== color && checkOblique) return newIndex;

      if (colorDataSet === color) return curIndex;
    }
    return curIndex;
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
    const CurIndex = curIndex * 1;
    const newIndex = checkIligalePos(CurIndex + change, CurIndex, arrTd);
    const checkNextPileChild = checKnightMove(curIndex, newIndex, arrTd);
    if (!checkNextPileChild) return CurIndex;
    const img = checkNextPileChild.firstElementChild;
    if (!img) return newIndex;
    const colorDataSet = getDataFromDataSet(img, 3);
    if (colorDataSet !== color) return newIndex;
    else return CurIndex;
  });
};

export const kingMove = (typePawn, changes, arrTd, kingState) => {
  const [index, type, _, color] = typePawn;
  if (type !== "king") return [];
  const curIndex = index * 1;
  const newIndex = checkIligalePos(curIndex + changes[0], curIndex, arrTd);
  const kingType = kingState[color];

  const nextPileChild = getNextPileChild(newIndex, curIndex, arrTd);

  const colorDataSet = getDataFromDataSet(nextPileChild, 3);
  if (colorDataSet === color) return [];
  return [newIndex];
};

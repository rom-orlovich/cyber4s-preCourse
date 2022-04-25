import {
  editDataSet,
  makeArray,
  selectElement,
} from "../Helpers/utilitesFun.js";
import {
  cheakBoardDir,
  getNextPileChild,
  getDataFromDataSet,
  checkillegalPos,
  checkNumMovesOfPawn,
} from "./pawnMovementHelpers.js";

const getRowsColumns = (curIndex, newIndex, arrTD) => {
  const CurIndex = curIndex * 1;

  const NewIndex = checkillegalPos(CurIndex, newIndex, arrTD);
  const [row, column] = arrTD[CurIndex]?.dataset.indexPos.split(",");
  const [rowNext, columnNext] = arrTD[NewIndex]?.dataset.indexPos.split(",");

  return {
    curPos: [row, column],
    newPos: [rowNext, columnNext],
    NewIndex: NewIndex,
  };
};

export const breakLoop = (change, curIndex, arrTd, color, relativeMoves) => {
  const newPos = change + curIndex;
  const nextPileChild = getNextPileChild(curIndex, newPos, arrTd);
  if (!nextPileChild) return;
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  if (relativeMoves && getColorDataSet === color) return true;
  if (getColorDataSet !== color || getColorDataSet === color) return true;
};
const obliquePossibleMovment = (
  curIndex,
  change,
  arr,
  color,
  relativeMoves
) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, curIndex + change, arr);

  if (Math.abs(rowNext - row) !== Math.abs(columnNext - column)) {
    return curIndex;
  }

  const nextPileImg = getNextPileChild(curIndex, NewIndex, arr);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);
  if (colorNextPileImg === color && relativeMoves) return NewIndex;
  if (nextPileImg && colorNextPileImg === color) return curIndex;

  return NewIndex;
};

const verticalPossibleMovment = (
  curIndex,
  change,
  arr,
  color,
  relativeMoves
) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, curIndex + change, arr);
  if (
    !(
      (rowNext !== row && column === columnNext) ||
      (rowNext === row && column !== columnNext)
    )
  ) {
    return curIndex;
  }
  const nextPileImg = getNextPileChild(curIndex, NewIndex, arr);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);

  if (relativeMoves && colorNextPileImg === color) return NewIndex;
  if (nextPileImg && colorNextPileImg === color) return curIndex;

  return NewIndex;
};

export const bishopMove = (
  type,
  lengthLoop,
  curIndex,
  change,
  arrTd,
  color,
  relativeMoves
) => {
  if (type !== "bishop" && type !== "queen") return [];
  const nextPileChild = getNextPileChild(curIndex, curIndex + change, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return !relativeMoves && getColorDataSet === color
    ? []
    : makeArray(
        1,
        lengthLoop,
        1,
        (i) =>
          obliquePossibleMovment(
            curIndex,
            i * change,
            arrTd,
            color,
            relativeMoves
          ),
        (i) => breakLoop(i * change, curIndex, arrTd, color, relativeMoves)
      );
};

export const rookMove = (
  type,
  lengthLoop,
  curIndex,
  change,
  arrTd,
  color,
  relativeMoves
) => {
  if (type !== "rook" && type !== "queen") return [];
  const nextPileChild = getNextPileChild(curIndex, curIndex + change, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);

  return !relativeMoves && getColorDataSet === color
    ? []
    : makeArray(
        1,
        lengthLoop,
        1,
        (i) =>
          verticalPossibleMovment(
            curIndex,
            i * change,
            arrTd,
            color,
            relativeMoves
          ),
        (i) => breakLoop(i * change, curIndex, arrTd, color, relativeMoves)
      );
};

const checkPawnMovement = (curIndex, newIndex, arrTD, color, relativeMoves) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, newIndex, arrTD);

  const rowDiff1 = Math.abs(row - rowNext) === 1;
  const rowDiff2 = Math.abs(row - rowNext) === 2;
  const columnDiff0 = Math.abs(column - columnNext) === 0;
  const columnDiff1 = Math.abs(column - columnNext) === 1;
  const firstRowMoveCheck = rowDiff1 && columnDiff0;
  const secRowMoveCheck = rowDiff2 && columnDiff0;
  const eatMoveCheck = rowDiff1 && columnDiff1;

  if (!(firstRowMoveCheck || secRowMoveCheck || eatMoveCheck)) return curIndex;

  const nextChildIndex = color === "black" ? curIndex + 8 : curIndex - 8;

  const nextPileImg = getNextPileChild(curIndex, NewIndex, arrTD);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);
  const nextOnePileImg = getNextPileChild(curIndex, nextChildIndex, arrTD);
  const colorOneNextPileImg = getDataFromDataSet(nextOnePileImg, 3);

  if (firstRowMoveCheck && !nextPileImg) return newIndex;

  if (secRowMoveCheck && !nextPileImg && !colorOneNextPileImg) return NewIndex;

  if (
    (eatMoveCheck && nextPileImg && color !== colorNextPileImg) ||
    (eatMoveCheck && relativeMoves)
  )
    return NewIndex;

  return curIndex;
};

export const pawnMove = (
  typePawn,
  curIndex,
  arrTD,

  color,
  relativeMoves
) => {
  if (typePawn.type !== "pawn") return [];
  let numMovesPawn = checkNumMovesOfPawn(typePawn.pawnMoves);
  let arrChanges = cheakBoardDir(color, [7, 9, ...numMovesPawn]);

  const arr = arrChanges.map((change) => {
    return checkPawnMovement(
      curIndex,
      curIndex + change,
      arrTD,
      color,
      relativeMoves
    );
  });

  return arr;
};

const checKnightMove = (curIndex, newIndex, arrTd) => {
  const NewIndex = checkillegalPos(curIndex, newIndex, arrTd);
  const [row, column] = arrTd[curIndex]?.dataset.indexPos?.split(",");
  const [rowNext, columnNext] = arrTd[NewIndex].dataset?.indexPos?.split(",");
  if (
    Math.abs(rowNext - row) * 2 === Math.abs(column - columnNext) ||
    Math.abs(rowNext - row) === Math.abs(column - columnNext) * 2
  )
    return NewIndex;
};

export const knightMove = (
  type,
  curIndex,
  changes,
  arrTd,
  color,
  relativeMoves
) => {
  if (type !== "knight") return [];
  return changes.map((change) => {
    const CurIndex = curIndex * 1;
    const NewIndex = checKnightMove(curIndex, CurIndex + change, arrTd);
    const checkNextPileChild = arrTd[NewIndex];
    if (!checkNextPileChild) return CurIndex;
    const img = checkNextPileChild.firstElementChild;
    if (!img) return NewIndex;
    const colorDataSet = getDataFromDataSet(img, 3);
    if (!relativeMoves && colorDataSet === color) return CurIndex;
    else return NewIndex;
  });
};

export const kingMove = (typePawn, arrTd, gameManageState, relativeMoves) => {
  const [index, type, _, color] = typePawn;

  if (type !== "king") return [];
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  const { kingState } = gameState;

  const kingStateByColor = kingState[color];
  const curPosisbleMove = kingStateByColor.possibleMoves;
  const curThreatArr = kingStateByColor.threats;

  const curIndex = index * 1;

  const newPossibleMove = [];
  let curThreat, curThreatInPos;
  curPosisbleMove.forEach((pm) => {
    curThreat = curThreatArr.some((threat) => threat === pm);

    if (!curThreatInPos)
      curThreatInPos = curThreatArr.some(
        (threat) => threat === pm && threat === curIndex
      );

    const nextPileChild = getNextPileChild(curIndex, pm, arrTd);
    const colorDataSet = getDataFromDataSet(nextPileChild, 3);
    if (!colorDataSet && !curThreat) newPossibleMove.push(pm);

    if (colorDataSet && colorDataSet !== color) newPossibleMove.push(pm);
    else if (relativeMoves) newPossibleMove.push(pm);
  });

  if (curThreatInPos) {
    kingStateByColor.stateCheck = "check";
  } else kingStateByColor.stateCheck = "";

  kingStateByColor.newPossibleMoves = newPossibleMove;

  setGameState(gameState);
  return newPossibleMove;
};

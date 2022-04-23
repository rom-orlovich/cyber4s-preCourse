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

const getRowsColumns = (curIndex, newIndex, arrTD) => {
  const CurIndex = curIndex * 1;

  const NewIndex = checkIligalePos(newIndex, CurIndex, arrTD);
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
  const nextPileChild = getNextPileChild(newPos, curIndex, arrTd);
  if (!nextPileChild) return;
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  if (relativeMoves && getColorDataSet === color) return true;
  if (getColorDataSet !== color || getColorDataSet === color) return true;
};
const obliquePossibleMovment = (curIndex, change, arr, color) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, curIndex + change, arr);

  if (Math.abs(rowNext - row) !== Math.abs(columnNext - column)) {
    return curIndex;
  }

  const nextPileImg = getNextPileChild(NewIndex, curIndex, arr);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);
  if (nextPileImg && colorNextPileImg === color) return curIndex;
  return NewIndex;
};

const verticalPossibleMovment = (curIndex, change, arr, color) => {
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
  const nextPileImg = getNextPileChild(NewIndex, curIndex, arr);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);
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
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  return !relativeMoves && getColorDataSet === color
    ? []
    : makeArray(
        1,
        lengthLoop,
        1,
        (i) => obliquePossibleMovment(curIndex, i * change, arrTd, color),
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
  const nextPileChild = getNextPileChild(curIndex + change, curIndex, arrTd);
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);

  return !relativeMoves && getColorDataSet === color
    ? []
    : makeArray(
        1,
        lengthLoop,
        1,
        (i) => verticalPossibleMovment(curIndex, i * change, arrTd, color),
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

  const nextPileImg = getNextPileChild(NewIndex, curIndex, arrTD);

  if (firstRowMoveCheck && !nextPileImg) return NewIndex;

  if (secRowMoveCheck && !nextPileImg) return NewIndex;

  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);

  if (
    (eatMoveCheck && nextPileImg && color !== colorNextPileImg) ||
    (eatMoveCheck && relativeMoves)
  )
    return NewIndex;

  return curIndex;
};

export const pawnMove = (
  pawnType,
  curIndex,
  arrTD,
  boardDir,
  color,
  relativeMoves
) => {
  if (pawnType.type !== "pawn") return [];
  let numMovesPawn = checkNumMovesOfPawn(pawnType.pawnMoves);
  let arrChanges = cheakBoardDir(boardDir, color, [7, 9, ...numMovesPawn]);
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
  const NewIndex = checkIligalePos(newIndex, curIndex, arrTd);
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
  // console.log(kingState);
  const kingStateByColor = kingState[color];
  const curPosisbleMove = kingStateByColor.possibleMoves;
  const curThreatArr = kingStateByColor.threats;
  // console.log(curPosisbleMove);
  const curIndex = index * 1;
  // console.log(curThreatArr);
  const newPossibleMove = [];
  let curThreat, curThreatInPos;
  curPosisbleMove.forEach((el) => {
    curThreat = curThreatArr.some((threat) => threat === el);

    if (!curThreatInPos)
      curThreatInPos = curThreatArr.some(
        (threat) => threat === el && threat === curIndex
      );
    // console.log(curThreat);
    // console.log(curThreat, "threat", el);
    const nextPileChild = getNextPileChild(el, curIndex, arrTd);
    const colorDataSet = getDataFromDataSet(nextPileChild, 3);
    if (!colorDataSet && !curThreat) newPossibleMove.push(el);
    // console.log("colorDataSet", colorDataSet, "curThreat", curThreat);
    // if (!colorDataSet && curThreat) {
    //   console.log("s");
    //   kingStateByColor.stateCheck = "check";
    //   alert("check");
    // }

    if (colorDataSet && colorDataSet !== color) newPossibleMove.push(el);
    else if (relativeMoves) newPossibleMove.push(el);
  });
  // console.log(curThreatInPos);
  if (curThreatInPos) {
    kingStateByColor.stateCheck = "check";
    // alert("check");
  }

  kingStateByColor.newPossibleMoves = newPossibleMove;
  // console.log(kingStateByColor);
  setGameState(gameState);
  return newPossibleMove;

  // const newIndex = checkIligalePos(curIndex + changes[0], curIndex, arrTd);

  // // console.log(gameState);

  // const nextPileChild = getNextPileChild(newIndex, curIndex, arrTd);
  // const colorDataSet = getDataFromDataSet(nextPileChild, 3);
  // const iligalPos = lastPossibleMove.find((el) => el === newIndex);

  // //צריך להאזין לאיומים על המלך מחוץ לפונקציה ולמנוע תזוזה של המלך במיקומים האלו

  // const threat = kingStateByColor.threat.find((el) => el === newIndex);

  // if ((iligalPos && !colorDataSet) || threat) {
  //   return [];
  // }
};
//לבדוק את האיומים על המלך
//לבטל את האפשרותלאכול את המלך

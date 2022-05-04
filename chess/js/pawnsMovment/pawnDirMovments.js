import { makeArray } from "../Helpers/utilitesFun.js";
import {
  cheakBoardDir,
  getNextPileChild,
  getDataFromDataSet,
  checkillegalPos,
  checkNumMovesOfPawn,
  checkIfKingCanCastle,
} from "./pawnMovementHelpers.js";
import { posibleMovementsObj } from "./posibleMovmentsRes.js";

/**
 *
 * @param {Number} curIndex
 * @param {Number} newIndex
 * @param {Array} arrTD
 * @returns  Object that contains all the data about the row and column of the
 * current position and return the new illegl index
 */
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

/**
 *
 * @param {Number} change Get the change number in the index of the array TD.
 * @param {Number} curIndex
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {String} color Get color of the pawn
 * @param {Boolean} relativeMoves If is true the function will not relate to the same color
 * restriction
 * @returns Boolean value or undefined
 */
export const breakLoop = (curIndex, change, arrTD, color, relativeMoves) => {
  const newPos = change + curIndex;
  const nextPileChild = getNextPileChild(curIndex, newPos, arrTD);
  if (!nextPileChild) return;
  const getColorDataSet = getDataFromDataSet(nextPileChild, 3);
  // if (relativeMoves && getColorDataSet===color) return true;
  if (relativeMoves && getColorDataSet) return false;
  if (getColorDataSet !== color || getColorDataSet === color) return true;
};

/**
 *
 * @param {Number} curIndex
 * @param {Number} change Get the change number in the index of the array TD. Get the change number in the index of the array TD.
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {String} color Get color of the pawn
 * @param {Boolean} relativeMoves If is true the function will not relate to the same color
 * restriction
 * @returns Boolean value or undefined
 */
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

  //Check if the different between the new row and coulmn
  //and the current row and coulmn are equalls otherwise return the cur index

  if (Math.abs(rowNext - row) !== Math.abs(columnNext - column)) {
    return curIndex;
  }

  //Check if the next move of pawn is blocked by other pawn with the same color
  // and in case the possible movment is on relative mode , return the new Index
  //otherwise return the cur index

  const nextPileImg = getNextPileChild(curIndex, NewIndex, arr);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);
  if (colorNextPileImg === color && relativeMoves) return NewIndex;
  // if (colorNextPileImg === color) return NewIndex;
  if (nextPileImg && colorNextPileImg === color) return curIndex;

  return NewIndex;
};

/**
 *
 * @param {Number} curIndex
 * @param {Number} change Get the change number in the index of the array TD. Get the change number in the index of the array TD.
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {String} color Get color of the pawn
 * @param {Boolean} relativeMoves If is true the function will not relate to the same color
 * restriction
 * @returns Boolean value or undefined
 */
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

  //Check if the different between the new row and coulmn
  //and the current row and coulmn are equalls otherwise return the cur index
  if (
    !(
      (rowNext !== row && column === columnNext) ||
      (rowNext === row && column !== columnNext)
    )
  ) {
    return curIndex;
  }

  //Check if the next move of pawn is blocked by other pawn with the same color
  // and in case the possible movment is on relative mode , return the new Index
  //otherwise return the cur index
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
  arrTD,
  color,
  relativeMoves
) => {
  if (type !== "bishop" && type !== "queen") return [];

  //Check if the next near move is blocked by other pawn with the same color
  // and in case the possible movment is on relative mode , excuate make array fun
  //otherwise return the empty array
  const nextPileChild = getNextPileChild(curIndex, curIndex + change, arrTD);
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
            arrTD,
            color,
            relativeMoves
          ),
        (i) => breakLoop(curIndex, i * change, arrTD, color, relativeMoves)
      );
};

export const rookMove = (
  type,
  lengthLoop,
  curIndex,
  change,
  arrTD,
  color,
  relativeMoves
) => {
  if (type !== "rook" && type !== "queen") return [];

  //Check if the next near move is blocked by other pawn with the same color
  // and in case the possible movment is on relative mode , excuate make array fun
  //otherwise return the empty array
  const nextPileChild = getNextPileChild(curIndex, curIndex + change, arrTD);
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
            arrTD,
            color,
            relativeMoves
          ),
        (i) => breakLoop(curIndex, i * change, arrTD, color, relativeMoves)
      );
};

/**
 *
 * @param {Number} curIndex
 * @param {Number} newIndex
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {String} color Get color of the pawn
 * @param {Boolean} relativeMoves If is true the function will not relate to the same color
 * restriction
 * @returns Boolean value or undefined
 */

const checkPawnMovement = (curIndex, newIndex, arrTD, color, relativeMoves) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, newIndex, arrTD);

  //Calculate the different between the new row and col with the cur row and col
  const rowDiff1 = Math.abs(row - rowNext) === 1;
  const rowDiff2 = Math.abs(row - rowNext) === 2;
  const columnDiff0 = Math.abs(column - columnNext) === 0;
  const columnDiff1 = Math.abs(column - columnNext) === 1;

  //Make some condition for checking if the next movement is not pass the condition
  // return the cur index
  const firstRowMoveCheck = rowDiff1 && columnDiff0;
  const secRowMoveCheck = rowDiff2 && columnDiff0;
  const eatMoveCheck = rowDiff1 && columnDiff1;

  if (!(firstRowMoveCheck || secRowMoveCheck || eatMoveCheck)) return curIndex;

  //Get the data about the the movment of one pile and two piles
  const nextPileImg = getNextPileChild(curIndex, NewIndex, arrTD);
  const colorNextPileImg = getDataFromDataSet(nextPileImg, 3);

  //Get the data about the the movment of one pile
  const nextChildIndex = color === "black" ? curIndex + 8 : curIndex - 8;
  const nextOnePileImg = getNextPileChild(curIndex, nextChildIndex, arrTD);
  const colorOneNextPileImg = getDataFromDataSet(nextOnePileImg, 3);

  //Check if the movement of one row if it is possible and
  //there is no pawn in the next pile
  if (firstRowMoveCheck && !nextPileImg) return NewIndex;

  //Check if the movement of sec row if it is possible
  //and there is no pawn in the next one pile
  if (secRowMoveCheck && !nextPileImg && !colorOneNextPileImg) return NewIndex;

  //Check if the movement of eat move if it is possible
  //and there is  pawn in the next one pile with different color
  // or the relative move mode is active
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

  //The num moves of pawn can move
  let numMovesPawn = checkNumMovesOfPawn(typePawn.pawnMoves);

  //The pawn possible moves diraction
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

const checKnightMove = (curIndex, newIndex, arrTD) => {
  const {
    newPos: [row, column],
    curPos: [rowNext, columnNext],
    NewIndex,
  } = getRowsColumns(curIndex, newIndex, arrTD);
  //Check if the ratio between the new row and coulmn
  //and the current row and coulmn are 1/2;
  if (
    Math.abs(rowNext - row) * 2 === Math.abs(column - columnNext) ||
    Math.abs(rowNext - row) === Math.abs(column - columnNext) * 2
  )
    return NewIndex;
};

//This function is needed beacuse it  checks the movement of king relative to himself
// and if he can move at all.
export const knightMove = (
  type,
  curIndex,
  changes,
  arrTD,
  color,
  relativeMoves
) => {
  if (type !== "knight") return [];
  return changes
    .map((change) => {
      const CurIndex = curIndex * 1;
      const NewIndex = checKnightMove(curIndex, CurIndex + change, arrTD);
      //Check if the new pile is empty
      const checkNextPileChild = arrTD[NewIndex];
      if (!checkNextPileChild) return CurIndex;

      //Check if the new pile have img
      const img = checkNextPileChild.firstElementChild;
      if (!img) return NewIndex;

      //Check if the new pile have knight with same color
      // and if the reletive moves mode is active
      //if it ture return cur index;
      const colorDataSet = getDataFromDataSet(img, 3);
      if (!relativeMoves && colorDataSet === color) return CurIndex;
      else return NewIndex;
    })
    .filter((pos) => pos !== curIndex * 1);
};

export const kingMove = (typePawn, arrTD, gameManageState, relativeMoves) => {
  const [index, type, _, color] = typePawn;

  if (type !== "king") return [];

  // The king need to access the king state: cur possibleMoves and threats
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  const { kingState } = gameState;
  const kingStateByColor = kingState[color];
  const curPosisbleMove = kingStateByColor.possibleMoves;
  const curThreatArrAbs = kingStateByColor.absoluteThreats;
  const curThreatArrRel = kingStateByColor.relativeThreats;
  const castleState = kingStateByColor.castleState;
  const curIndex = index * 1;
  const newPossibleMove = [];
  let curThreatAbs, curThreatRel, curThreatInPos;
  // console.log(curPosisbleMove);
  curPosisbleMove.forEach((pm) => {
    // For each cur possible move, check if there is some threat on the king
    //and if the threat is same as his possible move
    curThreatAbs = curThreatArrAbs.includes(pm);
    curThreatRel = curThreatArrRel.includes(curIndex);

    curThreatInPos = curThreatArrAbs.includes(curIndex);

    //check it the next pile is empty and the color is different
    //and the reltaive move mode is active
    //if it is true push tu new possible move
    const nextPileChild = getNextPileChild(curIndex, pm, arrTD);

    const colorDataSet = getDataFromDataSet(nextPileChild, 3);
    // console.log("curThreatAbs", curThreatArrAbs, "pm", pm);
    if (!colorDataSet && !curThreatAbs) newPossibleMove.push(pm);
    if (colorDataSet && colorDataSet !== color) newPossibleMove.push(pm);
    else if (relativeMoves) newPossibleMove.push(pm);
  });

  //Check if the king did castle
  if (!castleState.didCastle) {
    const [rook1, rook2] = castleState.moveRooks;

    //Check the if there aren't player in the first and the sec nearby piles
    //for the both sides of the king

    checkIfKingCanCastle(curIndex, curIndex - 2, rook1, arrTD) &&
      newPossibleMove.push(curIndex - 2);

    checkIfKingCanCastle(curIndex, curIndex + 2, rook2, arrTD) &&
      newPossibleMove.push(curIndex + 2);
  }

  // The check if there is some threat on the king
  //and change the state of check

  if (curThreatInPos || curThreatRel) kingStateByColor.stateCheck = "check";

  //Update the state of the game
  kingStateByColor.newPossibleMoves = newPossibleMove;
  setGameState(gameState);
  return newPossibleMove;
};

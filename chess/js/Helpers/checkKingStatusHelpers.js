import { getDataFromDataSet } from "../pawnsMovment/pawnMovementHelpers.js";
import {
  getHowManyTimeElApperInArr,
  getSameValueBet2Arr,
  makeArray,
} from "./utilitesFun.js";

export const getDataAboutPawns = (color, arrTD) => {
  const curDataPawn = [];
  arrTD.forEach((td) => {
    const img = td.firstElementChild;
    if (!img) return;
    const colorImg = getDataFromDataSet(img, 3);

    if (colorImg === color) curDataPawn.push(img.dataset.typePawn);
  });
  return curDataPawn;
};

const getTheMovmentUntilTheKing = (posPawn, kingPos, arr) => {
  const kingPosIndex = arr.findIndex((el) => el === kingPos);
  const posPawnIndex = arr.findIndex((el) => el === posPawn);

  let diff;
  if (kingPosIndex === -1 || posPawnIndex === -1) return [];
  diff = Math.abs(posPawn - kingPos);

  let i;
  if (diff % 7 === 0) i = 7;
  else if (diff % 8 === 0) i = 8;
  else if (diff % 9 === 0) i = 9;
  else i = 1;

  const arrS = makeArray(
    Math.min(posPawn, kingPos),
    Math.max(posPawn, kingPos),
    i
  );
  return arrS;
};

export const checkPossibleThreatOfKing = (
  typePawnData,
  theCheckedMoves,
  possibleMovesFun,
  relative = true
) => {
  let threatArr = [];
  typePawnData.forEach((data) => {
    const pawnsPossibleMove = possibleMovesFun(data, relative);

    const sameValue = getSameValueBet2Arr(pawnsPossibleMove, theCheckedMoves);

    if (sameValue.length === 0) return;
    threatArr = [...threatArr, ...sameValue];
  });
  return threatArr;
};

export const checkPawnThreatMove = (typePawnData, possibleMoves, kingPos) => {
  let playerMove = [];
  typePawnData.forEach((data) => {
    const [curIndex] = data.split("-");
    const possibleMove = possibleMoves(data);

    const movmentUntilTheKing = getTheMovmentUntilTheKing(
      curIndex * 1,
      kingPos,
      possibleMove
    );

    const sameValue = getSameValueBet2Arr(possibleMove, movmentUntilTheKing);
    if (sameValue.length === 0) return;
    playerMove = [...playerMove, ...sameValue];
  });

  return playerMove;
};

export const checkKingPossibleMove = (threatArr, curPossibleMoves) => {
  const newPossibleMove = [];
  curPossibleMoves.forEach((pm) => {
    const timesInThreat = getHowManyTimeElApperInArr(pm, threatArr);
    if (timesInThreat < 2) newPossibleMove.push(pm);
  });

  return newPossibleMove;
};
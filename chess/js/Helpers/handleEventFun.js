import {
  checkIligalePos,
  editDatasSetByQuery,
  getDataFromDataSet,
  getKingRelativePos,
  getNextPileChild,
  movePawnToOtherPile,
} from "../pawnsMovment/pawnMovementHelpers.js";
import { posibleMovementsObj } from "../pawnsMovment/posibleMovmentsRes.js";
import {
  getHowManyTimeElApperInArr,
  getSameValueBet2Arr,
  makeArray,
  makeArrayToSet,
} from "./utilitesFun.js";

export const handlePosibleMovment = (
  pawnType,
  posibleMoves,
  arrTD,
  gameManageState,
  addActive = true
) => {
  const [index, type, number, color] = pawnType.split("-");

  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  const kingState = gameState.kingState[gameState.activePlayer];

  posibleMoves.forEach((change) => {
    addActive
      ? arrTD[change].classList.add("active")
      : arrTD[change].classList.remove("active");
  });
};

export const handleClickPawn = (
  pawnType,
  posibleMoves,
  arrTD,
  handleAfterClick,
  gameManageState
) => {
  let [CurIndex, type, _, color] = pawnType.split("-");
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  posibleMoves.forEach((el) => {
    const kingState = gameState.kingState[gameState.activePlayer];

    arrTD[el].addEventListener("click", (e) => {
      const target = e.target.closest("td");
      const indexPosTDClick = target?.dataset?.indexPos;

      if (!target) return;
      let dataInfo = movePawnToOtherPile(pawnType, indexPosTDClick);

      if (!dataInfo) return;
      if (type === "pawn") editDatasSetByQuery(el, 4, "1");
      if (type === "king") {
        gameState.kingState[color].pos = dataInfo.split("-")[0];
        setGameState(gameState);
      }
      handleAfterClick(dataInfo, posibleMovementsObj);
    });
  });
};

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

  return makeArrayToSet(arrS);
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
    // if (data.split("-")[1] === "pawn")
    //   console.log(data, "kingPos", pawnsPossibleMove);
    const sameValue = getSameValueBet2Arr(pawnsPossibleMove, theCheckedMoves);
    // console.log(
    //   data,
    //   "sameValue",
    //   sameValue,
    //   "pawnsPossibleMove",
    //   pawnsPossibleMove,
    //   "theCheckedMoves",
    //   theCheckedMoves
    // );

    if (sameValue.length === 0) return;
    threatArr = [...threatArr, ...sameValue];
  });
  return threatArr;
  // return makeArrayToSet(threatArr);
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
  // return makeArrayToSet(playerMove);
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

///create check mate disable function
// if (kingState.threat.length > 0)
//   if (el && !kingState.threat.every((treat) => treat === el))
//     return () => {
//       console.log("s");
//       kingState.checkState = "checkmate";
//       setGameState(gameState);
//       alert("checkmate");
//     };

import { checkThreatOnPiles } from "../Helpers/checkKingStatusHelpers.js";
import {
  selectElement,
  editDataSet,
  makeArrayToSet,
} from "../Helpers/utilitesFun.js";
import { posibleMovementsObj } from "./posibleMovmentsRes.js";

/**
 *
 * @param {Element} el
 * @param {Number} pos
 * @param {String} datasetName
 * @param {String} split Split query of the string
 * @returns The choosen data from the dataset accroding the pos of the string
 */
export const getDataFromDataSet = (
  el,
  pos,
  datasetName = "typePawn",
  split = "-"
) => el && el.dataset?.[datasetName]?.split(split)[pos];

/**
 *
 * @param {string} queryPos Select element from the dom according to the query of typePawn dataset 
 * @param {Number} posInStrArr Which part of the string need to changes in the dataset
 * @param {String} datasetName 
 * @param {string} newstr

 */

export const editDatasSetByQuery = (
  queryPos,
  posInStrArr,
  newStr,
  datasetName = "typePawn"
) => {
  const el = selectElement(`img[data-type-pawn*="${queryPos}"]`);
  const dataSetImg = el?.dataset[datasetName];
  if (!el) return;
  el.dataset[datasetName] = editDataSet(dataSetImg, posInStrArr, newStr);
};

/**
 *
 * @param {String} color of the pawn
 * @param {Number} change Get the change number in the index of the array TD.s Arr of the possible changes in movement of the pawn
 * @returns New change movements array- negetive or positive number according the color of the pawn
 */
export const cheakBoardDir = (color, changes) =>
  changes.map((el) => (color === "white" ? el * -1 : el));

/**s
 *
 * @param {Number} newIndex
 * @param {Number} curIndex
 * @param {Array} arrTD Array of table's TD piles
 * @returns The new normalize index pos
 */
export const checkillegalPos = (curIndex, newIndex, arrTD) => {
  let length = arrTD.length - 1;
  let NewIndex = newIndex * 1;
  return NewIndex > length || NewIndex < 0 ? curIndex : NewIndex;
};

/**
 *
 * @param {Number} newIndex
 * @param {Number} curIndex
 * @param {Array} arrTD Array of table's TD piles
 * @returns First element child of new normalize index pos
 */

export const getNextPileChild = (curIndex, newIndex, arrTD) =>
  arrTD[checkillegalPos(curIndex, newIndex, arrTD)]?.firstElementChild;

/**
 *
 * @param {Number} numMoves The current num moves of regular pawn. Can be 0 or 1.
 * @returns Array of the forward possible movement of the pawn
 */
export const checkNumMovesOfPawn = (numMoves) => {
  const NumMoves = numMoves * 1;
  return NumMoves === 0 ? [8, 16] : [8];
};

/**
 *
 * @param {String} typePawn The typePawn dataset of pawn
 * @param {Array} newPos Array that include the row and col of the new TD pile
 * @param {Array} gameManageState Array of getState and setState functions of the app's state
 * @returns The new dataset of typePawn
 */
export const movePawnToOtherPile = (typePawn, newPos, gameManageState) => {
  let [index, type, number, color] = typePawn.split("-");
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();
  //Select the img element by the data query in typePawn dataset
  //Select the new td element by the newPos query
  const choosenImg = selectElement(
    `img[data-type-pawn*="${index}-${type}-${number}-${color}"]`
  );
  const choosenTD = selectElement(`td[data-index-pos*="${newPos}"]`);

  //If there are no td nor img element exit from the function
  //If the player click in the sec click on td within element with the same color
  // exit from the function
  //If the player click on the same pile with img element exit from the function
  if (!(choosenImg && choosenTD)) return;
  if (color === getDataFromDataSet(choosenTD.firstElementChild, 3)) return;
  if (choosenImg.parentNode === choosenTD) return;

  //Get the data about typePawn dataset of the img which was clicked
  //Get the data about the indexPile dataset of the td which was clicked
  const dataSetImg = choosenImg.dataset.typePawn;
  const indexPile = choosenTD.dataset.indexPile;

  //Change the curPos index in the typePawn dataset  of img  with the pile's index pile
  choosenImg.dataset.typePawn = editDataSet(dataSetImg, 0, indexPile);
  const img = choosenTD.firstElementChild;

  //If no img in the choosen td so just append the curImg to the choosen td
  //Else if there is img with different color in the choosen td remove that img
  // and append the new img.
  if (!img) {
    choosenTD.appendChild(choosenImg);
  } else {
    let color1 = getDataFromDataSet(img, 3);
    if (color1 !== color) choosenTD.removeChild(img);
    gameState.capturePawns[color].push(img);
    gameState.capturePawns.isChange = true;
    choosenTD.appendChild(choosenImg);
  }

  return choosenImg.dataset.typePawn;
};

/**
 *
 * @param {Number} kingPos
 * @param {Number} newKingPos
 * @param {Boolean} rookCastleState Get the state of the castle
 * @param {Array} arrTD  Get the array of the data about the td's of the table

 * @returns True if the king can do a castle ,and  false otherwise
 */
export const checkIfKingCanCastle = (
  kingPos,
  newKingPos,
  rookCastleState,
  arrTD
) => {
  //The long castle has a negative movement while the short castle has positive movement

  const checkCastleDirMovement1Pile = newKingPos - kingPos > 0 ? 1 : -1;
  const checkIfTheCastleIsThelong = newKingPos - kingPos < 0;

  if (!rookCastleState) return;

  //Check if the next two piles are empty for the short castle
  //check if the next three piles are empty for the long castle

  //One pile before the exact place of the king in the castle
  const nextPileForCastle = getNextPileChild(
    kingPos,
    kingPos + checkCastleDirMovement1Pile,
    arrTD
  );
  //The exact place of the king in the castle
  const next2PileForCastle = getNextPileChild(kingPos, newKingPos, arrTD);

  //One pile after the exact place of the king in the castle
  //If checkIfTheCastleIsThelong is false the short castling can be done
  const next3PileForCastle =
    checkIfTheCastleIsThelong &&
    getNextPileChild(kingPos, kingPos + checkCastleDirMovement1Pile * 2, arrTD);

  if (!nextPileForCastle && !next2PileForCastle && !next3PileForCastle)
    return true;
};

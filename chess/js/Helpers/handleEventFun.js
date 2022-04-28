import {
  editDatasSetByQuery,
  movePawnToOtherPile,
} from "../pawnsMovment/pawnMovementHelpers.js";

/**
 *
 * @param {String} typePawn The typePawn dataset of pawn
 * @param {Array} posibleMoves Array of pawn's possible move
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {Array} gameManageState Array of getState and setState functions of the app's state
 * @param {Boolean} addActive If is true , the function will add an 'active' class to each
 * pile that the event mouseover is be executed
 */
export const handlePosibleMovment = (
  typePawn,
  posibleMoves,
  arrTD,
  gameManageState,
  addActive = true
) => {
  posibleMoves.forEach((change) => {
    addActive
      ? arrTD[change].classList.add("active")
      : arrTD[change].classList.remove("active");
  });
};
// const removeClass = (className, posibleMoves, arr) => {
//   // arr.forEach((el) => el.classList.remove(className));
//   posibleMoves.forEach((el) => arr[el].classList.remove(className));
// };

/**
 *
 * @param {String} typePawn The typePawn dataset of pawn
 * @param {Array} posibleMoves Array of pawn's possible move
 * @param {Array} arrTD Array of table's TD piles Array
 * @param {Function} handleAfterClick Function that excute after the click event 
 * @param {Array} gameManageState Array of getState and setState functions of the app's state

 */

export const handleClickPawn = (
  typePawn,
  posibleMoves,
  arrTD,
  handleAfterClick,
  gameManageState
) => {
  let [CurIndex, type, _, color] = typePawn.split("-");
  const [getGameState, setGameState] = gameManageState;
  const gameState = getGameState();

  posibleMoves.forEach((el) => {
    arrTD[el].addEventListener("click", (e) => {
      //Check if the td is clicked
      const target = e.currentTarget;
      if (!target) return;

      //Move pawn to other piles and return the current dataset
      const indexPosTDClick = target?.dataset?.indexPos;
      let dataInfo = movePawnToOtherPile(
        typePawn,
        indexPosTDClick,
        gameManageState
      );

      //If there is no dataset that return from the move function , the function will exit
      if (!dataInfo) return;
      // Set the new number moves of the pawns if he was moved
      if (type === "pawn") editDatasSetByQuery(el, 4, "1");

      // Set the new pos to the king
      if (type === "king") {
        gameState.kingState[color].pos = dataInfo.split("-")[0];
        setGameState(gameState);
      }

      // see the function in GameEvent file on line 96
      handleAfterClick(dataInfo, posibleMoves);
    });
  });
};

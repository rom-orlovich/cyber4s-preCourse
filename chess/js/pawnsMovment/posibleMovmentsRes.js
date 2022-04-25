import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  rookMove,
} from "./pawnDirMovments.js";

/**
 *
 * @param {String} typePawn The typePawn dataset of pawn
 * @param {Array} arrTD Array of table's TD piles Array of table's TD piles
 * @param {Array} gameManageState Array of getState and setState functions of the app's state
 Array of getState and setState functions of the app's state
 * @param {Boolean} relativeMoves If is true turns the possible moves to be relative instead absolute
 * @returns Array of the pawn's possible movements according to his type.
 */
export const posibleMovementsObj = (
  typePawn,
  arrTD,
  gameManageState,
  relativeMoves = false
) => {
  const typePawnArr = typePawn.split("-");
  const [index, type, _, color] = typePawnArr;
  //Pawns have uniqe number data in thier typePawn dataset how many time they moved
  const pawnMoves = typePawnArr[4];
  const Index = index * 1;

  const res = {
    pawn: [
      ...pawnMove(
        { type, pawnMoves },
        Index,
        arrTD,

        color,
        relativeMoves
      ),
    ],

    rook: [
      ...rookMove(type, 8, Index, -1, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, 1, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, 8, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, -8, arrTD, color, relativeMoves),
    ],

    knight: [
      ...knightMove(type, Index, [10, 17], arrTD, color, relativeMoves),
      ...knightMove(type, Index, [6, 15], arrTD, color, relativeMoves),
      ...knightMove(type, Index, [-6, -15], arrTD, color, relativeMoves),
      ...knightMove(type, Index, [-10, -17], arrTD, color, relativeMoves),
    ],

    bishop: [
      ...bishopMove(type, 8, Index, -9, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, -7, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, 9, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, 7, arrTD, color, relativeMoves),
    ],

    queen: [
      ...bishopMove(type, 8, Index, -9, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, -7, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, 9, arrTD, color, relativeMoves),
      ...bishopMove(type, 8, Index, 7, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, -1, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, 1, arrTD, color, relativeMoves),
      ...rookMove(type, 8, Index, 8, arrTD, color, relativeMoves),

      ...rookMove(type, 8, Index, -8, arrTD, color, relativeMoves),
    ],

    king: kingMove(typePawnArr, arrTD, gameManageState, relativeMoves),
  };

  return [...res[type]];
};

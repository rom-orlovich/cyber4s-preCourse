import {
  checkIligalePos,
  editDatasSetByQuery,
  getNextPileChild,
  movePawnToOtherPile,
} from "../pawnsMovment/pawnMovementHelpers.js";

export const handlePosibleMovment = (
  pawnType,
  arrMovement,
  arrTD,
  addEvent = true
) => {
  const [index, type, number, color] = pawnType.split("-");

  arrMovement.forEach((change) => {
    const Index = index * 1;
    const newPos = checkIligalePos(Index + change, Index, arrTD);
    addEvent
      ? arrTD[newPos].classList.add("active")
      : arrTD[newPos].classList.remove("active");
  });
};

export const handleClickPawn = (
  pawnType,
  posibleMoves,
  arrTD,
  handleAfterClick
) => {
  let [index, type, number, color] = pawnType.split("-");
  const curIndex = index * 1;
  posibleMoves.forEach((el) => {
    const newIndex = checkIligalePos(curIndex + el, curIndex, arrTD);
    const handler = (e) => {
      const target = e.target.closest("td");
      const indexPosTDClick = target?.dataset?.indexPos;

      if (!target) return;

      let bool = movePawnToOtherPile(
        curIndex,
        indexPosTDClick,
        pawnType,
        arrTD
      );
      console.log(bool);
      if (type === "pawn") editDatasSetByQuery(newIndex, 4, "1");
      handleAfterClick(color, bool);

      // arrTD[newIndex].removeEventListener("click", handler);
    };
    arrTD[newIndex].addEventListener("click", handler);
  });
};

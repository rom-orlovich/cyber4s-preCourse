import {
  checkIligalePos,
  editDatasSetByQuery,
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

    arrTD[newIndex].addEventListener("click", (e) => {
      const indexPosTDClick = e.target.dataset?.indexPos;

      if (!indexPosTDClick) return;

      movePawnToOtherPile(curIndex, indexPosTDClick, type);

      if (type === "pawn") editDatasSetByQuery(newIndex, 4, "1");
      handleAfterClick(color);
    });
  });
};

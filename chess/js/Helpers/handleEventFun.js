import {
  checkIligalePos,
  editDatasSetByQuery,
  movePawnToOtherPile,
} from "./pawnMovementHelpers.js";

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
  console.log(posibleMoves);
  const curIndex = index * 1;
  posibleMoves.forEach((el) => {
    const newIndex = checkIligalePos(curIndex + el, curIndex, arrTD);
    arrTD[newIndex].addEventListener("click", (e) => {
      const indexPosTDClick = e.target.dataset?.indexPos;
      if (!indexPosTDClick) return;
      arrTD[newIndex].classList.add("active");
      movePawnToOtherPile(curIndex, indexPosTDClick);
      console.log(type);
      if (type === "pawn") editDatasSetByQuery(newIndex, 4, "1");

      handleAfterClick(color);
    });
    arrTD[newIndex].removeEventListener("click", () => {});
  });
};

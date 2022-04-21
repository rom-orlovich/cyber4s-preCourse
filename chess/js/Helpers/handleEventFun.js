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
    // const Index = index * 1;
    // const newPos = checkIligalePos(Index + change, Index, arrTD);
    addEvent
      ? arrTD[change].classList.add("active")
      : arrTD[change].classList.remove("active");
  });
};

export const handleClickPawn = (
  pawnType,
  posibleMoves,
  arrTD,
  handleAfterClick
) => {
  let [CurIndex, type, _, color] = pawnType.split("-");
  // const curIndex = index * 1;

  posibleMoves.forEach((el) => {
    // const newIndex = checkIligalePos(curIndex + el, curIndex, arrTD);
    arrTD[el].addEventListener("click", (e) => {
      console.log(el);
      const target = e.target.closest("td");
      const indexPosTDClick = target?.dataset?.indexPos;
      if (!target) return;
      let bool = movePawnToOtherPile(
        CurIndex * 1,
        indexPosTDClick,
        pawnType,
        arrTD
      );
      if (!bool) return;
      if (type === "pawn") editDatasSetByQuery(el, 4, "1");
      handleAfterClick(color);
    });
  });
};

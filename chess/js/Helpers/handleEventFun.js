import {
  editDatasSetByQuery,
  movePawnToOtherPile,
} from "../pawnsMovment/pawnMovementHelpers.js";

export const handlePosibleMovment = (
  pawnType,
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
      handleAfterClick(dataInfo);
    });
  });
};

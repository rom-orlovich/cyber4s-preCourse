import { selectElement, editDataSet } from "../Helpers/utilitesFun.js";
//when the boardDir change and the board is rotate the index of cell are not changing
//therefore the change calcualtion of the regular pawns it doesn't change

export const getDataFromDataSet = (
  el,
  pos,
  datasetName = "typePawn",
  split = "-"
) => el && el.dataset?.[datasetName]?.split(split)[pos];

export const editDatasSetByQuery = (
  queryPos,
  posInStrArr,
  newstr,
  datasetName = "typePawn"
) => {
  const el = selectElement(`img[data-type-pawn*="${queryPos}"]`);
  const dataSetImg = el?.dataset[datasetName];
  if (!el) return;
  el.dataset[datasetName] = editDataSet(dataSetImg, posInStrArr, newstr);
};

export const cheakBoardDir = (boardDir, color, changes) => {
  return changes?.map((el) => {
    return (boardDir === 1 && color === "white") ||
      (boardDir === 2 && color === "white")
      ? el * -1
      : (boardDir === 1 && color === "black") ||
        (boardDir === 2 && color === "black")
      ? el
      : 0;
  });
};

export const checkIligalePos = (newIndex, curIndex, arr) => {
  let length = arr.length - 1;
  let NewIndex = newIndex * 1;
  return NewIndex > length || NewIndex < 0 ? curIndex : NewIndex;
};

export const getNextPileChild = (index, curIndex, arr) =>
  arr[checkIligalePos(index, curIndex, arr)]?.firstElementChild;

export const checkTheBoarderOfPile = (curIndex, change, color, arr) => {
  const nextPile = getNextPileChild(curIndex - 7, curIndex, arr);
  return nextPile && getDataFromDataSet(nextPile, 3) !== color;
};
export const checkNumMovesOfPawn = (numMoves) => {
  const NumMoves = numMoves * 1;
  return NumMoves === 0 ? [8, 16] : [8];
};

export const movePawnToOtherPile = (queryPos, newPos, pawnType, arr) => {
  let [index, type, number, color] = pawnType.split("-");
  const choosenImg = selectElement(
    `img[data-type-pawn*="${queryPos}-${type}-${number}-${color}"]`
  );

  const choosenTD = selectElement(`td[data-index-pos*="${newPos}"]`);

  if (!(choosenImg && choosenTD)) return;

  const dataSetImg = choosenImg.dataset.typePawn;
  const indexPile = choosenTD.dataset.indexPile;

  choosenImg.dataset.typePawn = editDataSet(dataSetImg, 0, indexPile);
  const img = choosenTD.firstElementChild;

  if (!img) choosenTD.appendChild(choosenImg);
  else {
    let [index1, type1, number1, color1] = img.dataset.typePawn.split("-");
    if (color1 === color) return false;
    choosenTD.removeChild(img);
    choosenTD.appendChild(choosenImg);
  }
  arr.forEach((el) => {
    el.classList.remove("active");
  });
};

import { dataImg } from "./chessPawnsData.js";
import { createEl, createImgHtml } from "./utilitesFun.js";

export const SIZE = 8;

export const checkColor = (row, setFirst, setSec) =>
  row === 6 || row === 7 ? setFirst : setSec;

export const checkPawnType = (indexPawns) => {
  if (indexPawns === 0 || indexPawns === SIZE - 1) return "rook";
  else if (indexPawns === 1 || indexPawns === SIZE - 2) return "knight";
  else if (indexPawns === 2 || indexPawns === SIZE - 3) return "bishop";
  else if (indexPawns === 3) return "queen";
  else if (indexPawns === 4) return "king";
};
export const setPawnImg = (
  td,
  typePawn,
  pawnIndex,
  indexPile,
  color,
  moveTimes
) => {
  const MoveTime = moveTimes === 0 ? "-" + moveTimes : "";
  const pawnImg = createEl(createImgHtml(dataImg[color][typePawn].src));
  pawnImg.dataset.typePawn = `${indexPile}-${typePawn}-${pawnIndex}-${color}${MoveTime}`;
  pawnImg.classList.add("center-abs");
  td.appendChild(pawnImg);
};

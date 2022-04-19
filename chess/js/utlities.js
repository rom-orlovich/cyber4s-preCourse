export const SIZE = 8;
import { dataImg } from "./dataImg.js";
export const createImg = (src, alt = "image not found") => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  return img;
};
export const checkTypePawn = (numberPawn) => {
  let typePawn;

  if (numberPawn === 0 || numberPawn === SIZE - 1) typePawn = "rook";
  if (numberPawn === 1 || numberPawn === SIZE - 2) typePawn = "knight";
  if (numberPawn === 2 || numberPawn === SIZE - 3) typePawn = "bishop";
  if (numberPawn === 3) typePawn = "king";
  if (numberPawn === 4) typePawn = "queen";

  return typePawn;
};

export const checkColor = (row) => (row === 7 || row === 6 ? "white" : "black");

export const createImgWithDataSet = (TDindex, numberPawn, color, typePawn) => {
  const img = createImg(dataImg[color][typePawn].src);
  img.dataset.typePawn = `${typePawn}-${numberPawn}-${color}-${TDindex}`;
  img.classList.add("center-abs");
  return img;
};

export const setPawn = (TDindex, numberPawn, color) => {
  const typePawn = "pawn";
  return createImgWithDataSet(TDindex, numberPawn, color, typePawn);
};
export const setOtherPawn = (TDindex, numberPawn, color) => {
  const typePawn = checkTypePawn(numberPawn);
  return createImgWithDataSet(TDindex, numberPawn, color, typePawn);
};
export const setUpPawns = {
  0: setOtherPawn,
  1: setPawn,

  6: setPawn,
  7: setOtherPawn,
};
export const createRows = (tr, tdNumber, row) => {
  for (let coulmn = 0; coulmn < SIZE; coulmn++) {
    tdNumber++;

    const td = document.createElement("td");
    td.dataset.indexPos = [row, coulmn];
    td.dataset.TDIndex = tdNumber;
    if (row === 7 || row === 6 || row === 0 || row === 1)
      td.appendChild(setUpPawns[row](coulmn, coulmn, checkColor(row)));
    tr.appendChild(td);
  }
};
export const selectByQuery = (query, scope = document) =>
  scope.querySelector(query);

export const appendToDom = (newEl, query) => {
  const parentEl = selectByQuery(query);
  parentEl.innerHtml = "";
  parentEl.appendChild(newEl);
};

export const addEventListenerByQuery = (event, handle, query) => {
  selectByQuery(query).addEventListener(event, handle);
};

import {
  setPawnImg,
  SIZE,
  checkColor,
  checkPawnType,
} from "./Helpers/ChessBoardHelpers.js";

export class ChessBoard {
  parentEl = document.querySelector("#container_ChessBoard");
  vtDom;
  curTable;
  tdBoardChess;

  chessPawnSetUp = {
    0: this.setOtherPawns,
    1: this.setPawns,
    6: this.setPawns,
    7: this.setOtherPawns,
  };
  constructor() {
    this.render();
  }

  setPawns(td, pawnIndex, indexPile, color, moveTimes = 0) {
    setPawnImg(td, "pawn", pawnIndex, indexPile, color, moveTimes);
  }

  setOtherPawns(td, pawnIndex, indexPile, color, moveTimes = undefined) {
    let typePawn = checkPawnType(pawnIndex);
    setPawnImg(td, typePawn, pawnIndex, indexPile, color, moveTimes);
  }

  generateTable() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    let indexPile = -1;
    for (let row = 0; row < SIZE; row++) {
      let tr = document.createElement("tr");
      tr.dataset.indexRow = row;
      for (let coulmn = 0; coulmn < SIZE; coulmn++) {
        indexPile++;
        const td = document.createElement("td");
        td.dataset.indexPos = [row, coulmn];
        td.dataset.indexPile = indexPile;
        if (row === 1 || row === 0 || row === 7 || row === 6)
          this.chessPawnSetUp[row](
            td,
            coulmn,
            indexPile,
            checkColor(row, "white", "black")
          );
        tr.appendChild(td);
      }
      tr.dataset.rowIndex = row;
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    return table;
  }

  changeDirBoard(stateMangement) {
    const [getGameState, setState] = stateMangement;
    const gameState = getGameState();
    gameState.activePlayer === "black"
      ? this.parentEl?.classList.add("rotate180")
      : this.parentEl?.classList.remove("rotate180");
    this.tdBoardChess.forEach((el) => {
      const img = el?.firstElementChild;
      if (!img) return;
      gameState.activePlayer === "black"
        ? img.classList.add("rotate180Img")
        : img.classList.remove("rotate180Img");
    });
  }
  makeTDArr() {
    this.vtDom = document.createDocumentFragment().appendChild(this.curTable);
    this.tdBoardChess = Array.from(this.vtDom.querySelectorAll("td"));
  }

  initChessBoard(reRender) {
    this.parentEl.innerHTML = "";
    this.curTable = reRender ? this.generateTable() : this.curTable;
    this.makeTDArr();
  }

  render(reRender = true) {
    this.initChessBoard(reRender);
    this.parentEl.appendChild(this.vtDom);
  }
}

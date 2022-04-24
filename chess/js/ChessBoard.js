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

  //obj that defined the place of each pawns 0/1 black pawns 6/7 white pawns
  chessPawnSetUp = {
    0: this.setOtherPawns,
    1: this.setPawns,
    6: this.setPawns,
    7: this.setOtherPawns,
  };
  constructor() {
    this.render();
  }

  //regular pawns
  setPawns(td, pawnIndex, indexPile, color, moveTimes = 0) {
    setPawnImg(td, "pawn", pawnIndex, indexPile, color, moveTimes);
  }

  //the more powerfull ones: queen, rook,bishop and ect.
  setOtherPawns(td, pawnIndex, indexPile, color, moveTimes = undefined) {
    let typePawn = checkPawnType(pawnIndex);
    setPawnImg(td, typePawn, pawnIndex, indexPile, color, moveTimes);
  }

  generateTable() {
    const table = document.createElement("table");
    let indexPile = -1;
    for (let row = 0; row < SIZE; row++) {
      let tr = table.insertRow();
      for (let column = 0; column < SIZE; column++) {
        indexPile++;
        let td = tr.insertCell();
        td.dataset.indexPos = [row, column];
        td.dataset.indexPile = indexPile;
        if (row === 0 || row === 1 || row === 6 || row === 7)
          this.chessPawnSetUp[row](
            td,
            column,
            indexPile,
            checkColor(row, "white", "black")
          );
      }
      tr.dataset.rowIndex = row;
    }

    return table;
  }

  /**
   *
   * @param {Object} gameState The array which within the getState and the setState function of the app;
   */
  changeDirBoard(gameState) {
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

    this.render(false);
  }

  /**
   * Create the 'virtual dom' and the td array
   * which we will work with it during the development of app.
   * The 'virtual dom' will attach the current table of the app and create td array
   * of the current table.
   *
   */

  makeTDArr() {
    this.vtDom = document.createDocumentFragment().appendChild(this.curTable);
    this.tdBoardChess = Array.from(this.vtDom.querySelectorAll("td"));
  }

  /**
   *
   * @param {Boolean} reRender If reRender is true the app will genrate new table from start.
   * This function clean the inner HTML of the parent Element where we will
   *  attach the 'virtual dom'.
   * The function create table or use the current table.
   *
   */
  initChessBoard(reRender) {
    this.parentEl.innerHTML = "";
    this.curTable = reRender ? this.generateTable() : this.curTable;
    this.makeTDArr();
  }

  /**
   *
   * @param {Boolean} reRender If reRender is true the app will genrate new table from start.
   * The fucntion is append the 'virtual dom' to the current parent Element.
   */
  render(reRender = true) {
    this.initChessBoard(reRender);
    this.parentEl.appendChild(this.vtDom);
  }
}

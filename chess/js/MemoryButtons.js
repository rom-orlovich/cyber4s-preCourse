import { editDataSet } from "./Helpers/utilitesFun.js";

export class MemoryButtons {
  constructor(gameManageState, changeDirBoard) {
    this.initMemoryButtons(gameManageState);
    this.nextTurn = [];
    this.changeDirBoard = changeDirBoard;
  }

  initMemoryButtons(gameManageState) {
    const [getGameState, setGameState] = gameManageState;
    this.nextTurn = [];
    const gameState = getGameState();
    console.log(gameState);
    window.addEventListener("keydown", (e) => {
      e.preventDefault();

      this.dataTD = gameState.dataTD;
      e.key === "ArrowRight" && this.moveNext(gameState);
      e.key === "ArrowLeft" && this.moveBack(gameState);
    });
  }

  moveNext(gameState) {
    if (this.nextTurn.length === 0) return;
    const nextTurn = this.nextTurn.pop();
    const { preDataPawn, nextDataPawn, eatPawn, eatPawnDataset } = nextTurn;
    if (!eatPawn) this.regularMove(nextDataPawn, preDataPawn);
    else this.eatMove(nextDataPawn, preDataPawn, eatPawnDataset);
    this.changeDirBoard(gameState);
  }

  moveBack(gameState) {
    const lastTurnArray = gameState.lastTurn;
    if (lastTurnArray.length === 0) return;
    const lastTurn = lastTurnArray.pop();
    this.nextTurn.push(lastTurn);
    const { preDataPawn, nextDataPawn, eatPawn, eatPawnDataset, activePlayer } =
      lastTurn;
    if (!eatPawn) this.regularMove(preDataPawn, nextDataPawn);
    else this.eatMove(preDataPawn, nextDataPawn, eatPawn, eatPawnDataset);
    this.changeDirBoard(gameState);
  }

  getDataAboutMove(preDataPawn, nextDataPawn) {
    const [preIndex] = preDataPawn.split("-");
    const [nextIndex] = nextDataPawn.split("-");

    const img = this.dataTD[nextIndex]?.firstElementChild;

    return { preIndex, nextIndex, img };
  }

  regularMove(preDataPawn, nextDataPawn) {
    const { preIndex, nextIndex, img } = this.getDataAboutMove(
      preDataPawn,
      nextDataPawn
    );
    img.dataset.typePawn = editDataSet(nextDataPawn, 0, preIndex);
    this.dataTD[preIndex].appendChild(img);
  }

  eatMove(preDataPawn, nextDataPawn, eatPawn, eatPawnDataset) {
    const { preIndex, nextIndex, img } = this.getDataAboutMove(
      preDataPawn,
      nextDataPawn
    );

    this.dataTD[nextIndex]?.firstElementChild.remove();
    eatPawn.dataset.typePawn = eatPawnDataset;
    eatPawn.className = "";
    eatPawn.classList.add("center-abs", "rotate180Img");
    this.dataTD[nextIndex].appendChild(eatPawn);

    img.dataset.typePawn = editDataSet(nextDataPawn, 0, preIndex);
    this.dataTD[preIndex].appendChild(img);
    // console.log(this.dataTD[nextIndex]);
  }
}

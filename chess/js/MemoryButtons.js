import { editDataSet } from "./Helpers/utilitesFun.js";

export class MemoryButtons {
  constructor(gameManageState, changeDirBoard, capturePawnsRender) {
    const [getGamestate, setGameState] = gameManageState;

    this.getGameState = getGamestate;
    this.setGameState = setGameState;
    this.initMemoryButtons();

    this.changeDirBoard = changeDirBoard;
    this.capturePawnsRender = capturePawnsRender;
  }

  initMemoryButtons() {
    this.nextTurns = [];
    this.preTurns = [];
    const gameState = this.getGameState();
    console.log(gameState);
    window.addEventListener("keydown", (e) => {
      e.preventDefault();
      this.dataTD = gameState.dataTD;
      e.key === "ArrowRight" && this.moveNext();
      e.key === "ArrowLeft" && this.moveBack();
    });
  }

  moveNext() {
    const gameState = this.getGameState();
    if (this.nextTurns.length === 0) return;
    const lastTurnArray = gameState.lastTurn;
    const nextTurn = this.nextTurns.pop();
    lastTurnArray.push(nextTurn);
    this.preTurns.push(nextTurn);
    const { preDataPawn, nextDataPawn, eatPawn, eatPawnDataset, activePlayer } =
      nextTurn;
    if (!eatPawn) this.regularMove(nextDataPawn, preDataPawn);
    else this.eatMove(nextDataPawn, preDataPawn, eatPawn, eatPawnDataset);
    gameState.activePlayer = activePlayer;
    this.changeDirBoard(gameState);
  }

  moveBack() {
    const gameState = this.getGameState();
    const lastTurnArray = gameState.lastTurn;
    if (lastTurnArray.length === 0) return;
    this.preTurns.push(lastTurnArray.pop());
    if (this.preTurns.length === 0) return;
    const lastTurn = this.preTurns.pop();
    this.nextTurns.push(lastTurn);
    const { preDataPawn, nextDataPawn, eatPawn, eatPawnDataset, activePlayer } =
      lastTurn;
    if (!eatPawn) this.regularMove(preDataPawn, nextDataPawn);
    else this.eatMove(preDataPawn, nextDataPawn, eatPawn, eatPawnDataset);
    gameState.activePlayer = activePlayer;
    this.changeDirBoard(gameState);
  }
  regularMove(preDataPawn, nextDataPawn) {
    const { preIndex, nextIndex, img } = this.getDataAboutMove(
      preDataPawn,
      nextDataPawn
    );
    if (!img) return;
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
    this.dataTD[nextIndex]?.appendChild(eatPawn);

    img.dataset.typePawn = editDataSet(nextDataPawn, 0, preIndex);
    this.dataTD[preIndex].appendChild(img);
  }

  getDataAboutMove(preDataPawn, nextDataPawn) {
    const [preIndex] = preDataPawn.split("-");
    const [nextIndex] = nextDataPawn.split("-");
    const img = this.dataTD[nextIndex]?.firstElementChild;
    return { preIndex, nextIndex, img };
  }
}

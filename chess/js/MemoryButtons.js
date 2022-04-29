import { addEventListenerByQuery, editDataSet } from "./Helpers/utilitesFun.js";
/**
 * @class That manage the history of turns in the app
 **/
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

    this.dataTD = gameState.dataTD;
    //KeyBoard contorl
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      e.key === "ArrowRight" && this.moveNext();
      e.key === "ArrowLeft" && this.moveBack();
    });

    this.renderButtons();
    //Button contorl
    addEventListenerByQuery(
      "click",
      (e) => {
        const target = e.target;
        if (e.target.tagName !== "BUTTON") return;
        if (target.textContent === "Next") this.moveNext();
        if (target.textContent === "Previous") this.moveBack();
      },
      ".buttons_preNext"
    );
  }

  renderButtons() {
    const nextButton = document.createElement("button");
    const preButton = document.createElement("button");
    nextButton.textContent = "Next";
    preButton.textContent = "Previous";
    const div = document.createElement("div");
    div.classList.add("buttons_preNext");
    div.append(preButton, nextButton);
    document.body.appendChild(div);
  }

  moveBack() {
    const gameState = this.getGameState();
    const lastTurnsArray = gameState.lastTurns;
    //Exit from the function if the turns array is empty
    if (lastTurnsArray.length === 0) return;
    this.preTurns.push(lastTurnsArray.pop());
    //Exit from the function if the pre turns array is empty
    if (this.preTurns.length === 0) return;
    const lastTurn = this.preTurns.pop();
    this.nextTurns.push(lastTurn);
    const { type, preDataPawn, nextDataPawn, eatPawnData, activePlayer } =
      lastTurn;
    //Check the type of the move
    // The previous turn dataset typepawn is before the next turn dataset typepawn
    if (type === "regularMove") this.regularMove(preDataPawn, nextDataPawn);
    else this.eatMove(preDataPawn, nextDataPawn, eatPawnData);
    gameState.activePlayer = activePlayer;
    this.changeDirBoard(gameState);
  }

  moveNext() {
    const gameState = this.getGameState();
    //Exit from the function if the user can't go to the next turn;
    if (this.nextTurns.length === 0) return;
    const lastTurnsArray = gameState.lastTurns;
    //Empty the next turn array and fill the pre turns arrays
    const nextTurn = this.nextTurns.pop();
    lastTurnsArray.push(nextTurn);
    this.preTurns.push(nextTurn);
    const { type, preDataPawn, nextDataPawn, eatPawnData, activePlayer } =
      nextTurn;
    //Check the type of the move
    // The order of the dataset of the img is changed
    if (type === "regularMove") this.regularMove(nextDataPawn, preDataPawn);
    else this.eatMove(nextDataPawn, preDataPawn, eatPawnData);
    gameState.activePlayer = activePlayer;
    this.changeDirBoard(gameState);
  }

  //Replace the  last turn img dataset and and fil the previous td with the img
  regularMove(preDataPawn, nextDataPawn) {
    const { preIndex, nextIndex, img } = this.getDataAboutMove(
      preDataPawn,
      nextDataPawn
    );
    if (!img) return;
    img.dataset.typePawn = editDataSet(nextDataPawn, 0, preIndex);
    this.dataTD[preIndex].appendChild(img);
  }

  //Remove the last td img of the pawn that eat the eaten pawns
  //Update the typepawn dataset of the eatenPawn  ,clean his className and add the correct classes
  // Update the last pos of the eaten pawn with the img of eaten pawn
  //Edit the dataset of the pawn that eat the eaten pawn
  //Append his img to the old pos of the td,namely the previous index
  eatMove(preDataPawn, nextDataPawn, eatPawnData) {
    const { imgEatPawn, eatPawnDataset } = eatPawnData;
    const { preIndex, nextIndex, img } = this.getDataAboutMove(
      preDataPawn,
      nextDataPawn
    );
    this.dataTD[nextIndex]?.firstElementChild.remove();
    imgEatPawn.dataset.typePawn = eatPawnDataset;
    imgEatPawn.className = "";
    imgEatPawn.classList.add("center-abs", "rotate180Img");
    this.dataTD[nextIndex]?.appendChild(imgEatPawn);

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

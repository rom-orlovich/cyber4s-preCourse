export class CapturePawnsList {
  constructor(gameManageState) {
    this.render(gameManageState);
  }

  createCaptureBlock(id, className, heading, capturesArray) {
    const div = document.createElement("div");
    div.id = id;
    div.className = className;
    const div2 = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerHTML = heading;
    div.appendChild(h1);

    capturesArray.forEach((el) => {
      const img = div2.appendChild(el);
      img.className = "";

      img.dataset.typePawn = "";
      img.classList.add("Capture_img");
    });

    div.appendChild(div2);
    return div;
  }

  whiteCapturePawns(gameState) {
    const capturesArray = gameState.capturePawns["white"];

    return this.createCaptureBlock(
      "whiteCaptrues",
      "capture_block",
      "White Captrues",
      capturesArray
    );
  }

  blackCapturePawns(gameState) {
    console.log(gameState);
    const capturesArray = gameState.capturePawns["black"];

    return this.createCaptureBlock(
      "blackCaptrues",
      "capture_block",
      "Black Captrues",
      capturesArray
    );
  }

  render(gameManageState) {
    const [getGameState, setGameState] = gameManageState;
    const gameState = getGameState();
    const whiteCapturePawns = this.whiteCapturePawns(gameState);
    const blackCapturePawns = this.blackCapturePawns(gameState);
    document.body.append(whiteCapturePawns, blackCapturePawns);
  }
}

// const secActivePlayer =gameState.activePlayer === "white"
// ? "rightBottomCornerCapture"
// : "leftTopCornerCapture";
// console.log(secActivePlayer);
// const currentPlayer = gameState.activePlayer;
// const currentId =
//   currentPlayer === "white" ? "blackCaptrues" : "whiteCaptrues";
// const currentPlayer = gameState.activePlayer;
// const currentId =
//   currentPlayer === "white" ? "whiteCaptrues" : "blackCapture";

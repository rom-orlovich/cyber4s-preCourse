import { gameStateInital } from "./gameState.js";
import {
  handleClickPawn,
  handlePosibleMovment,
} from "./Helpers/handleEventFun.js";
import {
  getDataAboutPawns,
  checkKingPossibleMove,
  checkPawnThreatMove,
  checkPossibleThreatOfKing,
  checkThreatOnPiles,
} from "./Helpers/checkKingStatusHelpers.js";
import {
  addEventListenerByQuery,
  createImgHtml,
  objDeepCopy,
} from "./Helpers/utilitesFun.js";
import { getKingRelativePos } from "./Helpers/checkKingStatusHelpers.js";
import { posibleMovementsObj } from "./pawnsMovment/posibleMovmentsRes.js";
import { movePawnToOtherPile } from "./pawnsMovment/pawnMovementHelpers.js";
import { dataImg } from "./Helpers/chessPawnsData.js";
import { setPawnImg } from "./Helpers/ChessBoardHelpers.js";

export class GameEvents {
  dataTD;
  _tdBoardChess;
  _vtDom;
  gameManageState;
  setState;

  constructor() {}

  //Assign the dataTD and the functions of the state of the game into 'this' .
  //and inital the state of the game
  initChessBoardControl(dataTD, gameManageState) {
    const [getGameState, setGameState] = gameManageState;
    this.gameManageState = gameManageState;
    this.getGameState = getGameState;
    this.setGameState = setGameState;
    this.dataTD = dataTD;
  }
  setSecColor(color) {
    return color === "white" ? "black" : "white";
  }
  setAfterPlayerTurn(color) {
    const gameState = this.getGameState();
    if (color === "white") {
      gameState.activePlayer = "black";
      gameState.playerTurns[0]++;
    } else {
      gameState.activePlayer = "white";
      gameState.playerTurns[1]++;
    }

    this.setGameState(gameState);
  }

  /**
   *
   * @param {String} datasetTypePawn Get the pawn typePawn dataset
   * @param {Boolean} relative If true the possible movement will be relative
   * @returns The improve possible move function that return the relative moves of the pawns
   */
  possibleMoveWithMode = (datasetTypePawn, relative = true) => {
    return posibleMovementsObj(
      datasetTypePawn,
      this.dataTD,
      this.gameManageState,
      relative
    );
  };

  /**
   *
   * @param {Array} dataTD - Array of td about the table
   * @param {Array} gameManageState Array of getState and setState functions of the app's state
 Array of functions - getGamestate and setGameState
   * @param {Array} controlFunction Array of functions - changeDirBoard and initApp
   */
  initEvents(dataTD, gameManageState, controlFunction) {
    const [changeDirBoard, renderCapturesLists, initApp] = controlFunction;

    //init the control of the board
    this.initChessBoardControl(dataTD, gameManageState);

    addEventListenerByQuery(
      "click",
      (e) => {
        const target = e.target;
        const dataSetInfo = target.dataset.typePawn;

        //Check if the target is pawn with dataset of typePawn otherwise -exit from the function
        if (!dataSetInfo) return;

        //Get data about the pawns from his dataset of typePawn
        const [curIndex, type, _, targetColor] = dataSetInfo.split("-");
        const gameState = this.getGameState();
        const kingState = gameState.kingState[targetColor];

        //If the color of the target that was clicked is different from the active player
        // -exit from the function
        if (targetColor !== gameState.activePlayer) return;

        //Check if the active player's king is threated by sec player pawns
        //If he is still threated and the king is not choosen , so exit from the function
        const isInDangerPlace = kingState.threats.some(
          (el) => el === curIndex * 1
        );
        if (
          isInDangerPlace &&
          type !== "king" &&
          kingState.stateCheck === "check"
        )
          return;

        /**
         *
         * @param {String} newDataSetInfo The new typePawn dataset of pawn
         * @param {Function} posibleMovementsObj
         * @param {Boolean} bool If it is true, change the direction of the board after each
         * move of player
         * @returns undefined if initApp in checkReset fucntion is excauted
         */
        const handleAfterClick = (newDataSetInfo, bool = true) => {
          this.handleEventsAfterClick(newDataSetInfo, renderCapturesLists);

          if (this.checkReset(initApp)) return;
          bool && changeDirBoard(this.getGameState());
          this.setGameState(this.getGameState());
        };

        this.handlerClickMovement(dataSetInfo, handleAfterClick);
      },
      "#container_ChessBoard"
    );

    addEventListenerByQuery(
      "mouseover",
      (e) => {
        // same comments as add event of 'click'
        const target = e.target;
        const dataSetInfo = target?.dataset?.typePawn;
        if (!dataSetInfo) return;
        const [curIndex, type, _, targetColor] = dataSetInfo.split("-");
        const gameState = this.getGameState();
        const kingState = gameState.kingState[targetColor];
        const pawnsCanDefense = gameState.kingState[targetColor].pawnCanDefense;
        if (pawnsCanDefense) target.parentElement.classList.add("active");

        if (targetColor !== gameState.activePlayer) return;

        const isInDangerPlace = kingState.threats.some(
          (el) => el === curIndex * 1
        );
        if (isInDangerPlace && type !== "king") return;
        this.handleBeforeClick(dataSetInfo);
        this.handleMouseOver(dataSetInfo, this.dataTD);
      },
      "#container_ChessBoard"
    );

    addEventListenerByQuery(
      "mouseout",
      (e) => {
        const target = e.target;
        const dataSetInfo = target?.dataset?.typePawn;
        if (!dataSetInfo) return;
        target.parentElement.classList.remove("active");
        this.handleMouseOver(dataSetInfo, this.dataTD, false);
        this.dataTD.forEach((el) => {
          el.classList.remove("active");
        });
      },
      "#container_ChessBoard"
    );
  }

  handleMouseOver(dataSetInfo, addActive = true) {
    let possibleMoves = posibleMovementsObj(
      dataSetInfo,
      this.dataTD,
      this.gameManageState
    );

    handlePosibleMovment(
      dataSetInfo,
      possibleMoves,
      this.dataTD,
      this.gameManageState,
      addActive
    );
  }

  handleBeforeClick(newDataSetInfo) {
    this.checkCastleMoveBeforeClick(newDataSetInfo);
  }

  handlerClickMovement(dataSetInfo, handleAfterClick) {
    let possibleMoves = posibleMovementsObj(dataSetInfo, this.dataTD, [
      this.getGameState,
      this.setGameState,
    ]);

    handleClickPawn(
      dataSetInfo,
      possibleMoves,
      this.dataTD,
      handleAfterClick,
      this.gameManageState
    );
  }
  /**
   *
   * @param {String} newDataSetInfo The new typePawn dataset of the pawn that we moved
   * @param {Function} posibleMovementsObj Function that return the possibleMovment array of pawn
   */
  handleEventsAfterClick(newDataSetInfo, renderCapturesLists) {
    const gameState = this.getGameState();
    if (gameState.capturePawns.isChange) {
      renderCapturesLists([this.getGameState, this.setGameStat]);
      gameState.capturePawns.isChange = false;
    }
    this.checkCastleMoveAfterClick(newDataSetInfo);
    this.changeRegularPawns(newDataSetInfo);
    this.checkCheckMate();
    this.setAfterPlayerTurn(gameState.activePlayer);
    this.setGameState(gameState);
  }

  changeRegularPawns(newDataSetInfo) {
    const [curIndex, type, pawnIndex, color] = newDataSetInfo.split("-");
    if (type !== "pawn") return;
    const CurIndex = curIndex * 1;
    const TD = this.dataTD[CurIndex];
    const row = TD.dataset.indexPos[0] * 1;

    if (row > 0 && row < 7) return;

    const numberPlayer = prompt(`Which player do you like to get?
    1:Queen,
    2:Rook,
    3:Bishop
    4:Knight
    Please Enter Number..
    `);
    const imgChoosen = {
      1: "queen",
      2: "rook",
      3: "bishop",
      4: "knight",
    };

    TD.firstElementChild?.remove();
    const newImg = setPawnImg(
      TD,
      imgChoosen[numberPlayer],
      pawnIndex,
      curIndex,
      color
    );
    if (newImg) newImg.classList.add("rotate180Img");
  }

  checkCastleMoveBeforeClick(newDataSetInfo) {
    const [curIndex, type, _] = newDataSetInfo.split("-");
    const CurIndex = curIndex * 1;
    if (type !== "king" && (CurIndex !== 60 || CurIndex !== 4)) return;
    const gameState = this.getGameState();
    const secColor = this.setSecColor(gameState.activePlayer);
    const kingState = gameState.kingState[secColor];
    const castleState = kingState.castleState;
    const threatsOnShort = checkThreatOnPiles(
      secColor,
      this.dataTD,
      [CurIndex + 1, CurIndex + 2, CurIndex + 3],
      this.possibleMoveWithMode
    );
    const threatsOnLong = checkThreatOnPiles(
      secColor,
      this.dataTD,
      [CurIndex - 1, CurIndex - 2, CurIndex - 3],
      this.possibleMoveWithMode
    );

    if (threatsOnShort.length > 0) castleState.moveRooks = [true, false];
    else castleState.moveRooks = [true, true];
    if (threatsOnLong.length > 0) castleState.moveRooks = [false, true];
    else castleState.moveRooks = [true, true];

    this.setGameState(gameState);
  }

  checkCastleMoveAfterClick(newDataSetInfo) {
    const [curIndex, type, indexPile] = newDataSetInfo.split("-");

    if (type === "rook" && indexPile === 0) castleState.moveRooks[0] = false;
    if (type === "rook" && indexPile === 7) castleState.moveRooks[1] = false;
    if (type !== "king") return;

    const gameState = this.getGameState();
    const castleState = gameState.kingState[gameState.activePlayer].castleState;
    if (type === "king")
      if (curIndex === "62") movePawnToOtherPile("63-rook-7-white", [7, 5]);
      else if (curIndex === "58")
        movePawnToOtherPile("56-rook-0-white", [7, 3]);
    if (curIndex === "2") movePawnToOtherPile("0-rook-0-black", [0, 3]);
    else if (curIndex === "6") movePawnToOtherPile("7-rook-7-black", [0, 5]);
    castleState.didCastle = true;
    castleState.moveRooks = [false, false];
  }

  checkCheckMate() {
    //Get current state
    const gameState = this.getGameState();

    // Get the color of the opponent and the state of his king
    const secColor = this.setSecColor(gameState.activePlayer);
    const kingState = gameState.kingState[secColor];

    //Create the datasets of typepawn array from the current table of both players pawns
    //Contains all the data about the pawns of the both players pawns
    const typePawnDataActivePlayer = getDataAboutPawns(
      gameState.activePlayer,
      this.dataTD
    );
    const typePawnDataSecPlayer = getDataAboutPawns(secColor, this.dataTD);

    // Get the relative moves of the king and the king img element and use his
    //typepawn in order to get the data about him.
    // Assign the king relative moves to sec color king state.
    const { kingRelativeMoves: secKingRelativeMoves, kingEl: SecKingColorEl } =
      getKingRelativePos(secColor, this.dataTD);
    kingState.relativeMoves = secKingRelativeMoves;
    const [kingPos] = SecKingColorEl.dataset.typePawn.split("-");

    // Get threats moves array  of the pawns that threat on the king
    const threatPawnMoves = checkPawnThreatMove(
      typePawnDataActivePlayer,
      this.possibleMoveWithMode,
      kingPos * 1
    );

    //Get array of threats on the sec king
    const [threatsArr] = checkPossibleThreatOfKing(
      typePawnDataActivePlayer,
      secKingRelativeMoves,
      this.possibleMoveWithMode
    );

    //Assignment the sec color kingstate threats and update the state
    kingState.threats = threatsArr;
    this.setGameState(gameState);

    //Get the current possible move of the sec color kings
    const kingCurPossibleMove = this.possibleMoveWithMode(
      SecKingColorEl.dataset.typePawn,
      false
    );

    //Get the calculated defense moves of other pawns of the sec color in order
    //to cancel the threats and the check.
    const [defenseMove] = checkPossibleThreatOfKing(
      typePawnDataSecPlayer,
      threatPawnMoves,
      this.possibleMoveWithMode,
      false
    );

    //if the state chcek of the sec color king is 'check' and
    // his current possible moves are zero and there is not defense moves that are possible
    //  so the active player is win and the state is 'checkmate'.
    //  otherwise is 'check' is cancel.

    if (
      kingState.stateCheck === "check" &&
      kingCurPossibleMove.length === 0 &&
      defenseMove.length === 0
    ) {
      alert("checkmate");
      kingState.stateCheck = "checkmate";
      this.setGameState(gameState);
    } else if (kingState.stateCheck === "check") {
      kingState.stateCheck = "";
      alert("check");
    }

    //if the game continue ,assign the new possible move to the sec color king state
    //And the new game state
    kingState.possibleMoves = checkKingPossibleMove(
      threatsArr,
      secKingRelativeMoves
    );

    this.setGameState(gameState);
  }

  //Get initapp function
  //Check the current king state of the active player.
  //if the state checkmate and the user input confirm the app will inital state
  // and render the app by initApp function
  checkReset(initApp) {
    const gameState = this.getGameState();
    const stateCheck = gameState.kingState[gameState.activePlayer].stateCheck;
    if (!(stateCheck === "checkmate" && confirm("rest?"))) return;

    this.setGameState(objDeepCopy(gameStateInital), true);
    initApp(true);

    return true;
  }
}

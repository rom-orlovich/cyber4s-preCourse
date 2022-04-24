import { gameStateInital } from "./gameState.js";
import {
  checkKingPossibleMove,
  checkPawnThreatMove,
  checkPossibleThreatOfKing,
  getDataAboutPawns,
  handleClickPawn,
  handlePosibleMovment,
} from "./Helpers/handleEventFun.js";
import { addEventListenerByQuery, objDeepCopy } from "./Helpers/utilitesFun.js";
import { getKingRelativePos } from "./pawnsMovment/pawnMovementHelpers.js";
import { posibleMovementsObj } from "./pawnsMovment/posibleMovmentsRes.js";

export class GameEvents {
  dataTd;
  _tdBoardChess;
  _vtDom;

  gameManageState;
  setState;
  curDataSetInfo;
  constructor() {}

  initChessBoardControl(dataTd, gameManageState) {
    const [getGameState, setGameState] = gameManageState;
    this.gameManageState = gameManageState;
    this.getGameState = getGameState;
    this.setGameState = setGameState;
    this.dataTd = dataTd;
    this.setGameState(objDeepCopy(gameStateInital));
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

  initEvents(dataTd, gameManageState, controlFunction) {
    const [changeDirFun, initApp] = controlFunction;
    this.initChessBoardControl(dataTd, gameManageState);

    addEventListenerByQuery(
      "click",
      (e) => {
        const target = e.target;
        const dataSetInfo = target.dataset.typePawn;
        if (!dataSetInfo) return;
        this.curClickDataSetInfo = dataSetInfo;
        const [curIndex, type, _, targetColor] = dataSetInfo.split("-");
        const gameState = this.getGameState();
        const kingState = gameState.kingState[targetColor];
        if (targetColor !== gameState.activePlayer) return;

        const isInDangerPlace = kingState.threats.some(
          (el) => el === curIndex * 1
        );
        const handleAfterClick = (
          newDataSetInfo,
          posibleMovementsObj,
          bool = true
        ) => {
          this.handleAfterClick(newDataSetInfo, posibleMovementsObj);
          if (this.checkReset(initApp)) return;

          bool && changeDirFun(this.getGameState());
          this.setGameState(this.getGameState());
        };
        if (isInDangerPlace && type !== "king") return;

        this.handlerClickMovement(dataSetInfo, handleAfterClick);
      },
      "#container_ChessBoard"
    );

    addEventListenerByQuery(
      "mouseover",
      (e) => {
        const target = e.target;
        const dataSetInfo = target?.dataset?.typePawn;
        if (!dataSetInfo) return;
        const [curIndex, type, _, targetColor] = dataSetInfo.split("-");
        const gameState = this.getGameState();
        const kingState = gameState.kingState[targetColor];
        e.target.parentElement.classList.add("active");
        if (targetColor !== gameState.activePlayer) return;
        const isInDangerPlace = kingState.threats.some(
          (el) => el === curIndex * 1
        );

        if (isInDangerPlace && type !== "king") return;
        this.handleMouseOver(dataSetInfo, this.dataTd);
      },
      "#container_ChessBoard"
    );

    addEventListenerByQuery(
      "mouseout",
      (e) => {
        const target = e.target;
        const dataSetInfo = target?.dataset?.typePawn;
        if (!dataSetInfo) return;
        e.target.parentElement.classList.remove("active");
        this.handleMouseOver(dataSetInfo, this.dataTd, false);
        this.dataTd.forEach((el) => {
          el.classList.remove("active");
        });
      },
      "#container_ChessBoard"
    );
  }

  handleMouseOver(dataSetInfo, addActive = true) {
    let possibleMoves = posibleMovementsObj(
      dataSetInfo,
      this.dataTd,
      this.gameManageState
    );

    handlePosibleMovment(
      dataSetInfo,
      possibleMoves,
      this.dataTd,
      this.gameManageState,
      addActive
    );
  }

  handlerClickMovement(dataSetInfo, handleAfterClick) {
    let possibleMoves = posibleMovementsObj(dataSetInfo, this.dataTd, [
      this.getGameState,
      this.setGameState,
    ]);
    handleClickPawn(
      dataSetInfo,
      possibleMoves,
      this.dataTd,
      handleAfterClick,
      this.gameManageState
    );
  }

  handleAfterClick(newDataSetInfo, posibleMovementsObj) {
    const gameState = this.getGameState();
    const [index, type, _, color] = newDataSetInfo.split("-");
    this.checkCheckMate(posibleMovementsObj);
    this.setAfterPlayerTurn(gameState.activePlayer);
    this.setGameState(gameState);
  }

  checkCheckMate(posibleMovementsObj) {
    //Get current state
    const gameState = this.getGameState();

    // Get the color of the opponent and the state of his king
    const secColor = this.setSecColor(gameState.activePlayer);
    const kingState = gameState.kingState[secColor];

    //Declare an improve possible move function that return the relative moves of the pawns
    const possibleMove = (newDataSetInfo, relative = true) => {
      return posibleMovementsObj(
        newDataSetInfo,
        this.dataTd,
        this.gameManageState,
        relative
      );
    };

    //Create the datasets of typepawn array from the current table of both players pawns
    //Contains all the data about the pawns of the both players pawns
    const typePawnDataActivePlayer = getDataAboutPawns(
      gameState.activePlayer,
      this.dataTd
    );
    const typePawnDataSecPlayer = getDataAboutPawns(secColor, this.dataTd);

    // Get the relative moves of the king and the king img element and use his
    //typepawn in order to get the data about him.
    // Assign the king relative moves to sec color king state.
    const { kingRelativeMoves: secKingRelativeMoves, kingEl: SecKingColorEl } =
      getKingRelativePos(secColor, this.dataTd);
    kingState.relativeMoves = secKingRelativeMoves;
    const [kingPos] = SecKingColorEl.dataset.typePawn.split("-");

    // Get threats moves array  of the pawns that threat on the king
    const threatPawnMoves = checkPawnThreatMove(
      typePawnDataActivePlayer,
      possibleMove,
      kingPos * 1
    );

    //Get array of threats on the sec king
    const threatsArr = checkPossibleThreatOfKing(
      typePawnDataActivePlayer,
      secKingRelativeMoves,
      possibleMove
    );

    //Assignment the sec color kingstate threats and update the state
    kingState.threats = threatsArr;
    this.setGameState(gameState);

    //Get the current possible move of the sec color kings
    const kingCurPossibleMove = possibleMove(
      SecKingColorEl.dataset.typePawn,
      false
    );

    //Get the calculated defense moves of other pawns of the sec color in order
    //to cancel the threats and the check.
    const defenseMove = checkPossibleThreatOfKing(
      typePawnDataSecPlayer,
      threatPawnMoves,
      possibleMove,
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

  checkReset(initApp) {
    const gameState = this.getGameState();
    const stateCheck = gameState.kingState[gameState.activePlayer].stateCheck;
    if (!(stateCheck === "checkmate" && confirm("rest?"))) return;

    this.setGameState(objDeepCopy(gameStateInital), true);
    initApp(true);

    return true;
  }
}

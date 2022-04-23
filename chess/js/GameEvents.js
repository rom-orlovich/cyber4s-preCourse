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
    const gameState = this.getGameState();
    const secColor = this.setSecColor(gameState.activePlayer);
    const kingState = gameState.kingState[secColor];

    const possibleMove = (newDataSetInfo, relative = true) => {
      return posibleMovementsObj(
        newDataSetInfo,
        this.dataTd,
        this.gameManageState,
        relative
      );
    };

    const typePawnDataActivePlayer = getDataAboutPawns(
      gameState.activePlayer,
      this.dataTd
    );
    const typePawnDataSecPlayer = getDataAboutPawns(secColor, this.dataTd);

    const { kingRelativeMoves: secKingRelativeMoves, kingEl: SecKingColorEl } =
      getKingRelativePos(secColor, this.dataTd);

    const [kingPos] = SecKingColorEl.dataset.typePawn.split("-");

    const threatsArr = checkPossibleThreatOfKing(
      typePawnDataActivePlayer,
      secKingRelativeMoves,
      possibleMove
    );

    const threatPawnMoves = checkPawnThreatMove(
      typePawnDataActivePlayer,
      possibleMove,
      kingPos * 1
    );

    kingState.threats = threatsArr;

    this.setGameState(gameState);

    const kingCurPossibleMove = possibleMove(
      SecKingColorEl.dataset.typePawn,
      false
    );

    const defenseMove = checkPossibleThreatOfKing(
      typePawnDataSecPlayer,
      threatPawnMoves,
      possibleMove,
      false
    );

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

    kingState.possibleMoves = checkKingPossibleMove(
      threatsArr,
      secKingRelativeMoves
    );

    kingState.relativeMoves = secKingRelativeMoves;
  }

  checkReset(initApp) {
    const gameState = this.getGameState();
    const stateCheck = gameState.kingState[gameState.activePlayer].stateCheck;
    if (!(stateCheck === "checkmate" && confirm("rest?"))) return;

    this.setGameState(objDeepCopy(gameStateInital), true);
    initApp();

    return true;
  }
}

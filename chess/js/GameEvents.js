import {
  handleClickPawn,
  handlePosibleMovment,
} from "./Helpers/handleEventFun.js";
import {
  selectElement,
  addEventListenerByQuery,
  getObjKeyWithValue,
  genrateObjKeyValueToArr,
  toLog,
} from "./Helpers/utilitesFun.js";
import { getDataFromDataSet } from "./pawnsMovment/pawnMovementHelpers.js";
import { posibleMovementsObj } from "./pawnsMovment/posibleMovmentsRes.js";

export class GameEvents {
  dataTd;
  _tdBoardChess;
  _vtDom;
  gameState;

  setState;
  constructor() {}
  initChessBoardControl(arr, gameManageState) {
    this.dataTd = arr;
    const [gameState, setState] = gameManageState;
    this.gameState = gameState();
    this.setState = setState;
  }

  setAfterPlayerTurn(color) {
    if (color === "white") {
      this.gameState.activePlayer = "black";
      this.gameState.playerTurns[0]++;
    } else {
      this.gameState.activePlayer = "white";
      this.gameState.playerTurns[1]++;
    }
    this.setState(this.gameState);
    console.log(this.gameState);
  }
  initEvents(dataTd, gameManageState, changeDirFun = () => {}) {
    this.initChessBoardControl(dataTd, gameManageState);
    addEventListenerByQuery(
      "click",
      (e) => {
        const target = e.target;
        const dataSetInfo = target.dataset.typePawn;
        if (!dataSetInfo) return;
        const handleAfterClick = (color, bool = true) => {
          bool && changeDirFun(color === "white" ? "black" : "white");
          this.setAfterPlayerTurn(color);
        };
        if (getDataFromDataSet(target, 3) !== this.gameState.activePlayer)
          return;
        this.handlerClickMovement(dataSetInfo, this.dataTd, handleAfterClick);
      },
      "#container_ChessBoard"
    );
    addEventListenerByQuery(
      "mouseover",
      (e) => {
        const target = e.target;
        const dataSetInfo = target?.dataset?.typePawn;
        if (!dataSetInfo) return;
        e.target.parentElement.classList.add("active");
        if (getDataFromDataSet(target, 3) !== this.gameState.activePlayer)
          return;
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

  handleMouseOver(dataSetInfo, arrTD, addEvent = true) {
    let { normalMove, eatMove } = posibleMovementsObj(
      dataSetInfo,
      this.dataTd,
      this.gameState
    );

    let allMovement = genrateObjKeyValueToArr(normalMove);
    handlePosibleMovment(dataSetInfo, allMovement, arrTD, addEvent);
  }

  handlerClickMovement(dataSetInfo, arrTD, handleAfterClick) {
    let { normalMove, eatMove } = posibleMovementsObj(
      dataSetInfo,
      arrTD,
      this.gameState
    );
    let allMovement = genrateObjKeyValueToArr(normalMove);
    handleClickPawn(dataSetInfo, allMovement, arrTD, handleAfterClick);
  }
}

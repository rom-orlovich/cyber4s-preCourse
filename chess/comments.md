// gameEvents.setBoardDir.bind(gameEvents) i try to set the state by function
//but the each time the button click is sent the pre state of the border dir
// (num)=> gameEvents.setBoardDir(num) / gameEvents.setBoardDir.bind(gameEvents)
// not work without bind the this keyword beacuse in scope of
// the function where handler works the "this" of gameEvents is not defiend

// todo : disable the turn of the sec player after he did his turn
//
// todo: save the state of possible moves arr of the last movement and the place of the king of the both players and connect to possible moves of the king
// todo:

// ButtonControlInit(chess.changeDirBoard.bind(chess)); // I turned off the button control

// movePawnToOtherPile("52-pawn-4-white-0", [4, 4]);
// movePawnToOtherPile("59-queen-3-white", [5, 5]);
// movePawnToOtherPile("61-bishop-5-white", [4, 2]);
// movePawnToOtherPile("52-pawn-4-white-0", [4, 4]);

///create check mate disable function
// if (kingState.threat.length > 0)
// if (el && !kingState.threat.every((treat) => treat === el))
// return () => {
// console.log("s");
// kingState.checkState = "checkmate";
// setGameState(gameState);
// alert("checkmate");
// };
// return makeArrayToSet(playerMove);
// console.log("checkCheckMate", secColor, kingCurPossibleMove);

    // console.log(kingState.threats);
    // console.log("checkCheckMate", secColor, kingState);
    // console.log(defenseMove, kingCurPossibleMove, kingState.stateCheck);

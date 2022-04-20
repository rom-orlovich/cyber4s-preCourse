// gameEvents.setBoardDir.bind(gameEvents) i try to set the state by function
//but the each time the button click is sent the pre state of the border dir
// (num)=> gameEvents.setBoardDir(num) / gameEvents.setBoardDir.bind(gameEvents)
// not work without bind the this keyword beacuse in scope of
// the function where handler works the "this" of gameEvents is not defiend

// todo : disable the turn of the sec player after he did his turn
//
// todo: save the state of possible moves arr of the last movement and the place of the king of the both players and connect to possible moves of the king
// todo:

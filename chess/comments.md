// gameEvents.setBoardDir.bind(gameEvents) i try to set the state by function
//but the each time the button click is sent the pre state of the border dir
// (num)=> gameEvents.setBoardDir(num) / gameEvents.setBoardDir.bind(gameEvents)
// not work without bind the this keyword beacuse in scope of
// the function where handler works the "this" of gameEvents is not defiend

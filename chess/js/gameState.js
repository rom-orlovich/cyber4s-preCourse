export const gameStateInital = {
  boardDir: 1,
  playerTurns: [0, 0],
  activePlayer: "white",
  kingState: {
    white: {
      pos: 0,
      stateCheck: "",
      threats: [],
      relativeMoves: [],
      possibleMoves: [],
      newPossibleMoves: [],
    },
    black: {
      pos: 0,
      stateCheck: "",
      threats: [],
      relativeMoves: [],
      possibleMoves: [],
      newPossibleMoves: [],
    },
  },
  points: [0, 0],
  eatenPawns: {
    player1: [],
    player2: [],
  },
  lastPossibleMove: [],
};

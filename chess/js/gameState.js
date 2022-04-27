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
      pawnCanDefense: [],
      castleState: {
        moveRooks: [true, true],
        didCastle: false,
      },
    },
    black: {
      pos: 0,
      stateCheck: "",
      threats: [],
      relativeMoves: [],
      possibleMoves: [],
      newPossibleMoves: [],
      pawnCanDefense: [],
      castleState: {
        moveRooks: [true, true],
        didCastle: false,
      },
    },
  },
  points: [0, 0],
  capturePawns: {
    white: [],
    black: [],
    isChange: false,
  },
  lastPossibleMove: [],
};

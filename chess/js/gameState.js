export const gameStateInital = {
  boardDir: 1,
  playerTurns: [0, 0],
  activePlayer: "white",
  lastTurn: {
    white: [],
    black: [],
  },
  kingState: {
    white: {
      pos: 60,
      stateCheck: "",
      relativeThreats: [],
      absoluteThreats: [],
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
      pos: 4,
      stateCheck: "",
      relativeThreats: [],
      absoluteThreats: [],
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

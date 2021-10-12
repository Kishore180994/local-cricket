export const getTopBatsman = (players) => {
  return players.reduce(
    (acc, item) => {
      if (acc.score < item.batting.runs) {
        acc.score = item.batting.runs;
        acc.obj = item;
      }
      return acc;
    },
    { obj: players[0], score: 0 }
  );
};

// Top bowler is determined in the followin order.
// 1.Number of wickets.
// 2.Number of runs.
export const getTopBowler = (players) => {
  return players.reduce(
    (acc, item) => {
      if (acc.wickets < item.bowling.wickets) {
        acc.wickets = item.bowling.wickets;
        acc.obj = item;
      } else if (acc.wickets === item.bowling.wickets) {
        if (acc.runs >= item.bowling.runs) {
          acc.runs = item.bowling.runs;
          acc.obj = item;
        }
      }
      return acc;
    },
    {
      obj: players[0],
      wickets: players[0].bowling.wickets,
      runs: players[0].bowling.runs,
    }
  );
};

export const whoWonGame = (first, second) => {
  return first.stats.totalRuns > second.stats.totalRuns
    ? first.name
    : second.name;
};

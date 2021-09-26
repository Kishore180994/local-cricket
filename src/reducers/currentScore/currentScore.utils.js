import _ from 'lodash';
import { PLAYER_STATE } from '../../states';
import { getCurRunRate } from '../../util';

export const addLineBreaker = async (curScore) => {
  await swapStriker(curScore);
  const { firstInnings } = curScore;
  const {
    stats: { thisOver },
  } = firstInnings;

  const newState = {
    ...firstInnings.stats,
    thisOver: [...thisOver, '|'],
  };

  return {
    ...curScore,
    firstInnings: {
      ...firstInnings,
      stats: newState,
    },
  };
};

export const addRun = (curScore, run) => {
  const {
    striker: {
      batting: { runs, balls, ones, twos, threes, fours, sixes },
    },
    firstInnings: {
      stats: { thisOver, totalBalls, totalRuns },
    },
    bowler: { bowling },
  } = curScore;
  // Update stats
  const strikerScore = runs + run;
  const strikerBalls = balls + 1;
  const StrikerOnes = run === 1 ? ones + 1 : ones;
  const StrikerTwos = run === 2 ? twos + 1 : twos;
  const StrikerThrees = run === 3 ? threes + 1 : threes;
  const StrikerFours = run === 4 ? fours + 1 : fours;
  const StrikerSixes = run === 6 ? sixes + 1 : sixes;

  const bowlerRuns = bowling.runs + run;
  const bowlerBalls = bowling.balls + 1;

  const newStriker = {
    ...curScore.striker,
    batting: {
      runs: strikerScore,
      balls: strikerBalls,
      ones: StrikerOnes,
      twos: StrikerTwos,
      threes: StrikerThrees,
      fours: StrikerFours,
      sixes: StrikerSixes,
    },
  };

  const newStats = {
    ...curScore.firstInnings.stats,
    totalRuns: totalRuns + run,
    totalBalls: totalBalls + 1 || 0,
    thisOver: [...thisOver, run],
    currentRunRate: getCurRunRate(totalRuns + run, totalBalls + 1),
  };

  const newBowler = {
    ...curScore.bowler,
    bowling: { ...bowling, runs: bowlerRuns, balls: bowlerBalls },
  };
  return {
    ...curScore,
    striker: newStriker,
    firstInnings: { ...curScore.firstInnings, stats: newStats },
    bowler: newBowler,
  };
};

export const addWicket = (curScore, wicket) => {
  const { firstInnings, bowler } = curScore;
  const {
    stats: { thisOver, totalBalls, totalWickets },
  } = firstInnings;
  const {
    bowling: { balls, wickets },
  } = bowler;
  const newStats = {
    ...firstInnings.stats,
    totalBalls: totalBalls + 1 || 0,
    thisOver: [...thisOver, 'W'],
    totalWickets: totalWickets + 1 || 1,
  };

  const newBowler = {
    ...bowler,
    bowling: {
      ...bowler.bowling,
      balls: balls + 1 || 0,
      wickets: wickets + 1 || 1,
    },
  };

  return {
    ...curScore,
    firstInnings: { ...firstInnings, stats: newStats },
    bowler: newBowler,
  };
};

export const addExtra = (curScore, extraType, extraRuns) => {
  const { firstInnings, bowler } = curScore;
  const {
    stats: { thisOver, totalRuns },
  } = firstInnings;
  const {
    bowling: { runs },
  } = bowler;

  const extraRunsRevised =
    extraType === 'b' || extraType === 'lb' ? extraRuns : extraRuns - 1;

  const newStats = {
    ...firstInnings.stats,
    thisOver: [...thisOver, extraType + extraRunsRevised],
    totalRuns: totalRuns + extraRuns,
  };

  const newBowling = {
    ...bowler.bowling,
    runs: runs + extraRuns,
  };

  return {
    ...curScore,
    firstInnings: {
      ...firstInnings,
      stats: newStats,
    },
    bowler: {
      ...bowler,
      bowling: newBowling,
    },
  };
};

export const swapStriker = (curScore, _callback) => {
  const temp = curScore.striker;
  _.set(curScore, 'striker', curScore.nonStriker);
  _.set(curScore, 'nonStriker', temp);
};

export const movePlayer = (curScore, name) => {
  console.log('UTIL', name);
  const {
    striker,
    nonStriker,
    firstInnings: { players },
  } = curScore;
  if (striker.name === name) {
    return {
      ...curScore,
      striker: { ...PLAYER_STATE },
      firstInnings: {
        ...curScore.firstInnings,
        players: [...players, striker],
      },
    };
  } else if (nonStriker.name === name) {
    return {
      ...curScore,
      firstInnings: {
        ...curScore.firstInnings,
        players: [...players, nonStriker],
      },
    };
  }

  return curScore;
};

export const addStriker = (curScore, name) => {
  const { striker } = curScore;
  return { ...curScore, striker: { ...striker, name: name } };
};

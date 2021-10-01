import _, { uniqueId } from 'lodash';
import { PLAYER_STATE } from '../../states';
import { getCurRunRate } from '../../util';
import { v4 as uuidv4 } from 'uuid';

export const matchInit = (curScore, formValues) => {
  const { team1, team2 } = curScore;
  const {
    byes,
    choose,
    legbyes,
    matchId,
    noball,
    overs,
    firstTeam,
    secondTeam,
    toss,
    wpr,
  } = formValues;
  let isTeam1Batting = false;
  if (toss === 'firstTeam') {
    isTeam1Batting = choose.toLowerCase() === 'batting' ? true : false;
  }

  if (toss === 'secondTeam') {
    isTeam1Batting = choose.toLowerCase() === 'batting' ? false : true;
  }
  return {
    ...curScore,
    matchId,
    settings: { overs, noball, byes, legbyes, widesPerRun: wpr },
    team1: {
      ...team1,
      objName: 'team1',
      name: firstTeam,
      toss: toss === 'firstTeam' ? true : false,
      choose: toss === 'firstTeam' ? choose : '',
      isBatting: isTeam1Batting,
    },
    team2: {
      ...team2,
      objName: 'team2',
      name: secondTeam,
      toss: toss === 'secondTeam' ? true : false,
      choose: toss === 'secondTeam' ? choose : '',
      isBatting: !isTeam1Batting,
    },
  };
};

export const getCurrentBattingTeam = (curScore) => {
  const { team1, team2 } = curScore;
  return team1.isBatting ? team1 : team2;
};

export const addLineBreaker = async (curScore) => {
  await swapStriker(curScore);
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const {
    stats: { thisOver },
  } = currentBattingTeam;

  const newState = {
    ...currentBattingTeam.stats,
    thisOver: [...thisOver, '|'],
  };

  return {
    ...curScore,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      stats: newState,
    },
  };
};

export const addRun = (curScore, run) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const {
    striker: {
      batting: { runs, balls, ones, twos, threes, fours, sixes },
    },
    [currentBattingTeam.objName]: {
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
    ...currentBattingTeam.stats,
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
    [currentBattingTeam.objName]: { ...currentBattingTeam, stats: newStats },
    bowler: newBowler,
  };
};

export const addWicket = (curScore, wicket) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { bowler } = curScore;
  const {
    stats: { thisOver, totalBalls, totalWickets },
  } = currentBattingTeam;
  const {
    bowling: { balls, wickets },
  } = bowler;
  const newStats = {
    ...currentBattingTeam.stats,
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
    [currentBattingTeam.objName]: { ...currentBattingTeam, stats: newStats },
    bowler: newBowler,
  };
};

export const addExtra = (curScore, extraType, extraRuns) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { bowler } = curScore;
  const {
    stats: { thisOver, totalRuns },
  } = currentBattingTeam;
  const {
    bowling: { runs },
  } = bowler;

  const extraRunsRevised =
    extraType === 'b' || extraType === 'lb' ? extraRuns : extraRuns - 1;

  const newStats = {
    ...currentBattingTeam.stats,
    thisOver: [...thisOver, extraType + extraRunsRevised],
    totalRuns: totalRuns + extraRuns,
  };

  const newBowling = {
    ...bowler.bowling,
    runs: runs + extraRuns,
  };

  return {
    ...curScore,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      stats: newStats,
    },
    bowler: {
      ...bowler,
      bowling: newBowling,
    },
  };
};

export const swapStriker = (curScore) => {
  const temp = curScore.striker;
  _.set(curScore, 'striker', curScore.nonStriker);
  _.set(curScore, 'nonStriker', temp);
  return curScore;
};

export const movePlayer = (curScore, id) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const {
    striker,
    nonStriker,
    [currentBattingTeam.objName]: { players },
  } = curScore;
  if (striker.playerId === id) {
    return {
      ...curScore,
      striker: { ...PLAYER_STATE },
      [currentBattingTeam.objName]: {
        ...currentBattingTeam,
        players: [...players, striker],
      },
    };
  } else if (nonStriker.playerId === id) {
    return {
      ...curScore,
      nonStriker: { ...PLAYER_STATE },
      [currentBattingTeam.objName]: {
        ...currentBattingTeam,
        players: [...players, nonStriker],
      },
    };
  }

  return curScore;
};

export const addStriker = (curScore, name) => {
  const { striker } = curScore;
  const p_id = striker.playerId ? striker.playerId : uuidv4();
  return {
    ...curScore,
    striker: { ...striker, name: name, playerId: p_id, order: uniqueId() },
  };
};

export const addNonStriker = (curScore, name) => {
  const { nonStriker } = curScore;
  const p_id = nonStriker.playerId ? nonStriker.playerId : uuidv4();
  return {
    ...curScore,
    nonStriker: {
      ...nonStriker,
      name: name,
      playerId: p_id,
      order: uniqueId(),
    },
  };
};

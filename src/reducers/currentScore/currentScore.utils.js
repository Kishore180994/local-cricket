import _, { uniqueId } from 'lodash';
import { PLAYER_STATE } from '../../states';
import { getCurRunRate } from '../../util';
import { v4 as uuidv4 } from 'uuid';
import { RUN_OUT } from '../../actions/types';

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

export const getCurrentOver = (overs) => {
  if (!overs || overs === null) return null;
  return overs.at(-1);
};

const addRunWicketToOver = (balls, thisOver, run) => {
  if (balls % 6 === 0) {
    //End the current over i.e, end the current array.
    //Start the new over ie., start the new array.
    const newOver = [run];
    return [...thisOver, newOver];
  } else {
    return thisOver.map((over, index) => {
      if (thisOver.length === index + 1) {
        return [...over, run];
      }
      return over;
    });
  }
};

export const addRunUtil = (curScore, run) => {
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
  const totalBallsBowledInThisInnigs = totalBalls + 1;
  let oversInInnings = thisOver;
  // (TODO) Check if the innings ends
  oversInInnings = addRunWicketToOver(totalBalls, thisOver, run);

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
    totalBalls: totalBallsBowledInThisInnigs || 0,
    thisOver: oversInInnings,
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
  const oversInInnings = addRunWicketToOver(totalBalls, thisOver, 'W');
  const newStats = {
    ...currentBattingTeam.stats,
    totalBalls: totalBalls + 1 || 0,
    thisOver: oversInInnings,
    totalWickets: totalWickets + 1 || 0,
  };

  const revisedWicketCount = wicket === RUN_OUT ? wickets : wickets + 1;

  const newBowler = {
    ...bowler,
    bowling: {
      ...bowler.bowling,
      balls: balls + 1 || 0,
      wickets: revisedWicketCount,
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
  const { bowler, striker } = curScore;
  const {
    stats: { thisOver, totalRuns, totalBalls },
  } = currentBattingTeam;

  const {
    bowling: { runs },
  } = bowler;

  const extraRunsRevised =
    extraType === 'b' || extraType === 'lb' ? extraRuns : extraRuns - 1;
  const extraBallsRevised = extraType === 'b' || extraType === 'lb' ? 1 : 0;
  const oversInInnings = addRunWicketToOver(
    totalBalls,
    thisOver,
    extraType + extraRunsRevised
  );
  const newStats = {
    ...currentBattingTeam.stats,
    totalBalls: currentBattingTeam.stats.totalBalls + extraBallsRevised,
    thisOver: oversInInnings,
    totalRuns: totalRuns + extraRuns,
  };

  const newBatting = {
    ...striker.batting,
    balls: striker.batting.balls + 1,
  };

  const newBowling = {
    ...bowler.bowling,
    runs: runs + extraRuns,
    balls: bowler.bowling.balls + extraBallsRevised,
  };

  return {
    ...curScore,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      stats: newStats,
    },
    striker: {
      ...striker,
      batting: newBatting,
    },
    bowler: {
      ...bowler,
      bowling: newBowling,
    },
  };
};

export const swapStrikerUtil = (curScore) => {
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

export const addBowler = (curScore, nameOrObject) => {
  //  Add bowler to the list of bowling team players.
  //  Parameters:
  // curScore: State object
  // nameOrObject: This parameter can be of two types - string or an Object.
  //          If the the parameter type is string, then the entry refers to new
  //          bowler. if the paramter type is object, then the entry refers to
  //          exisiting bowler object.
  // Returns: "state" object.
  if (typeof nameOrObject === 'string') {
    return {
      ...curScore,
      bowler: {
        ...PLAYER_STATE,
        name: nameOrObject,
        playerId: uuidv4(),
      },
    };
  } else if (typeof nameOrObject === 'object') {
    return {
      ...curScore,
      bowler: nameOrObject,
    };
  }
};

export const moveCurrentBowler = (curScore) => {
  // Function that allows to move the currentBowler to bowlingTeam platers obj.
  // Returns: "state" object.
  const { bowler, team1, team2 } = curScore;
  const bowlingTeam = team1.isBatting ? team2 : team1;
  const players = isPlayerInTheList(bowler, bowlingTeam.players)
    ? // If player is already in the list, update the bowler stats
      bowlingTeam.players.map((player) =>
        player.playerId === bowler.playerId ? bowler : player
      )
    : // Else, add him in the list.
      [...bowlingTeam.players, { ...bowler }];
  return {
    ...curScore,
    [bowlingTeam.objName]: { ...bowlingTeam, players: players },
  };
};

export const isPlayerInTheList = (player, team) => {
  // Boolean function to determine if the player is already in the list.
  const foundPlayer = team.filter(
    (eachPlayer) => eachPlayer.playerId === player.playerId
  );

  if (foundPlayer.length) return true;
  else return false;
};

export const isOverEnd = (balls) => {
  // Boolean function to determine if the over came to an end.
  return balls % 6 === 0;
};

export const addRunsToPlayerObjectOnRunOut = (curScore, runOutruns) => {
  // Runs will be added to the current batsman ie., striker and
  // the current bowler.
  // Returns: "state" object.
  const { striker, bowler } = curScore;
  const { batting } = striker;
  const { bowling } = bowler;

  // Get current batting team
  const team = getCurrentBattingTeam(curScore);
  return {
    ...curScore,
    // Add runs to team's total Runs.
    [team.objName]: {
      ...team,
      stats: { ...team.stats, totalRuns: team.stats.totalRuns + runOutruns },
    },
    // Add runs to striker.
    striker: {
      ...striker,
      batting: { ...batting, runs: batting.runs + runOutruns },
    },
    // Add runs to bowler.
    bowler: {
      ...bowler,
      bowling: { ...bowling, runs: bowling.runs + runOutruns },
    },
  };
};

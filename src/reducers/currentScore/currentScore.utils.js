import _, { uniqueId } from 'lodash';
import { PLAYER_STATE } from '../../states';
import { convertOversToBalls, getCurRunRate } from '../../util';
import { v4 as uuidv4 } from 'uuid';
import {
  BOWLER,
  NON_BOWLER,
  NON_STRIKER,
  RUN_OUT,
  STRIKER,
} from '../../actions/types';

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
  let isFirstInnings = false;
  if (toss === 'firstTeam') {
    isTeam1Batting = choose.toLowerCase() === 'batting' ? true : false;
    isFirstInnings = choose.toLowerCase() === 'batting' ? true : false;
  }

  if (toss === 'secondTeam') {
    isTeam1Batting = choose.toLowerCase() === 'batting' ? false : true;
    isFirstInnings = choose.toLowerCase() === 'batting' ? false : true;
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
      isFirstInnings: isFirstInnings,
    },
    team2: {
      ...team2,
      objName: 'team2',
      name: secondTeam,
      toss: toss === 'secondTeam' ? true : false,
      choose: toss === 'secondTeam' ? choose : '',
      isBatting: !isTeam1Batting,
      isFirstInnings: !isFirstInnings,
    },
  };
};

export const switchInnings = (curScore) => {
  // Switch the team1 and team2
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);
  // _.set(curScore, 'team1.isBatting', false);
  // _.set(curScore, 'team2.isBatting', true);
  return {
    ...curScore,
    settings: {
      ...curScore.settings,
      target: currentBattingTeam.stats.totalRuns + 1,
    },
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isBatting: false,
    },
    [currentBowlingTeam.objName]: {
      ...currentBowlingTeam,
      isBatting: true,
    },
  };
};

export const getCurrentBattingTeam = (curScore) => {
  const { team1, team2 } = curScore;
  return team1.isBatting ? team1 : team2;
};

export const getCurrentBowlingTeam = (curScore) => {
  const { team1, team2 } = curScore;
  return team1.isBatting ? team2 : team1;
};

export const getCurrentOver = (overs) => {
  if (!overs || overs === null) return null;
  return overs.at(-1);
};

const addRunWicketToOver = (curScore, balls, thisOver, run) => {
  let isInningsFinished = false;
  let isMatchFinsihed = false;
  const totalOvers = curScore.settings.overs;
  //Check for target runs acheived by opponent team.
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { totalRuns } = currentBattingTeam.stats;
  const { target } = curScore.settings;
  if (totalRuns + run >= target) {
    isInningsFinished = true;
    isMatchFinsihed = true;
  }

  if (balls % 6 === 0) {
    //End the current over i.e, end the current array.
    //Start the new over ie., start the new array.
    const newOver = [run];

    // Check: If the total overs are completed.
    return {
      updatedOver: [...thisOver, newOver],
      isInningsFinished,
      isMatchFinsihed,
    };
  } else {
    let updatedOver = thisOver.map((over, index) => {
      if (thisOver.length === index + 1) {
        return [...over, run];
      }
      return over;
    });
    if (balls + 1 >= convertOversToBalls(totalOvers)) {
      isInningsFinished = true;
    }
    return { updatedOver, isInningsFinished, isMatchFinsihed };
  }
};

export const addRunUtil = (curScore, run) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);
  let currentStriker = getCurrentStriker(curScore);
  let currentBowler = getCurrentBowler(curScore);
  // Update stats
  const {
    batting: { runs, balls, fours, sixes, ones, twos, threes },
  } = currentStriker;

  const { bowling } = currentBowler;

  const {
    stats: { totalRuns, totalBalls, thisOver },
  } = currentBattingTeam;

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
  let { updatedOver, isInningsFinished, isMatchFinsihed } = addRunWicketToOver(
    curScore,
    totalBalls,
    thisOver,
    run
  );
  let oversInInnings = updatedOver;

  const updatedStriker = {
    ...currentStriker,
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

  const updatedStats = {
    ...currentBattingTeam.stats,
    totalRuns: totalRuns + run,
    totalBalls: totalBallsBowledInThisInnigs || 0,
    thisOver: oversInInnings,
    currentRunRate: getCurRunRate(totalRuns + run, totalBalls + 1),
  };

  const updatedBowler = {
    ...currentBowler,
    bowling: { ...bowling, runs: bowlerRuns, balls: bowlerBalls },
  };
  return {
    ...curScore,
    isMatchFinsihed,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isInningsFinished,
      stats: updatedStats,
      players: currentBattingTeam.players.map((player) =>
        player.playerId === updatedStriker.playerId ? updatedStriker : player
      ),
    },
    [currentBowlingTeam.objName]: {
      ...currentBowlingTeam,
      players: currentBowlingTeam.players.map((player) =>
        player.playerId === updatedBowler.playerId ? updatedBowler : player
      ),
    },
  };
};

export const addWicket = (curScore, wicket) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);
  const currentBowler = getCurrentBowler(curScore);
  const {
    stats: { thisOver, totalBalls, totalWickets },
  } = currentBattingTeam;
  const {
    bowling: { balls, wickets },
  } = currentBowler;
  let { updatedOver, isInningsFinished, isMatchFinsihed } = addRunWicketToOver(
    curScore,
    totalBalls,
    thisOver,
    'W'
  );
  let oversInInnings = updatedOver;
  const newStats = {
    ...currentBattingTeam.stats,
    totalBalls: totalBalls + 1 || 0,
    thisOver: oversInInnings,
    totalWickets: totalWickets + 1 || 0,
  };

  const revisedWicketCount = wicket === RUN_OUT ? wickets : wickets + 1;

  const updatedBowler = {
    ...currentBowler,
    bowling: {
      ...currentBowler.bowling,
      balls: balls + 1 || 0,
      wickets: revisedWicketCount,
    },
  };

  return {
    ...curScore,
    addRunWicketToOver,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isInningsFinished,
      stats: newStats,
    },
    [currentBowlingTeam.objName]: {
      ...currentBowlingTeam,
      players: currentBowlingTeam.players.map((player) =>
        player.id === currentBowler.playerId ? updatedBowler : player
      ),
    },
  };
};

export const addExtra = (curScore, extraType, extraRuns) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);
  const currentBowler = getCurrentBowler(curScore);
  const currentStriker = getCurrentStriker(curScore);
  const {
    stats: { thisOver, totalRuns, totalBalls },
  } = currentBattingTeam;

  const {
    bowling: { runs },
  } = currentBowler;

  const extraRunsRevised =
    extraType === 'b' || extraType === 'lb' ? extraRuns : extraRuns - 1;
  const extraBallsRevised = extraType === 'b' || extraType === 'lb' ? 1 : 0;
  let { updatedOver, isInningsFinished, isMatchFinsihed } = addRunWicketToOver(
    curScore,
    totalBalls,
    thisOver,
    extraType + extraRunsRevised
  );
  let oversInInnings = updatedOver;
  const newStats = {
    ...currentBattingTeam.stats,
    totalBalls: currentBattingTeam.stats.totalBalls + extraBallsRevised,
    thisOver: oversInInnings,
    totalRuns: totalRuns + extraRuns,
  };

  const newBatting = {
    ...currentStriker.batting,
    balls: currentStriker.batting.balls + 1,
  };

  const newBowling = {
    ...currentBowler.bowling,
    runs: runs + extraRuns,
    balls: currentBowler.bowling.balls + extraBallsRevised,
  };

  return {
    ...curScore,
    isMatchFinsihed,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isInningsFinished,
      stats: newStats,
      players: currentBattingTeam.players.map((player) =>
        player.playerId === currentStriker.playerId
          ? { ...currentStriker, batting: newBatting }
          : player
      ),
    },
    [currentBowlingTeam.objName]: {
      ...currentBowlingTeam,
      players: currentBowlingTeam.players.map((player) =>
        player.playerId === currentBowler.playerId
          ? { ...currentBowler, bowling: newBowling }
          : player
      ),
    },
  };
};

export const swapStrikerUtil = (curScore) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  return {
    ...curScore,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      players: currentBattingTeam.players.map((player) => {
        switch (player.status) {
          case STRIKER:
            player.status = NON_STRIKER;
            break;
          case NON_STRIKER:
            player.status = STRIKER;
            break;
          default:
            break;
        }
        return player;
      }),
    },
  };
};

export const removePlayerStatus = (curScore, type, status) => {
  const currentTeam =
    type === BOWLER
      ? getCurrentBowlingTeam(curScore)
      : getCurrentBattingTeam(curScore);
  const currentPlayer =
    type === BOWLER
      ? getCurrentBowler(curScore)
      : type === STRIKER
      ? getCurrentStriker(curScore)
      : getCurrentNonStriker(curScore);

  return currentPlayer
    ? {
        ...curScore,
        [currentTeam.objName]: {
          ...currentTeam,
          players: currentTeam.players.map((player) =>
            player.playerId === currentPlayer.playerId
              ? { ...currentPlayer, status: status }
              : player
          ),
        },
      }
    : null;
};

export const addStrikerOrNonStrikerOrBowler = (
  curScore,
  nameOrObject,
  status,
  type
) => {
  //  Add striker to the list of batting team players.
  //  Parameters:
  // curScore: State object
  // nameOrObject: This parameter can be of two types - string or an Object.
  //          If the the parameter type is string, then the entry refers to new
  //          bowler. if the paramter type is object, then the entry refers to
  //          exisiting bowler object.
  // Returns: "state" object.
  const currentTeam =
    type === 'batting'
      ? getCurrentBattingTeam(curScore)
      : getCurrentBowlingTeam(curScore);

  if (typeof nameOrObject === 'string') {
    const newPlayer = { ...PLAYER_STATE };
    return {
      ...curScore,
      [currentTeam.objName]: {
        ...currentTeam,
        players: [
          ...currentTeam.players,
          {
            ...newPlayer,
            name: nameOrObject,
            playerId: uuidv4(),
            order: uniqueId(),
            status: status,
          },
        ],
      },
    };
  } else if (typeof nameOrObject === 'object') {
    return {
      ...curScore,
      [currentTeam.objName]: {
        ...currentTeam,
        players: currentTeam.players.map((player) =>
          player.playerId === nameOrObject.playerId
            ? { ...nameOrObject, status: status }
            : player
        ),
      },
    };
  }
};

export const isPlayerInTheList = (player, teamPlayers) => {
  // Boolean function to determine if the player is already in the list.
  const foundPlayer = teamPlayers.filter(
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
  const currentStriker = getCurrentStriker(curScore);
  const currentBowler = getCurrentBowler(curScore);
  const { batting } = currentStriker;
  const { bowling } = currentBowler;

  // Get current batting team.
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  // Get current bowling team.
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);

  return {
    ...curScore,
    // Add runs to team's total Runs.
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      stats: {
        ...currentBattingTeam.stats,
        totalRuns: currentBattingTeam.stats.totalRuns + runOutruns,
      },
      players: currentBattingTeam.players.map((player) =>
        player.playerId === currentStriker.playerId
          ? {
              ...currentStriker,
              batting: {
                ...batting,
                runs: batting.runs + runOutruns,
                balls: batting.balls + 1,
              },
            }
          : player
      ),
    },
    [currentBowlingTeam.objName]: {
      ...currentBowlingTeam,
      players: currentBowlingTeam.players.map((player) =>
        player.playerId === currentBowler.playerId
          ? {
              ...currentBowler,
              bowling: { ...bowling, runs: bowling.runs + runOutruns },
            }
          : player
      ),
    },
  };
};

export const getCurrentStriker = (curScore) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { players } = currentBattingTeam;
  return players.filter((player) => player.status === STRIKER)[0];
};

export const getCurrentNonStriker = (curScore) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { players } = currentBattingTeam;
  return players.filter((player) => player.status === NON_STRIKER)[0];
};

export const getCurrentBowler = (curScore) => {
  const currentBowlingTeam = getCurrentBowlingTeam(curScore);
  const { players } = currentBowlingTeam;
  return players.filter((player) => player.status === BOWLER)[0];
};

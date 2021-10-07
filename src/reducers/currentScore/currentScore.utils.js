import _, { uniqueId } from 'lodash';
import { PLAYER_STATE } from '../../states';
import {
  convertBallsToOvers,
  convertOversToBalls,
  getCurRunRate,
} from '../../util';
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
  // Add bowler to players of bowling team.
  const updatedCurScore = moveCurrentBowler(curScore);

  const { striker, nonStriker, settings } = updatedCurScore;
  // Add striker and non striker to players of batting team.
  const battingTeam = getCurrentBattingTeam(updatedCurScore);
  const updatedPlayers = [...battingTeam.players, striker, nonStriker];
  const updatedBattingTeam = { ...battingTeam, players: updatedPlayers };
  // Added striker, nonstriker and bowler to the respective objects.
  const newState = {
    ...updatedCurScore,
    [battingTeam.objName]: updatedBattingTeam,
    settings: { ...settings, target: updatedBattingTeam.stats.totalRuns },
  };
  // Switch the team1 and team2
  _.set(newState, 'team1.isBatting', false);
  _.set(newState, 'team2.isBatting', true);

  //Adding defaults
  _.set(newState, 'striker', { ...PLAYER_STATE });
  _.set(newState, 'nonStriker', { ...PLAYER_STATE });
  _.set(newState, 'bowler', { ...PLAYER_STATE });

  return newState;
};

export const getCurrentBattingTeam = (curScore) => {
  const { team1, team2 } = curScore;
  return team1.isBatting ? team1 : team2;
};

export const getCurrentOver = (overs) => {
  if (!overs || overs === null) return null;
  return overs.at(-1);
};

const addRunWicketToOver = (curScore, balls, thisOver, run) => {
  let isInningsFinished = false;
  const totalOvers = curScore.settings.overs;
  if (balls % 6 === 0) {
    //End the current over i.e, end the current array.
    //Start the new over ie., start the new array.
    const newOver = [run];

    // Check: If the total overs are completed.

    return { updatedOver: [...thisOver, newOver], isInningsFinished };
  } else {
    let updatedOver = thisOver.map((over, index) => {
      if (thisOver.length === index + 1) {
        return [...over, run];
      }
      return over;
    });
    console.log(
      balls,
      convertOversToBalls(totalOvers),
      balls === convertOversToBalls(totalOvers)
    );
    if (balls + 1 >= convertOversToBalls(totalOvers)) {
      isInningsFinished = true;
    }
    return { updatedOver, isInningsFinished };
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
  let { updatedOver, isInningsFinished } = addRunWicketToOver(
    curScore,
    totalBalls,
    thisOver,
    run
  );
  let oversInInnings = updatedOver;
  const updatedStriker = {
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

  const updatedStats = {
    ...currentBattingTeam.stats,
    totalRuns: totalRuns + run,
    totalBalls: totalBallsBowledInThisInnigs || 0,
    thisOver: oversInInnings,
    currentRunRate: getCurRunRate(totalRuns + run, totalBalls + 1),
  };

  const updatedBowler = {
    ...curScore.bowler,
    bowling: { ...bowling, runs: bowlerRuns, balls: bowlerBalls },
  };
  return {
    ...curScore,
    striker: updatedStriker,
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isInningsFinished,
      stats: updatedStats,
    },
    bowler: updatedBowler,
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
  let { updatedOver, isInningsFinished } = addRunWicketToOver(
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
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      isInningsFinished,
      stats: newStats,
    },
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
  let { updatedOver, isInningsFinished } = addRunWicketToOver(
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
      isInningsFinished,
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

//(TODO)
export const movePlayer = (curScore, id) => {
  const currentBattingTeam = getCurrentBattingTeam(curScore);
  const { striker, nonStriker } = curScore;
  const isPlayerInList = isPlayerInTheList(
    striker.playerId === id ? striker : nonStriker,
    currentBattingTeam.players
  );
  let outBatsman = striker.playerId === id ? striker : nonStriker;
  outBatsman = { ...outBatsman, batting: { status: 'OUT' } };
  const outField = striker.playerId === id ? 'striker' : 'nonStriker';
  return {
    ...curScore,
    [outField]: { ...PLAYER_STATE },
    [currentBattingTeam.objName]: {
      ...currentBattingTeam,
      players: isPlayerInList
        ? currentBattingTeam.players.map((player) =>
            player.playerId === outBatsman.playerId ? outBatsman : player
          )
        : [
            ...currentBattingTeam.players,
            {
              ...outBatsman,
              batting: { ...outBatsman.batting },
            },
          ],
    },
  };
};

export const addStriker = (curScore, nameOrObject) => {
  //  Add striker to the list of batting team players.
  //  Parameters:
  // curScore: State object
  // nameOrObject: This parameter can be of two types - string or an Object.
  //          If the the parameter type is string, then the entry refers to new
  //          bowler. if the paramter type is object, then the entry refers to
  //          exisiting bowler object.
  // Returns: "state" object.
  const { striker } = curScore;
  const p_id = striker.playerId ? striker.playerId : uuidv4();
  if (typeof nameOrObject === 'string') {
    return {
      ...curScore,
      striker: {
        ...striker,
        name: nameOrObject,
        playerId: p_id,
        order: uniqueId(),
      },
    };
  } else if (typeof nameOrObject === 'object') {
    return {
      ...curScore,
      striker: nameOrObject,
    };
  }
};

export const addNonStriker = (curScore, nameOrObject) => {
  //  Add nonStriker to the list of batting team players.
  //  Parameters:
  // curScore: State object
  // nameOrObject: This parameter can be of two types - string or an Object.
  //          If the the parameter type is string, then the entry refers to new
  //          bowler. if the paramter type is object, then the entry refers to
  //          exisiting bowler object.
  // Returns: "state" object.
  const { nonStriker } = curScore;
  const p_id = nonStriker.playerId ? nonStriker.playerId : uuidv4();
  if (typeof nameOrObject === 'string') {
    return {
      ...curScore,
      nonStriker: {
        ...nonStriker,
        name: nameOrObject,
        playerId: p_id,
        order: uniqueId(),
      },
    };
  } else if (typeof nameOrObject === 'object') {
    return {
      ...curScore,
      nonStriker: nameOrObject,
    };
  }
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
      batting: {
        ...batting,
        runs: batting.runs + runOutruns,
        balls: batting.balls + 1,
      },
    },
    // Add runs to bowler.
    bowler: {
      ...bowler,
      bowling: { ...bowling, runs: bowling.runs + runOutruns },
    },
  };
};

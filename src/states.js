import { BENCH } from './actions/types';

export const PLAYER_STATE = {
  playerId: '',
  order: '',
  name: '',
  bat: BENCH,
  bowl: false,
  batting: {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    ones: 0,
    twos: 0,
    threes: 0,
    strike_rate: 0,
  },
  bowling: {
    runs: 0,
    wickets: 0,
    balls: 0,
    runrate: 0,
  },
};

export const TEAM_STATE = {
  toss: false,
  choose: '',
  name: '',
  isBatting: false,
  objName: '',
  players: [],
  stats: {
    totalRuns: 0,
    totalWickets: 0,
    totalBalls: 0,
    thisOver: [],
    currentRunRate: 0,
  },
};

export const MATCH_INITIAL_STATE = {
  match: {
    id: null,
    toss: '',
    team1: { ...TEAM_STATE },
    team2: { ...TEAM_STATE },
    settings: {
      overs: 0,
      extras: {
        value: false,
        wides: {
          value: false,
          widesForRun: 0,
        },
        noBall: false,
        byes: false,
        legByes: false,
      },
    },
  },
};

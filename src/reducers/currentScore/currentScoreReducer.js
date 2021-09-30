import _ from 'lodash';
import {
  ADD_RUN,
  ADD_EXTRA,
  ADD_WICKET,
  ADD_STRIKER,
  ADD_NON_STRIKER,
  ADD_BOWLER,
  CREATE_GAME,
  MOVE_PLAYER,
  SWAP_STRIKER,
  SWAP_STRIKER_FORCE,
} from '../../actions/types';
import { PLAYER_STATE, TEAM_STATE } from '../../states';
import {
  addRun,
  swapStriker,
  addWicket,
  addExtra,
  movePlayer,
  addStriker,
  addNonStriker,
  matchInit,
  getCurrentBattingTeam,
} from './currentScore.utils';

const INITIAL_STATE = {
  matchId: 0,
  striker: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  nonStriker: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  bowler: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  team1: JSON.parse(JSON.stringify(TEAM_STATE)),
  team2: JSON.parse(JSON.stringify(TEAM_STATE)),
  // firstInnings: JSON.parse(JSON.stringify(TEAM_STATE)),
  // secondInnings: JSON.parse(JSON.stringify(TEAM_STATE)),
  settings: {
    overs: 0,
    widesPerRun: 0,
    noball: false,
    byes: false,
    legbyes: false,
  },
};

const currentScoreReducer = (state = INITIAL_STATE, action) => {
  const newState = _.clone(state);
  switch (action.type) {
    case CREATE_GAME:
      return matchInit(newState, action.payload);

    case SWAP_STRIKER:
      const runs = parseInt(action.payload);
      const currentBattingTeam = getCurrentBattingTeam(newState);
      const balls = currentBattingTeam.stats.totalBalls;
      if (balls % 6 === 0 && (runs === 1 || runs === 3)) return newState;
      else if (runs === 1 || runs === 3 || balls % 6 === 0) {
        swapStriker(newState);
        return newState;
      } else return newState;

    case SWAP_STRIKER_FORCE:
      return swapStriker(newState);

    case ADD_RUN:
      return addRun(state, action.payload);

    case ADD_EXTRA:
      return addExtra(newState, action.payload.extra, action.payload.runs);

    case ADD_WICKET:
      return addWicket(state, 'somethingToAddLater');

    case ADD_STRIKER:
      return addStriker(newState, action.payload);

    case ADD_NON_STRIKER:
      // (TODO)
      return addNonStriker(newState, action.payload);

    case ADD_BOWLER:
      return _.set(newState, 'bowler.name', action.payload);

    case MOVE_PLAYER:
      return movePlayer(newState, action.payload);

    default:
      return state;
  }
};

export default currentScoreReducer;

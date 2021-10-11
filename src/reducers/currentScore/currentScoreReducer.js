import _ from 'lodash';
import undoable from 'redux-undo';
import {
  ADD_RUN,
  ADD_EXTRA,
  ADD_WICKET,
  ADD_STRIKER,
  ADD_NON_STRIKER,
  ADD_BOWLER,
  CREATE_GAME,
  MOVE_PLAYER,
  MOVE_BOWLER,
  SWAP_STRIKER,
  SWAP_STRIKER_FORCE,
  ADD_RUNS_TO_PLAYER,
  SWITCH_INNINGS,
  CLEAR_UNDO_HISTORY,
} from '../../actions/types';
import { PLAYER_STATE, TEAM_STATE } from '../../states';
import {
  addRunUtil,
  swapStrikerUtil,
  addWicket,
  addExtra,
  movePlayer,
  addStriker,
  addNonStriker,
  matchInit,
  getCurrentBattingTeam,
  addBowler,
  moveCurrentBowler,
  addRunsToPlayerObjectOnRunOut,
  switchInnings,
} from './currentScore.utils';

const INITIAL_STATE = {
  matchId: 0,
  striker: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  nonStriker: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  bowler: JSON.parse(JSON.stringify({ ...PLAYER_STATE })),
  team1: JSON.parse(JSON.stringify(TEAM_STATE)),
  team2: JSON.parse(JSON.stringify(TEAM_STATE)),
  settings: {
    overs: 0,
    widesPerRun: 0,
    noball: false,
    byes: false,
    legbyes: false,
    target: 0,
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
        swapStrikerUtil(newState);
        return newState;
      } else return newState;

    case SWAP_STRIKER_FORCE:
      return swapStrikerUtil(newState);

    case ADD_RUN:
      return addRunUtil(newState, action.payload);

    case ADD_EXTRA:
      return addExtra(newState, action.payload.extra, action.payload.runs);

    case ADD_WICKET:
      return addWicket(newState, action.payload);

    case ADD_STRIKER:
      return addStriker(newState, action.payload);

    case ADD_NON_STRIKER:
      return addNonStriker(newState, action.payload);

    case MOVE_PLAYER:
      return movePlayer(newState, action.payload);

    case ADD_BOWLER:
      return addBowler(newState, action.payload);

    case MOVE_BOWLER:
      return moveCurrentBowler(newState);

    case ADD_RUNS_TO_PLAYER:
      return addRunsToPlayerObjectOnRunOut(newState, action.payload);

    case SWITCH_INNINGS:
      return switchInnings(newState);

    default:
      return state;
  }
};

const undoableCurrentScoreReducer = undoable(currentScoreReducer, {
  limit: 10,
  filter: function filterActions(action, currentState, previousHistory) {
    return action.type !== SWAP_STRIKER || action.type !== SWAP_STRIKER_FORCE; // only add to history if action is SOME_ACTION
  },
  clearHistoryType: CLEAR_UNDO_HISTORY,
});
export default undoableCurrentScoreReducer;

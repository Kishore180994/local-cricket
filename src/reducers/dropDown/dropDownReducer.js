import _ from 'lodash';
import {
  SELECT_RUNS_BYES,
  SELECT_RUNS_LEGBYES,
  SELECT_RUNS_NOBALL,
  SELECT_RUNS_WIDE,
  TOGGLE_OPEN_BYES,
  TOGGLE_OPEN_LEGBYES,
  TOGGLE_OPEN_NOBALL,
  TOGGLE_OPEN_WIDE,
} from '../../actions/types';

const INITIAL_STATE = {
  wideOpen: { enabled: false, selected: 0 },
  noBallOpen: { enabled: false, selected: 0 },
  legByesOpen: { enabled: false, selected: 0 },
  byesOpen: { enabled: false, selected: 0 },
};
const dropDownReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_OPEN_WIDE:
      return _.set(_.clone(state), 'wideOpen.enabled', action.payload);
    case TOGGLE_OPEN_BYES:
      return _.set(_.clone(state), 'byesOpen.enabled', action.payload);
    case TOGGLE_OPEN_LEGBYES:
      return _.set(_.clone(state), 'legByesOpen.enabled', action.payload);
    case TOGGLE_OPEN_NOBALL:
      return _.set(_.clone(state), 'noBallOpen.enabled', action.payload);
    case SELECT_RUNS_WIDE:
      return _.set(_.clone(state), 'wideOpen.selected', action.payload);
    case SELECT_RUNS_BYES:
      return _.set(_.clone(state), 'byesOpen.selected', action.payload);
    case SELECT_RUNS_NOBALL:
      return _.set(_.clone(state), 'noBallOpen.selected', action.payload);
    case SELECT_RUNS_LEGBYES:
      return _.set(_.clone(state), 'legByesOpen.selected', action.payload);
    default:
      return state;
  }
};

export default dropDownReducer;

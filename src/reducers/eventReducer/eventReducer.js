import { SELECT_EXTRA, SELECT_WIDES } from '../../actions/types';

const INITIAL_STATE = {
  isSelectedExtra: false,
  isSelectedWides: false,
};

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_EXTRA:
      return { ...state, isSelectedExtra: action.payload };
    case SELECT_WIDES:
      return { ...state, isSelectedWides: action.payload };
    default:
      return state;
  }
};

export default eventReducer;

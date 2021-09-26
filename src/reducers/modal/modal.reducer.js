import { WICKET_MODAL } from '../../actions/types';

const INITIAL_STATE = {
  wicket: {
    hidden: true,
    type: '',
  },
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WICKET_MODAL:
      return {
        ...state,
        wicket: { hidden: action.payload.value, type: action.payload.type },
      };
    default:
      return state;
  }
};

export default modalReducer;

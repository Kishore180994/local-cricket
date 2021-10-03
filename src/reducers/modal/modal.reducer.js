import undoable from 'redux-undo';
import {
  WICKET_MODAL,
  OUT_BATSMAN,
  BOWLER_MODAL,
  END_OF_THE_INNIGS_MODAL,
} from '../../actions/types';

const INITIAL_STATE = {
  wicket: {
    hidden: true,
    type: '',
  },
  bowlerModal: {
    hidden: true,
  },
  eoiModal: {
    hidden: true,
  },
  currentBatsmanWhoGotOut: null,
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WICKET_MODAL:
      return {
        ...state,
        wicket: { hidden: action.payload.value, type: action.payload.type },
      };
    case END_OF_THE_INNIGS_MODAL:
      return {
        ...state,
        eoiModal: { hidden: action.payload },
      };
    case BOWLER_MODAL:
      return {
        ...state,
        bowlerModal: { hidden: action.payload },
      };
    case OUT_BATSMAN:
      return {
        ...state,
        currentBatsmanWhoGotOut: action.payload,
      };

    default:
      return state;
  }
};

// const undoableModalReducer = undoable(modalReducer);

export default modalReducer;

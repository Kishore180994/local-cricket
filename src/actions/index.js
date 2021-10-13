import cricket from '../api/cricket';
import {
  SIGN_IN,
  SIGN_OUT,
  SELECT_EXTRA,
  SELECT_WIDES,
  ADD_RUN,
  ADD_WICKET,
  GAME_UNDO,
  ADD_EXTRA,
  SWITCH_STRIKER,
  ADD_STRIKER,
  ADD_NON_STRIKER,
  ADD_BOWLER,
  SWAP_STRIKER,
  WICKET_MODAL,
  CREATE_GAME,
  MOVE_PLAYER,
  SWAP_STRIKER_FORCE,
  OUT_BATSMAN,
  BOWLER_MODAL,
  MOVE_BOWLER,
  ADD_RUNS_TO_PLAYER,
  END_OF_THE_INNINGS_MODAL,
  END_OF_THE_MATCH_MODAL,
  SWITCH_INNINGS,
  CLEAR_UNDO_HISTORY,
  OVERS_DONE,
  REMOVE_BOWLER_STATUS,
  REMOVE_BATSMAN_STATUS,
  CLEAR_STATE,
} from './types';

export const signIn = (userId) => {
  return {
    type: SIGN_IN,
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const selectExtras = (boolValue) => {
  return {
    type: SELECT_EXTRA,
    payload: boolValue,
  };
};

export const selectWides = (boolValue) => async (dispatch) => {
  dispatch({
    type: SELECT_WIDES,
    payload: boolValue,
  });
};

//Example
// export const createGame = (formValues) => {
//   return async function (dispatch) {
//     const response = await cricket.post("/games", formValues);

//     dispatch({ type: GAME_CREATE, payload: response.data });
//   };
// };
// export const createGame = (formValues) => async (dispatch) => {
//   const response = await cricket.post('/games', formValues);

//   dispatch({ type: GAME_CREATE, payload: response.data });
// };

export const createGame = (formValues) => async (dispatch) => {
  dispatch({
    type: CREATE_GAME,
    payload: formValues,
  });
};

export const addScore = (runs) => async (dispatch) => {
  dispatch({
    type: ADD_RUN,
    payload: runs,
  });
};

export const addRunToPlayer = (runs) => async (dispatch) => {
  dispatch({
    type: ADD_RUNS_TO_PLAYER,
    payload: runs,
  });
};

export const addExtra = (extra, runs) => async (dispatch) => {
  dispatch({
    type: ADD_EXTRA,
    payload: { extra, runs },
  });
};

export const addWicket = (wicketType) => async (dispatch) => {
  dispatch({
    type: ADD_WICKET,
    payload: wicketType,
  });
};

export const undo = () => async (dispatch) => {
  dispatch({
    type: GAME_UNDO,
  });
};

// DropDown Actions
export const setOpen = (type, isOpen) => async (dispatch) => {
  dispatch({
    type: type,
    payload: !isOpen,
  });
};

export const setSelected = (type, isSelected) => async (dispatch) => {
  dispatch({
    type: type,
    payload: isSelected,
  });
};

export const swapStriker = (runs) => async (dispatch) => {
  dispatch({
    type: SWAP_STRIKER,
    payload: runs,
  });
};

export const swapStrikerForce = () => async (dispatch) => {
  dispatch({
    type: SWAP_STRIKER_FORCE,
  });
};

export const switchStriker = (balls, run) => async (dispatch) => {
  dispatch({
    type: SWITCH_STRIKER,
    payload: { balls, run },
  });
};

export const addStriker = (name) => async (dispatch) => {
  dispatch({
    type: ADD_STRIKER,
    payload: name,
  });
};

export const addNonStriker = (name) => async (dispatch) => {
  dispatch({
    type: ADD_NON_STRIKER,
    payload: name,
  });
};

export const removeBatsmanStatus =
  (batsmanType, wicketType) => async (dispatch) => {
    dispatch({
      type: REMOVE_BATSMAN_STATUS,
      batsmanType: batsmanType, // can be either striker or non-striker
      wicketType: wicketType,
    });
  };

export const removeBowlerStatus = () => async (dispatch) => {
  dispatch({
    type: REMOVE_BOWLER_STATUS,
  });
};

export const movePlayer = (name) => async (dispatch) => {
  dispatch({
    type: MOVE_PLAYER,
    payload: name,
  });
};

export const moveBowler = () => async (dispatch) => {
  dispatch({
    type: MOVE_BOWLER,
  });
};

export const addBowler = (nameOrObject) => async (dispatch) => {
  dispatch({
    type: ADD_BOWLER,
    payload: nameOrObject,
  });
};

export const setWicketModal = (value, type) => async (dispatch) => {
  dispatch({
    type: WICKET_MODAL,
    payload: { value, type },
  });
};

export const setBowlerModal = (value) => async (dispatch) => {
  dispatch({
    type: BOWLER_MODAL,
    payload: value,
  });
};

export const setEndOfInningsModal = (val) => async (dispatch) => {
  dispatch({
    type: END_OF_THE_INNINGS_MODAL,
    payload: val,
  });
};

export const setEndOfMatchModal = (val) => async (dispatch) => {
  dispatch({
    type: END_OF_THE_MATCH_MODAL,
    payload: val,
  });
};

export const setBatsmanOut = (id) => async (dispatch) => {
  dispatch({
    type: OUT_BATSMAN,
    payload: id,
  });
};

export const switchInnings = () => async (dispatch) => {
  dispatch({
    type: SWITCH_INNINGS,
  });
};

export const clearUndoHistory = () => async (dispatch) => {
  dispatch({
    type: CLEAR_UNDO_HISTORY,
  });
};

export const oversFinished = () => async (dispatch) => {
  dispatch({
    type: OVERS_DONE,
  });
};

export const clearState = () => async (dispatch) => {
  dispatch({
    type: CLEAR_STATE,
  });
};

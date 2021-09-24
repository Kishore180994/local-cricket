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
  UPDATE_STRIKER_SCORE_AND_OVERS,
  SWITCH_STRIKER,
  ADD_STRIKER,
  ADD_NON_STRIKER,
  ADD_BOWLER,
  SWAP_STRIKER,
  CREATE_GAME,
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

export const selectWides = (boolValue) => {
  return {
    type: SELECT_WIDES,
    payload: boolValue,
  };
};

export const swapStriker = () => {
  return {
    type: SWAP_STRIKER,
  };
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

export const createGame = (formValues) => ({
  type: CREATE_GAME,
  payload: formValues,
});

export const addScore = (runs) => ({
  type: ADD_RUN,
  payload: runs,
});

export const addExtra = (extra, runs) => ({
  type: ADD_EXTRA,
  payload: { extra, runs },
});

export const addWicket = (gameId) => (dispatch, getState) => {
  const { curScore } = getState();

  dispatch({
    type: ADD_WICKET,
    payload: { gameId, curScore },
  });
};

export const undo = () => {
  return {
    type: GAME_UNDO,
  };
};

// DropDown Actions
export const setOpen = (type, isOpen) => {
  return {
    type: type,
    payload: !isOpen,
  };
};

export const setSelected = (type, isSelected) => {
  return {
    type: type,
    payload: isSelected,
  };
};

export const updateBatsmanScore = (runs) => (dispatch, getState) => {
  const { curScore } = getState();

  dispatch({
    type: UPDATE_STRIKER_SCORE_AND_OVERS,
    payload: { curScore, runs },
  });
};

export const switchStriker = (balls, run) => {
  return {
    type: SWITCH_STRIKER,
    payload: { balls, run },
  };
};

export const addStriker = (name) => {
  return {
    type: ADD_STRIKER,
    payload: name,
  };
};

export const addNonStriker = (name) => {
  return {
    type: ADD_NON_STRIKER,
    payload: name,
  };
};

export const addBowler = (name) => {
  return {
    type: ADD_BOWLER,
    payload: name,
  };
};

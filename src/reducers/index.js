import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import currentScoreReducer from './currentScore/currentScoreReducer';
import dropDownReducer from './dropDown/dropDownReducer';
import eventReducer from './eventReducer/eventReducer';

export default combineReducers({
  auth: authReducer,
  events: eventReducer,
  dropdown: dropDownReducer,
  curScore: currentScoreReducer,
});

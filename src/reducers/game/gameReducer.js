// import _ from 'lodash';
// import { GAME_CREATE } from '../../actions/types';
// import { MATCH_INITIAL_STATE } from '../../states';

// const gameReducer = (state = MATCH_INITIAL_STATE, action) => {
//   switch (action.type) {
//     case GAME_CREATE:
//       const newState = _.clone(state);
//       const updates = {
//         'match.id': action.payload.matchId,
//         'match.team1.name': action.payload.team1,
//         'match.team2.name': action.payload.team2,
//         'match.toss': action.payload.toss,
//         'match.settings.overs': action.payload.overs,
//         'match.settings.extras.byes': action.payload.byes,
//         'match.settings.extras.legByes': action.payload.legbyes,
//         'match.settings.extras.noBall': action.payload.noball,
//         'match.settings.extras.wides.widesForRun': action.payload.wpr,
//       };
//       Object.keys(updates).map((key) => {
//         return _.set(newState, key, updates[key]);
//       });
//       return {
//         ...newState,
//         currentMatchId: action.payload.matchId,
//       };

//     default:
//       return state;
//   }
// };

// export default gameReducer;

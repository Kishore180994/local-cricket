import { createSelector } from 'reselect';

const selectCurrentScore = (state) => state.curScore;

export const selectFirstInnings = createSelector(
  [selectCurrentScore],
  (curScore) =>
    curScore.team1.isFirstInnings ? curScore.team1 : curScore.team2
);

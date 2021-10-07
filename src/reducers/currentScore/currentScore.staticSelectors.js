import { createSelector } from 'reselect';

const selectCurrentScore = (state) => state.curScore.present;

export const selectFirstInnings = createSelector(
  [selectCurrentScore],
  (curScore) =>
    curScore.team1.isFirstInnings ? curScore.team1 : curScore.team2
);

export const selectSecondInnings = createSelector(
  [selectCurrentScore],
  (curScore) =>
    curScore.team1.isFirstInnings ? curScore.team2 : curScore.team1
);

export const selectIsFirstInningsFinished = createSelector(
  [selectFirstInnings],
  (firstInnings) => firstInnings.isInningsFinished
);

export const selectIsSecondInningsFinished = createSelector(
  [selectSecondInnings],
  (secondInnings) => secondInnings.isInningsFinished
);

export const selectIsFirstInnings = createSelector(
  [selectFirstInnings, selectSecondInnings],
  (first, second) =>
    !first.isInningsFinished && !second.isInningsFinished ? true : false
);

import { createSelector } from 'reselect';

const selectCurrentScore = (state) => state.curScore;

export const selectFirstInnigs = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.firstInnings
);

export const selectStriker = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.striker
);

export const selectNonStriker = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.nonStriker
);

export const selectBowler = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.bowler
);

export const selectStats = createSelector(
  [selectFirstInnigs],
  (firstInnings) => firstInnings.stats
);

export const selectTotalBallsPlayed = createSelector(
  [selectStats],
  (stats) => stats.totalBalls
);

export const selectBattingTeamScore = createSelector(
  [selectStats],
  (stats) => stats.totalRuns
);

export const selectBattingTeamWickets = createSelector(
  [selectStats],
  (stats) => stats.totalWickets
);

export const selectThisInnings = createSelector(
  [selectStats],
  (stats) => stats.thisOver
);

export const selectCurrentRunRate = createSelector(
  [selectStats],
  (stats) => stats.currentRunRate
);

export const selectSettings = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.settings
);
export const selectIsWidesEnabled = createSelector(
  [selectSettings],
  (settings) => (settings.widesPerRun ? true : false)
);

export const selectIsNoBallEnabled = createSelector(
  [selectSettings],
  (settings) => settings.noball
);

export const selectIsByesEnabled = createSelector(
  [selectSettings],
  (settings) => settings.byes
);

export const selectIsLegByesEnabled = createSelector(
  [selectSettings],
  (settings) => settings.legbyes
);

export const selectOvers = createSelector(
  [selectSettings],
  (settings) => settings.overs
);

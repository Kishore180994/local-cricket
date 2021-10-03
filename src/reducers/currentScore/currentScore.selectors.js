import { createSelector } from 'reselect';

const selectCurrentScore = (state) => state.curScore;

export const selectTeam1 = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.team1
);

export const selectTeam2 = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.team2
);

export const selectFirstInnigs = createSelector(
  [selectTeam1, selectTeam2],
  (team1, team2) => {
    return team1.isBatting ? team1 : team2;
  }
);

export const selectBowlingTeam = createSelector(
  [selectCurrentScore],
  (curScore) => {
    const { team1, team2 } = curScore.present;
    return team1.isBatting ? team2 : team1;
  }
);

export const selectStriker = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.striker
);

export const selectMatchId = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.matchId
);

export const selectNonStriker = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.nonStriker
);

export const selectBowler = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.present.bowler
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
  (curScore) => curScore.present.settings
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

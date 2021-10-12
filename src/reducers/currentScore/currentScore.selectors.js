import { createSelector } from 'reselect';
import { BOWLER, NON_STRIKER, STRIKER } from '../../actions/types';

const selectCurrentScore = (state) => state.curScore.present;

export const selectTeam1 = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.team1
);

export const selectTeam2 = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.team2
);

export const selectBattingTeam = createSelector(
  [selectTeam1, selectTeam2],
  (team1, team2) => {
    return team1.isBatting ? team1 : team2;
  }
);

export const selectBattingTeamPlayers = createSelector(
  [selectBattingTeam],
  (team) => team.players
);

export const SelectIsCurrentInningsCompleted = createSelector(
  [selectBattingTeam],
  (team) => team.isInningsFinished
);

export const selectBowlingTeam = createSelector(
  [selectTeam1, selectTeam2],
  (team1, team2) => {
    return team1.isBatting ? team2 : team1;
  }
);

export const selectBowlingTeamPlayers = createSelector(
  [selectBowlingTeam],
  (team) => team.players
);

export const selectStriker = createSelector(
  [selectBattingTeamPlayers],
  (players) => players.filter((player) => player.status === STRIKER)[0]
);

export const selectNonStriker = createSelector(
  [selectBattingTeamPlayers],
  (players) => players.filter((player) => player.status === NON_STRIKER)[0]
);

export const selectBowler = createSelector(
  [selectBowlingTeamPlayers],
  (players) => players.filter((player) => player.status === BOWLER)[0]
);

export const selectMatchId = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.matchId
);

export const selectIsMatchFinished = createSelector(
  [selectCurrentScore],
  (curScore) => curScore.isMatchFinished
);

export const selectStats = createSelector(
  [selectBattingTeam],
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

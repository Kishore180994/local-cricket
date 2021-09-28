import { createSelector } from 'reselect';

export const selectModal = (state) => state.modal;

export const selectWicket = createSelector(
  [selectModal],
  (modal) => modal.wicket
);

export const selectBowlerModal = createSelector(
  [selectModal],
  (modal) => modal.bowlerModal
);

export const selectBastmanWhoGotOut = createSelector(
  [selectModal],
  (modal) => modal.currentBatsmanWhoGotOut
);

export const selectWicketModalHiddenValue = createSelector(
  [selectWicket],
  (wicket) => wicket.hidden
);

export const selectBowlerModalHiddenValue = createSelector(
  [selectBowlerModal],
  (bowler) => bowler.hidden
);

export const selectWicketType = createSelector(
  [selectWicket],
  (wicket) => wicket.type
);

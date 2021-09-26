import { createSelector } from 'reselect';

export const selectModal = (state) => state.modal;

export const selectWicket = createSelector(
  [selectModal],
  (modal) => modal.wicket
);

export const selectWicketModalHiddenValue = createSelector(
  [selectWicket],
  (wicket) => wicket.hidden
);

export const selectWicketType = createSelector(
  [selectWicket],
  (wicket) => wicket.type
);

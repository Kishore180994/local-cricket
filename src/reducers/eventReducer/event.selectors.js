import { createSelector } from 'reselect';

const selectEvents = (state) => state.events;

export const selectIsWidesEnabled = createSelector(
  [selectEvents],
  (events) => events.isSelectedWides
);

export const selectIsSelectedExtra = createSelector(
  [selectEvents],
  (events) => events.isSelectedExtra
);

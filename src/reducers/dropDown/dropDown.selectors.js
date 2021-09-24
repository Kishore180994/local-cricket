import { createSelector } from 'reselect';

export const selectDropDown = (state) => state.dropdown;

export const selectIsWideOpen = createSelector(
  [selectDropDown],
  (wide) => wide.wideOpen.enabled
);

export const selectisNoBallOpen = createSelector(
  [selectDropDown],
  (noBall) => noBall.noBallOpen.enabled
);

export const selectisByesOpen = createSelector(
  [selectDropDown],
  (byes) => byes.byesOpen.enabled
);

export const selectislegByesOpen = createSelector(
  [selectDropDown],
  (legByes) => legByes.legByesOpen.enabled
);

export const selectedWides = createSelector(
  [selectDropDown],
  (wide) => wide.wideOpen.selected
);

export const selectedNoBall = createSelector(
  [selectDropDown],
  (noBall) => noBall.noBallOpen.selected
);

export const selectedByes = createSelector(
  [selectDropDown],
  (byes) => byes.byesOpen.selected
);

export const selectedLegByes = createSelector(
  [selectDropDown],
  (legByes) => legByes.legByesOpen.selected
);

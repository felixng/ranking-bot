/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectUsername = () => createSelector(
  selectHome,
  (homeState) => homeState.get('username')
);

const makeSelectDate = () => createSelector(
  selectHome,
  (homeState) => homeState.get('date')
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectDate,
};

/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectDate = () => createSelector(
  selectHome,
  (homeState) => homeState.get('date')
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectDate,
};

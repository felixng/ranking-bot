/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectDate = () => createSelector(
  selectHome,
  (homeState) => homeState.get('date')
);

const makeSelectHandle = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['tweetsCloud', 'handle'])
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectDate,
  makeSelectHandle,
};

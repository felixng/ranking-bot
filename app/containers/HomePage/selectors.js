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
  (homeState) => homeState.getIn(['snapshot', 'handle'])
);

const makeSelectShowName = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'name'])
);

const makeSelectTweets = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'tweets'])
);

const makeSelectTweetsError = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'error'])
);

const makeSelectTweetsLoading = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'loading'])
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectDate,
  makeSelectHandle,
  makeSelectTweets,
  makeSelectTweetsLoading,
  makeSelectTweetsError,
};

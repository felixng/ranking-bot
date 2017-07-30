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

const makeSelectShowPrice = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'price'])
);

const makeSelectBookNowLink = () => createSelector(
  selectHome,
  (homeState) => homeState.getIn(['snapshot', 'bookNowLink'])
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
  makeSelectDate,
  makeSelectHandle,
  makeSelectTweets,
  makeSelectTweetsLoading,
  makeSelectTweetsError,
  makeSelectShowName,
  makeSelectShowPrice,
  makeSelectBookNowLink
};

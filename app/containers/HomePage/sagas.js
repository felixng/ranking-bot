/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_SHOWS } from 'containers/App/constants';
import { LOAD_TWEETS, LOAD_BOOK_NOW } from 'containers/HomePage/constants';
import { showsLoaded, showsLoadingError } from 'containers/App/actions';
import { tweetsLoaded, tweetsLoadingError, bookNowDetailsLoaded, bookNowLoadingError } from 'containers/HomePage/actions';

import request from 'utils/request';
import toKey from 'utils/date';
import { makeSelectHandle, makeSelectDate, makeSelectShowName } from 'containers/HomePage/selectors';

const url = process.env.API_URL || 'uat-cms-ensemblr.herokuapp.com';

export function* getTweets() {
  // Select username from store
  const date = yield select(makeSelectDate());
  const dateKey = toKey(date);
  const handle = yield select(makeSelectHandle());
  // const requestURL = `${window.location.protocol}\/\/${window.location.host}/snapshot/${handle}/${dateKey}`;
  const requestURL = `/snapshot/${handle}/${dateKey}`;

  try {
    const snapshot = yield call(request, requestURL);
    yield put(tweetsLoaded(snapshot));
  } catch (err) {
    yield put(tweetsLoadingError(err));
  }
}

export function* getShows() {
  const date = yield select(makeSelectDate());
  const dateKey = toKey(date);
  const requestURL = `/top/10/${dateKey}`;

  try {
    const shows = yield call(request, requestURL);
    yield put(showsLoaded(shows.splice(0, 5), dateKey));
  } catch (err) {
    yield put(showsLoadingError(err));
  }
}

export function* getBookNowDetails() {
  var name = yield select(makeSelectShowName());
  name = encodeURIComponent(name);
  var protocol = 'http:';
  if (window){
    protocol = window.location.protocol;
  }
  const requestURL = `${protocol}\/\/${url}/api/affiliate/search/${name}`;

  try {
    const affiliateList = yield call(request, requestURL);
  
    yield put(bookNowDetailsLoaded(affiliateList));
  } catch (err) {
    console.log(err);
    yield put(bookNowLoadingError(err));
  }
}

export function* tweetsData() {
  const watcher = yield takeLatest(LOAD_TWEETS, getTweets);
  
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* showData() {
  const watcher = yield takeLatest(LOAD_SHOWS, getShows);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* bookNowData() {
  const watcher = yield takeLatest(LOAD_BOOK_NOW, getBookNowDetails);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  showData,
  tweetsData,
  bookNowData
];

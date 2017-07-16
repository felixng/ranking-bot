/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_SHOWS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError, showsLoaded, showsLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import toKey from 'utils/date';
import { makeSelectUsername, makeSelectDate } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(makeSelectUsername());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* getShows() {
  // Select username from store
  const date = yield select(makeSelectDate());
  const dateKey = toKey(date);
  const requestURL = `${window.location.protocol}\/\/${window.location.host}/top/10/${dateKey}`;

  try {
    // Call our request helper (see 'utils/request')
    const shows = yield call(request, requestURL);
    yield put(showsLoaded(shows.splice(0, 5), dateKey));
    console.debug(shows);
    console.debug(dateKey);
  } catch (err) {
    yield put(showsLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(LOAD_REPOS, getRepos);
  
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* showData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(LOAD_SHOWS, getShows);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  showData,
];

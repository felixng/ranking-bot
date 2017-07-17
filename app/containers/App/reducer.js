/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  LOAD_SHOWS,
  LOAD_SHOWS_SUCCESS,
  LOAD_SHOWS_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  currentDate: false,
  userData: {
    repositories: false,
  },
  trendingData: {
    shows: false,
  }
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_SHOWS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['trendingData', 'shows'], false);
    case LOAD_SHOWS_SUCCESS:
      return state
        .setIn(['trendingData', 'shows'], action.shows)
        .set('loading', false)
        .set('currentDate', action.date);
    case LOAD_SHOWS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    default:
      return state;
  }
}

export default appReducer;

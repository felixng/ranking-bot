/*
 * HomeReducer
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
  CHANGE_DATE,
  LOAD_TWEETS,
  LOAD_TWEETS_SUCCESS,
  LOAD_BOOK_NOW,
  BOOK_NOW_LOADED,
  ALL_TWEETS_LOADED
} from './constants';

var todayTimeStamp = new Date(); 
var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
var diff = todayTimeStamp - oneDayTimeStamp;
var yesterdayDate = new Date(diff);

// The initial state of the App
const initialState = fromJS({
  date: yesterdayDate,
  snapshot: {
    handle: '',
    tweets: false,
    tweetCount: -1,
    retweetCount: -1,
    favouriteCount: -1,
    loading: false,
    error: false,
    bookNowLink: false,
    price: false,
  }
});


function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DATE:
      return state
        .set('date', action.date)
        .setIn(['snapshot', 'tweets'], false)
        .setIn(['snapshot', 'name'], false)
        .setIn(['snapshot', 'tweetsCount'], -1)
        .setIn(['snapshot', 'retweetCount'], -1)
        .setIn(['snapshot', 'favouriteCount'], -1)
        .setIn(['snapshot', 'error'], false)
        .setIn(['snapshot', 'loading'], false)
        .setIn(['snapshot', 'bookNowLink'], false)
        .setIn(['snapshot', 'price'], false);
    case LOAD_TWEETS:
      return state
        .setIn(['snapshot', 'handle'], action.handle)
        .setIn(['snapshot', 'loading'], true)
        .setIn(['snapshot', 'error'], false)
        .setIn(['snapshot', 'bookNowLink'], false)
        .setIn(['snapshot', 'price'], false);
    case LOAD_TWEETS_SUCCESS:
      return state
        .setIn(['snapshot', 'tweets'], action.tweets)
        .setIn(['snapshot', 'name'], action.name)
        .setIn(['snapshot', 'tweetsCount'], action.tweetTotal)
        .setIn(['snapshot', 'retweetCount'], action.retweetTotal)
        .setIn(['snapshot', 'favouriteCount'], action.favouriteTotal)
        .setIn(['snapshot', 'error'], false)
    case ALL_TWEETS_LOADED:
      return state
        .setIn(['snapshot', 'loading'], false);
    case BOOK_NOW_LOADED:
      return state
        .setIn(['snapshot', 'bookNowLink'], action.link)
        .setIn(['snapshot', 'price'], action.price);
    default:
      return state;
  }
}

export default homeReducer;

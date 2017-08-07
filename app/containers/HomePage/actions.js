/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  CHANGE_USERNAME,
  CHANGE_DATE,
  LOAD_TWEETS,
  LOAD_TWEETS_SUCCESS,
  ALL_TWEETS_LOADED,
  LOAD_TWEETS_FAILED,
  LOAD_BOOK_NOW,
  LOAD_BOOK_NOW_FAILED,
  BOOK_NOW_LOADED,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function changeUsername(name) {
  return {
    type: CHANGE_USERNAME,
    name,
  };
}

export function changeDate(date) {
  return {
    type: CHANGE_DATE,
    date,
  };
}

export function loadTweets(handle) {
  return {
    type: LOAD_TWEETS,
    handle
  };
}

export function allTweetsLoaded() {
  return {
    type: ALL_TWEETS_LOADED,
  };
}

export function tweetsLoaded(snapshot) {
  return {
    type: LOAD_TWEETS_SUCCESS,
    tweets: snapshot.tweets,
    retweetTotal: snapshot.retweetTotal,
    tweetTotal: snapshot.tweetTotal,
    favouriteTotal: snapshot.favouriteTotal,
    name: snapshot.name,
  };
}

export function tweetsLoadingError(err) {
  return {
    type: LOAD_TWEETS_FAILED,
  };
}


export function loadBookNowDetails() {
  return {
    type: LOAD_BOOK_NOW,
  };
}

export function bookNowDetailsLoaded(list) {
  return {
    type: BOOK_NOW_LOADED,
    link: list[0].item.aw_deep_link,
    price: list[0].item.display_price
  };
}

export function bookNowLoadingError(err) {
  return {
    type: LOAD_BOOK_NOW_FAILED,
  };
}

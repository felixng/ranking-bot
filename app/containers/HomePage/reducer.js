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
} from './constants';

var todayTimeStamp = new Date(); 
var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
var diff = todayTimeStamp - oneDayTimeStamp;
var yesterdayDate = new Date(diff);

// The initial state of the App
const initialState = fromJS({
  date: yesterdayDate,
  tweetsCloud: {
    show: '',
    tweets: []
  }
});


function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DATE:
      return state
        .set('date', action.date);
    default:
      return state;
  }
}

export default homeReducer;

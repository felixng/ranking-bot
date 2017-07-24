/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const CHANGE_USERNAME = 'boilerplate/Home/CHANGE_USERNAME';
export const CHANGE_DATE = 'boilerplate/Home/CHANGE_DATE';
export const LOAD_TWEETS = 'boilerplate/Home/LOAD_TWEETS';
export const LOAD_TWEETS_SUCCESS = 'boilerplate/Home/LOAD_TWEETS_SUCCESS';
export const ALL_TWEETS_LOADED = 'boilerplate/Home/ALL_TWEETS_LOADED';
export const LOAD_TWEETS_FAILED = 'boilerplate/Home/LOAD_TWEETS_FAILED';
export const LOAD_BOOK_NOW = 'boilerplate/Home/LOAD_BOOK_NOW';
export const LOAD_BOOK_NOW_FAILED = 'boilerplate/Home/LOAD_BOOK_NOW_FAILED';
export const BOOK_NOW_LOADED = 'boilerplate/Home/BOOK_NOW_LOADED';

import React, { PropTypes } from 'react';

import Cloud from 'containers/Cloud';
import LoadingIndicator from 'components/LoadingIndicator';
import ErrorMessage from 'components/ErrorMessage';
import TweetItem from 'components/TweetItem';

function TweetsList({ loading, error, tweets }) {
  if (loading) {
    return <Cloud component={LoadingIndicator} />;
  }

  if (error) {
    return (<ErrorMessage>Sorry! Twitter is not responding...</ErrorMessage>)
  }

  if (tweets !== false && tweets.length != 0) {
    return <Cloud items={tweets} component={TweetItem} n/>;
  } 

  return null;
}

TweetsList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  tweets: PropTypes.any,
};

export default TweetsList;

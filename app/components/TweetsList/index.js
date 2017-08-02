import React, { PropTypes } from 'react';

import Cloud from 'containers/Cloud';
import LoadingIndicator from 'components/LoadingIndicator';
import ErrorMessage from 'components/ErrorMessage';
import TweetItem from 'components/TweetItem';

function TweetsList({ title, loading, error, tweets }) {
  if (loading) {
    return <Cloud component={LoadingIndicator} />;
  }

  if (error) {
    return (<ErrorMessage>Sorry! Twitter is not responding...</ErrorMessage>)
  }

  if (tweets !== false && tweets.length != 0) {
    return <Cloud title={title} items={tweets} component={TweetItem} />;
  } 

  return null;
}

TweetsList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  title: PropTypes.string,
  tweets: PropTypes.any,
};

export default TweetsList;

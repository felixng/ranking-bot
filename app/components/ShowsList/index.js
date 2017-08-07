import React, { PropTypes } from 'react';

import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import ErrorMessage from 'components/ErrorMessage';
import ShowListItem from 'containers/ShowListItem';

function ShowsList({ loading, error, shows, title }) {
  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  if (error === true) {
    return (<ErrorMessage>Hmmm.. Try the day before by clicking on the button above.</ErrorMessage>)
  }

  if (shows !== false && shows.length != 0) {
    return <List items={shows} component={ShowListItem} header={title} />;
  } 
  else {
    return (<ErrorMessage>Sorry! There were no data for this date!</ErrorMessage>)
  }

  return null;
}

ShowsList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  shows: PropTypes.any,
};

export default ShowsList;

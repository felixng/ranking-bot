import React, { PropTypes } from 'react';

import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import ShowListItem from 'containers/ShowListItem';

function ShowsList({ loading, error, shows, title }) {
  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item={'Something went wrong, please try again!'} />
    );
    return <List component={ErrorComponent} />;
  }

  if (shows !== false && shows.length != 0) {
    return <List items={shows} component={ShowListItem} header={title} />;
  }

  return null;
}

ShowsList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  shows: PropTypes.any,
};

export default ShowsList;

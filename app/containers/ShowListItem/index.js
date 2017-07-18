/**
 * ShowListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';
import ListItem from 'components/ListItem';
import { loadTweets } from '../HomePage/actions';
import Wrapper from './Wrapper';
import Number from './Number';

export class ShowListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  handleClick(){
    const handle = this.props.item.handle;
    this.props.onItemClick(handle);
  }

  render() {
    const item = this.props.item;

    const content = (
      <Wrapper>
        <div>{item.handle}</div>
        <Number>{item.score}</Number>
      </Wrapper>
    );

    return (
      <ListItem onClick={this.handleClick.bind(this)} 
                key={`show-list-item-${item.key}`} 
                item={content}/>
    );
  }
}

ShowListItem.propTypes = {
  item: React.PropTypes.object,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onItemClick: (handle) => {
      dispatch(loadTweets(handle));
    },
  };
}

const mapStateToProps = createStructuredSelector({

});

export default connect(mapStateToProps, mapDispatchToProps)(ShowListItem)

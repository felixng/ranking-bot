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
import Icon from './Icon';
import Title from './Title';
import { push } from 'react-router-redux';
import { makeSelectDate, makeSelectHandle } from 'containers/HomePage/selectors'
import toKey from 'utils/date';
import scrollToComponent from 'react-scroll-to-component';

export class ShowListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  handleClick(){
    const handle = this.props.item.handle;
    const date = toKey(this.props.date);

    if (handle != this.props.currentHandle){
      this.props.onItemClick(date, handle);  
    }

    scrollToComponent(this.tweetsCloud, { offset: 0, align: 'top', duration: 800 });
  }

  active(currentHandle, handle){
    return (handle == currentHandle)
  }

  render() {
    const item = this.props.item;

    const content = (
      <Wrapper>
        <Title>{item.name}</Title>
        <Icon><i className="fa fa-twitter" aria-hidden="true"></i></Icon>
        <Number>{item.tweetTotal}</Number>
        <Icon><i className="fa fa-retweet" aria-hidden="true"></i></Icon>
        <Number>{item.retweetTotal}</Number>
        <Icon><i className="fa fa-heart-o" aria-hidden="true"></i></Icon>
        <Number>{item.favouriteTotal}</Number>
      </Wrapper>
    );
    
    return (
      <ListItem onClick={this.handleClick.bind(this)}
                active={this.active(this.props.currentHandle, item.handle)} 
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
    onItemClick: (date, handle) => {
      dispatch(loadTweets(handle));
      dispatch(push(`/${date}/${handle}`));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  date: makeSelectDate(),
  currentHandle: makeSelectHandle()
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowListItem)

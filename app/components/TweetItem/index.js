import React from 'react';
import Wrapper from './Wrapper';
import { Tweet } from 'react-twitter-widgets';

function TweetItem(props) {
  return (
    <Wrapper>
    	<Tweet tweetId={props.item} 
	           options={{ cards: 'hidden', 
	                      align: 'centre', 
	                      linkColor: '#f39264',
	                      width:320 }}
             onLoad={props.onLoaded}/>
    </Wrapper>
  );
}

TweetItem.propTypes = {
  item: React.PropTypes.any,
};

export default TweetItem;

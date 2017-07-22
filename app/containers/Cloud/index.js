import React from 'react';
import Wrapper from './Wrapper';
import Title from './Title';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { allTweetsLoaded } from '../HomePage/actions';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import { makeSelectTweetsLoading } from 'containers/HomePage/selectors';

var masonryOptions = {
    transitionDuration: 0,
    fitWidth: true,
};

const pageSize = 10;

export class Cloud extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      elements: this.getCards(0),
      page: 0
    };
  }

  getCards = (pageToLoad) => { return this.props.items.slice(pageToLoad * pageSize, (pageToLoad + 1) * pageSize);}

  loadMore = (pageToLoad) =>  { this.setState(state => ({
    hasMore: ((pageToLoad + 1) * pageSize < this.props.items.length),
    page: pageToLoad + 1,
    elements: state.elements.concat(this.getCards(pageToLoad)),
  })); }

  componentWillReceiveProps(nextProps){
    if (this.props.tweetsLoading && nextProps.tweetsLoading == false) {
      this.masonry.forcePack();
    }
  }

  render() {
    const ComponentToRender = this.props.component;
    let content = (<div></div>)

    // If we have items, render them
    if (this.props.items) {
      content = this.state.elements.map((item, index) => (
        <ComponentToRender key={`item-${index}`} item={item} onLoaded={this.props.onMounted}/>
      ));
    } else {
      // Otherwise render a single component
      return (<ComponentToRender />);
    }

    return (
        <Wrapper>
          <MasonryInfiniteScroller hasMore={this.state.hasMore} 
                                   loadMore={this.loadMore}
                                   className='tweets'
                                   ref={ref => (this.masonry = ref)}
                                   useWindow={false}
                                   threshold={0}>
              {
                  this.state.elements.map((item, index) => (
                    <ComponentToRender key={`item-${index}`} item={item} onLoaded={this.props.onMounted}/>
                  ))
              }
          </MasonryInfiniteScroller>
        </Wrapper>
    );
  }
}

Cloud.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onMounted: () => {
      dispatch(allTweetsLoaded());
    }
  };
}

const mapStateToProps = createStructuredSelector({
  tweetsLoading: makeSelectTweetsLoading(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cloud);


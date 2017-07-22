import React from 'react';
import Wrapper from './Wrapper';
import Title from './Title';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { allTweetsLoaded } from '../HomePage/actions';
import Masonry from 'react-masonry-component';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import { makeSelectTweetsLoading } from 'containers/HomePage/selectors';
import LoadingIndicator from 'components/LoadingIndicator';

const pageSize = 10;
const masonryOptions = {
    transitionDuration: 10,
    fitWidth: true,
};

export class Cloud extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    // this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      hasMore: true,
      elements: this.getCards(0),
      page: 0
    };
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    
    return array;
  }

  handleScroll(e) {
    // console.log('scroll event');
  }
  
  getCards = (pageToLoad) => { return this.shuffle(this.props.items).slice(pageToLoad * pageSize, (pageToLoad + 1) * pageSize);}

  loadMore = (pageToLoad) =>  { 
    console.log('loading more');
    this.setState(state => ({
      hasMore: ((pageToLoad + 1) * pageSize < this.props.items.length),
      page: pageToLoad + 1,
      elements: state.elements.concat(this.getCards(pageToLoad)),
    })); 
  }

  // componentWillReceiveProps(nextProps){
  //   if (this.props.tweetsLoading && nextProps.tweetsLoading == false) {
  //     this.masonry.forcePack();
  //   }
  // }

  render() {
    const ComponentToRender = this.props.component;
    let content = (<div></div>)

    // If we have items, render them
    if (this.props.items) {
      content = this.props.items.slice(0, 30).map((item, index) => (
        <ComponentToRender key={`item-${index}`} item={item} onLoaded={this.props.onMounted}/>
      ));
    } else {
      // Otherwise render a single component
      return (<ComponentToRender />);
    }

    return (
        <Wrapper>
          <Title>{this.props.title}</Title>
          {/*<MasonryInfiniteScroller hasMore={this.state.hasMore} 
                                   loadMore={this.loadMore}
                                   className='tweets'
                                   ref={ref => (this.masonry = ref)}
                                   useWindow={true}
                                   loader={<LoadingIndicator />}
                                   threshold={100}>
              {
                  this.state.elements.map((item, index) => (
                    <ComponentToRender key={`item-${index}`} item={item} onLoaded={this.props.onMounted}/>
                  ))
              }
          </MasonryInfiniteScroller>*/}
          <Masonry elementType={'div'} 
                   className={'tweets'}
                   options={masonryOptions}>
              {content}
          </Masonry>
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


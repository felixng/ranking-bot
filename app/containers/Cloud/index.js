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
const scrollOffset = 400;
const masonryOptions = {
    transitionDuration: 0,
    fitWidth: true,
};

export class Cloud extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollFunction = this.scrollListener.bind(this);

    this.state = {
      hasMore: true,
      elements: this.getCards(0),
      page: 0
    };
  }

  attachScrollListener () {
    let el = window;
    el.addEventListener('scroll', this.scrollFunction, true);
    
    // this.scrollListener();
  }

  scrollListener() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - scrollOffset) {
        this.loadMore(this.state.page + 1);
    }
  }

  componentWillUnmount () {
    this.detachScrollListener();
  }

  detachScrollListener () {
    let el = window;
    el.removeEventListener('scroll', this.scrollFunction, true);
  }

  componentDidMount () {
    this.attachScrollListener();
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
  
  getCards = (pageToLoad) => { return this.shuffle(this.props.items).slice(pageToLoad * pageSize, (pageToLoad + 1) * pageSize);}

  loadMore = (pageToLoad) =>  { 
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
    if (this.state.elements) {
      content = this.state.elements.map((item, index) => (
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


/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import toKey from 'utils/date';
import { createStructuredSelector } from 'reselect';
import { makeSelectShows, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import { makeSelectHandle, makeSelectTweets, makeSelectTweetsLoading, makeSelectTweetsError } from 'containers/HomePage/selectors';
import SubTitle from './SubTitle';
import ShowsList from 'components/ShowsList';
import TweetsList from 'components/TweetsList';
import Button from 'components/Button';
import OverlayLoading from 'components/OverlayLoading';
import LoadingIndicator from 'components/LoadingIndicator';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';
import { loadShows } from '../App/actions';
import { loadTweets } from '../HomePage/actions';
import { changeDate } from './actions';
import { makeSelectDate } from './selectors';
import { push } from 'react-router-redux';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount(){
    console.log('componentWillMount');
    this.onPageLoad(this.props.params.date, this.props.params.handle);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.params.date != this.props.params.date ||
        nextProps.params.handle != this.props.params.handle){
      console.log('componentWillReceiveProps');
      this.onPageLoad(nextProps.params.date, nextProps.params.handle);
    }
  }

  onPageLoad(propsDate, propsHandle) {
    if (propsDate){
      var date = new Date(propsDate);
      this.props.setDate(date);
    }
    
    this.props.onLoad(propsHandle);
  }

  previousDay(){
    const currentDate = this.props.date;
    this.props.onPreviousDate(currentDate);
  }

  nextDay(){
    const currentDate = this.props.date;
    this.props.onNextDate(currentDate);
  }

  render() {
    let nextButton = (<div></div>)
    let loadingOverlay = (<div></div>)
    const { loading, error, shows, date, tweets, tweetsError, tweetsLoading } = this.props;
    const title = date.toDateString();
    const showsListProps = {
      loading,
      error,
      shows,
      title
    };


    const cloudTitle = `What are people saying about ${this.props.handle}`;
    const tweetsListProps = {
      tweetsLoading,
      tweetsError,
      tweets
    };
    
    var todayTimeStamp = new Date(); 
    var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
    var diff = todayTimeStamp - oneDayTimeStamp;
    var yesterdayDate = new Date(diff);

    if (date.toDateString() != yesterdayDate.toDateString()){
      nextButton = (<Button 
                      onClick={this.nextDay.bind(this)}> Next Day 
                    </Button>)
    }

    if (tweetsLoading) {
      loadingOverlay = (<CenteredSection>
                          <OverlayLoading loaded={tweetsLoading}/>
                        </CenteredSection>)
    }

    return (
      <article>
        {loadingOverlay}
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: "West End League - What's Trending in West End?" },
          ]}
        />
        <div>
          <CenteredSection>
            <SubTitle>
              <FormattedMessage {...messages.startProjectMessage} />
            </SubTitle>
            <Button 
              onClick={this.previousDay.bind(this)}> Previous Day </Button>
            {nextButton}
            <ShowsList {...showsListProps} />
          </CenteredSection>
          <CenteredSection>
            <TweetsList title={cloudTitle} {...tweetsListProps} />
          </CenteredSection>

        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  shows: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  date: React.PropTypes.instanceOf(Date),
  onChangeDate: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onPreviousDate: (currentDate) => {
      var date = currentDate;
      var result = new Date(date);
      result.setDate(result.getDate() - 1);

      var dateRoute = toKey(result);

      dispatch(changeDate(result));
      dispatch(loadShows());
      dispatch(push(`/${dateRoute}`));

    },
    onNextDate: (currentDate) => {
      var date = currentDate;
      var result = new Date(date);
      result.setDate(result.getDate() + 1);
      var dateRoute = toKey(result);

      dispatch(changeDate(result));
      dispatch(loadShows());
      dispatch(push(`/${dateRoute}`));
    },
    setDate: (date) =>{
      dispatch(changeDate(date));
    },
    onLoad: (handle) => {
      dispatch(loadShows());
      if (handle) {
        dispatch(loadTweets(handle))
      }
    }
  };
}

const mapStateToProps = createStructuredSelector({
  shows: makeSelectShows(),
  date: makeSelectDate(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  tweets: makeSelectTweets(),
  tweetsError: makeSelectTweetsError(),
  tweetsLoading: makeSelectTweetsLoading(),
  handle: makeSelectHandle()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

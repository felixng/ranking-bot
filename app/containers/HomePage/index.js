/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectShows, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import SubTitle from './SubTitle';
import ShowsList from 'components/ShowsList';
import Button from 'components/Button';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadShows } from '../App/actions';
import { changeDate } from './actions';
import { makeSelectDate } from './selectors';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.onLoad();
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
    const { loading, error, shows, date } = this.props;
    const title = date.toDateString();
    const showsListProps = {
      loading,
      error,
      shows,
      title
    };

    var todayTimeStamp = new Date(); 
    var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
    var diff = todayTimeStamp - oneDayTimeStamp;
    var yesterdayDate = new Date(diff);

    if (date.toDateString() != yesterdayDate.toDateString()){
      nextButton = (<Button 
                      onClick={this.nextDay.bind(this)}> Next Day </Button>)
    }

    return (
      <article>
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
            {/*<ShowsList {...showsListProps} />
            <ShowsList {...showsListProps} />*/}
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

      dispatch(changeDate(result));
      dispatch(loadShows());
    },
    onNextDate: (currentDate) => {
      var date = currentDate;
      var result = new Date(date);
      result.setDate(result.getDate() + 1);

      dispatch(changeDate(result));
      dispatch(loadShows());
    },
    onLoad: () => {

      dispatch(loadShows());
    }
  };
}

const mapStateToProps = createStructuredSelector({
  shows: makeSelectShows(),
  date: makeSelectDate(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

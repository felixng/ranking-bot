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

import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H3 from 'components/H3';
import ReposList from 'components/ReposList';
import Button from 'components/Button';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername, changeDate } from './actions';
import { makeSelectUsername, makeSelectDate } from './selectors';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    // if (this.props.username && this.props.username.trim().length > 0) {
    //   this.props.onSubmitForm();
    // }
  }

  updateDate(){
    const currentDate = this.props.date;
    this.props.onChangeDate(currentDate);
  }

  render() {
    const { loading, error, repos, date } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

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
            <H3>
              <FormattedMessage {...messages.startProjectMessage} />
            </H3>
          </CenteredSection>
          <Section>
            <Button 
              onClick={this.updateDate.bind(this)}> Click Me! </Button>
            <ReposList {...reposListProps} />
          </Section>
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
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  username: React.PropTypes.string,
  date: React.PropTypes.instanceOf(Date),
  onChangeUsername: React.PropTypes.func,
  onChangeDate: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChangeDate: (currentDate) => {
      var date = currentDate;
      var result = new Date(date);
      result.setDate(result.getDate() - 1);

      dispatch(changeDate(result));
    },
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  date: makeSelectDate(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
